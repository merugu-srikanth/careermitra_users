"use client";

import { useEffect, useState } from "react";

export default function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    // Standard service worker registration update listener can be configured here
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Stub for Next.js PWA update prompt
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        let hasUnregisteredAny = false;
        for (let registration of registrations) {
          const scriptURL = registration.active?.scriptURL ||
            registration.installing?.scriptURL ||
            registration.waiting?.scriptURL || "";

          // Target and unregister the old 'sw.js' (leaving firebase-messaging-sw.js alone)
          if (scriptURL.endsWith('/sw.js') || (scriptURL.includes('sw.js') && !scriptURL.includes('firebase-messaging-sw.js'))) {
            console.log("Removing old/stale PWA service worker:", scriptURL);
            registration.unregister();
            hasUnregisteredAny = true;
          }
        }

        // Refresh the page to load new files directly from network
        if (hasUnregisteredAny) {
          window.location.reload();
        }
      }).catch(err => {
        console.error("Error checking service workers:", err);
      });
    }
  }, []);


  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-blue-900 text-white rounded-xl shadow-2xl px-5 py-4 flex items-center gap-4 max-w-sm w-full mx-4">
      <div className="flex-1">
        <p className="font-semibold text-sm">App Update Available</p>
        <p className="text-xs text-blue-200 mt-0.5">A new version of Careermitra is ready.</p>
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
