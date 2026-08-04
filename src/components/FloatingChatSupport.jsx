"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/utils/api";
import { FaComments, FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiSend, BiChevronLeft } from "react-icons/bi";
import { HiOutlineSparkles } from "react-icons/hi2";

const API_BASE = API_BASE_URL;

const FAQ_DATA = [
  {
    id: 1,
    question: "Where can I see matching job alerts?",
    answer: "After logging into your **Careermitra** account, you can view your personalized job alerts in your **Student Dashboard**. Complete your profile with your qualification and preferences to receive the most relevant government job opportunities."
  },
  {
    id: 2,
    question: "Is there a WhatsApp channel for the latest government job notifications?",
    answer: "Yes! Join our official WhatsApp channel to receive the latest government job notifications and important announcements directly on WhatsApp.\n\n**Follow the Careermitra Latest Govt Updates (PAN INDIA Coverage) channel:**\n[Join WhatsApp Channel](https://whatsapp.com/channel/0029Vb7zTcp7j6g6O0OHfn37)"
  },
  {
    id: 3,
    question: "Is Careermitra completely free, or do I need a subscription?",
    answer: "**Careermitra is 100% free** to use. You can browse government jobs, receive personalized job alerts, and access the latest government job updates without paying for any subscription."
  },
  {
    id: 4,
    question: "How do I receive personalized job notifications?",
    answer: "Simply **register for a free Careermitra account** and complete your profile by adding your qualification and other details. Based on your profile, you'll automatically receive personalized government job notifications in your **Student Dashboard** and **email**."
  },
  {
    id: 5,
    question: "Do I need to create an account to receive job alerts?",
    answer: "Yes. Creating a free **Careermitra** account is required to receive personalized job alerts and access your **Student Dashboard**."
  },
  {
    id: 6,
    question: "How do I contact Careermitra support?",
    answer: "To contact **Careermitra** support, please **register or log in** to your account and continue the conversation through our **Customer Support Chat**. This helps us verify your account and provide faster, more personalized assistance."
  }
];

const parseMarkdown = (text) => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-extrabold">{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const url = linkMatch[2];
      const label = linkMatch[1];
      if (url.includes("whatsapp.com")) {
        return (
          <span key={idx} className="block mt-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FaWhatsapp size={15} />
              <span>Join WhatsApp Channel</span>
            </a>
          </span>
        );
      }
      return (
        <a
          key={idx}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 underline font-semibold break-all"
        >
          {label}
        </a>
      );
    }
    return part;
  });
};

