"use client";

import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-4115444466556482";

/**
 * Google AdSense unit. The adsbygoogle.js script is already loaded site-wide in
 * src/app/layout.js, so this only renders the <ins> slot and requests an ad for it.
 *
 * - Responsive (default): fills its container.
 * - Fixed size: pass `width` + `height` (px) — the slot must be created in AdSense with that size.
 *
 * Give it a changing `key` (e.g. the article id) so a new page gets a fresh ad request
 * on client-side navigation.
 */
export default function AdSenseUnit({ slot, width, height, className = "" }) {
  const pushed = useRef(false);
  const fixed = Boolean(width && height);

  useEffect(() => {
    if (pushed.current) return; // StrictMode runs effects twice in dev — push once per mount
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or script not ready — ignore */
    }
  }, []);

  return (
    <div className={className} aria-label="Advertisement">
      {fixed ? (
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: `${width}px`, height: `${height}px` }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
        />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
