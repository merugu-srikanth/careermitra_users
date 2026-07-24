"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import loginImg from '@/assets/bg-images/Login.webp';
import AnimatedBg from '@/components/Animate';
import { toast } from "react-toastify";

import { generateWebPageSchema } from '@/utils/schemaHelpers';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const navigate = (to, options) => { if (options?.replace) { router.replace(to); } else { router.push(to); } };
  const { resetPassword } = useAuth();

  const presetEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!email || !otp || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await resetPassword({
        email,
        otp,
        new_password: password,
      });

      if (res?.success) {
        toast.success("Password reset successfully! Please login. 🎉");
        navigate("/login");
      } else {
        setError(res?.message || "Failed to reset password. OTP may be invalid or expired.");
      }
    } catch (err) {
      setError("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleReset();
  };

  const resetSchemas = [
    generateWebPageSchema({
      name: "Reset Password - Career Mitra",
      description: "Reset your account password on Career Mitra.",
      url: "https://careermitra.in/reset-password"
    })
  ];

  return (
    <>
      <div className="min-h-screen relative flex items-center justify-center py-20">
        <AnimatedBg />

      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">

        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={loginImg.src || loginImg}
              alt="Reset Password"
              className="object-contain max-h-[500px] w-full rounded-3xl shadow-2xl shadow-orange-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Reset+Password";
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex flex-col justify-center bg-white">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-center mb-1">Enter your new password below</p>
          {email && (
            <p className="text-orange-600 font-semibold text-center text-sm mb-6">{email}</p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <>
              <input
                type="email"
                placeholder="Registered Email"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                value={email}
                autoFocus
              />

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition text-center text-2xl tracking-widest"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyPress={handleKeyPress}
                value={otp}
              />

              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full py-2 px-3 pr-10 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  value={password}
                  autoFocus
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

              <div className="relative mb-6">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="w-full py-2 px-3 pr-10 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  value={confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
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

              <button
                onClick={handleReset}
                disabled={loading}
                className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition mt-2"
              >
                ← Back to Login
              </button>
            </>
        </div>
      </div>
    </div>
    </>
  );
}
