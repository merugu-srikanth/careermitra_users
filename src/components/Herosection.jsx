"use client";

import React, { useRef } from 'react';
import Link from "next/link";
import { motion, } from 'framer-motion';
import { 
  FaBalanceScale, 
  FaUserShield, 
  FaGraduationCap, 
  FaHandHoldingHeart, 
  FaHospitalSymbol, 
  FaGavel 
} from 'react-icons/fa';
// import heroImg from "../assets/bg-images/hero-bg-img2.webp";
import center from "../assets/bg-images/CenterIMG.webp";

const trust = ["🏛️ 100% Free", "🔔 Daily Updates", "📱 No Spam", "🆓 10K+ Users Subscribed"];

const governmentNodes = [
  { icon: <FaGavel />, color: 'border-blue-500', pos: 'top-[12%] right-[22%]', size: 'w-24 h-24', label: 'Judiciary', speed: 40 },
  { icon: <FaUserShield />, color: 'border-pink-500', pos: 'top-[38%] right-[2%]', size: 'w-20 h-20', label: 'Police', speed: -30 },
  { icon: <FaHandHoldingHeart />, color: 'border-purple-500', pos: 'bottom-[18%] right-[4%]', size: 'w-18 h-18', label: 'Welfare', speed: 50 },
  { icon: <FaHospitalSymbol />, color: 'border-orange-500', pos: 'top-[18%] left-[25%]', size: 'w-20 h-20', label: 'Health', speed: -45 },
  { icon: <FaGraduationCap />, color: 'border-yellow-400', pos: 'bottom-[35%] left-[8%]', size: 'w-16 h-16', label: 'UPSC', speed: 35 },
];

export default function IntegratedHero() {
  const containerRef = useRef(null);

  // Mouse Parallax Logic
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    // We apply this via CSS variables for performance
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0500] selection:bg-amber-500/60"
    >
      {/* 1. Background Layer */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img 
          src="" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-50 scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0c0500]/70 via-[#0c0500]/50 to-[#0c0500]/30" />
      </motion.div>

      {/* 2. Dynamic Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 3. The Content Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        
        {/* Left Column: Typography */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col space-y-4"
        >
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase"
            >
              Certified Updates • 2026
            </motion.span>
            
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white leading-[1.05] tracking-tight">
              Latest Govt Jobs Notifications 2026 
             
            </h1>
            <h2 className="text-[clamp(2.5rem,3vw,4rem)] font-black text-white leading-[1.05] tracking-tight">
              <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(245,158,11,0.2)]">
                Personalized Alerts For You
              </span>
            </h2>
          </div>

          {/* <p className="text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed font-light">
            Don't just search for a career. Let your future <span className="text-white font-medium italic underline decoration-amber-500/50 underline-offset-4">find you first</span> with AI-powered alerts tailored to your location and expertise.
          </p> */}

           <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-amber-50/90 text-[clamp(1rem,2.5vw,1.25rem)] max-w-4xl mx-auto font-normal leading-relaxed"
        >
          Your one-stop destination for the latest government job updates, with

          <span className="text-amber-400 font-bold mx-1"> personalized job notifications</span>
          at your fingertips, curated based on your profile, interests, and location.
        </motion.p>

          <div className="flex flex-col sm:flex-row gap-5 pt-2">
            <Link href="#" className="relative group px-5 py-5 rounded-2xl bg-amber-500 text-[#ffffff] font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.5)]">
              Let Every Update Find You First.
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all" />
            </Link>


            <Link href="#" className="px-5 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold text-lg hover:bg-white/10 transition-all">
              Browse Latest Jobs
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {trust.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Interactive Graphic */}
        <div className="relative h-[500px] lg:h-[700px] flex items-center justify-center">
          
          {/* Main Core Node */}
          <motion.div 
            style={{ 
              x: 'calc(var(--mouse-x) * 0.5)', 
              y: 'calc(var(--mouse-y) * 0.5)' 
            }}
            className="relative z-30 group"
          >
            <div className="relative w-full h-full lg:w-66 lg:h-66 rounded-full bg-white flex flex-col items-center justify-center p-1 shadow-[0_0_80px_rgba(245,158,11,0.3)]">
              {/* Pulsing Core Glow */}
              {/* <div className="absolute inset-[-15px] rounded-full border border-amber-500/20 animate-ping opacity-20" />
              <div className="absolute inset-0 rounded-full border-[10px] border-[#0c0500] z-10" />
              <div className="absolute inset-[-4px] rounded-full border-2 border-amber-500/50 animate-hero-slow" />
              
              <FaBalanceScale className="text-6xl text-slate-800 mb-4 transition-transform group-hover:scale-110 duration-500" />
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-none uppercase">
                Core <br /> Services
              </h2>
              <div className="mt-4 h-1 w-12 bg-amber-500 rounded-full" />
            </div> */}
            <img src={center.src || center} alt="Center Graphic" className="w-full h-full lg:w-80 lg:h-80 object-cover rounded-full shadow-[0_0_80px_rgba(245,158,11,0.3)]" />
            </div>
          </motion.div>

          {/* Floating Category Nodes */}
          {governmentNodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              style={{ 
                x: `calc(var(--mouse-x) * ${node.speed * 0.05})`, 
                y: `calc(var(--mouse-y) * ${node.speed * 0.05})` 
              }}
              className={`absolute ${node.pos} ${node.size} rounded-full border-2 ${node.color} hero-glass-morph shadow-2xl flex items-center justify-center z-40 cursor-pointer group`}
            >
              <div className="text-3xl text-slate-100 group-hover:scale-110 transition-transform">
                {node.icon}
              </div>
              <div className="absolute -bottom-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                 <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-[#0c0500] px-2 py-1 rounded border border-amber-500/30">
                  {node.label}
                 </span>
              </div>
            </motion.div>
          ))}

          {/* Orbit Rings Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 border border-slate-500/30 rounded-full animate-hero-slow scale-[1.2]" />
            <div className="absolute inset-0 border border-dashed border-amber-500/20 rounded-full animate-hero-reverse scale-[0.8]" />
          </div>
        </div>
      </div>

      {/* 4. Bottom Fade */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#0c0500] to-transparent z-10" />
    </section>
  );
}