"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { generateWebPageSchema, generateFAQSchema } from '@/utils/schemaHelpers';

/* ─── All FAQ data (exact content preserved) ───────────────────────────── */
const FAQS = [
  {
    q: "What is an Internship?",
    a: "An internship is a structured learning experience that bridges classroom knowledge with real-world application. It offers hands-on exposure to professional environments.",
    insight: "Helps students understand industry practices, teamwork, and decision-making — far beyond textbooks.",
    icon: "🎓",
    accent: "#f97316",
  },
  {
    q: "Why Should I Apply for an Internship?",
    a: "Because every successful career begins with experience, not just education. Internships give you that first step into the real world.",
    insight: "Builds employability, confidence, and adaptability — three top skills recruiters value most.",
    icon: "🚀",
    accent: "#ea580c",
  },
  {
    q: "When is the Right Time to Apply?",
    a: "Ideally during your final or pre-final year of graduation, or immediately after major academic milestones.",
    insight: "Early exposure accelerates career clarity and ensures smoother transitions post-graduation.",
    icon: "📅",
    accent: "#f97316",
  },
  {
    q: "What Kind of Internships Are Available?",
    a: "Options include government internships, research programs, corporate internships, NGO projects, and startup roles.",
    insight: "Each type enhances a different aspect: discipline, innovation, empathy, or entrepreneurship.",
    icon: "🗂️",
    accent: "#fb923c",
  },
  {
    q: "How Do I Choose the Right Internship?",
    a: "Choose based on your career goals, subject interest, and preferred work environment (remote or on-site).",
    insight: "Right alignment saves time and gives meaningful growth — not just certificates.",
    icon: "🎯",
    accent: "#ea580c",
  },
  {
    q: "Are Government Internships Useful?",
    a: "Absolutely! They provide first-hand exposure to policy implementation, governance, and administrative processes.",
    insight: "Strengthens understanding of the system, especially for aspirants of UPSC, SSC, or other civil services.",
    icon: "🏛️",
    accent: "#f97316",
  },
  {
    q: "What Skills Can I Learn During an Internship?",
    a: "Communication, leadership, project management, data analysis, and domain-specific tools.",
    insight: "You gain what no classroom can teach — emotional intelligence, accountability, and discipline.",
    icon: "💡",
    accent: "#fb923c",
  },
  {
    q: "Do Internships Count in My Resume?",
    a: "Yes, internships add practical credibility and make your profile stand out in competitive selections.",
    insight: "Recruiters often give higher preference to candidates with verified internship experience.",
    icon: "📄",
    accent: "#ea580c",
  },
  {
    q: "Is it Paid or Unpaid?",
    a: "Both exist — but the real reward is experience. Paid roles are a bonus, but unpaid internships can open premium future opportunities.",
    insight: "Smart students value learning over earning initially. The ROI of experience is lifelong.",
    icon: "💰",
    accent: "#f97316",
  },
  {
    q: "Can I Get a Job Offer After Internship?",
    a: "Many organizations offer pre-placement offers to high-performing interns.",
    insight: "Your internship is a live audition — performance here can directly shape your career start.",
    icon: "🤝",
    accent: "#fb923c",
  },
  {
    q: "How to Apply for Internships?",
    a: "Through official portals, university tie-ups, company career pages, or verified internship platforms.",
    insight: "Applying strategically saves time and ensures credibility of the opportunity.",
    icon: "📝",
    accent: "#ea580c",
  },
  {
    q: "What Documents Are Needed?",
    a: "Resume, ID proof, academic transcripts, and a short Statement of Purpose (SOP).",
    insight: "A well-written SOP can influence your selection more than grades.",
    icon: "📁",
    accent: "#f97316",
  },
  {
    q: "How Long Do Internships Last?",
    a: "Usually 4 to 12 weeks; government projects may extend up to 6 months.",
    insight: "Duration helps balance learning and productivity — short enough to explore, long enough to contribute.",
    icon: "⏱️",
    accent: "#fb923c",
  },
  {
    q: "What is Expected from an Intern?",
    a: "Punctuality, curiosity, teamwork, and a proactive learning attitude.",
    insight: "Professional ethics and discipline learned here mirror real job expectations.",
    icon: "⭐",
    accent: "#ea580c",
  },
  {
    q: "What Happens After Completion?",
    a: "You receive a certificate, feedback, and sometimes a letter of recommendation.",
    insight: "Recognition validates your effort — often unlocking your next opportunity.",
    icon: "🏆",
    accent: "#f97316",
  },
  {
    q: "What if I Don't Have Prior Experience?",
    a: "Internships are meant for beginners. What matters is enthusiasm and willingness to learn. So, actually internships doesnot need previous experience.",
    insight: "Every expert once started as an intern — attitude is everything.",
    icon: "🌱",
    accent: "#fb923c",
  },
  {
    q: "Are Remote Internships Effective?",
    a: "Yes, if structured with weekly goals, mentor calls, and submission reviews.",
    insight: "Builds digital discipline and self-management — essential for modern workplaces.",
    icon: "💻",
    accent: "#ea580c",
  },
];

