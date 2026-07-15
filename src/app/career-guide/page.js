"use client";

import { useEffect, useRef, useState } from "react";
import SEO from '@/components/SEO';
import { generateWebPageSchema } from '@/utils/schemaHelpers';

/* ─── Career categories data ──────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 1,
    icon: "🏛️",
    name: "UPSC – Union Public Service Commission",
    shortDesc: "IAS, IPS, IFS, CDS, NDA & more",
    description:
      "UPSC conducts India's most prestigious exams like IAS, CDS, NDA, and Engineering Services. Graduation required; age 21–32; criteria vary by exam. Gateway to top civil services positions in India.",
    tag: "Civil Services",
    accent: "#f97316",
    highlights: ["IAS / IPS / IFS / IRS", "CDS & NDA", "CAPF & ESE", "Age: 21–32 years", "Graduation required"],
    scope: "Nationwide — Central Government",
  },
  {
    id: 2,
    icon: "📋",
    name: "Staff Selection Commission (SSC)",
    shortDesc: "CGL, CHSL, MTS, GD Constable",
    description:
      "SSC recruits staff for Group B and C posts in various ministries. Exams include SSC CGL, CHSL, MTS, GD Constable, and others across India. One of the largest recruitment bodies.",
    tag: "Group B & C",
    accent: "#ea580c",
    highlights: ["SSC CGL & CHSL", "SSC MTS & GD", "SSC JE (Junior Engineer)", "10th / 12th / Graduation", "Lakhs of vacancies annually"],
    scope: "All India — Central Ministries",
  },
  {
    id: 3,
    icon: "🏢",
    name: "Public Sector Undertakings (PSUs)",
    shortDesc: "BHEL, ONGC, NTPC, IOCL, SAIL",
    description:
      "PSUs recruit for technical, managerial, and administrative roles through GATE scores and direct exams. Major recruiters include BHEL, ONGC, NTPC, IOCL, SAIL, and other central enterprises.",
    tag: "Technical & Managerial",
    accent: "#f97316",
    highlights: ["GATE-based recruitment", "Management Trainees", "BHEL / ONGC / NTPC", "Engineering & Management", "High CTC packages"],
    scope: "Across India — Central PSUs",
  },
  {
    id: 4,
    icon: "🏦",
    name: "Banking & Insurance",
    shortDesc: "IBPS, SBI, RBI, LIC, SEBI",
    description:
      "Banking and insurance sectors offer stable careers through exams by IBPS, SBI, RBI, LIC, and other insurers. Recruitments also in financial regulators like SEBI, NABARD, and IRDAI.",
    tag: "Finance & Banking",
    accent: "#16a34a",
    highlights: ["IBPS PO / Clerk / RRB", "SBI PO & Clerk", "RBI Grade B / Assistant", "LIC ADO / AAO", "SEBI, NABARD, IRDAI"],
    scope: "All India — Banking Sector",
  },
  {
    id: 5,
    icon: "🚂",
    name: "Indian Railways",
    shortDesc: "RRB NTPC, Group D, JE, ALP",
    description:
      "One of the world's largest employers, conducts recruitment through RRBs. Offers opportunities in technical, non-technical, and paramedical categories across Group A, B, C, and D posts.",
    tag: "Technical & Non-Technical",
    accent: "#ea580c",
    highlights: ["RRB NTPC (Graduation)", "Group D (10th pass)", "Junior Engineer (JE)", "ALP (Diploma)", "Paramedical & Commercial"],
    scope: "All India — Railway Zones",
  },
  {
    id: 6,
    icon: "🛡️",
    name: "Ministry of Defence",
    shortDesc: "NDA, CDS, AFCAT, DRDO, HAL",
    description:
      "Recruits for armed forces, civilian roles, and technical positions through NDA, CDS, and AFCAT. Also oversees Defence PSUs like HAL, DRDO, BEL, and BEML for engineers and scientists.",
    tag: "Defence & Research",
    accent: "#1d4ed8",
    highlights: ["NDA (After 12th)", "CDS (Graduation)", "AFCAT (Air Force)", "DRDO / ISRO Scientist", "HAL / BEL / BEML"],
    scope: "All India — Armed Forces & PSUs",
  },
  {
    id: 7,
    icon: "🚩",
    name: "State Services",
    shortDesc: "APPSC, TSPSC, Group 1,2,3,4",
    description:
      "State PSCs recruit for various government departments through Group exams. Includes technical posts in Engineering, Panchayat Raj, Women & Child Welfare, Agriculture, Forestry, and more.",
    tag: "State Government",
    accent: "#7c3aed",
    highlights: ["Group 1 / 2 / 3 / 4", "TSPSC / APPSC / KPSC", "Panchayat Raj & Revenue", "Police & Excise", "Forest & Agriculture"],
    scope: "State-wise — All Departments",
  },
  {
    id: 8,
    icon: "🏗️",
    name: "Central Ministries",
    shortDesc: "58 Ministries, 94+ Departments",
    description:
      "Government of India comprises 58 ministries and over 94 departments. Opportunities include scientists, trainers, administrators, and diverse roles across various organizations and institutes.",
    tag: "Administration",
    accent: "#f97316",
    highlights: ["Scientist / Research roles", "Administrator posts", "Training & Education", "Public Health & Welfare", "Infrastructure & Culture"],
    scope: "Nationwide — All Ministries",
  },
];

const FILTERS = ["All", "Civil Services", "Group B & C", "Finance & Banking", "Technical & Managerial", "Defence & Research", "State Government"];

/* ─── Animated blob ──────────────────────────────────────────────────────── */
const Blob = ({ style, delay = 0, duration = 18 }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{ ...style, animation: `blobFloat ${duration}s ease-in-out infinite ${delay}s`, willChange: "transform" }}
  />
);

