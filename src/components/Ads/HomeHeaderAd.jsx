"use client";

import { useSyncExternalStore } from "react";
import AdSenseUnit from "./AdSenseUnit";

// HomePage-Header slot is a fixed 928x90 unit, so only render it where it fits
// (a hidden/zero-width slot makes AdSense throw "no slot size for availableWidth=0").
const QUERY = "(min-width: 960px)";

function subscribe(onChange) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export default function HomeHeaderAd() {
  const fits = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false // server render: no ad, avoids hydration mismatch
  );

  if (!fits) return null;

  return (
    <div className="flex justify-center px-4 pt-4">
      <AdSenseUnit slot="5138651658" width={928} height={90} />
    </div>
  );
}