/* ─── Animated blob ──────────────────────────────────────────────────────── */
const Blob = ({ style, delay = 0, duration = 18 }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      ...style,
      animation: `blobFloat ${duration}s ease-in-out infinite ${delay}s`,
      willChange: "transform",
    }}
  />
);

/* ─── Animated floating rings ────────────────────────────────────────────── */
const Ring = ({ size, x, y, delay, opacity = 0.12 }) => (
  <div
    className="absolute rounded-full border border-orange-400 pointer-events-none"
    style={{
      width: size, height: size,
      left: x, top: y,
      opacity,
      animation: `ringPulse ${6 + delay}s ease-in-out infinite ${delay}s`,
    }}
  />
);

/* ─── Card with scroll-triggered reveal ──────────────────────────────────── */
function FAQCard({ faq, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.65s ease ${(index % 4) * 0.08}s, transform 0.65s ease ${(index % 4) * 0.08}s`,
      }}
    >
      {/* Card */}
      <div
        className="relative bg-white rounded-3xl overflow-hidden"
        style={{
          boxShadow: "0 2px 24px rgba(249,115,22,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          border: "1.5px solid rgba(249,115,22,0.12)",
          transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 48px rgba(249,115,22,0.18), 0 2px 8px rgba(0,0,0,0.06)";
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 24px rgba(249,115,22,0.08), 0 1px 4px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(249,115,22,0.12)";
        }}
      >
        {/* Colored top bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(to right, ${faq.accent}, #fbbf24)` }}
        />

        {/* Number badge — large, typographic */}
        <div className="absolute top-5 right-5 font-black select-none"
          style={{ fontSize: 56, lineHeight: 1, color: "rgba(249,115,22,0.06)", fontFamily: "'Georgia', serif" }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="p-6 md:p-7">
          {/* Icon + question */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `linear-gradient(135deg, ${faq.accent}18, ${faq.accent}30)` }}
            >
              {faq.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: faq.accent }}
              >
                Question {String(index + 1).padStart(2, "0")}
              </div>
              <h3
                className="font-black leading-snug text-gray-900"
                style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                {faq.q}
              </h3>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-4 h-px" style={{ background: `linear-gradient(to right, ${faq.accent}25, transparent)` }} />

          {/* Answer */}
          <p
            className="text-gray-700 leading-relaxed mb-5"
            style={{ fontSize: "0.92rem", fontFamily: "'Georgia', serif" }}
          >
            {faq.a}
          </p>

          {/* Brainy Insight box */}
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${faq.accent}0d, ${faq.accent}18)`, border: `1px solid ${faq.accent}25` }}
          >
            {/* Decorative corner circle */}
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
              style={{ background: faq.accent }}
            />
            <div className="relative flex items-start gap-3">
              <div
                className="shrink-0 mt-0.5 text-xs font-black px-2 py-0.5 rounded-full text-white"
                style={{ background: faq.accent }}
              >
                💡
              </div>
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: faq.accent }}
                >
                  Brainy Insight
                </p>
                <p className="text-sm text-gray-700 leading-relaxed font-medium italic" style={{ fontFamily: "'Georgia', serif" }}>
                  {faq.insight}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero stat counter ──────────────────────────────────────────────────── */
const Stat = ({ value, label }) => (
  <div className="text-center">
    <div
      className="font-black text-white leading-none"
      style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontFamily: "'Georgia', serif" }}
    >
      {value}
    </div>
    <div className="text-orange-200 text-xs font-semibold uppercase tracking-widest mt-1">{label}</div>
  </div>
);

/* ─── Main Export ────────────────────────────────────────────────────────── */
export default function InternshipGuide() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigate = (to, options) => { if (options?.replace) { router.replace(to); } else { router.push(to); } };

  const categories = ["All", "Getting Started", "Application", "Benefits", "After Internship"];
  const catMap = {
    "Getting Started": [0, 1, 2, 3, 4, 5],
    "Application": [10, 11],
    "Benefits": [6, 7, 8, 9],
    "After Internship": [12, 13, 14, 15, 16],
  };

  const displayed = FAQS.filter((faq, i) => {
    const matchCat = activeFilter === "All" || (catMap[activeFilter] || []).includes(i);
    const matchSearch = !search.trim() ||
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase()) ||
      faq.insight.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleExploreInternships = () => {
    const scrollToInternships = () => {
      const target = document.getElementById("internship");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToInternships, 250);
      return;
    }

    scrollToInternships();
  };

  const guideSchemas = [
    generateWebPageSchema({
      name: "Internship Guide 2026 - Career Mitra",
      description: "Explore internship opportunities, career guidance, resume tips, and internship preparation advice to kickstart your career journey.",
      url: "https://careermitra.in/internship-guide"
    }),
    generateFAQSchema(FAQS.map(faq => ({ q: faq.q, a: faq.a })))
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#ffffff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >

      {/* ── Ambient animated background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Large soft blobs */}
        <Blob style={{ width: 600, height: 600, top: -200, right: -200, background: "radial-gradient(circle, rgba(251,146,60,0.09) 0%, transparent 70%)" }} delay={0} />
        <Blob style={{ width: 500, height: 500, bottom: 100, left: -150, background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)" }} delay={3} duration={22} />
        <Blob style={{ width: 350, height: 350, top: "40%", left: "50%", background: "radial-gradient(circle, rgba(254,215,170,0.2) 0%, transparent 70%)" }} delay={6} duration={16} />

        {/* Floating rings */}
        <Ring size={120} x="5%" y="15%" delay={0} opacity={0.1} />
        <Ring size={80}  x="88%" y="8%" delay={2} opacity={0.12} />
        <Ring size={200} x="75%" y="40%" delay={4} opacity={0.06} />
        <Ring size={60}  x="12%" y="65%" delay={1} opacity={0.1} />
        <Ring size={140} x="45%" y="80%" delay={5} opacity={0.08} />
        <Ring size={90}  x="92%" y="72%" delay={3} opacity={0.1} />

        {/* Floating dots grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Hero Section ── */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div
          className="relative overflow-hidden"
        //   style={{ background: "linear-gradient(135deg, #f97316 10%, #ea580c 55%, #c2410c 100%)" }}
        >
          {/* Hero dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Hero animated circles */}
          <div
            className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 translate-x-1/3 opacity-10"
            style={{ background: "white", animation: "heroPulse 8s ease-in-out infinite" }}
          />
          <div
            className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full translate-y-1/2 opacity-10"
            style={{ background: "white", animation: "heroPulse 10s ease-in-out infinite 2s" }}
          />

          <div className="relative max-w-5xl mx-auto px-5 md:px-8 pt-20 pb-16 text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-orange-200" style={{ animation: "dotPulse 1.8s ease-in-out infinite" }} />
              <span className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em]">
                Complete Internship Knowledge Base
              </span>
            </div>

            {/* Headline — editorial typographic */}
            <h1
              className="text-orange-600 font-black mb-3 leading-[1.08]"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                textShadow: "0 2px 24px rgba(0,0,0,0.15)",
              }}
            >
              Everything You Need to
              <br />
              <span style={{
                WebkitTextStroke: "2px rgba(249,115,22,0.8)",
                color: "transparent",
              }}>
                Know About Internships
              </span>
            </h1>

            <p className="text-orange-900 mb-12 max-w-2xl mx-auto"
              style={{ fontSize: "1.05rem", lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
              Comprehensive answers to all your internship questions
            </p>

            {/* Stats row */}
            {/* <div
              className="inline-flex items-center gap-10 px-10 py-6 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}
            >
              <Stat value="17" label="Questions Answered" />
              <div className="w-px h-12 bg-white/20" />
              <Stat value="100%" label="Free Knowledge" />
              <div className="w-px h-12 bg-white/20" />
              <Stat value="∞" label="Career Impact" />
            </div> */}
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ marginTop: -2, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 27.5C840 35 960 40 1080 37.5C1200 35 1320 25 1380 20L1440 15V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V60Z" fill="#c2410c"/>
          </svg>
        </div>
      </div>

      {/* ── Sticky search & filter ── */}
      <div
        className="sticky top-0 z-20 bg-white/96 border-b border-orange-100"
        style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(249,115,22,0.07)" }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm text-gray-700 outline-none transition-all"
                style={{
                  border: "1.5px solid rgba(249,115,22,0.2)",
                  background: "rgba(255,247,237,0.6)",
                }}
                onFocus={(e) => { e.target.style.border = "1.5px solid rgba(249,115,22,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.08)"; }}
                onBlur={(e) => { e.target.style.border = "1.5px solid rgba(249,115,22,0.2)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                  style={activeFilter === cat
                    ? { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", boxShadow: "0 4px 14px rgba(249,115,22,0.35)" }
                    : { background: "rgba(255,247,237,0.8)", color: "#ea580c", border: "1.5px solid rgba(249,115,22,0.2)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results count strip ── */}
      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-2" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-1.5 rounded-full"
            style={{ background: "linear-gradient(to bottom, #f97316, #ea580c)" }}
          />
          <span
            className="font-black text-gray-900"
            style={{ fontSize: "1.15rem", fontFamily: "'Georgia', serif" }}
          >
            {displayed.length} {displayed.length === 1 ? "Answer" : "Answers"}
          </span>
          <span className="text-gray-400 text-sm">
            {activeFilter !== "All" ? `in "${activeFilter}"` : "across all topics"}
          </span>
        </div>
      </div>

      {/* ── FAQ Grid ── */}
      <div className="relative w-full md:max-w-6xl mx-auto px-5 md:px-8 py-8" style={{ zIndex: 1 }}>
        {displayed.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-800 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
              No results found
            </h3>
            <p className="text-gray-500">Try a different search term or browse all questions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayed.map((faq, i) => (
              <FAQCard key={faq.q} faq={faq} index={FAQS.indexOf(faq)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom CTA banner ── */}
      <div className="relative z-10 mx-5 md:mx-8 max-w-5xl lg:mx-auto mb-16 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)" }}>
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}
        />
        <div
          className="absolute right-0 top-0 w-72 h-72 rounded-full -translate-y-1/2 translate-x-1/4 opacity-10"
          style={{ background: "white" }}
        />
        <div className="relative px-8 md:px-12 py-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h2
            className="font-black text-white mb-3 leading-tight"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontFamily: "'Georgia', serif" }}
          >
            Ready to Start Your Internship Journey?
          </h2>
          <p className="text-orange-100 mb-6 max-w-lg mx-auto text-sm leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
            Browse verified government and private internship opportunities tailored to your profile.
          </p>
          <button
            type="button"
            onClick={handleExploreInternships}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-orange-600 bg-white transition-all hover:scale-105 hover:shadow-2xl active:scale-[0.98]"
            style={{ fontSize: "0.95rem", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            Explore Internships
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(24px,-36px) scale(1.06); }
          66%      { transform: translate(-18px,24px) scale(0.95); }
        }
        @keyframes ringPulse {
          0%,100% { transform: scale(1); opacity: 0.1; }
          50%      { transform: scale(1.12); opacity: 0.03; }
        }
        @keyframes heroPulse {
          0%,100% { transform: translate(33%,-50%) scale(1); }
          50%      { transform: translate(33%,-50%) scale(1.08); }
        }
        @keyframes dotPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}