const Ring = ({ size, x, y, delay, opacity = 0.12 }) => (
  <div
    className="absolute rounded-full border border-orange-400 pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, opacity, animation: `ringPulse ${6 + delay}s ease-in-out infinite ${delay}s` }}
  />
);









/* ─── Category Card ──────────────────────────────────────────────────────── */
function CategoryCard({ cat, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);



  const WHATSAPP_NUMBER = "917794045533";

  const message = encodeURIComponent(
    `Hi, I'm interested in ${cat.name}. Can you guide me with details and preparation?`
  );

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;





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
      <div
        className="relative bg-white rounded-3xl overflow-hidden h-full flex flex-col"
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
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${cat.accent}, #fbbf24)` }} />

        {/* Large bg number */}
        <div
          className="absolute top-4 right-4 font-black select-none"
          style={{ fontSize: 56, lineHeight: 1, color: "rgba(249,115,22,0.06)", fontFamily: "'Georgia', serif" }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="p-6 md:p-7 flex flex-col flex-1">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `linear-gradient(135deg, ${cat.accent}18, ${cat.accent}30)` }}
            >
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: cat.accent }}
              >
                {cat.tag}
              </div>
              <h3
                className="font-black leading-snug text-gray-900"
                style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                {cat.name}
              </h3>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-4 h-px" style={{ background: `linear-gradient(to right, ${cat.accent}25, transparent)` }} />

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-5" style={{ fontSize: "0.9rem", fontFamily: "'Georgia', serif" }}>
            {cat.description}
          </p>

          {/* Highlights */}
          <div
            className="rounded-2xl p-4 relative overflow-hidden mt-auto"
            style={{ background: `linear-gradient(135deg, ${cat.accent}0d, ${cat.accent}18)`, border: `1px solid ${cat.accent}25` }}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20" style={{ background: cat.accent }} />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: cat.accent }}>
                Key Exams & Roles
              </p>
              <ul className="space-y-1">
                {cat.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.accent }} />
                    {h}
                  </li>
                ))}
              </ul>
              <div
                className="mt-3 text-[11px] font-bold flex items-center gap-1.5"
                style={{ color: cat.accent }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {cat.scope}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #25D366, #16a34a)",
                  color: "#fff",
                  boxShadow: "0 6px 18px rgba(37, 211, 102, 0.25)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(37, 211, 102, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(37, 211, 102, 0.25)";
                }}
              >
                💬 To Know More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────────────────── */
