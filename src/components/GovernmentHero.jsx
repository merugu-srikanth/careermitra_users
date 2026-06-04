import { useState, useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import image from "../assets/Careermitra-hero.webp";

/* ── Google Fonts injection ─────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    // @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Cinzel:wght@700;900&display=swap');
  `}</style>
);

/* ── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    :root {
      --or: #f97316;
      --gn: #22c55e;
      --gd: #fbbf24;
      --bg: #050a06;
      --surface: rgba(255,255,255,0.035);
      --border: rgba(255,255,255,0.08);
    }
   

    @keyframes textShimmer {
      0%,100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes floatY {
      0%,100% { transform: translateY(0px); }
      50% { transform: translateY(-18px); }
    }
    @keyframes rotateRing {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes rotateRingRev {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
    @keyframes pulseGlow {
      0%,100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(1.06); }
    }
    // @keyframes scanLine {
    //   0% { transform: translateY(-100%); }
    //   100% { transform: translateY(100vh); }
    // }
    @keyframes blobMorph {
      0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      66% { border-radius: 55% 45% 60% 40% / 35% 65% 45% 65%; }
    }
    @keyframes gridPan {
      0% { transform: translate(0,0); }
      100% { transform: translate(60px,60px); }
    }
    @keyframes nodeAppear {
      from { opacity:0; transform: scale(0.4) translateY(20px); }
      to { opacity:1; transform: scale(1) translateY(0px); }
    }
    @keyframes spokeDraw {
      from { stroke-dashoffset: 300; opacity:0; }
      to { stroke-dashoffset: 0; opacity:1; }
    }
    @keyframes shimmerButton {
      0% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes counterUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes taglineReveal {
      from { clip-path: inset(0 100% 0 0); opacity:0; }
      to { clip-path: inset(0 0% 0 0); opacity:1; }
    }
    @keyframes hexRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .shimmer-grad {
      background: linear-gradient(90deg, #f97316 0%, #fbbf24 42%, #22c55e 100%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: textShimmer 3.5s ease-in-out infinite;
    }
    .glass {
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.09);
    }
    .btn-primary {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #f97316 0%, #22c55e 100%);
      border: none;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 12px 40px rgba(249,115,22,0.55); }
    .btn-primary::after {
      content: '';
      position: absolute;
      top: 0; width: 60%; height: 100%;
      background: linear-gradient(105deg, transparent, rgba(255,255,255,0.28), transparent);
      animation: shimmerButton 2.5s ease infinite;
    }
    .btn-ghost {
      position: relative;
      overflow: hidden;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.18);
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
    }
    .btn-ghost:hover { transform: translateY(-3px) scale(1.03); background: rgba(255,255,255,0.12); box-shadow: 0 8px 32px rgba(34,197,94,0.2); }
    .stat-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 14px 20px;
      transition: background 0.3s, transform 0.3s;
    }
    .stat-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-4px); }
    .node-group { cursor: pointer; }
    .node-group:hover .node-circle { filter: drop-shadow(0 0 14px rgba(249,115,22,0.7)); }

    /* ── Mobile (≤767px) ── */
    @media (max-width: 480px) {
      .hero-title { font-size: clamp(1.6rem, 7vw, 2.2rem) !important; }
      .hero-sub { font-size: clamp(0.8rem, 3.5vw, 1rem) !important; }
    }
    @media (max-width: 767px) {
      .hero-content-wrap { padding: 80px 16px 24px !important; box-sizing: border-box !important; width: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; min-height: 100vh !important; }
      .hero-layout { flex-direction: column !important; align-items: center !important; width: 100% !important; box-sizing: border-box !important; }
      .right-panel { display: none !important; }
      .hub-svg { max-width: 360px !important; width: 100% !important; }
      .hero-left { text-align: center !important; max-width: 100% !important; width: 100% !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
      .hero-cta { justify-content: center !important; flex-direction: column !important; width: 100% !important; gap: 12px !important; }
      .hero-cta button { width: 100% !important; justify-content: center !important; font-size: 15px !important; padding: 15px 24px !important; box-sizing: border-box !important; }
    }
    /* ── Tablet & Landscape (768px – 1199px) ── */
    @media (min-width: 768px) and (max-width: 1199px) {
      .hero-content-wrap { padding: 90px 60px 32px !important; box-sizing: border-box !important; width: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; min-height: 100vh !important; }
      .hero-layout { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 24px !important; width: 100% !important; max-width: calc(100vw - 120px) !important; }
      .hero-left { text-align: left !important; align-items: flex-start !important; }
      .hero-cta { justify-content: flex-start !important; }
      .hero-title { font-size: clamp(1.8rem, 3.5vw, 2.6rem) !important; }
    }
    /* ── Desktop (≥1200px) ── */
    @media (min-width: 1200px) {
      .hero-content-wrap { padding: 100px 60px 40px !important; box-sizing: border-box !important; width: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; min-height: 100vh !important; }
      .hero-layout { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 40px !important; width: 100% !important; max-width: calc(100vw - 120px) !important; }
      .hero-left { text-align: left !important; align-items: flex-start !important; }
      .hero-cta { justify-content: flex-start !important; }
    }
  `}</style>
);

/* ── Icons ──────────────────────────────────────────────────────────────── */
const Icons = {
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" ry="2"/>
      <path d="M8 7V5a4 4 0 0 1 8 0v2"/>
      <path d="M3 12h18"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  grid: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  target: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  bulb: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  book: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  check: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  compass: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  star: <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

/* ── Particle System ────────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 1.2 + Math.random() * 2.2,
    color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#22c55e" : "#fbbf24",
    dur: 5 + Math.random() * 7,
    delay: Math.random() * 10,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{ y: [0, -window.innerHeight - 20], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ── Animated Grid BG ────────────────────────────────────────────────────── */
function GridBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      {/* Base dark */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, #0a1f0d 0%, #050a06 60%, #020502 100%)" }} />
      
      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: "-60px",
        backgroundImage: `
          linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridPan 8s linear infinite",
      }} />

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.12), rgba(34,197,94,0.14), transparent)",
        animation: "scanLine 6s linear infinite",
        zIndex: 1,
      }} />

      {/* Orange blob top-left */}
      <div style={{
        position: "absolute", top: "-120px", left: "-80px",
        width: "520px", height: "520px",
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        animation: "blobMorph 12s ease-in-out infinite",
      }} />
      {/* Green blob bottom-right */}
      <div style={{
        position: "absolute", bottom: "-100px", right: "-60px",
        width: "480px", height: "480px",
        background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
        animation: "blobMorph 15s ease-in-out infinite reverse",
      }} />
      {/* Center glow */}
      <div style={{
        position: "absolute", top: "30%", left: "20%",
        width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(251,191,36,0.04) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />

      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        opacity: 0.4,
      }} />
    </div>
  );
}

