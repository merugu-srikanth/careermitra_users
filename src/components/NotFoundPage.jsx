import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-20"
      // style={{
      //   background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      // }}
    >
      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            width: `${8 + i * 4}px`,
            height: `${8 + i * 4}px`,
            background: i % 2 === 0 ? "#f97316" : "#ec4899",
            top: `${10 + i * 14}%`,
            left: `${5 + i * 15}%`,
          }}
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl w-full text-center">

        {/* 404 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-[120px] md:text-[140px] font-extrabold leading-none select-none"
          style={{
            background: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(249,115,22,0.5))",
            letterSpacing: "-4px",
          }}
        >
          404
        </motion.h1>

        {/* GIF Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-sm md:max-w-2xl mx-auto"
        >
          <div
            className="rounded-3xl overflow-hidden border border-white/10"
            style={{
              // background: "rgba(255,255,255,0.05)",
              // backdropFilter: "blur(12px)",
              // padding: "10px",
              // boxShadow: "0 0 60px rgba(249,115,22,0.2), 0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
              alt="careermitra - 404 Not Found"
              className="w-full h-55 md:h-70 object-cover rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Oops! You&apos;re{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f97316, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Lost
            </span>
          </h2>
          {/* <p className="text-gray-400 text-base md:text-lg max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track!
          </p> */}
        </motion.div>

        {/* Go Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #f97316, #ec4899)",
              boxShadow: "0 0 30px rgba(249,115,22,0.45), 0 0 60px rgba(236,72,153,0.25)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
            Navigate Home
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFoundPage;
