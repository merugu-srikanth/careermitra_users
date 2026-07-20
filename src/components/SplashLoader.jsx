"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash loader after 1.5 seconds (gives ample time for initial loading/hydration)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white"
          style={{ zIndex: 99999 }}
        >
          {/* Subtle radiating background pulses */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute w-72 h-72 rounded-full bg-orange-100/50"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.6, ease: "easeOut" }}
              className="absolute w-72 h-72 rounded-full bg-green-100/30"
            />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
              }}
              className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center bg-white p-4 rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50"
            >
              <img
                src="/pwa-icons/icon-512x512.png"
                alt="Career Mitra"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Brand Title */}
            <div className="overflow-hidden flex flex-col items-center">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-orange-500 via-orange-600 to-green-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                CAREER MITRA
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.6 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="text-xs md:text-sm font-semibold text-slate-500 tracking-widest mt-1.5 uppercase"
              >
                Empowering Your Future
              </motion.p>
            </div>

            {/* Sleek Line Progress Indicator */}
            <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="relative h-full w-1/2 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
