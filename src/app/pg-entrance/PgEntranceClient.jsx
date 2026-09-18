"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  GraduationCap,
  FileText,
  Building2,
  X,
  ExternalLink,
  Calendar,
  Sparkles,
  CheckCircle2,
  MapPin,
  Filter,
  Eye,
  BookOpen,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  RotateCcw
} from "lucide-react";

// Master dataset structured strictly around the user's handwritten roadmap:
// I. Pan India PG Entrance
// II. Telangana & Andhra Pradesh State PG Entrance
// III. Organization / Institute-wise PG Courses (e.g., CFTRI, TIFR, ISI, CMI, NIPER)
const PG_EXAMS_DATA = [
  // ─── I. PAN INDIA PG ENTRANCE ───────────────────────────────────────────
  {
    id: "cuet-pg",
    name: "CUET-PG",
    fullName: "Common University Entrance Test (Postgraduate)",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "All Streams",
    streamCategory: "all",
    degree: "M.A., M.Sc., M.Com, MCA, MBA, M.Ed",
    university: "National Testing Agency (NTA) & 190+ Central / State Universities",
    location: "All India (Multiple Central Universities)",
    eligibility: "Bachelor's degree in relevant discipline from a recognized university.",
    examPeriod: "March - April",
    notificationUrl: "https://pgcuet.samarth.ac.in",
    applyUrl: "https://pgcuet.samarth.ac.in",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "Single-window national entrance examination for admission into postgraduate master degree programs across Central Universities (DU, JNU, BHU, HCU, Pondicherry) and participating institutions.",
    highlights: ["Score accepted by 190+ Universities", "150+ Subject Question Papers", "Computer-Based Test (CBT)"]
  },
  {
    id: "gate",
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "Engineering & Science",
    streamCategory: "engineering",
    degree: "M.Tech, M.E., M.Arch, Ph.D., PSU Recruitments",
    university: "IITs (Rotational) & IISc Bangalore",
    location: "All India (IITs, NITs, IIITs, CFTIs)",
    eligibility: "Bachelor's degree in Engineering / Technology / Architecture / Science (or 3rd/final year).",
    examPeriod: "February",
    notificationUrl: "https://gate2026.iitkgp.ac.in",
    applyUrl: "https://gate2026.iitkgp.ac.in",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "National premier examination testing comprehensive understanding of undergraduate subjects in Engineering, Technology, Architecture, and Science for M.Tech admissions and PSU jobs.",
    highlights: ["GATE score valid for 3 Years", "Direct pathway to PSU Maharatna recruitments", "MHRD monthly scholarship for M.Tech candidates"]
  },
  {
    id: "jam",
    name: "IIT JAM",
    fullName: "Joint Admission Test for Masters",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "Pure Sciences",
    streamCategory: "science",
    degree: "M.Sc., M.Sc.-Ph.D. Dual Degree, Integrated Ph.D.",
    university: "IITs (Rotational) & IISc Bangalore",
    location: "All India (IITs, IISc, NITs, IISERs)",
    eligibility: "Bachelor's degree with relevant science subjects (Chemistry, Physics, Math, Bio).",
    examPeriod: "February",
    notificationUrl: "https://jam2026.iitd.ac.in",
    applyUrl: "https://jam2026.iitd.ac.in",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
    badgeBg: "bg-amber-100 text-amber-800",
    description: "Benchmark admission test for science graduates seeking admission into 2-year M.Sc. and Joint M.Sc.-Ph.D. programs at premier Indian Institutes of Technology.",
    highlights: ["7 test papers: Biotechnology, Chemistry, Geology, Mathematics, Mathematical Statistics, Physics, Economics", "Centralized admissions across IITs & IISc"]
  },
  {
    id: "cat",
    name: "CAT",
    fullName: "Common Admission Test",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "Management",
    streamCategory: "management",
    degree: "MBA / PGDM",
    university: "Indian Institutes of Management (IIMs)",
    location: "All India (21 IIMs, FMS, SPJIMR, MDI, IIT DoMS)",
    eligibility: "Bachelor's degree with at least 50% marks (45% for SC/ST/PwD) or equivalent.",
    examPeriod: "November",
    notificationUrl: "https://iimcat.ac.in",
    applyUrl: "https://iimcat.ac.in",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "The most prestigious computer-based management entrance test in India for admission into graduate management programs at 21 IIMs and hundreds of top B-schools.",
    highlights: ["Tests VARC, DILR, and Quantitative Ability", "Scores accepted by 1000+ Business Schools", "Tier-1 corporate career placement opportunities"]
  },
  {
    id: "xat",
    name: "XAT",
    fullName: "Xavier Aptitude Test",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "Management",
    streamCategory: "management",
    degree: "MBA / PGDM",
    university: "XLRI Xavier School of Management, Jamshedpur",
    location: "All India (XLRI, XIMB, TAPMI, IMT, 160+ B-Schools)",
    eligibility: "Recognized Bachelor's degree of minimum 3 years duration in any discipline.",
    examPeriod: "January",
    notificationUrl: "https://xatonline.in",
    applyUrl: "https://xatonline.in",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
    badgeBg: "bg-amber-100 text-amber-800",
    description: "National management aptitude examination conducted by XLRI on behalf of XAMI for admission to management programs across 160+ partner institutes.",
    highlights: ["Unique Decision Making section", "Accepted by XLRI Jamshedpur & Delhi", "High prestige in corporate leadership & HR"]
  },
  {
    id: "mat",
    name: "MAT",
    fullName: "Management Aptitude Test",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "Management",
    streamCategory: "management",
    degree: "MBA / PGDM",
    university: "All India Management Association (AIMA)",
    location: "All India (600+ Business Schools)",
    eligibility: "Graduates in any discipline or final year degree students.",
    examPeriod: "Feb, May, Sep, Dec",
    notificationUrl: "https://mat.aima.in",
    applyUrl: "https://mat.aima.in",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "Standardized national test administered 4 times a year in PBT (Paper Based), CBT (Computer Based), and IBT (Internet Based) formats.",
    highlights: ["Conducted 4 times a year", "Multiple testing mode choices", "Wide acceptance across government & private B-schools"]
  },
  {
    id: "niper-jee",
    name: "NIPER JEE",
    fullName: "NIPER Joint Entrance Examination",
    section: "pan-india",
    sectionLabel: "Pan India",
    stream: "Pharmacy & Pharma Sciences",
    streamCategory: "pharmacy",
    degree: "M.Pharm, M.S. (Pharm), M.Tech (Pharm), MBA (Pharm), Ph.D.",
    university: "National Institutes of Pharmaceutical Education and Research (NIPER)",
    location: "Hyderabad, Mohali, Ahmedabad, Raebareli, Guwahati, Hajipur, Kolkata",
    eligibility: "B.Pharm / B.Tech / M.Sc with valid GPAT / GATE / NET score.",
    examPeriod: "June - July",
    notificationUrl: "https://www.niperhyd.ac.in",
    applyUrl: "https://www.niperhyd.ac.in",
    iconBg: "bg-green-50 text-green-600 border-green-200",
    badgeBg: "bg-green-100 text-green-700",
    description: "Apex national examination for admission to postgraduate and doctoral programs across all seven NIPER institutes of national importance.",
    highlights: ["Institutes of National Importance", "Cutting-edge pharmaceutical research", "Excellent placement in R&D and drug manufacturing"]
  },

  // ─── II. STATE-WISE PG ENTRANCE (TELANGANA & ANDHRA PRADESH) ─────────────
  {
    id: "ts-pgecet",
    name: "TS PGECET",
    fullName: "Telangana State Post Graduate Engineering Common Entrance Test",
    section: "telangana",
    sectionLabel: "Telangana State",
    stream: "Engineering & Pharmacy",
    streamCategory: "engineering",
    degree: "M.Tech, M.E., M.Pharm, M.Arch, Graduate Pharm.D",
    university: "JNTU Hyderabad on behalf of TSCHE",
    location: "Telangana State Universities (JNTUH, OU, KU)",
    eligibility: "B.Tech / B.E. / B.Pharm with qualifying percentage in relevant branch.",
    examPeriod: "June",
    notificationUrl: "https://pgecet.tsche.ac.in",
    applyUrl: "https://pgecet.tsche.ac.in",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "State-level common entrance examination for admission into M.E./M.Tech/M.Pharm/M.Arch/Graduate level Pharm.D programs in Telangana.",
    highlights: ["State quota reservation & scholarships", "GATE/GPAT qualifiers eligible for direct admission", "CBT mode test across Telangana"]
  },
  {
    id: "ts-icet",
    name: "TS ICET",
    fullName: "Telangana State Integrated Common Entrance Test",
    section: "telangana",
    sectionLabel: "Telangana State",
    stream: "Management & MCA",
    streamCategory: "management",
    degree: "MBA & MCA (Full Time & Part Time)",
    university: "Kakatiya University, Warangal on behalf of TSCHE",
    location: "Telangana State Universities & Affiliated Colleges",
    eligibility: "Bachelor's degree of minimum 3 years duration with at least 50% (45% for reserved categories).",
    examPeriod: "May - June",
    notificationUrl: "https://icet.tsche.ac.in",
    applyUrl: "https://icet.tsche.ac.in",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "State-level entrance test for admissions into regular MBA and MCA postgraduate programs in all universities and affiliated colleges in Telangana.",
    highlights: ["Analytical, Mathematical, and Communication Ability sections", "Government fee reimbursement eligibility"]
  },
  {
    id: "cpget-ts",
    name: "CPGET (OUCET)",
    fullName: "Common Post Graduate Entrance Tests - Telangana",
    section: "telangana",
    sectionLabel: "Telangana State",
    stream: "Arts, Science & Commerce",
    streamCategory: "science",
    degree: "M.A., M.Sc., M.Com, M.Ed, M.P.Ed, PG Diploma",
    university: "Osmania University on behalf of TS State Universities",
    location: "OU, Kakatiya Univ, Telangana Univ, Mahatma Gandhi Univ, Palamuru Univ, Satavahana Univ, JNTUH",
    eligibility: "Qualifying undergraduate degree in relevant discipline from a recognized university.",
    examPeriod: "June - July",
    notificationUrl: "https://cpget.tsche.ac.in",
    applyUrl: "https://cpget.tsche.ac.in",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
    badgeBg: "bg-amber-100 text-amber-800",
    description: "Centralized admission test conducted by Osmania University for entry into diverse conventional and professional PG courses across all 7 Telangana state universities.",
    highlights: ["Covers 50+ subjects in Arts, Sciences, Social Sciences & Commerce", "Single application for multiple state universities"]
  },
  {
    id: "ap-pgecet",
    name: "AP PGECET",
    fullName: "Andhra Pradesh Post Graduate Engineering Common Entrance Test",
    section: "andhra-pradesh",
    sectionLabel: "Andhra Pradesh",
    stream: "Engineering & Pharmacy",
    streamCategory: "engineering",
    degree: "M.Tech, M.Pharm, Pharma.D",
    university: "Sri Venkateswara University on behalf of APSCHE",
    location: "Andhra Pradesh State Universities (AU, SVU, JNTUK, JNTUA)",
    eligibility: "B.Tech/B.E./B.Pharm with at least 50% marks (45% for reserved category).",
    examPeriod: "May - June",
    notificationUrl: "https://cets.apsche.ap.gov.in",
    applyUrl: "https://cets.apsche.ap.gov.in",
    iconBg: "bg-green-50 text-green-600 border-green-200",
    badgeBg: "bg-green-100 text-green-700",
    description: "State-level entrance test for admissions into regular postgraduate engineering and pharmacy programs across universities and affiliated colleges in AP.",
    highlights: ["State quota counseling & scholarships", "Exemption from test for GATE/GPAT qualifiers", "Online computer-based test"]
  },
  {
    id: "ap-icet",
    name: "AP ICET",
    fullName: "Andhra Pradesh Integrated Common Entrance Test",
    section: "andhra-pradesh",
    sectionLabel: "Andhra Pradesh",
    stream: "Management & MCA",
    streamCategory: "management",
    degree: "MBA & MCA",
    university: "Sri Krishnadevaraya University, Anantapur on behalf of APSCHE",
    location: "Andhra Pradesh Universities & Affiliated Colleges",
    eligibility: "Graduate degree of 3/4 years duration with required qualifying marks.",
    examPeriod: "May",
    notificationUrl: "https://cets.apsche.ap.gov.in",
    applyUrl: "https://cets.apsche.ap.gov.in",
    iconBg: "bg-green-50 text-green-600 border-green-200",
    badgeBg: "bg-green-100 text-green-700",
    description: "State-level integrated examination for students seeking master's degrees in Business Administration (MBA) and Computer Applications (MCA) in AP.",
    highlights: ["Single counseling process for all colleges in AP", "State Jagananna Vidya Deevena fee reimbursement applicable"]
  },
  {
    id: "appgcet",
    name: "APPGCET",
    fullName: "Andhra Pradesh Post Graduate Common Entrance Test",
    section: "andhra-pradesh",
    sectionLabel: "Andhra Pradesh",
    stream: "Arts, Science & Commerce",
    streamCategory: "science",
    degree: "M.A., M.Sc., M.Com, M.Ed, M.P.Ed, M.Sc. Tech",
    university: "Andhra University, Visakhapatnam on behalf of APSCHE",
    location: "AU, SVU, SKVU, Acharya Nagarjuna Univ, Yogi Vemana Univ, Rayalaseema Univ, SPMVV",
    eligibility: "Bachelor's degree with matching subject prerequisites.",
    examPeriod: "June",
    notificationUrl: "https://cets.apsche.ap.gov.in",
    applyUrl: "https://cets.apsche.ap.gov.in",
    iconBg: "bg-green-50 text-green-600 border-green-200",
    badgeBg: "bg-green-100 text-green-700",
    description: "Common entrance test for admissions into Master of Arts, Science, Commerce, and Education courses across all state university campuses in Andhra Pradesh.",
    highlights: ["Centralized admission to 14+ State Universities", "40+ Subject Papers", "Online Web Counseling"]
  },

  // ─── III. ORGANISATION / INSTITUTE-WISE PG COURSES & ENTRANCES ───────────
  {
    id: "cftri",
    name: "CFTRI M.Sc. Entrance",
    fullName: "CSIR-Central Food Technological Research Institute Entrance Exam",
    section: "institute",
    sectionLabel: "Institute Specific",
    stream: "Food Technology & Science",
    streamCategory: "science",
    degree: "M.Sc. (Food Technology), Ph.D., Post Harvest Tech",
    university: "CSIR - Central Food Technological Research Institute (AcSIR), Mysore",
    location: "Mysuru, Karnataka",
    eligibility: "B.Sc. / B.Tech / B.E. in Agriculture / Food Tech / Chemistry / Bio / Horticulture with 55%+.",
    examPeriod: "June - July",
    notificationUrl: "https://cftri.res.in",
    applyUrl: "https://cftri.res.in/academic/msc",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "Prestigious national entrance for the two-year specialized M.Sc. Food Technology course at CSIR-CFTRI, recognized globally as the gold-standard in food science and industrial processing.",
    highlights: ["Premier CSIR R&D laboratory", "100% Industry placement record in Top FMCG & Food giants", "World-class pilot plants and food research infrastructure"]
  },
  {
    id: "tifr-gs",
    name: "TIFR GS",
    fullName: "Tata Institute of Fundamental Research Graduate School",
    section: "institute",
    sectionLabel: "Institute Specific",
    stream: "Pure Sciences & Research",
    streamCategory: "science",
    degree: "M.Sc. & Integrated Ph.D.",
    university: "Tata Institute of Fundamental Research (TIFR / DAE)",
    location: "Mumbai, Pune (NCRA), Bangalore (ICTS, NCBS), Hyderabad",
    eligibility: "B.Sc. / B.Tech / B.E. in relevant scientific disciplines.",
    examPeriod: "December (Annual)",
    notificationUrl: "https://www.tifr.res.in/~academics",
    applyUrl: "https://www.tifr.res.in/~academics",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
    badgeBg: "bg-amber-100 text-amber-800",
    description: "Rigorous national examination for aspiring scientific researchers seeking direct M.Sc. and Integrated Ph.D. degrees in Physics, Chemistry, Biology, Mathematics, and Computer Science.",
    highlights: ["Full fellowship / stipend from Day 1", "Direct research under India's top scientists", "World-renowned international research collaborations"]
  },
  {
    id: "isi-admission",
    name: "ISI Admission Test",
    fullName: "Indian Statistical Institute Entrance Examination",
    section: "institute",
    sectionLabel: "Institute Specific",
    stream: "Statistics, Math & Data Science",
    streamCategory: "science",
    degree: "M.Stat, M.Math, MS (Quantitative Economics), M.Tech (CS)",
    university: "Indian Statistical Institute (ISI Kolkata)",
    location: "Kolkata, Delhi, Bangalore, Chennai, Tezpur",
    eligibility: "Bachelor's degree with strong background in Mathematics / Statistics / Engineering.",
    examPeriod: "May",
    notificationUrl: "https://www.isical.ac.in/~admission",
    applyUrl: "https://www.isical.ac.in/~admission",
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    description: "Elite competitive examination for master's programs in Statistics, Mathematics, Data Science, and Quantitative Economics at the historic Indian Statistical Institute.",
    highlights: ["Free tuition + monthly stipend for all admitted students", "World-leading statistical & AI research", "Highest tier global actuarial & quantitative analytics placements"]
  },
  {
    id: "cmi-entrance",
    name: "CMI Entrance Exam",
    fullName: "Chennai Mathematical Institute Entrance Examination",
    section: "institute",
    sectionLabel: "Institute Specific",
    stream: "Mathematics & Computer Science",
    streamCategory: "science",
    degree: "M.Sc. in Mathematics, M.Sc. in Computer Science, M.Sc. in Data Science",
    university: "Chennai Mathematical Institute (CMI)",
    location: "Siruseri, Chennai, Tamil Nadu",
    eligibility: "Undergraduate degree with strong mathematical aptitude.",
    examPeriod: "May",
    notificationUrl: "https://www.cmi.ac.in/admissions",
    applyUrl: "https://www.cmi.ac.in/admissions",
    iconBg: "bg-green-50 text-green-600 border-green-200",
    badgeBg: "bg-green-100 text-green-700",
    description: "Premier entrance test for students with a deep passion for Theoretical Computer Science, Pure Mathematics, and Advanced Data Science.",
    highlights: ["Generous scholarships & fee waivers", "Small batch sizes with personalized faculty mentorship", "Direct access to top global PhD programs"]
  }
];

