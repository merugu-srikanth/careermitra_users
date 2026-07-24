"use client";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import AnimatedBg from '@/components/Animate';
import { toast } from "react-toastify";
import spamGuideImg from '@/assets/IMAGESPAM.png';
import SEO from '@/components/SEO';
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export default function VerifyOtp() {
  const { verifyRegisterOtp, sendOtp, loginPendingRegisteredUser, checkProfile, loading } = useAuth();
  const router = useRouter();
  const navigate = (to, options) => { if (options?.replace) { router.replace(to); } else { router.push(to); } };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = { pathname, search: searchParams ? "?" + searchParams.toString() : "", state: null };
  
  const [otp, setOtp] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
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
      setOtpValues(["", "", "", "", "", ""]);
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

  const handleChange = (val, index) => {
    // Only allow single digit number
    if (val !== "" && isNaN(Number(val))) return;
    
    const newValues = [...otpValues];
    newValues[index] = val.slice(-1);
    setOtpValues(newValues);
    setOtp(newValues.join(""));

    // Auto focus next field
    if (val !== "" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpValues[index] === "" && index > 0) {
        const newValues = [...otpValues];
        newValues[index - 1] = "";
        setOtpValues(newValues);
        setOtp(newValues.join(""));
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      } else {
        const newValues = [...otpValues];
        newValues[index] = "";
        setOtpValues(newValues);
        setOtp(newValues.join(""));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split("");
      setOtpValues(newOtpValues);
      setOtp(pastedData);
      document.getElementById("otp-input-5")?.focus();
    }
  };

  return (
    <>
      <div className="min-h-screen relative flex items-center justify-center py-20">
        {/* Animated Background */}
        <AnimatedBg />
      
        {/* Main Container */}
        <div className="max-w-6xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10 w-full mx-4">
          
          {/* LEFT SIDE FORM */}
          <div className="p-10 flex flex-col justify-center bg-white border-b md:border-b-0 md:border-r border-slate-100">
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
              <p className="text-orange-600 font-semibold text-center font-mono">
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

            {/* OTP Input - 6 separate boxes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center gap-2.5 max-w-sm mx-auto" onPaste={handlePaste}>
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    className="w-12 h-12 text-center text-xl font-bold border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition bg-slate-50"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onKeyPress={handleKeyPress}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
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
            <div className="text-center mb-6">
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

            {/* Back to Register Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/register")}
                className="text-gray-600 hover:text-orange-500 transition flex items-center justify-center gap-2 mx-auto text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Registration
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: SPAM GUIDANCE */}
          <div className="flex flex-col justify-center p-10 bg-orange-50/20">
            <div className="text-center mb-4">
              <p className="text-sm font-bold text-orange-500 mb-3 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Can't find the email? Check your inbox &amp; spam folder
              </p>
            </div>
            <div className="w-full flex items-center justify-center">
              <img
                src={spamGuideImg.src || spamGuideImg}
                alt="Check inbox and spam folder for OTP"
                className="w-full rounded-2xl shadow-xl shadow-orange-100 object-contain max-h-[380px]"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}