/* ── Options ─────────────────────────────────────────────────────────────── */
const OPTIONS = [
  { id: 1, label: "Internships", sub: "Govt. internships near you", path: "/#internship", icon: Icons.book, color: "#f97316" },
  { id: 2, label: "Skill-Up", sub: "Top upskilling programmes", path: "/#internship", icon: Icons.bulb, color: "#fbbf24" },
  { id: 3, label: "Career Guide", sub: "Free expert guidance", path: "/contact-us", icon: Icons.compass, color: "#22c55e" },
  { id: 4, label: "Job Alerts", sub: "Age & qualification alerts", path: "/jobs", icon: Icons.check, color: "#22c55e" },
  { id: 5, label: "Diverse Fields", sub: "Admin, defence & policy", path: "/contact-us", icon: Icons.target, color: "#f97316" },
];

/* ── Hub-Spoke SVG ──────────────────────────────────────────────────────── */
const W = 520, H = 460;
const HUB_X = W / 2, HUB_Y = 360, HUB_R = 64, NODE_R = 56, SPOKE = 196;

const FAN = [
  { oi: 4, deg: 201 },
  { oi: 3, deg: 235 },
  { oi: 2, deg: 269 },
  { oi: 1, deg: 303 },
  { oi: 0, deg: 337 },
];
const toRad = (d) => (d * Math.PI) / 180;
const NODES = FAN.map(({ oi, deg }) => ({
  oi, x: HUB_X + SPOKE * Math.cos(toRad(deg)), y: HUB_Y + SPOKE * Math.sin(toRad(deg)),
}));

