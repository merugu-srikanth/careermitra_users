"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/utils/api";

const API_BASE = API_BASE_URL;

export default function ChatPanel({ token }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editing, setEditing] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch or create conversation
  const fetchConversation = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/chat/conversation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success || res.data) {
        // Handle standard envelope format
        const conv = res.data?.data || res.data?.conversation || res.data;
        setConversation(conv);
        return conv;
      }
    } catch (err) {
      console.error("Error fetching/creating conversation:", err);
      toast.error("Failed to load chat conversation.");
    }
    return null;
  };

  // Fetch full chat history
  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/user/chat/conversation/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success || Array.isArray(res.data?.data) || Array.isArray(res.data)) {
        const msgs = res.data?.data || res.data?.messages || res.data;
        if (Array.isArray(msgs)) {
          // Sort oldest to newest
          const sorted = [...msgs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(sorted);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!token) return;
    const initChat = async () => {
      await fetchConversation();
      await fetchMessages(true);
      scrollToBottom();
    };
    initChat();
  }, [token]);

  // Polling for real-time messages
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [token]);

  // Scroll on message change
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await axios.post(
        `${API_BASE}/user/chat/conversation/messages`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success || res.data) {
        setNewMessage("");
        await fetchMessages(false);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  // Edit message
  const handleEditMessage = async (messageId) => {
    if (!editValue.trim() || editing) return;
    setEditing(true);
    try {
      await axios.put(
        `${API_BASE}/user/chat/conversation/messages/${messageId}`,
        { message: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingMessageId(null);
      setEditValue("");
      await fetchMessages(false);
      toast.success("Message updated!");
    } catch (err) {
      console.error("Error editing message:", err);
      toast.error("Failed to edit message.");
    } finally {
      setEditing(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${API_BASE}/user/chat/conversation/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchMessages(false);
      toast.success("Message deleted.");
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Failed to delete message.");
    }
  };

  // Mark all as seen when chat opens
  useEffect(() => {
    if (!token) return;
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
  }, [token, messages.length]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isClosed = conversation?.status === "closed";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-3xl border border-orange-100">
        <div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin mb-3" />
        <p className="text-orange-400 text-sm font-semibold">Connecting to support...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-xs">
      {/* Chat Header */}
      <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
            💬
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-sm">CareerMitra Chat Support</p>
            <p className="text-xs text-slate-400">Ask us anything about jobs, exams, or your profile</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isClosed ? "bg-red-500" : "bg-green-500 animate-pulse"}`} />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {isClosed ? "Closed" : "Open"}
          </span>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50" style={{ scrollbarWidth: "thin" }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-slate-600 font-bold text-sm">Start a conversation with CareerMitra Support.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">Type your queries or feedback below and support team will reply shortly.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isStudent = msg.sender === "student";
            return (
              <div key={msg.id} className={`flex ${isStudent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm border transition-all ${
                  isStudent
                    ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-none border-orange-400"
                    : "bg-white text-slate-800 rounded-bl-none border-slate-100"
                }`}>
                  {/* Edited input */}
                  {editingMessageId === msg.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full p-2 text-xs border border-orange-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="px-2 py-1 text-[10px] bg-slate-200 text-slate-700 rounded-md font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditMessage(msg.id)}
                          disabled={editing}
                          className="px-2 py-1 text-[10px] bg-orange-600 text-white rounded-md font-bold"
                        >
                          {editing ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Deleted state vs standard text */}
                      <p className={`text-sm leading-relaxed ${msg.isDeleted ? "italic opacity-70" : ""}`}>
                        {msg.message}
                      </p>

                      {/* Message details & Actions */}
                      <div className="flex items-center justify-between gap-4 mt-2 pt-1.5 border-t border-white/10 text-[10px]">
                        <span className={isStudent ? "text-orange-100" : "text-slate-400"}>
                          {formatTime(msg.createdAt)}
                          {msg.isEdited && <span className="ml-1 opacity-70">(edited)</span>}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Student can edit/delete their own NOT deleted messages */}
                          {isStudent && !msg.isDeleted && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingMessageId(msg.id);
                                  setEditValue(msg.message);
                                }}
                                className="opacity-80 hover:opacity-100 transition-opacity font-bold underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="opacity-80 hover:opacity-100 transition-opacity font-bold text-red-100 hover:text-red-200 underline"
                              >
                                Delete
                              </button>
                            </>
                          )}

                          {/* Seen status for student messages */}
                          {isStudent && (
                            <span className="flex items-center gap-0.5">
                              {msg.isSeen ? (
                                <span className="text-[10px] text-green-200 font-bold">✓✓ Seen</span>
                              ) : (
                                <span className="text-[10px] text-orange-200 font-semibold">✓ Sent</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel */}
      <div className="shrink-0 p-4 border-t border-orange-50 bg-white">
        {isClosed ? (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-3 text-center text-xs font-semibold">
            🔒 This conversation has been closed by the support team.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1 px-4 py-3 text-sm border border-orange-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/20 text-slate-800"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl text-sm font-bold shadow-md shadow-orange-200 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {sending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                "Send"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
