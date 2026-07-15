"use client";

import { useEffect, useState } from "react";

export default function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    // Standard service worker registration update listener can be configured here
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Stub for Next.js PWA update prompt
    }
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-blue-900 text-white rounded-xl shadow-2xl px-5 py-4 flex items-center gap-4 max-w-sm w-full mx-4">
      <div className="flex-1">
        <p className="font-semibold text-sm">App Update Available</p>
        <p className="text-xs text-blue-200 mt-0.5">A new version of CareerMitra is ready.</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-xs text-blue-300 hover:text-white px-2 py-1"
        >
          Later
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="bg-white text-blue-900 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
}