export default function CareerGuide() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const displayed = CATEGORIES.filter((cat) => {
    const matchFilter = activeFilter === "All" || cat.tag === activeFilter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      cat.name.toLowerCase().includes(q) ||
      cat.shortDesc.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.tag.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const guideSchemas = [
    generateWebPageSchema({
      name: "Career Guidance & Job Preparation Tips 2026 - Career Mitra",
      description: "Explore career guidance, job preparation tips, interview advice, and personalized Govt Jobs updates to build a successful career.",
      url: "https://careermitra.in/career-guide"
    })
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#ffffff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <SEO
        title="Career Guidance, Job Preparation Tips 2026 | Career Mitra"
        description="Explore career guidance, job preparation tips, interview advice, and personalized Govt Jobs updates to build a successful career."
        keywords="Career Guidance, Career Guide 2026, Job Preparation Tips, Govt Jobs Preparation, Interview Tips, Career Counselling, Sarkari Naukri Guidance, Career Advice India, Career Mitra"
        url="https://careermitra.in/career-guide"
        schema={guideSchemas}
      />

      {/* ── Animated background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <Blob style={{ width: 600, height: 600, top: -200, right: -200, background: "radial-gradient(circle, rgba(251,146,60,0.09) 0%, transparent 70%)" }} delay={0} />
        <Blob style={{ width: 500, height: 500, bottom: 100, left: -150, background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)" }} delay={3} duration={22} />
        <Blob style={{ width: 350, height: 350, top: "40%", left: "50%", background: "radial-gradient(circle, rgba(254,215,170,0.2) 0%, transparent 70%)" }} delay={6} duration={16} />
        <Ring size={120} x="5%" y="15%" delay={0} opacity={0.1} />
        <Ring size={80} x="88%" y="8%" delay={2} opacity={0.12} />
        <Ring size={200} x="75%" y="40%" delay={4} opacity={0.06} />
        <Ring size={60} x="12%" y="65%" delay={1} opacity={0.1} />
        <Ring size={140} x="45%" y="80%" delay={5} opacity={0.08} />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />
          <div className="absolute right-0 top-0 w-125 h-125 rounded-full -translate-y-1/2 translate-x-1/3 opacity-10" style={{ background: "white", animation: "heroPulse 8s ease-in-out infinite" }} />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full translate-y-1/2 opacity-10" style={{ background: "white", animation: "heroPulse 10s ease-in-out infinite 2s" }} />

          <div className="relative max-w-5xl mx-auto px-5 md:px-8 pt-24 pb-16 text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
              style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" style={{ animation: "dotPulse 1.8s ease-in-out infinite" }} />
              <span className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em]">
                Explore Your Future
              </span>
            </div>

            <h1
              className="font-black mb-3 leading-[1.08]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#111827" }}
            >
              A Glance at Different {" "}
              <span style={{ background: "linear-gradient(90deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Careers
              </span>
              <br />
              {/* <span style={{ WebkitTextStroke: "2px rgba(249,115,22,0.6)", color: "transparent" }}>
                Path in India
              </span> */}
            </h1>

            <p className="text-gray-600 mb-10 max-w-2xl mx-auto" style={{ fontSize: "1.05rem", lineHeight: 1.7, fontFamily: "'Georgia', serif" }}>
              Find here a brief idea about what each recruitment is about. This will help you understand the scope of various recruitments.            </p>

            {/* Stats row */}
            <div className="inline-flex flex-wrap items-center justify-center gap-8 px-8 py-4 rounded-2xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)" }}>
              {[["8+", "Career Sectors"], ["100+", "Exam Paths"], ["∞", "Opportunities"]].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <div className="font-black text-orange-600" style={{ fontSize: "1.8rem", fontFamily: "'Georgia', serif" }}>{val}</div>
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ marginTop: -2, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0 50L60 42C120 34 240 18 360 13C480 8 600 18 720 23C840 28 960 33 1080 31C1200 29 1320 21 1380 17L1440 13V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V50Z" fill="#fff7ed" />
          </svg>
        </div>
      </div>

      {/* ── Sticky search & filter ── */}
      <div className="sticky top-0 z-20 bg-white/96 border-b border-orange-100" style={{ backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(249,115,22,0.07)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search career sectors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm text-gray-700 outline-none transition-all"
                style={{ border: "1.5px solid rgba(249,115,22,0.2)", background: "rgba(255,247,237,0.6)" }}
                onFocus={(e) => { e.target.style.border = "1.5px solid rgba(249,115,22,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.08)"; }}
                onBlur={(e) => { e.target.style.border = "1.5px solid rgba(249,115,22,0.2)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                  style={activeFilter === f
                    ? { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", boxShadow: "0 4px 14px rgba(249,115,22,0.35)" }
                    : { background: "rgba(255,247,237,0.8)", color: "#ea580c", border: "1.5px solid rgba(249,115,22,0.2)" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-2" style={{ zIndex: 1 }}>
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full" style={{ background: "linear-gradient(to bottom, #f97316, #ea580c)" }} />
          <span className="font-black text-gray-900" style={{ fontSize: "1.15rem", fontFamily: "'Georgia', serif" }}>
            {displayed.length} {displayed.length === 1 ? "Sector" : "Sectors"}
          </span>
          <span className="text-gray-400 text-sm">
            {activeFilter !== "All" ? `in "${activeFilter}"` : "across all career paths"}
          </span>
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div className="relative w-full md:max-w-6xl mx-auto px-5 md:px-8 py-8" style={{ zIndex: 1 }}>
        {displayed.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-800 mb-2" style={{ fontFamily: "'Georgia', serif" }}>No results found</h3>
            <p className="text-gray-500">Try a different search or browse all sectors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayed.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={CATEGORIES.indexOf(cat)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <div
        className="relative z-10 mx-5 md:mx-8 max-w-5xl lg:mx-auto mb-16 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full -translate-y-1/2 translate-x-1/4 opacity-10" style={{ background: "white" }} />
        <div className="relative px-8 md:px-12 py-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="font-black text-white mb-3 leading-tight" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontFamily: "'Georgia', serif" }}>
            Ready to Start Your Government Career?
          </h2>
          <p className="text-orange-100 mb-6 max-w-lg mx-auto text-sm leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
            Browse verified government job openings tailored to your profile and qualification.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-orange-600 bg-white transition-all hover:scale-105 hover:shadow-2xl active:scale-[0.98]"
            style={{ fontSize: "0.95rem", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
          >
            Explore Jobs
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-20px) scale(1.04); }
          66% { transform: translateY(12px) scale(0.97); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: var(--op, 0.12); }
          50% { transform: scale(1.12); opacity: calc(var(--op, 0.12) * 0.5); }
        }
        @keyframes heroPulse {
          0%, 100% { transform: translateY(-50%) translateX(33%) scale(1); }
          50% { transform: translateY(-50%) translateX(33%) scale(1.08); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
