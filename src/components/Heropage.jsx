import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

/* ─── Card Icons ─────────────────────────────────────────────────────────── */
const JobAlertsIcon = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const CareerGuideIcon = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const SkillUpIcon = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);
const DiverseIcon = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const InternshipIcon = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

/* ─── Stat Icons ─────────────────────────────────────────────────────────── */
const UsersIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const BriefcaseIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const AcademicIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const BookIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const TrendIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

/* ─── Data ───────────────────────────────────────────────────────────────── */
const CARDS = [
  {
    id: 1, label: "Job Alerts", sub: "Get instant notifications for the latest job openings.",
    Icon: JobAlertsIcon, color: "#f97316", path: "/jobs", colSpan: 1,
  },
  {
    id: 2, label: "Career Guide", sub: "Expert guidance to help you choose the right career path.",
    Icon: CareerGuideIcon, color: "#22c55e", path: "/contact-us", colSpan: 1,
  },
  {
    id: 3, label: "Skill-Up", sub: "Upskill with the best resources and grow your potential.",
    Icon: SkillUpIcon, color: "#f97316", path: "/#internship", colSpan: 1,
  },
  {
    id: 4, label: "Diverse Fields", sub: "Explore opportunities across multiple industries.",
    Icon: DiverseIcon, color: "#22c55e", path: "/contact-us", colSpan: 1,
  },
  {
    id: 5, label: "Internships", sub: "Find the best internship opportunities to kickstart your career.",
    Icon: InternshipIcon, color: "#f97316", path: "/#internship", colSpan: 1,
  },
];

const STATS = [
  { value: "50K+", label: "Active Users", Icon: UsersIcon, color: "#22c55e" },
  { value: "15K+", label: "Job Opportunities", Icon: BriefcaseIcon, color: "#f97316" },
  { value: "5K+", label: "Internship Listings", Icon: AcademicIcon, color: "#22c55e" },
  { value: "100+", label: "Career Resources", Icon: BookIcon, color: "#f97316" },
  { value: "20+", label: "Diverse Fields", Icon: TrendIcon, color: "#22c55e" },
];

/* ─── Feature Card ───────────────────────────────────────────────────────── */
function FeatureCard({ card, onNav, index }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
      onClick={() => onNav(card.path)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hov ? card.color + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 14,
        padding: "22px 18px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        textAlign: "center",
        boxShadow: hov ? `0 0 22px ${card.color}22` : "none",
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: 54, height: 54, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${card.color}18`,
        border: `1.5px solid ${card.color}44`,
        marginBottom: 2,
        transition: "all 0.25s",
        boxShadow: hov ? `0 0 18px ${card.color}33` : "none",
      }}>
        <card.Icon color={card.color} />
      </div>

      <div style={{
        fontSize: 15, fontWeight: 700, color: "#fff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        letterSpacing: "0.01em",
      }}>
        {card.label}
      </div>

      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.52)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        lineHeight: 1.5,
      }}>
        {card.sub}
      </div>

      {/* Bottom accent line */}
      <div style={{
        width: hov ? "60%" : "0%",
        height: 1.5,
        background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
        transition: "width 0.3s ease",
        borderRadius: 2,
        marginTop: 4,
      }} />
    </motion.div>
  );
}

/* ─── Main Hero ──────────────────────────────────────────────────────────── */
export default function IndiaJobsHero() {
  const navigate = useNavigate();

  const handleNav = (path) => {
    if (typeof path === "string" && path.includes("#")) {
      const hash = path.split("#")[1];
      const scrollToHash = () => {
        const target = document.getElementById(hash);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(scrollToHash, 250);
      } else {
        scrollToHash();
      }
      return;
    }
    navigate(path);
  };

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      background: "#0a0f0a",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Background glows ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 75% 40%, rgba(34,197,94,0.07) 0%, transparent 55%), radial-gradient(ellipse at 10% 60%, rgba(249,115,22,0.06) 0%, transparent 50%)",
      }} />

      {/* Dot grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* ── Floating particles ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            style={{
              position: "absolute",
              width: 2 + Math.random(),
              height: 2 + Math.random(),
              borderRadius: "50%",
              background: i % 2 === 0 ? "#f97316" : "#22c55e",
              left: `${5 + Math.random() * 90}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{ y: [-8, -120], opacity: [0, 0.55, 0] }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 9,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px 5% 20px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
          className="hero-grid"
        >

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 100,
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                marginBottom: 20,
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                animation: "cmPulse 1.6s ease-in-out infinite",
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "linear-gradient(90deg,#f97316,#22c55e)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}>
                #1 Career Guidance Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              style={{
                fontSize: "clamp(2rem, 7.5vw, 6rem)",
                fontWeight: 900,
                lineHeight: 1.12,
                margin: "0 0 8px",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                color: "#ffffff",
              }}
            >
              Welcome to{" "}
              <span style={{
                background: "linear-gradient(90deg, #f97316 0%, #fbbf24 42%, #22c55e 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                animation: "textShimmer 3.5s ease-in-out infinite",
                display: "inline-block",
              }}>
                Careermitra
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              style={{
                fontSize: "clamp(13px, 1.6vw, 15.5px)",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.65,
                margin: "0 0 32px",
                maxWidth: 420,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              Explore endless opportunities, build skills and shape your future with the{" "}
              <span style={{ color: "#22c55e", fontWeight: 600 }}>right guidance</span>.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
            >
              {/* Primary */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/jobs")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 24px", borderRadius: 100,
                  background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
                  border: "none", cursor: "pointer",
                  color: "#fff", fontWeight: 700, fontSize: 13.5,
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  boxShadow: "0 4px 28px rgba(249,115,22,0.38)",
                  letterSpacing: "0.01em",
                  position: "relative", overflow: "hidden",
                }}
              >
                <BellIcon />
                Get Free Job Alerts
                <ArrowIcon />
              </motion.button>

              {/* Ghost */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/user-dashboard")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 24px", borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  cursor: "pointer",
                  color: "#fff", fontWeight: 600, fontSize: 13.5,
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.01em",
                }}
              >
                <GridIcon />
                User Dashboard
                <ArrowIcon />
              </motion.button>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Card Grid ── */}
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "auto auto",
              gap: 12,
            }}>
              {/* Row 1: 3 cards */}
              {CARDS.slice(0, 3).map((card, i) => (
                <FeatureCard key={card.id} card={card} onNav={handleNav} index={i} />
              ))}
              {/* Row 2: 2 cards centered */}
              <div style={{ gridColumn: "1 / 2" }}>
                <FeatureCard card={CARDS[3]} onNav={handleNav} index={3} />
              </div>
              <div style={{ gridColumn: "3 / 4" }}>
                <FeatureCard card={CARDS[4]} onNav={handleNav} index={4} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{
          position: "relative", zIndex: 10,
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "18px 5%",
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
        }}
          className="stats-grid"
        >
          {STATS.map((stat, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, padding: "8px 4px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <stat.Icon color={stat.color} />
                <span style={{
                  fontSize: "clamp(17px, 2.2vw, 22px)",
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                }}>
                  {stat.value}
                </span>
              </div>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.45)",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                textAlign: "center",
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @keyframes cmPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.35; transform:scale(0.75); }
        }
        @keyframes textShimmer {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .stats-grid > div:nth-child(3) {
            border-right: none !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stats-grid > div:nth-child(2),
          .stats-grid > div:nth-child(4) {
            border-right: none !important;
          }
        }
      `}</style>
    </div>
  );
}