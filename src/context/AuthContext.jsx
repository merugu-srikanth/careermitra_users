import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { calculateProfileCompletion, flattenEducation } from "../utils/profileCompletion";

const AuthContext = createContext();

const API = "https://www.careermitra.in/api";
const AUTH_API = `${API}/auth`;
const PENDING_REGISTER_KEY = "pendingRegisterCredentials";
const REGISTER_VERIFY_TOKEN_KEY = "registerVerificationToken";

const extractErrorMessage = (err, fallback) => {
  const payload = err?.response?.data;
  if (!payload) return fallback;

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  const errors = payload?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0];
    if (typeof first === "string") return first;
    if (typeof first?.msg === "string") return first.msg;
    if (typeof first?.message === "string") return first.message;
  }

  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstValue = errors[firstKey];
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return String(firstValue[0]);
    }
    if (typeof firstValue === "string") return firstValue;
  }

  return fallback;
};

const normalizeResponse = (raw) => {
  const success = Boolean(raw?.success ?? raw?.status);
  const token = raw?.data?.token ?? raw?.token ?? null;
  const user = raw?.data?.user ?? raw?.user ?? null;
  const message = raw?.message || (success ? "Success" : "Request failed");

  return {
    ...raw,
    success,
    status: success,
    token,
    user,
    message,
  };
};

const readPendingRegisterCredentials = () => {
  try {
    const raw = localStorage.getItem(PENDING_REGISTER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const storePendingRegisterCredentials = (email, password) => {
    if (!email || !password) return;
    localStorage.setItem(PENDING_REGISTER_KEY, JSON.stringify({ email, password }));
  };

  const clearPendingRegisterCredentials = () => {
    localStorage.removeItem(PENDING_REGISTER_KEY);
  };

  const getPendingRegisterCredentials = () => readPendingRegisterCredentials();

  // 🔐 LOGIN WITH PASSWORD
  const loginWithPassword = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/login`, { email, password });
      const data = normalizeResponse(res.data);

      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user || { email });
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }

      return data;
    } catch (err) {
      const message = extractErrorMessage(err, "Login failed");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  const loginPendingRegisteredUser = async (fallbackEmail, fallbackPassword) => {
    const stored = getPendingRegisterCredentials();
    const email = fallbackEmail || stored?.email;
    const password = fallbackPassword || stored?.password;

    if (!email || !password) {
      return { status: false, message: "Registered user login details not found" };
    }

    const res = await loginWithPassword(email, password);
    if (res?.success) {
      clearPendingRegisterCredentials();
    }

    return res;
  };

  // 📩 SEND OTP (LOGIN)
  const sendOtp = async (email, purpose = "login") => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/request-otp`, { email, purpose });
      const data = normalizeResponse(res.data);
      if (data.success) {
        toast.success(data.message || "OTP sent successfully");
      }
      return data;
    } catch (err) {
      const message = extractErrorMessage(err, "Failed to send OTP");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP (LOGIN)
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/login/verify-otp`, { email, otp });
      const data = normalizeResponse(res.data);

      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user || { email });
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Invalid OTP");
      }

      return data;
    } catch (err) {
      const message = extractErrorMessage(err, "Invalid OTP");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const register = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        password: data?.password,
        interest: data?.interest || data?.interested_in || "Govt Jobs",
      };

      const res = await axios.post(`${AUTH_API}/register`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const response = normalizeResponse(res.data);

      if (response?.token) {
        localStorage.setItem(REGISTER_VERIFY_TOKEN_KEY, response.token);
      }

      if (response.success) {
        toast.success(response.message || "Registration successful");
      } else {
        toast.error(response.message || "Registration failed");
      }

      return response;
    } catch (err) {
      const message = extractErrorMessage(err, "Registration failed");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY REGISTER OTP
  const verifyRegisterOtp = async (email, otp) => {
    setLoading(true);
    try {
      const registerToken = localStorage.getItem(REGISTER_VERIFY_TOKEN_KEY);
      if (!registerToken) {
        const message = "Verification session expired. Please register again.";
        toast.error(message);
        return normalizeResponse({ success: false, message });
      }

      const res = await axios.post(
        `${AUTH_API}/email-verification`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${registerToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = normalizeResponse(res.data);

      if (data.success) {
        localStorage.removeItem(REGISTER_VERIFY_TOKEN_KEY);
        toast.success("Account created successfully");
      } else {
        toast.error(data.message || "Invalid OTP");
      }

      return data;
    } catch (err) {
      const message = extractErrorMessage(err, "Invalid OTP");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  // 🔑 FORGOT PASSWORD
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/request-otp`, {
        email,
        purpose: "forgot-password",
      });
      const data = normalizeResponse(res.data);
      if (data.success) {
        toast.success(data.message || "OTP sent to your email");
      }
      return data;
    } catch (err) {
      const message = extractErrorMessage(err, "Failed to send reset OTP");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  // 🔄 RESET PASSWORD
  const resetPassword = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data?.email,
        otp: data?.otp,
        new_password: data?.new_password || data?.password,
      };
      const res = await axios.post(`${AUTH_API}/forgot-password/reset`, payload);
      const response = normalizeResponse(res.data);
      if (response.success) {
        toast.success(response.message || "Password reset successfully");
      }
      return response;
    } catch (err) {
      const message = extractErrorMessage(err, "Reset failed");
      toast.error(message);
      return normalizeResponse(err.response?.data || { success: false, message });
    } finally {
      setLoading(false);
    }
  };

  // � CHECK PROFILE COMPLETION
  const checkProfile = async (authToken) => {
    try {
      const res = await axios.get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const isOk = Boolean(res.data?.success ?? res.data?.status);
      if (!isOk) return false;

      const payload = res.data?.data || {};
      const userData = payload?.user || payload || {};
      const rawEdu = payload?.education || userData?.education || {};
      const profile = { ...userData, education: flattenEducation(rawEdu) };

      if (profile?.name || profile?.email) {
        setUser((prev) => ({ ...(prev || {}), ...profile }));
      }

      return calculateProfileCompletion(profile) === 100;
    } catch {
      return false;
    }
  };

  // �🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem(REGISTER_VERIFY_TOKEN_KEY);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithPassword,
        loginPendingRegisteredUser,
        sendOtp,
        verifyOtp,
        register,
        verifyRegisterOtp,
        forgotPassword,
        resetPassword,
        logout,
        checkProfile,
        storePendingRegisterCredentials,
        clearPendingRegisterCredentials,
        getPendingRegisterCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);