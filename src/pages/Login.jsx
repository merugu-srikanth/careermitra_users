"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/bg-images/Login.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AnimatedBg from "../components/Animate";
import SEO from "../components/SEO";
import { generateWebPageSchema } from "../utils/schemaHelpers";
import { toast } from "react-toastify";

export default function Login() {
  const { loginWithPassword, loginPendingRegisteredUser, sendOtp, verifyOtp, forgotPassword, resetPassword, checkProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // login | otp | forgot
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 PASSWORD LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await loginWithPassword(email, password);
      if (!res?.success) {
        setError(res?.message || "Login failed");
      } else {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        const profileComplete = await checkProfile(res.token);
        if (profileComplete) {
          navigate("/");
        } else {
          navigate("/user-profile-filling", { state: { email } });
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 📩 SEND OTP (Login with OTP)
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp(email, "login");
      if (!res?.success) {
        setError(res?.message || "Email not registered");
      } else {
        setStep("otp");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP (Login)
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      if (!res?.success || !res?.token) {
        setError("Invalid OTP. Please try again");
      } else {
        const profileComplete = await checkProfile(res.token);
        if (profileComplete) {
          navigate("/");
        } else {
          navigate("/user-profile-filling", { state: { email } });
        }
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 FORGOT PASSWORD — sends reset OTP to email
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res?.success) {
        setStep("forgot-reset");
      } else {
        setError(res?.message || "Failed to send reset OTP");
      }
    } catch (err) {
      setError("Failed to send reset OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordReset = async () => {
    if (!email || !resetOtp || !newPassword || !confirmNewPassword) {
      setError("Please fill all fields");
      return;
    }

    if (resetOtp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await resetPassword({
        email,
        otp: resetOtp,
        new_password: newPassword,
      });

      if (res?.success) {
        toast.success("Password reset successfully! Please login.");
        setStep("login");
        setResetOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError(res?.message || "Failed to reset password");
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (step === "login") handleLogin();
      else if (step === "otp") handleVerifyOtp();
      else if (step === "forgot") handleForgotPassword();
      else if (step === "forgot-reset") handleForgotPasswordReset();
    }
  };

  const goBackToLogin = () => {
    setStep("login");
    setOtp("");
    setResetOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
  };

  // Load remembered email / email passed from register
  useEffect(() => {
    if (location?.state?.email) {
      setEmail(location.state.email);
      if (!location?.state?.autoLoginNewUser) {
        return;
      }
    }

    if (!location?.state?.autoLoginNewUser) {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    }
  }, [location?.state?.autoLoginNewUser, location?.state?.email]);

  useEffect(() => {
    if (!location?.state?.autoLoginNewUser || !location?.state?.email) return;

    let isActive = true;

    const autoLogin = async () => {
      setError("");
      setLoading(true);

      try {
        const res = await loginPendingRegisteredUser(location.state.email);
        if (!isActive) return;

        if (!res?.success) {
          setError(res?.message || "Auto login failed. Please sign in.");
          return;
        }

        const profileComplete = await checkProfile(res.token);
        if (!isActive) return;

        if (profileComplete) {
          navigate("/");
        } else {
          navigate("/user-profile-filling", { state: { email: location.state.email } });
        }
      } catch {
        if (isActive) {
          setError("Auto login failed. Please sign in.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    autoLogin();

    return () => {
      isActive = false;
    };
  }, [checkProfile, location?.state?.autoLoginNewUser, location?.state?.email, loginPendingRegisteredUser, navigate]);

  const subtitleMap = {
    login: "Enter your credentials to access your account",
    otp: "Enter the OTP sent to your email",
    forgot: "Enter your email to receive a password reset OTP",
    "forgot-reset": "Enter OTP and set a new password",
  };

  const loginSchemas = [
    generateWebPageSchema({
      name: "Career Mitra - Log in",
      description: "Log in to Career Mitra to access personalized Govt Jobs notifications, Sarkari Naukri alerts, career guidance, and latest updates.",
      url: "https://careermitra.in/login"
    })
  ];

  return (
    <>
      <SEO
        title="Career Mitra - Log in | Access Govt Jobs Notifications & Career Alerts"
        description="Log in to Career Mitra to access personalized Govt Jobs notifications, Sarkari Naukri alerts, career guidance, and latest updates."
        keywords="Career Mitra Login, Govt Jobs Login, Sarkari Naukri Login, Free Job Alerts, Latest Govt Jobs Notifications, Career Guidance"
        url="https://careermitra.in/login"
        schema={loginSchemas}
      />

      <div className="min-h-screen relative flex items-center justify-center py-20">
        <AnimatedBg />

      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">

        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center p-8 border-r-2 border-orange-100">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={loginImg}
              alt="Login illustration"
              className="object-contain max-h-[400px] w-full rounded-3xl "
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Login+Image";
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            {step === "forgot" ? "Forgot Password" : "Login"}
          </h2>
          <p className="text-gray-500 text-center mb-6">{subtitleMap[step]}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* ── PASSWORD LOGIN ── */}
          {step === "login" && (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                value={email}
              />

              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full py-2 px-3 pr-10 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  value={password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember + Forgot */}
              <div className="flex justify-between items-center text-sm mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <span
                  onClick={() => { setStep("forgot"); setError(""); }}
                  className="text-orange-500 cursor-pointer hover:text-orange-600 transition"
                >
                  Forgot Password?
                </span>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-400">or</span>
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
              >
                Login with OTP
              </button>
            </>
          )}

          {/* ── OTP LOGIN ── */}
          {step === "otp" && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-green-400 focus:outline-none focus:border-green-400 transition text-center text-2xl tracking-widest"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyPress={handleKeyPress}
                value={otp}
                maxLength="6"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className={`w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={goBackToLogin}
                className="w-full text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition mt-2"
              >
                ← Back to Login
              </button>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {step === "forgot" && (
            <>
              <input
                type="email"
                placeholder="Enter your registered email"
                className="w-full py-2 px-3 border rounded-xl mb-4 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                value={email}
                autoFocus
              />

              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Reset OTP"}
              </button>

              <button
                onClick={goBackToLogin}
                className="w-full text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition mt-2"
              >
                ← Back to Login
              </button>
            </>
          )}

          {step === "forgot-reset" && (
            <>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition text-center text-2xl tracking-widest"
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                onKeyPress={handleKeyPress}
                value={resetOtp}
                maxLength="6"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                value={newPassword}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full py-2 px-3 border rounded-xl mb-4 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                value={confirmNewPassword}
              />

              <button
                onClick={handleForgotPasswordReset}
                disabled={loading}
                className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                onClick={() => setStep("forgot")}
                className="w-full text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition mt-2"
              >
                ← Back
              </button>
            </>
          )}

          {/* Register Link */}
          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium transition">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      </div>
    </>
  );
}