function curvePath(nx, ny) {
  const dx = nx - HUB_X, dy = ny - HUB_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist, uy = dy / dist;
  const sx = HUB_X + ux * (HUB_R + 6), sy = HUB_Y + uy * (HUB_R + 6);
  const ex = nx - ux * (NODE_R + 5), ey = ny - uy * (NODE_R + 5);
  const mx = (sx + ex) / 2, my = (sy + ey) / 2;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${(mx + (HUB_X - mx) * 0.1).toFixed(1)} ${(my - 10).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

function HubSpoke({ onNav }) {
  const [shown, setShown] = useState([]);
  const [hov, setHov] = useState(null);

  useEffect(() => {
    NODES.forEach((_, i) => setTimeout(() => setShown((p) => [...p, i]), 400 + i * 220));
  }, []);

  const spokeLen = (nx, ny) => {
    const dx = nx - HUB_X, dy = ny - HUB_Y;
    return Math.sqrt(dx * dx + dy * dy) - HUB_R - NODE_R - 11;
  };

  return (
    <div >
      <svg
        className="hub-svg"
        viewBox={`20 10 ${W - 40} ${H + 10}`}
        width="100%"
        style={{ maxWidth: 500, height: "auto", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="og2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="ogV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="nodeFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id="hubBg" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#1c2e1e" />
            <stop offset="100%" stopColor="#080d08" />
          </radialGradient>
          <radialGradient id="hubGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <filter id="hubShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nodeBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrowOG2" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
            <polygon points="0,0 0,8 9,4" fill="url(#og2)" />
          </marker>
        </defs>

        {/* Root stems */}
        {[0,1,2,3,4].map((i) => (
          <motion.line key={i}
            x1={HUB_X - 22 + i * 11} y1={HUB_Y + HUB_R + 2}
            x2={HUB_X - 22 + i * 11} y2={HUB_Y + HUB_R + 38}
            stroke="url(#og2)" strokeWidth="2.5" strokeLinecap="round"
            initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
          />
        ))}

        {/* Pulse rings */}
        {[HUB_R + 22, HUB_R + 14, HUB_R + 6].map((r, ri) => (
          <circle key={ri} cx={HUB_X} cy={HUB_Y} r={r}
            fill="none" stroke="url(#og2)"
            strokeWidth={0.6 - ri * 0.1}
            strokeOpacity={0.18 - ri * 0.04}>
            <animate attributeName="r" values={`${r};${r + 11};${r}`} dur={`${3.8 + ri * 0.9}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values={`${0.18 - ri * 0.04};0.02;${0.18 - ri * 0.04}`} dur={`${3.8 + ri * 0.9}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Spokes */}
        {NODES.map(({ x, y }, fi) => (
          <path key={fi} d={curvePath(x, y)}
            fill="none" stroke="url(#og2)"
            strokeWidth={hov === fi ? 2.8 : 1.8}
            strokeLinecap="round"
            markerEnd="url(#arrowOG2)"
            strokeDasharray={spokeLen(x, y) + 20}
            strokeDashoffset={shown.includes(fi) ? 0 : spokeLen(x, y) + 20}
            style={{ transition: `stroke-dashoffset 0.7s ${fi * 0.16}s ease, stroke-width 0.2s, opacity 0.4s ${fi * 0.16}s`, opacity: shown.includes(fi) ? 1 : 0 }}
          />
        ))}

        {/* Hub outer glow */}
        <circle cx={HUB_X} cy={HUB_Y} r={HUB_R + 26} fill="url(#hubGlowGrad)" />

        {/* Hub body */}
        <circle cx={HUB_X} cy={HUB_Y} r={HUB_R} fill="url(#hubBg)" filter="url(#hubShadow)" />
        <circle cx={HUB_X} cy={HUB_Y} r={HUB_R} fill="none" stroke="url(#og2)" strokeWidth="2.8" strokeOpacity="0.8" />
        <circle cx={HUB_X} cy={HUB_Y} r={HUB_R - 10} fill="none" stroke="url(#og2)" strokeWidth="0.8" strokeOpacity="0.22" />

        {/* Rotating dashes around hub */}
        <g style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px`, animation: "rotateRing 12s linear infinite" }}>
          <circle cx={HUB_X} cy={HUB_Y} r={HUB_R + 5} fill="none" stroke="url(#og2)"
            strokeWidth="1.2" strokeOpacity="0.28" strokeDasharray="8 14" />
        </g>

        {/* Hub text */}
        <text x={HUB_X} y={HUB_Y - 12} textAnchor="middle"
          fontSize="16" fontWeight="900" letterSpacing="0.12em"
          fill="url(#og2)" fontFamily="'Rajdhani', sans-serif">CAREER</text>
        <text x={HUB_X} y={HUB_Y + 10} textAnchor="middle"
          fontSize="16" fontWeight="900" letterSpacing="0.12em"
          fill="url(#og2)" fontFamily="'Rajdhani', sans-serif">MITRA</text>
        <text x={HUB_X} y={HUB_Y + 28} textAnchor="middle"
          fontSize="7" fill="rgba(255,255,255,0.35)"
          fontFamily="'DM Sans', sans-serif">Your Career Guide</text>

        {/* Nodes */}
        {NODES.map(({ oi, x, y }, fi) => {
          const o = OPTIONS[oi];
          const isVis = shown.includes(fi);
          const isHov = hov === fi;
          const icColor = fi % 2 === 0 ? "#f97316" : "#22c55e";

          return (
            <g key={fi} className="node-group"
              style={{
                opacity: isVis ? 1 : 0,
                transform: isVis ? "scale(1)" : "scale(0.5)",
                transformOrigin: `${x}px ${y}px`,
                transition: `opacity 0.5s ${fi * 0.14 + 0.15}s, transform 0.55s ${fi * 0.14 + 0.15}s cubic-bezier(0.34,1.56,0.64,1)`,
              }}
              onClick={() => onNav(o.path)}
              onMouseEnter={() => setHov(fi)}
              onMouseLeave={() => setHov(null)}
            >
              {/* Hover outer glow */}
              {isHov && (
                <>
                  <circle cx={x} cy={y} r={NODE_R + 20} fill={icColor} fillOpacity="0.06" />
                  <circle cx={x} cy={y} r={NODE_R + 14}
                    fill="none" stroke={icColor} strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="6 5">
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur="4s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Node body */}
              <circle cx={x} cy={y} r={NODE_R}
                className="node-circle"
                fill="url(#nodeFill)"
                stroke="url(#og2)"
                strokeWidth={isHov ? 3.2 : 2}
                filter={isHov ? "url(#nodeBlur)" : "none"}
                style={{ transition: "stroke-width 0.2s" }}
              />
              <circle cx={x} cy={y} r={NODE_R - 9} fill="none"
                stroke="url(#og2)" strokeWidth="0.6"
                strokeOpacity={isHov ? 0.5 : 0.2} />

              {/* Icon via foreignObject */}
              <foreignObject x={x - 12} y={y - 26} width={24} height={24}>
                <div xmlns="http://www.w3.org/1999/xhtml"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                  {o.icon(icColor)}
                </div>
              </foreignObject>

              {/* Label */}
              <text x={x} y={y + 14} textAnchor="middle"
                fontSize="11" fontWeight="700" fill="url(#og2)"
                fontFamily="'Rajdhani', sans-serif" letterSpacing="0.04em">
                {o.label}
              </text>

              {/* Sub label on hover */}
              <text x={x} y={y + 27} textAnchor="middle"
                fontSize="5.8" fill="rgba(255,255,255,0.5)"
                fillOpacity={isHov ? 1 : 0}
                fontFamily="'DM Sans', sans-serif"
                style={{ transition: "fill-opacity 0.22s" }}>
                {o.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Stat Counter ────────────────────────────────────────────────────────── */
function StatCard({ value, label, icon, delay = 0 }) {
  return (
    <motion.div className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{ minWidth: 100 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color: "#22c55e" }}>{icon}</span>
        <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif", background: "linear-gradient(90deg,#f97316,#fbbf24,#22c55e)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          {value}
        </span>
      </div>
      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ── Badge Pill ──────────────────────────────────────────────────────────── */
function LiveBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: 99, padding: "5px 14px", marginBottom: 18,
        backdropFilter: "blur(10px)",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulseGlow 1.5s ease-in-out infinite", display: "inline-block" }} />
      <span style={{ fontSize: 11, color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>
        1,20,000+ GOVT JOBS UPDATED DAILY
      </span>
    </motion.div>
  );
}

/* ── Floating Tag ────────────────────────────────────────────────────────── */
function FloatingTag({ text, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4 + Math.random() * 0.5 }}
      style={{
        position: "absolute",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "6px 12px",
        fontSize: 10.5,
        color: "rgba(255,255,255,0.55)",
        fontFamily: "'DM Sans',sans-serif",
        backdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
        animation: "floatY 4s ease-in-out infinite",
        animationDelay: `${Math.random() * 2}s`,
        ...style,
      }}
    >
      {text}
    </motion.div>
  );
}

/* ── Right Panel: Illustrated Card ─────────────────────────────────────── */
function RightIllustration() {
  return (
    <div className="right-panel" style={{ position: "relative", flexShrink: 0 }}>
      {/* Floating tags */}
      {/* <FloatingTag text="🏛️ SSC CGL 2025" style={{ top: "8%", right: "2%", animationDelay: "0s" }} />
      <FloatingTag text="📋 UPSC Prelims" style={{ top: "22%", left: "-8%", animationDelay: "0.7s" }} />
      <FloatingTag text="🚂 Railway Group D" style={{ bottom: "30%", right: "-4%", animationDelay: "1.2s" }} />
      <FloatingTag text="🏦 IBPS PO 2025" style={{ bottom: "14%", left: "4%", animationDelay: "0.3s" }} /> */}

      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "clamp(380px, 44vw, 640px)",
          borderRadius: 28,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)",
          animation: "floatY 6s ease-in-out infinite",
        }}
      >
        {/* Card background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,25,18,0.95) 0%, rgba(8,14,10,0.98) 100%)",
          backdropFilter: "blur(20px)",
        }} />

        {/* Decorative corner glow */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 180, height: 180,
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: -30,
          width: 140, height: 140,
          background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        <div style={{ position: "relative", padding: "14px 14px 10px" }}>
          <img src={image} alt="Government Jobs" style={{ width: "100%", borderRadius: 16, marginBottom: 12, filter: "drop-shadow(0 12px 24px rgba(34,197,94,0.2)) drop-shadow(0 6px 12px rgba(249,115,22,0.15))", display: "block" }}  alt="Government Jobs in Careermitra" />  
          {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 11, color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                Top Opportunities
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Rajdhani',sans-serif" }}>
                Govt Job Dashboard
              </div>
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg,#f97316,#22c55e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>🎯</div>
          </div>

          {[
            { emoji: "🏛️", title: "SSC CGL 2025", sub: "17,727 Posts • Age: 18-32", tag: "Apply Now", tagColor: "#22c55e" },
            { emoji: "🚂", title: "Railway RRB NTPC", sub: "11,558 Posts • 12th Pass", tag: "Trending", tagColor: "#f97316" },
            { emoji: "🏦", title: "IBPS PO 2025", sub: "4,455 Posts • Graduate", tag: "New", tagColor: "#fbbf24" },
            { emoji: "⚔️", title: "CDS 2025 II", sub: "459 Posts • UPSC Exam", tag: "Closing Soon", tagColor: "#ef4444" },
          ].map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.12 }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12, marginBottom: 8,
                background: i === 0 ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${i === 0 ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)"}`,
                cursor: "pointer", transition: "all 0.2s",
              }}
              whileHover={{ x: 4, background: "rgba(255,255,255,0.07)" }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{job.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans',sans-serif", marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {job.title}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
                  {job.sub}
                </div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 99,
                background: `${job.tagColor}22`, color: job.tagColor,
                border: `1px solid ${job.tagColor}44`,
                fontFamily: "'DM Sans',sans-serif", flexShrink: 0,
              }}>{job.tag}</span>
            </motion.div>
          ))} */}

          <div style={{
            marginTop: 14, paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", gap: 0 }}>
              {/* {[...Array(5)].map((_, i) => <span key={i}>{Icons.star}</span>)} */}
              <span className="text-md" style={{ color: "rgba(255,255,255,0.45)", marginLeft: 0, fontFamily: "'DM Sans',sans-serif" }}>
               Careermitra empowers you with matching career alerts in government sector.
              </span>
            </div>
            {/* <span style={{ fontSize: 10, color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>View All →</span> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Hero ──────────────────────────────────────────────────────────── */
export default function IndiaJobsHero() {
  const navigate = useNavigate();

  const handleNav = (path) => {
    if (typeof path === "string" && path.includes("#")) {
      const hash = path.split("#")[1];
      const scroll = () => {
        const target = document.getElementById(hash);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (window.location.pathname !== "/") { navigate("/"); setTimeout(scroll, 250); }
      else scroll();
      return;
    }
    navigate(path);
  };

  return (
    <>
      {/* <FontLoader /> */}
      <GlobalStyles />
      <div style={{
        position: "relative",
        height: "100vh",
        background: "#050a06",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        width: "100%",
      }}>
        <GridBackground />
        <Particles />

        {/* Content */}
        <div
          className="hero-content-wrap"
          style={{
            position: "relative", zIndex: 10,
            display: "flex", alignItems: "center",
            justifyContent: "center",
            padding: "100px 60px 40px",
            boxSizing: "border-box",
            width: "100%",
            minHeight: "100vh",
          }}>
          <div className="hero-layout" style={{
            width: "100%",
            maxWidth: "calc(100vw - 120px)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 40,
          }}>

            {/* LEFT: Text + Hub */}
            <motion.div
              className="hero-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: 1, maxWidth: 600, minWidth: 0 }}
            >
              {/* <LiveBadge /> */}

              {/* Main heading */}
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                style={{
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  margin: 0,
                  // letterSpacing: "0.02em",
                }}
              >
                <span className="shimmer-grad" style={{ whiteSpace: "nowrap" }}>Welcome to CareerMitra</span>
              
                {/* <span className="shimmer-grad">CareerMitra</span> */}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                className="hero-sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.6 }}
                style={{
                  fontSize: "clamp(0.88rem, 1.5vw, 1.12rem)",
                  color: "rgba(255,255,255,0.55)",
                  fontStyle: "italic",
                  margin: 0,
                  lineHeight: 1.55,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                }}
              >
                Let your career be,{" "}
                <span style={{ color: "#22c55e", fontWeight: 600 }}>an informed choice…</span>
                {" "}
                <span className="shimmer-grad" style={{ fontStyle: "italic" }}>not a forced decision</span>
              </motion.p>

              {/* Hub-Spoke */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: -44, marginBottom: -30 }}
              >
                <HubSpoke onNav={handleNav} />
              </motion.div>

              {/* Stats row */}
              {/* <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}
              >
                <StatCard value="1.2L+" label="Live Jobs" icon={Icons.users} delay={0.6} />
                <StatCard value="85K+" label="Students Helped" icon={Icons.users} delay={0.68} />
                <StatCard value="28+" label="Exam Categories" icon={Icons.users} delay={0.76} />
              </motion.div> */}

              {/* CTA buttons */}
              <motion.div
                className="hero-cta"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}
              >
                <button
                  className="btn-primary"
                  onClick={() => navigate("/jobs")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "16px 32px", borderRadius: 99,
                    fontSize: 15.5, fontWeight: 700, color: "#fff",
                    fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em",
                    boxShadow: "0 4px 32px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.bell}</span>
                  Latest Govt Job
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </button>

                <button
                  className="btn-ghost"
                  onClick={() => navigate("/user-dashboard")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 12,
                    padding: "16px 32px", borderRadius: 99,
                    fontSize: 15.5, fontWeight: 700, color: "rgba(255,255,255,0.85)",
                    fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.grid}</span>
                  User Dashboard
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </button>
              </motion.div>

              {/* Trust bar */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                style={{
                  marginTop: 22, paddingTop: 18,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                }}
              >
                {["SSC", "UPSC", "Railway", "IBPS", "State PSC", "Defence"].map((t, i) => (
                  <motion.span key={t}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.95 + i * 0.07 }}
                    style={{
                      fontSize: 10.5, color: "rgba(255,255,255,0.35)",
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                      padding: "3px 10px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 6,
                    }}>{t}</motion.span>
                ))}
              </motion.div> */}
            </motion.div>
          <div> {/* RIGHT: Job card */}
            <RightIllustration /></div>
           
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 5,
          background: "linear-gradient(to bottom, transparent, rgba(5,10,6,0.8))",
          pointerEvents: "none",
        }} />
      </div>
    </>
  );
}