export default function PgEntranceClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all"); // "all", "pan-india", "telangana", "andhra-pradesh", "institute"
  const [activeStream, setActiveStream] = useState("all"); // "all", "engineering", "science", "management", "pharmacy"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [selectedExamModal, setSelectedExamModal] = useState(null);

  // Filter logic matching exam name, stream, university, location, degrees
  const filteredExams = useMemo(() => {
    return PG_EXAMS_DATA.filter((exam) => {
      if (activeSection !== "all" && exam.section !== activeSection) {
        return false;
      }
      if (activeStream !== "all" && exam.streamCategory !== activeStream) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = exam.name.toLowerCase().includes(query);
        const matchFullName = exam.fullName.toLowerCase().includes(query);
        const matchStream = exam.stream.toLowerCase().includes(query);
        const matchUniv = exam.university.toLowerCase().includes(query);
        const matchLoc = exam.location.toLowerCase().includes(query);
        const matchDegree = exam.degree.toLowerCase().includes(query);

        return matchName || matchFullName || matchStream || matchUniv || matchLoc || matchDegree;
      }
      return true;
    });
  }, [searchQuery, activeSection, activeStream]);

  // Section Counts
  const counts = useMemo(() => {
    return {
      all: PG_EXAMS_DATA.length,
      "pan-india": PG_EXAMS_DATA.filter(e => e.section === "pan-india").length,
      telangana: PG_EXAMS_DATA.filter(e => e.section === "telangana").length,
      "andhra-pradesh": PG_EXAMS_DATA.filter(e => e.section === "andhra-pradesh").length,
      institute: PG_EXAMS_DATA.filter(e => e.section === "institute").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pt-24 sm:pt-28 pb-20 overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Decorative ambient background gradient blobs */}
      <div
        style={{
          position: "fixed",
          top: -80,
          right: -80,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -60,
          left: -60,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ─── 1. HERO HEADER WITH SIGNATURE GRADIENT ──────────────────────── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-15 pt-2 pb-4">
        <div className="text-center max-w-5xl mx-auto space-y-3.5">
          
          {/* Eyebrow Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs"
            style={{
              background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
              border: "1px solid #fed7aa",
              color: "#c2410c",
            }}
          >
            <span>🔥</span>
            <span>PG ENTRANCE & ADMISSIONS 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-gray-900 via-orange-600 to-green-600 bg-clip-text text-transparent">
            Explore PG Entrance Exams
          </h1>

          {/* Accent Divider Line */}
          <div
            className="h-1 rounded-full w-32 mx-auto"
            style={{
              background: "linear-gradient(90deg, transparent, #fbbf24, #f59e0b, #fbbf24, transparent)",
              boxShadow: "0 0 12px rgba(251,191,36,0.7)",
              height: 3,
              width: 220,
              margin: "8px auto 12px",
            }}
          />

          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base font-normal leading-relaxed max-w-4xl mx-auto px-2">
            Search exam-wise, stream-wise, and university-wise for <span className="font-semibold text-gray-800">Pan-India</span>, <span className="font-semibold text-gray-800">Telangana</span>, <span className="font-semibold text-gray-800">Andhra Pradesh</span>, and premier institutes like <span className="font-semibold text-gray-800">CFTRI, TIFR, ISI</span>.
          </p>

        </div>
      </section>

      {/* ─── 2. UNIFIED FILTER BAR (Left: Search & Chips | Center: All Exams Dropdown | Right: Streams Dropdown) ─── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-15 my-3 sm:my-5">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 sm:gap-5">
            
            {/* ── LEFT SIDE: Search Input & Quick Chips ── */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Search Entrance Exams
              </label>

              <div className="flex items-center bg-slate-50/80 hover:bg-white focus-within:bg-white rounded-2xl border border-gray-200 hover:border-orange-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100/70 p-1.5 transition-all">
                <Search className="w-4 h-4 text-orange-500 ml-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by exam (GATE, CUET, TS PGECET), stream, or institute..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400 font-normal"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-gray-400 hover:text-gray-600 mr-1.5 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 text-[11px] font-medium rounded-lg shrink-0 hidden sm:inline-block">
                  {filteredExams.length} Found
                </span>
              </div>

              {/* Quick Popular Keywords / Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-gray-400 text-[11px] font-medium mr-0.5">Quick:</span>
                {["GATE", "CUET-PG", "TS PGECET", "AP PGECET", "CFTRI", "JAM", "CAT", "NIPER", "ISI"].map((tag) => {
                  const isSelected = searchQuery.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(isSelected ? "" : tag)}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                          : "bg-slate-50 hover:bg-orange-50 text-gray-600 hover:text-orange-700 border-gray-200/80 hover:border-orange-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── CENTER: All Exams / Section Dropdown ── */}
            <div className="w-full lg:w-60 shrink-0 space-y-2.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-orange-500" /> Exam Category
                </span>
                {activeSection !== "all" && (
                  <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </label>
              
              <div className="relative">
                <select
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="w-full appearance-none bg-slate-50/80 hover:bg-white focus:bg-white rounded-2xl border border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100/70 py-2.5 pl-3.5 pr-10 text-xs sm:text-sm font-medium text-gray-800 outline-none transition-all cursor-pointer shadow-2xs"
                >
                  <option value="all">All Exams ({counts.all})</option>
                  <option value="pan-india">Pan India ({counts["pan-india"]})</option>
                  <option value="telangana">Telangana (TS) ({counts.telangana})</option>
                  <option value="andhra-pradesh">Andhra Pradesh (AP) ({counts["andhra-pradesh"]})</option>
                  <option value="institute">Institute Specific ({counts.institute})</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDE: Streams Dropdown & Reset ── */}
            <div className="w-full lg:w-60 shrink-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-orange-500" /> Stream
                </label>
                {(activeSection !== "all" || activeStream !== "all" || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveSection("all");
                      setActiveStream("all");
                      setSearchQuery("");
                    }}
                    className="text-[11px] font-medium text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={activeStream}
                  onChange={(e) => setActiveStream(e.target.value)}
                  className="w-full appearance-none bg-slate-50/80 hover:bg-white focus:bg-white rounded-2xl border border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100/70 py-2.5 pl-3.5 pr-10 text-xs sm:text-sm font-medium text-gray-800 outline-none transition-all cursor-pointer shadow-2xs"
                >
                  <option value="all">All Streams</option>
                  <option value="engineering">Engineering</option>
                  <option value="science">Science & Food Tech</option>
                  <option value="management">Management / MBA</option>
                  <option value="pharmacy">Pharmacy & Pharma</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. EXAM LISTINGS (GRID & TABLE MODES) ──── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-15 py-4">
        
        {/* Section Header with View Toggle (Grid / Table) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>PG Entrance Opportunities</span>
              <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                {filteredExams.length} Available
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Direct access to official notifications, syllabus, and online application links.
            </p>
          </div>

          {/* View Mode Toggle (Grid / Table) */}
          <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-xs"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-xs"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* ─── A. GRID VIEW ─── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredExams.map((exam) => (
              <motion.article
                key={exam.id}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 45px rgba(234,88,12,0.12)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-gray-200/90 hover:border-orange-400 shadow-sm overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Top Signature Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400" />

                <div className="p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    {/* Card Top: Badges & Stream */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md border ${
                        exam.section === "pan-india"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : exam.section === "telangana"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : exam.section === "andhra-pradesh"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-purple-50 text-purple-800 border-purple-200"
                      }`}>
                        {exam.sectionLabel}
                      </span>
                      <span className="text-[11px] font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md truncate max-w-[150px] border border-gray-200">
                        {exam.stream}
                      </span>
                    </div>

                    {/* Exam Title & Full Name */}
                    <div className="mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {exam.name}
                      </h3>
                      <p className="text-xs font-normal text-gray-500 mt-0.5 line-clamp-1" title={exam.fullName}>
                        {exam.fullName}
                      </p>
                    </div>

                    {/* Institution / University */}
                    <div className="bg-slate-50/80 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 mb-3.5 space-y-1.5">
                      <div className="flex items-start gap-2 text-xs text-gray-800">
                        <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span className="font-semibold line-clamp-2" title={exam.university}>
                          {exam.university}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-normal">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{exam.location}</span>
                      </div>
                    </div>

                    {/* Courses / Degrees Offered */}
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">
                        Degrees / Courses
                      </p>
                      <p className="text-xs font-medium text-gray-700 line-clamp-2" title={exam.degree}>
                        {exam.degree}
                      </p>
                    </div>

                    {/* Exam Period & Info Modal Button */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pt-2.5 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {exam.examPeriod}
                      </span>
                      <button
                        onClick={() => setSelectedExamModal(exam)}
                        className="text-[11px] font-medium text-orange-600 hover:text-orange-800 underline flex items-center gap-0.5 cursor-pointer py-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </div>
                  </div>

                  {/* ─── ACTION BUTTONS (Notification & Apply) ─── */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-orange-50">
                    <a
                      href={exam.notificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 rounded-xl text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 transition-all text-center border border-orange-200 min-h-[42px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-600" />
                      <span>Notification</span>
                    </a>

                    <a
                      href={exam.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all shadow-sm shadow-green-500/20 text-center min-h-[42px]"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* ─── B. TABLE VIEW ─── */}
        {viewMode === "table" && (
          <div className="mb-8 bg-white rounded-3xl border border-orange-100 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Exam Name</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Stream</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Degrees</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Exam Period</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="border-b border-gray-100 hover:bg-orange-50/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">{exam.name}</p>
                        <p className="text-xs text-orange-600 font-normal truncate max-w-[200px]" title={exam.university}>{exam.university}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase ${exam.badgeBg}`}>
                          {exam.sectionLabel}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 font-normal">
                        {exam.stream}
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-700 font-normal max-w-[220px]">
                        <span className="line-clamp-1" title={exam.degree}>{exam.degree}</span>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-gray-600">
                        {exam.examPeriod}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedExamModal(exam)}
                            className="px-3 py-1.5 text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <a
                            href={exam.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            Apply <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="bg-white rounded-3xl border border-orange-100 p-8 sm:p-12 text-center my-8 shadow-sm">
            <Search className="w-12 h-12 text-orange-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No matching PG entrance exams found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Try resetting the filters or searching for keywords like GATE, CFTRI, TS ICET, CUET.</p>
            <button
              onClick={() => {
                setActiveSection("all");
                setActiveStream("all");
                setSearchQuery("");
              }}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ─── 4. SUMMARY ROADMAP / QUICK ACCESS ─────────────── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-15 my-10 sm:my-12">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl sm:text-2xl">🧭</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Quick PG Entrance Roadmaps
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 font-normal mb-6 sm:mb-8">
            Direct roadmap classifications for state and national PG aspirants:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Box 1: Pan India */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 space-y-2.5 hover:bg-white/15 transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-orange-300 block mb-1">I. Pan India PG</span>
                <h4 className="font-semibold text-sm sm:text-base text-white">National Central Exams</h4>
                <p className="text-xs text-gray-300 leading-relaxed mt-1.5 font-normal">
                  <span className="font-medium text-white">GATE</span> (M.Tech/PSU), <span className="font-medium text-white">CUET-PG</span> (Central Universities), <span className="font-medium text-white">JAM</span> (M.Sc), <span className="font-medium text-white">CAT/XAT/MAT</span> (MBA), <span className="font-medium text-white">NIPER</span> (Pharma).
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSection("pan-india");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="text-xs font-medium text-orange-400 hover:text-orange-200 flex items-center gap-1 pt-3 cursor-pointer"
              >
                Filter Pan India Exams <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Box 2: State Wise (TS & AP) */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 space-y-2.5 hover:bg-white/15 transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-green-300 block mb-1">II. Telangana & AP</span>
                <h4 className="font-semibold text-sm sm:text-base text-white">State Universities Common Tests</h4>
                <p className="text-xs text-gray-300 leading-relaxed mt-1.5 font-normal">
                  <span className="font-medium text-white">Telangana:</span> TS PGECET, TS ICET, CPGET (OUCET)<br />
                  <span className="font-medium text-white">Andhra Pradesh:</span> AP PGECET, AP ICET, APPGCET
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSection("telangana");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="text-xs font-medium text-green-400 hover:text-green-200 flex items-center gap-1 pt-3 cursor-pointer"
              >
                Filter State Exams <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Box 3: Institutes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 space-y-2.5 hover:bg-white/15 transition-colors flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-amber-300 block mb-1">III. Organization Specific</span>
                <h4 className="font-semibold text-sm sm:text-base text-white">Premier Research Institutes</h4>
                <p className="text-xs text-gray-300 leading-relaxed mt-1.5 font-normal">
                  <span className="font-medium text-white">CFTRI</span> (Food Tech), <span className="font-medium text-white">TIFR GS</span> (Pure Sciences), <span className="font-medium text-white">ISI</span> (Stats & Math), <span className="font-medium text-white">CMI</span> (Data Science), IISERs.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSection("institute");
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="text-xs font-medium text-amber-400 hover:text-amber-200 flex items-center gap-1 pt-3 cursor-pointer"
              >
                Filter Institute Exams <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. DETAIL MODAL (DETAILED EXAM INFORMATION POPUP) ─────────────── */}
      {selectedExamModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedExamModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 relative border border-orange-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedExamModal(null)}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-4 sm:mb-5 pr-8">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md ${selectedExamModal.badgeBg}`}>
                  {selectedExamModal.sectionLabel}
                </span>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
                  {selectedExamModal.stream}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedExamModal.name}
              </h3>
              <p className="text-xs font-normal text-gray-500 mt-0.5">{selectedExamModal.fullName}</p>
            </div>

            {/* University / Conducting Body */}
            <div className="bg-orange-50/40 rounded-2xl p-3.5 sm:p-4 border border-orange-100 mb-4 space-y-1">
              <p className="text-[10px] font-semibold uppercase text-orange-600">Conducting Body & Participating Institutions</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{selectedExamModal.university}</p>
              <p className="text-[11px] sm:text-xs text-gray-600">📍 {selectedExamModal.location}</p>
            </div>

            {/* Details & Eligibility */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-5">
              <p>{selectedExamModal.description}</p>
              
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3.5 sm:p-4">
                <p className="text-xs font-semibold text-orange-900 mb-0.5">🎓 Degree Programs Offered</p>
                <p className="text-xs text-orange-800 font-normal">{selectedExamModal.degree}</p>
              </div>

              <div className="bg-green-50/60 border border-green-100 rounded-2xl p-3.5 sm:p-4">
                <p className="text-xs font-semibold text-green-900 mb-0.5">📋 Eligibility Criteria</p>
                <p className="text-xs text-green-800 font-normal">{selectedExamModal.eligibility}</p>
              </div>

              {selectedExamModal.highlights && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-gray-800">Key Highlights:</p>
                  {selectedExamModal.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Direct Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={selectedExamModal.notificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium text-xs text-center flex items-center justify-center gap-1.5 transition-all border border-orange-200"
              >
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                View Notification
              </a>

              <a
                href={selectedExamModal.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-green-500/20"
              >
                Apply Directly <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

