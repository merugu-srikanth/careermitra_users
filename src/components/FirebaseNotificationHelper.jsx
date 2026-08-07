"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { requestFcmToken, subscribeToForegroundMessages } from "@/utils/firebase";

export default function FirebaseNotificationHelper() {
  const { token } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check notification permission state
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = Notification.permission;

      if (permission === "granted") {
        // If already granted, refresh the token silently
        requestFcmToken(token);
      } else if (permission === "default") {
        // If not prompted yet, show a custom notification opt-in toast
        const toastId = toast.info(
          <div className="flex flex-col gap-1">
            <p className="font-bold text-xs text-slate-800">Stay Updated! 🔔</p>
            <p className="text-[10px] text-slate-600">Enable push notifications to get the latest government job updates instantly.</p>
            <button
              onClick={() => {
                requestFcmToken(token);
                toast.dismiss(toastId);
              }}
              className="mt-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] rounded-lg shadow-sm hover:opacity-90 self-start"
            >
              Enable Notifications
            </button>
          </div>,
          {
            position: "top-right",
            autoClose: false, // Don't close until action is taken
            closeOnClick: false,
            draggable: false,
          }
        );
      }
    }

    // Subscribe to foreground push notifications
    const unsubscribe = subscribeToForegroundMessages((payload) => {
      console.log("Foreground push notification received:", payload);

      // Display the received push notification dynamically as a Toast
      toast.info(
        <div className="flex flex-col gap-0.5">
          <p className="font-extrabold text-xs text-slate-800">{payload.notification?.title || "Career Mitra Alert 📢"}</p>
          <p className="text-[10px] text-slate-600 leading-snug">{payload.notification?.body}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 8000,
          icon: "🔔",
        }
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [mounted, token]);

  return null;
}