export default function FloatingChatSupport() {
  const { token, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("faq"); // "faq" or "live" or "login-required"
  const [localMessages, setLocalMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to **Careermitra Support**. How can we help you today? Select one of our common queries or choose to chat with our support team."
    }
  ]);
  
  // Live chat states
  const [conversation, setConversation] = useState(null);
  const [liveMessages, setLiveMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingLive, setLoadingLive] = useState(false);
  const [sending, setSending] = useState(false);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const triggerButtonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside of chat window or toggle button
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target) &&
        triggerButtonRef.current &&
        !triggerButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [localMessages, liveMessages, mode, isOpen]);

  // Live Chat: Fetch or create conversation
  const fetchConversation = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/chat/conversation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      if (data?.success || data) {
        const conv = data?.data || data?.conversation || data;
        setConversation(conv);
        return conv;
      }
    } catch (err) {
      console.error("Error fetching/creating conversation:", err);
    }
    return null;
  };

  // Live Chat: Fetch full chat history
  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoadingLive(true);
    try {
      const res = await axios.get(`${API_BASE}/user/chat/conversation/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      
      let msgs = null;
      if (data) {
        if (data.data?.messages && Array.isArray(data.data.messages)) {
          msgs = data.data.messages;
        } else if (data.data && Array.isArray(data.data)) {
          msgs = data.data;
        } else if (data.messages && Array.isArray(data.messages)) {
          msgs = data.messages;
        } else if (Array.isArray(data)) {
          msgs = data;
        }
      }

      if (msgs && Array.isArray(msgs)) {
        const sorted = [...msgs].sort((a, b) => {
          const timeA = new Date(a.createdAt || a.created_at || 0);
          const timeB = new Date(b.createdAt || b.created_at || 0);
          return timeA - timeB;
        });
        setLiveMessages(sorted);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (showLoading) setLoadingLive(false);
    }
  };

  // Polling for live chat messages
  useEffect(() => {
    if (!token || mode !== "live" || !isOpen) return;
    
    // Fetch initial
    fetchConversation();
    fetchMessages(true);

    const interval = setInterval(() => {
      fetchMessages(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [token, mode, isOpen]);

  // Mark all as seen when live chat is active
  useEffect(() => {
    if (!token || mode !== "live" || !isOpen || liveMessages.length === 0) return;
    const markAsSeen = async () => {
      try {
        await axios.patch(
          `${API_BASE}/user/chat/conversation/seen`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error marking messages seen:", err);
      }
    };
    markAsSeen();
  }, [token, mode, isOpen, liveMessages.length]);

  const handleSendLiveMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanMessage = newMessage.trim();
    if (!cleanMessage) return;
    if (sending) return;

    setSending(true);
    try {
      const res = await axios.post(
        `${API_BASE}/user/chat/conversation/messages`,
        { message: cleanMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success || res.data?.status || res.data) {
        setNewMessage("");
        await fetchMessages(false);
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleSelectFAQ = (faq) => {
    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: faq.question
    };

    // Add bot message
    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: faq.answer
    };

    setLocalMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleStartLiveSupport = () => {
    if (!token) {
      setMode("login-required");
    } else {
      setMode("live");
    }
  };

  const handleBackToFAQ = () => {
    setMode("faq");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[9999] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white border border-orange-100"
            style={{ width: "min(400px, calc(100vw - 2rem))", height: "550px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-green-600 px-4 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                {mode !== "faq" && (
                  <button
                    onClick={handleBackToFAQ}
                    className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                    title="Back to FAQ"
                  >
                    <BiChevronLeft size={24} />
                  </button>
                )}
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 font-bold">
                  💬
                </div>
                <div>
                  <h3 className="text-white font-black text-sm tracking-wide leading-none">
                    {mode === "live" ? "Live CareerMitra Chat" : "CareerMitra Help Desk"}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-orange-100 font-semibold uppercase tracking-wider">
                      {mode === "live" ? "Connected to Team" : "Instant Support"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all"
                aria-label="Close Help Desk"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
              style={{ scrollbarWidth: "thin", scrollBehavior: "smooth" }}
            >
              {mode === "faq" && (
                <>
                  {localMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-xs border transition-all ${
                          msg.sender === "user"
                            ? "bg-orange-500 text-white rounded-tr-none border-orange-600"
                            : "bg-white text-slate-800 rounded-tl-none border-slate-200/60 leading-relaxed"
                        }`}
                      >
                        {parseMarkdown(msg.text)}
                      </div>
                    </div>
                  ))}

                  {/* FAQ Suggestion List */}
                  <div className="space-y-1.5 mt-2.5 pt-2.5 border-t border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Frequently Asked Questions
                    </p>
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        {FAQ_DATA.map((faq) => (
                          <button
                            key={faq.id}
                            onClick={() => handleSelectFAQ(faq)}
                            className="text-left text-[10.5px] p-2 leading-snug rounded-xl border border-orange-100 bg-white hover:bg-orange-50/40 hover:border-orange-200 text-slate-700 transition-all font-semibold active:scale-[0.99] min-h-[46px] flex items-center"
                          >
                            {faq.question}
                          </button>
                        ))}
                      </div>
                      
                      {/* 7th option to switch to live support */}
                      <button
                        onClick={handleStartLiveSupport}
                        className="w-full text-left text-xs p-2 mt-0.5 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-50 hover:border-green-300 text-green-700 transition-all font-black flex items-center justify-between group active:scale-[0.99]"
                      >
                        <span>🤝 Chat with Careermitra support team</span>
                        <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {mode === "login-required" && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 text-3xl shadow-sm">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">Account Required</h4>
                    <p className="text-xs text-slate-400 mt-2 max-w-[280px] leading-relaxed">
                      You must be registered or logged in to send a message to the support team.
                    </p>
                  </div>
                  <div className="flex flex-col w-full gap-2 pt-2">
                    <a
                      href="/login"
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold text-center shadow-md shadow-orange-100 hover:opacity-95 transition-opacity"
                    >
                      Login
                    </a>
                    <a
                      href="/register"
                      className="w-full py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold text-center transition-colors"
                    >
                      Register New Account
                    </a>
                  </div>
                </div>
              )}

              {mode === "live" && (
                <>
                  {loadingLive ? (
                    <div className="flex flex-col items-center justify-center h-[250px]">
                      <div className="w-8 h-8 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin mb-2" />
                      <p className="text-orange-400 text-xs font-semibold">Connecting to support agent...</p>
                    </div>
                  ) : liveMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[250px] text-center p-6">
                      <div className="text-3xl mb-2">👋</div>
                      <p className="text-slate-700 font-bold text-xs">Start a conversation with Support.</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                        Type your message below and our team will get back to you shortly.
                      </p>
                    </div>
                  ) : (
                    liveMessages.map((msg, idx) => {
                      const isStudent =
                        msg.sender === "student" ||
                        msg.sender === "user" ||
                        (user?.id && msg.sender === user.id) ||
                        (user?.id && msg.senderId === user.id);

                      const msgId = msg.id || msg.messageId || msg._id || `live-${idx}`;
                      const isMsgDeleted = msg.isDeleted || msg.is_deleted;
                      const textContent = isMsgDeleted ? "This message was deleted." : (msg.message || msg.text || msg.content);

                      return (
                        <div key={msgId} className={`flex ${isStudent ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-xs border transition-all ${
                              isStudent
                                ? "bg-orange-500 text-white rounded-tr-none border-orange-600"
                                : "bg-white text-slate-800 rounded-tl-none border-slate-200/60 shadow-xs leading-relaxed"
                            }`}
                          >
                            <p className={isMsgDeleted ? "italic opacity-70" : ""}>{textContent}</p>
                            <div className="text-[9px] mt-1 opacity-60 text-right">
                              {formatTime(msg.createdAt || msg.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>

            {/* Input Footer for Live Chat */}
            {mode === "live" && (
              <div className="shrink-0 p-3 border-t border-orange-50 bg-white">
                {conversation?.status === "closed" ? (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-2.5 text-center text-xs font-semibold">
                    🔒 This conversation is closed.
                  </div>
                ) : (
                  <form onSubmit={handleSendLiveMessage} className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled={sending}
                      className="flex-1 px-3 py-2 text-xs border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/20 text-slate-800"
                    />
                    <button
                      type="submit"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                        !newMessage.trim() || sending
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 shadow-md shadow-orange-200 cursor-pointer"
                      }`}
                    >
                      {sending ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <BiSend size={16} />
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      <div className="fixed right-4 bottom-6 sm:right-6 sm:bottom-8 z-[9999]">
        <div className="relative group">
          {/* Animated concentric rings */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-orange-400/50"
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-green-500/40"
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
          />

          <motion.button
            ref={triggerButtonRef}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Open Career Mitra Help Desk"
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-green-600 text-white shadow-xl shadow-orange-600/30 flex items-center justify-center border-2 border-white/20 cursor-pointer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <IoClose size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="chat-icon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="text-white flex items-center justify-center"
                >
                  <FaComments size={24} />
                </motion.span>
              )}
            </AnimatePresence>

            <motion.span
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-md pointer-events-none"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <HiOutlineSparkles size={14} />
            </motion.span>
          </motion.button>

          {!isOpen && (
            <div className="hidden sm:block absolute right-16 bottom-2.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
              <div className="bg-slate-900 border border-slate-800 text-white shadow-xl rounded-xl px-3 py-1.5 text-[11px] font-black whitespace-nowrap tracking-wide uppercase">
                Support & FAQs ✨
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
