"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import loginImg from "../assets/bg-images/Login.webp";
import AnimatedBg from "../components/Animate";
import { toast } from "react-toastify";
import spamGuideImg from "../assets/IMAGESPAM.png"

export default function VerifyOtp() {
  const { verifyRegisterOtp, sendOtp, loginPendingRegisteredUser, checkProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  
  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem("registerEmail") || "";

  useEffect(() => {
    if (!email) {
      setError("Email not found. Please register again.");
      setTimeout(() => navigate("/register"), 2000);
    }
  }, [email, navigate]);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setError("");
    
    try {
      const res = await verifyRegisterOtp(email, otp);
      
      if (res?.success) {
        toast.success("Account created successfully! 🎉");
        const loginRes = await loginPendingRegisteredUser(email);

        if (!loginRes?.success) {
          navigate("/login", {
            state: {
              email,
              autoLoginNewUser: true,
            },
          });
          return;
        }

        const profileComplete = await checkProfile(loginRes.token);
        if (profileComplete) {
          navigate("/");
        } else {
          navigate("/user-profile-filling", { state: { email } });
        }
      } else {
        setError(res?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await sendOtp(email, "email_verification");
      if (!res?.success) {
        setError(res?.message || "Failed to resend OTP");
        return;
      }

      setTimeLeft(300);
      setCanResend(false);
      setOtp("");
      setError("");
      toast.success("OTP resent successfully! 📧");
    } catch {
      setError("Failed to resend OTP");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20">
      {/* Animated Background */}
      <AnimatedBg />
      
      {/* Main Container */}
      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">
        
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={loginImg}
              alt="Verify OTP illustration"
              className="object-contain max-h-[500px] w-full rounded-3xl shadow-2xl shadow-orange-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Verify+OTP";
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Verify OTP</h2>
            <p className="text-gray-500 text-center mb-2">
              Please enter the 6-digit verification code sent to
            </p>
            <p className="text-orange-600 font-semibold text-center">
              {email || "your email address"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm animate-shake">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              <span className="text-sm">remaining</span>
            </div>
          </div>

          {/* OTP Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full py-3 px-4 text-center text-2xl tracking-[0.5em] font-mono border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              value={otp}
              autoFocus
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition mb-4 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify & Create Account'
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-orange-500 hover:text-orange-600 font-medium transition hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Didn't receive the code?{" "}
                <span className="text-gray-400">
                  Resend available in {formatTime(timeLeft)}
                </span>
              </p>
            )}
          </div>

          {/* Spam Guidance */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-center text-orange-500 mb-3 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Can't find the email? Check your inbox &amp; spam folder
            </p>
            <img
              src={spamGuideImg}
              alt="Check inbox and spam folder for OTP"
              className="w-full rounded-xl object-contain"
            />
          </div>

          {/* Back to Register Link */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/register")}
              className="text-gray-600 hover:text-orange-500 transition flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}