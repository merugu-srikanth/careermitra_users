"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/bg-images/Login.webp";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBg from "../components/Animate";
import { toast } from "react-toastify";
import image from "../assets/IMAGESPAM.png"


export default function Register() {
  const { register, verifyRegisterOtp, sendOtp, loginPendingRegisteredUser, checkProfile, storePendingRegisterCredentials, loading } = useAuth();
  const navigate = useNavigate();

  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobType, setJobType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  
  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showRegisterSuccessModal, setShowRegisterSuccessModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);
  
  const inputRefs = useRef([]);

  // Timer effect
  useEffect(() => {
    if (!showOtpModal) return;
    
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer, showOtpModal]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP key press (backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (pastedNumbers) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedNumbers.length; i++) {
        newOtp[i] = pastedNumbers[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or last input
      const nextIndex = Math.min(pastedNumbers.length, 5);
      if (nextIndex <= 5) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      return;
    }
    
    setOtpError("");
    
    try {
      const res = await verifyRegisterOtp(registeredEmail, otpString);
      
      if (res?.success) {
        toast.success("Account created successfully! 🎉");
        setShowOtpModal(false);
        setShowRegisterSuccessModal(true);
      } else {
        setOtpError(res?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("OTP verification failed. Please try again.");
    }
  };

  const handleGoToLogin = async () => {
    setAutoLoginLoading(true);
    setShowRegisterSuccessModal(false);

    try {
      const res = await loginPendingRegisteredUser(registeredEmail, password);

      if (!res?.success) {
        navigate("/login", {
          state: {
            email: registeredEmail,
            autoLoginNewUser: true,
          },
        });
        return;
      }

      const profileComplete = await checkProfile(res.token);
      if (profileComplete) {
        navigate("/");
      } else {
        navigate("/user-profile-filling", { state: { email: registeredEmail } });
      }
    } finally {
      setAutoLoginLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setTimer(300);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    
    try {
      const res = await sendOtp(registeredEmail, "email_verification");
      if (res?.success) {
        toast.success("OTP resent successfully! 📧");
      } else {
        setOtpError(res?.message || "Failed to resend OTP");
      }
    } catch (err) {
      setOtpError("Failed to resend OTP");
    }
  };

  // Handle registration
  const handleRegister = async () => {
    // Validation
    if (!name || !phone || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // if (!jobType) {
    //   setError("Please select your interest (Govt Jobs or IT Jobs)");
    //   return;
    // }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setError("");
    
    // Prepare registration data
    const registrationData = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      password_confirmation: confirmPassword,
      interested_in: jobType,
    };

    try {
      const res = await register(registrationData);
      
      if (res?.success) {
        storePendingRegisterCredentials(email, password);
        localStorage.setItem("registerEmail", email);
        setRegisteredEmail(email);
        setShowOtpModal(true);
        setTimer(300);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(res?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
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
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={loginImg}
              alt="Register illustration"
              className="object-contain max-h-[420px] w-full rounded-3xl"
              onError={(e) => { e.target.src = "https://via.placeholder.com/500x500?text=Register+Image"; }}
            />

            {/* QR badge — overlaid bottom-right on image */}
            <div className="absolute bg-blur bottom-4 right-4 bg-white rounded-2xl shadow-xl border border-orange-100 p-3 flex items-center gap-3 w-full" >
              <div className="shrink-0 bg-orange-50  rounded-xl p-1.5 border border-orange-100">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=https://careermitra.in/register&margin=4"
                  alt="Scan QR to register"
                  width={122}
                  height={72}
                  className="rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-800 mb-0.5">📱 Scan to Register</p>
              

                <p className="text- text-gray-400 leading-snug mb-1">Open your phone camera, scan this QR code and fill your registration instantly — no typing needed!
</p>
                {/* <p className="text-[10px] font-semibold text-orange-500 truncate">careermitra.in/register</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Register</h2>
          <p className="text-gray-500 text-sm text-center mb-3">
            Create your account to get started
          </p>

          {/* QR Code Card — mobile & tablet only */}
          <div className="md:hidden flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 mb-5 shadow-sm">
            <div className="shrink-0 bg-white rounded-xl p-1.5 shadow-sm border border-orange-100">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://careermitra.in/register&margin=4"
                alt="Scan QR to register"
                width={80}
                height={80}
                className="rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 mb-0.5">📱 Scan &amp; Register</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Scan QR with your phone to fill registration <span className="text-orange-500 font-semibold">instantly</span>!
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full py-1.5 px-3 text-sm border rounded-lg mb-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            value={name}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full py-1.5 px-3 text-sm border rounded-lg mb-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            value={email}
          />
          {/* Email */}
          <input
            type="number"
            placeholder="Phone Number"
            className="w-full py-1.5 px-3 text-sm border rounded-lg mb-2.5 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setPhone(e.target.value)}
            onKeyPress={handleKeyPress}
            value={phone}
          />
          

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full py-1.5 px-3 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
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

          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full py-1.5 px-3 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
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

          {/* Radio Options - Card Style */}
          {/* <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-green-500 rounded-full"></div>
              <span className="text-gray-800 font-semibold text-xl">Are You Interested In?</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="relative group">
                <input
                  type="radio"
                  name="job"
                  value="govt"
                  onChange={(e) => setJobType(e.target.value)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className="p-4 rounded-xl border-2 border-gray-200 group-hover:border-orange-400 group-hover:bg-orange-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 opacity-0 transition-opacity" 
                           style={{ opacity: jobType === 'govt' ? 1 : 0 }}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏛️</span>
                      <span className="font-bold text-gray-800">Govt Jobs</span>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative group">
                <input
                  type="radio"
                  name="job"
                  value="it"
                  onChange={(e) => setJobType(e.target.value)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className="p-4 rounded-xl border-2 border-gray-200 group-hover:border-green-400 group-hover:bg-green-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 opacity-0 transition-opacity"
                           style={{ opacity: jobType === 'it' ? 1 : 0 }}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💻</span>
                      <span className="font-bold text-gray-800">IT Jobs</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div> */}

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2 mb-6">
            <input 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400" 
              id="terms" 
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-orange-500 cursor-pointer hover:text-orange-600">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-orange-500 cursor-pointer hover:text-orange-600">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending OTP...' : 'Register'}
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

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          {/* Modal card — fixed height, no scroll */}
          <div className="bg-white rounded-2xl max-w-7xl w-full h-[88vh] overflow-hidden relative animate-fadeIn shadow-2xl flex flex-col">

            {/* Close button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 transition bg-white rounded-full p-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Grid fills remaining height */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] flex-1 min-h-0">

              {/* ── LEFT: OTP Form ── */}
              <div className="flex flex-col justify-center px-6 py-6 sm:px-8 border-b sm:border-b-0 sm:border-r border-gray-100 overflow-hidden">
                <div className="text-center mb-4">
                  <div className="w-11 h-11 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-0.5">Verify OTP</h3>
                  <p className="text-gray-400 text-xs">6-digit code sent to</p>
                  <p className="text-orange-500 font-semibold text-xs mt-0.5 break-all">{registeredEmail}</p>
                </div>

                {otpError && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-300 text-red-600 rounded-lg text-xs text-center">
                    {otpError}
                  </div>
                )}

                {/* Timer */}
                <div className="text-center mb-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${timer <= 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-mono font-bold">{formatTime(timer)}</span>
                    <span>remaining</span>
                  </div>
                </div>

                {/* 6 OTP Boxes */}
                <div className="flex gap-2 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-10 h-10 text-center text-lg font-bold border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                      style={{ borderColor: otpError ? '#ef4444' : '#e5e7eb' }}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className={`w-full bg-orange-500 text-white py-2.5 text-sm rounded-xl font-semibold hover:bg-orange-600 transition mb-2.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : 'Verify & Create Account'}
                </button>

                {/* Resend */}
                <div className="text-center">
                  {canResend ? (
                    <button onClick={handleResendOtp} className="text-orange-500 hover:text-orange-600 font-medium transition hover:underline text-xs">
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-gray-400 text-xs">
                      Didn't receive it? Resend in {formatTime(timer)}
                    </p>
                  )}
                </div>
              </div>

              {/* ── RIGHT: Guidance Image — fills full height, no crop ── */}
              <div className="bg-orange-50 flex flex-col sm:rounded-r-2xl overflow-hidden min-h-0">
                {/* Header */}
                <div className="shrink-0 px-4 py-2.5 border-b border-orange-100 flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-bold text-orange-500 text-center">
                    Can't find the email? Check your inbox &amp; spam folder
                  </p>
                </div>
                {/* Image fills all remaining height */}
                <div className="flex-1 min-h-0 flex items-center justify-center p-3">
                  <img
                    src={image}
                    alt="Check inbox and spam folder for OTP"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Register Success Modal */}
      {showRegisterSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center animate-[fadeInUp_0.3s_ease]">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-5 shadow-inner">
              <span className="text-4xl">🎉</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Registration Successful
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-2">
              Your account is ready. Proceed to  <span className="text-orange-500 font-semibold"> complete  your profile</span> to get
              <span className="text-orange-500 font-semibold"> personalised job alerts</span> {" "}
              on your dashboard.
            </p>

            <p className="text-gray-400 text-sm mb-8">
              It only takes a few minutes.
            </p>

            <button
              onClick={handleGoToLogin}
              disabled={autoLoginLoading}
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
            >
              {autoLoginLoading ? "Signing you in..." : "Login and Fill Your Profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}