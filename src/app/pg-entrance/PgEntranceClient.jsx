"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { PUBLIC_API_BASE_URL } from "@/utils/api";

// ── SKELETON LOADERS ────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col justify-between animate-pulse">
      <div className="h-1.5 w-full bg-slate-200" />
      <div className="p-5 sm:p-6 flex flex-col h-full justify-between space-y-4">
        <div>
          {/* Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="h-5 w-24 bg-slate-200 rounded-md" />
            <div className="h-5 w-28 bg-slate-100 rounded-md" />
          </div>

          {/* Title */}
          <div className="space-y-2 mb-4">
            <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-3.5 w-full bg-slate-100 rounded" />
          </div>

          {/* Authority Box */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2 mb-3.5">
            <div className="h-4 w-4/5 bg-slate-200 rounded" />
            <div className="h-3 w-1/3 bg-slate-100 rounded" />
          </div>

          {/* Degrees */}
          <div className="space-y-1.5 mb-3">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
          </div>

          {/* Exam Period */}
          <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-orange-50">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="mb-8 bg-white rounded-3xl border border-orange-100 shadow-md overflow-hidden animate-pulse">
      <div className="h-12 bg-gradient-to-r from-orange-400 to-orange-500" />
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 gap-4">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-5 w-24 bg-slate-100 rounded" />
            <div className="h-5 w-32 bg-slate-100 rounded" />
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="h-5 w-24 bg-slate-100 rounded" />
            <div className="h-8 w-28 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PgEntranceClient({ initialExams = [], initialPagination = null, guide = null }) {
  const [exams, setExams] = useState(initialExams);
  const [loading, setLoading] = useState(initialExams.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [activeStream, setActiveStream] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedExamModal, setSelectedExamModal] = useState(null);

  // Fetch from live backend API
  const fetchLiveExams = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (activeSection !== "all") params.set("section", activeSection);
      if (activeStream !== "all") params.set("streamCategory", activeStream);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`${PUBLIC_API_BASE_URL}/pg-entrance?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setExams(json.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch live PG entrance data:", err);
    } finally {
      setLoading(false);
    }
  }, [activeSection, activeStream, searchQuery]);

  // Trigger search/filter fetch on change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLiveExams();
    }, 250);
    return () => clearTimeout(handler);
  }, [fetchLiveExams]);

  // Dynamic quick keyword chips from fetched exams
  const quickKeywords = useMemo(() => {
    if (!exams.length) return ["GATE", "IIT JAM", "CAT", "CUET-PG", "TG CPGET", "TG PGECET", "TG ICET", "TG PGLCET"];
    const names = exams.map((e) => e.name.split(" ")[0]);
    return Array.from(new Set(names)).slice(0, 8);
  }, [exams]);

  // Dynamic counts
  const counts = useMemo(() => {
    return {
      all: exams.length,
      national: exams.filter((e) => e.section === "national").length,
      state: exams.filter((e) => e.section === "state").length,
    };
  }, [exams]);

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

      {/* ─── 1. HERO HEADER ─────────────────────────────────────────────────── */}
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
            Search exam-wise, stream-wise, and university-wise for <span className="font-semibold text-gray-800">National-level</span> PG entrances like <span className="font-semibold text-gray-800">GATE, IIT JAM, CAT, CUET-PG</span> and <span className="font-semibold text-gray-800">Telangana State</span> entrances like <span className="font-semibold text-gray-800">TG CPGET, TG PGECET, TG ICET, TG PGLCET</span>.
          </p>
        </div>
      </section>

      {/* ─── 2. UNIFIED FILTER BAR ────────────────────────────────────────── */}
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
                  placeholder="Search by exam (GATE, CUET-PG, TG PGECET), stream, or institute..."
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
                  {exams.length} Found
                </span>
              </div>

              {/* Quick Popular Keywords / Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-gray-400 text-[11px] font-medium mr-0.5">Quick:</span>
                {quickKeywords.map((tag) => {
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

            {/* ── CENTER: Category Dropdown ── */}
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
                  <option value="national">National Level ({counts.national})</option>
                  <option value="state">Telangana State ({counts.state})</option>
                  <option value="institute">Institute Specific</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDE: Stream Dropdown ── */}
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
                  <option value="science">Science & Mathematics</option>
                  <option value="management">Management / MBA / MCA</option>
                  <option value="law">Law</option>
                  <option value="multi-stream">Arts, Commerce & Multi-stream</option>
                  <option value="medical">Medical / Pharmacy</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. EXAM LISTINGS ─────────────────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-15 py-4">
        {/* Header with View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>PG Entrance Opportunities</span>
              <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                {exams.length} Available
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Direct access to official notifications, syllabus, and online application links.
            </p>
          </div>

          {/* View Mode Toggle */}
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

        {/* ─── LOADING SKELETON ─── */}
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <CardSkeleton key={k} />
              ))}
            </div>
          ) : (
            <TableSkeleton />
          )
        ) : (
          <>
            {/* ─── GRID VIEW ─── */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {exams.map((exam) => (
                  <motion.article
                    key={exam.id || exam.slug}
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
                        {/* Top: Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md border ${
                              exam.section === "national"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {exam.sectionLabel || (exam.section === "state" ? "State Level" : "National Level")}
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

                        {/* University & Location */}
                        <div className="bg-slate-50/80 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 mb-3.5 space-y-1.5">
                          <div className="flex items-start gap-2 text-xs text-gray-800">
                            <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span className="font-semibold line-clamp-2" title={exam.university}>
                              {exam.university}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-normal">
                            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="truncate">{exam.location || "India"}</span>
                          </div>
                        </div>

                        {/* Degrees Offered */}
                        <div className="mb-3">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">
                            Degrees / Courses
                          </p>
                          <p className="text-xs font-medium text-gray-700 line-clamp-2" title={exam.degree}>
                            {exam.degree}
                          </p>
                        </div>

                        {/* Exam Period & View Details */}
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

                      {/* Action Links */}
                      <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-orange-50">
                        <a
                          href={exam.notificationUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 rounded-xl text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 transition-all text-center border border-orange-200 min-h-[42px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-orange-600" />
                          <span>Notification</span>
                        </a>

                        <a
                          href={exam.applyUrl || "#"}
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

            {/* ─── TABLE VIEW ─── */}
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
                    <tbody className="divide-y divide-gray-100">
                      {exams.map((exam) => (
                        <tr key={exam.id || exam.slug} className="hover:bg-orange-50/40 transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">{exam.name}</p>
                            <p className="text-xs text-orange-600 font-normal truncate max-w-[200px]" title={exam.university}>
                              {exam.university}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                                exam.section === "national"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {exam.sectionLabel || exam.section}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-600 font-normal">{exam.stream}</td>
                          <td className="px-4 py-4 text-xs text-gray-700 font-normal max-w-[220px]">
                            <span className="line-clamp-1" title={exam.degree}>{exam.degree}</span>
                          </td>
                          <td className="px-4 py-4 text-xs font-medium text-gray-600">{exam.examPeriod}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedExamModal(exam)}
                                className="px-3 py-1.5 text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-colors cursor-pointer"
                              >
                                Details
                              </button>
                              <a
                                href={exam.applyUrl || "#"}
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
            {exams.length === 0 && (
              <div className="bg-white rounded-3xl border border-orange-100 p-8 sm:p-12 text-center my-8 shadow-sm">
                <Search className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">No matching PG entrance exams found</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Try resetting your search or filters to see all available entrance opportunities.
                </p>
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
          </>
        )}
      </section>

      {/* ─── 4. BOTTOM PAGE CONTENT (GUIDE & SEO ARTICLE) ──────────────────── */}
      {guide}

      {/* ─── 5. DETAIL MODAL ───────────────────────────────────────────────── */}
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
                <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800">
                  {selectedExamModal.sectionLabel || selectedExamModal.section}
                </span>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
                  {selectedExamModal.stream}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedExamModal.name}</h3>
              <p className="text-xs font-normal text-gray-500 mt-0.5">{selectedExamModal.fullName}</p>
            </div>

            {/* Conducting Body */}
            <div className="bg-orange-50/40 rounded-2xl p-3.5 sm:p-4 border border-orange-100 mb-4 space-y-1">
              <p className="text-[10px] font-semibold uppercase text-orange-600">Conducting Body & Participating Institutions</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{selectedExamModal.university}</p>
              <p className="text-[11px] sm:text-xs text-gray-600">📍 {selectedExamModal.location || "India"}</p>
            </div>

            {/* Description & Eligibility */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-5">
              {selectedExamModal.description && <p>{selectedExamModal.description}</p>}

              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3.5 sm:p-4">
                <p className="text-xs font-semibold text-orange-900 mb-0.5">🎓 Degree Programs Offered</p>
                <p className="text-xs text-orange-800 font-normal">{selectedExamModal.degree}</p>
              </div>

              <div className="bg-green-50/60 border border-green-100 rounded-2xl p-3.5 sm:p-4">
                <p className="text-xs font-semibold text-green-900 mb-0.5">📋 Eligibility Criteria</p>
                <p className="text-xs text-green-800 font-normal">{selectedExamModal.eligibility}</p>
              </div>

              {selectedExamModal.highlights?.length > 0 && (
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

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={selectedExamModal.notificationUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium text-xs text-center flex items-center justify-center gap-1.5 transition-all border border-orange-200"
              >
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                View Notification
              </a>

              <a
                href={selectedExamModal.applyUrl || "#"}
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
