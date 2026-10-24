"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { generateCollectionPageSchema, generateItemListSchema, generateTableSchema } from '@/utils/schemaHelpers';
import InternshipGuideContent from '@/components/InternshipGuideContent';
import { isDeadlineExpired } from "@/utils/jobDeadline";
import { formatAge } from "@/utils/jobMapper";
import { formatISTDateNumeric } from "@/utils/istDate";
import JobRichText from "@/components/JobRichText";
import InternshipFinder from "@/components/internships/InternshipFinder";
import SkillupFinder from "@/components/skillups/SkillupFinder";
import { SectionSwitch } from "@/components/listing/ListingKit";

import {
  Calendar,
  Building2,
  Search,
  Eye,
  X,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  IndianRupee,
  Award,
  ChevronDown,
  Check,
  AlertCircle,
  Sparkles,
  BookOpen,
  Star,
  Users,
  ArrowRight,
  Layers,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Filter,
  Rocket,
  Code,
  GraduationCap,
  Zap,
  TrendingUp,
  LayoutGrid,
  ListFilter,
  FileText
} from "lucide-react";

import { API_BASE_URL } from "@/utils/api";

const BASE_URL = `${API_BASE_URL}/internships`;

const SKILLUPS_API_BASE = `${API_BASE_URL}/jobs`;

// IST calendar day, whatever the visitor's timezone.
const formatDateDDMMYYYY = (value) => (value ? formatISTDateNumeric(value) || value : "-");

const normalizeLink = (link) => {
  if (!link) return null;
  return link.startsWith("http") ? link : `https://${link}`;
};

const generateSlug = (title) => {
  return title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
};

const mapDynamicSkillUp = (j) => {
  const deadline = j.deadline || j.application_deadline || j.lastDate || null;
  return {
    id: j._id || j.id,
    title: j.title || "SkillUp Opportunity",
    org: j.platform || j.jobSource || j.source_name || j.sourceName || j.org || "SWAYAM / Ministry of Education",
    category: j.categoryName || j.category_name || j.category || "Skill Development",
    qualifications: j.qualificationLevel
      || (j.qualifications && j.qualifications !== "Not available in the website" ? j.qualifications : "")
      || "Open to all students, graduates & working professionals",
    applyLink: j.courseLink || j.applyLink || j.apply_link || null,
    notificationUrl: j.notificationUrl || j.notification_url || null,
    postedDate: j.postedDate || j.posted_date || null,
    deadline: deadline,
    description: j.description || "",
    remark: j.remark || "",
    note: j.note || "",
    courseLayout: j.courseLayout || "",
    // Skill-up columns, shown exactly as the admin typed them (dates can be "TBA" / "Closed").
    enrollmentEndText: j.enrollmentEndDate || "",
    details: [
      ["National Coordinator", j.nationalCoordinator], ["Institute", j.institute], ["Instructor", j.instructor],
      ["Course Status", j.courseStatus], ["Course Type", j.courseType], ["Duration", j.duration], ["Credit Points", j.creditPoints],
      ["Start Date", j.startDate], ["End Date", j.endDate], ["Exam Date", j.examDate],
      ["Exam Registration End Date", j.examRegistrationEndDate], ["Fee", j.fee], ["Certificate", j.certificate],
      ["Mode", j.mode], ["Prerequisites", j.prerequisites], ["Stipend", j.stipend],
    ].filter(([, v]) => v != null && String(v).trim() !== ""),
    isPinned: Boolean(j.isPinned),
    imageUrl: j.imageUrl || "",
    isExpired: isDeadlineExpired(deadline),
    age: (formatAge(j) && formatAge(j) !== "-") ? formatAge(j) : "No Age Limit",
    posts: j.noOfPosts ?? j.no_of_posts ?? 1,
    status: j.status || "approved",
    type: "skillup",
  };
};

export default function InternshipsClient({
  initialInternships = [],
  initialPagination = null,
  initialSkillups = [],
  initialSkillupsPagination = null,
  initialFilters = null,
  initialError = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state: "internships" | "skillups"
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === "skillups" ? "skillups" : "internships"
  );

  useEffect(() => {
    if (tabFromUrl === "skillups" || tabFromUrl === "internships") {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    const newUrl = tab === "skillups" ? "/internships?tab=skillups" : "/internships";
    window.history.replaceState(null, "", newUrl);
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     INTERNSHIPS TAB — search, filters and list live in <InternshipFinder>.
     Only the open-internship count for the tab badge is kept here.
  ───────────────────────────────────────────────────────────────────────────── */
  const [globalCounts, setGlobalCounts] = useState({ active: 913, expired: 3283, total: 4196 });

  useEffect(() => {
    const fetchGlobalCounts = async () => {
      try {
        const [activeRes, expiredRes] = await Promise.all([
          fetch(`${BASE_URL}?page=1&limit=1&expired=false`).then(r => r.json()),
          fetch(`${BASE_URL}?page=1&limit=1&expired=true`).then(r => r.json())
        ]);
        const active = activeRes.data?.pagination?.total || 0;
        const expired = expiredRes.data?.pagination?.total || 0;
        if (active || expired) {
          setGlobalCounts({ active, expired, total: active + expired });
        }
      } catch (err) {
        console.error("Failed to fetch internship status counts:", err);
      }
    };
    fetchGlobalCounts();
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────────
     DYNAMIC SKILLUPS (API-DRIVEN) STATE & LOGIC
  ───────────────────────────────────────────────────────────────────────────── */
  const [skillupsList, setSkillupsList] = useState(
    initialSkillups && initialSkillups.length > 0
      ? initialSkillups.map(mapDynamicSkillUp)
      : []
  );
  const [allSkillups, setAllSkillups] = useState([]);
  const [skillupsLoaded, setSkillupsLoaded] = useState(false);
  const [skillupsLoading, setSkillupsLoading] = useState(false);
  const [skillupsError, setSkillupsError] = useState(null);

  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null);

  // Fetch all skillups dynamically from API
  const fetchDynamicSkillUps = async () => {
    try {
      setSkillupsLoading(true);
      setSkillupsError(null);

      // Fetch all pages of skillups
      let allItems = [];
      const firstRes = await fetch(`${SKILLUPS_API_BASE}/skillup?page=1&limit=100&sort=newest`);
      const firstJson = await firstRes.json();

      if (firstJson.success && firstJson.data?.jobs) {
        allItems = firstJson.data.jobs.map(mapDynamicSkillUp);
        const totalPages = firstJson.data.pagination?.totalPages || 1;
        if (totalPages > 1) {
          const promises = [];
          for (let p = 2; p <= totalPages; p++) {
            promises.push(
              fetch(`${SKILLUPS_API_BASE}/skillup?page=${p}&limit=100&sort=newest`).then(r => r.json())
            );
          }
          const results = await Promise.all(promises);
          results.forEach(res => {
            if (res.success && res.data?.jobs) {
              allItems = allItems.concat(res.data.jobs.map(mapDynamicSkillUp));
            }
          });
        }
      }

      setAllSkillups(allItems);
      setSkillupsList(allItems);
      setSkillupsLoaded(true);
    } catch (err) {
      console.error("Error fetching dynamic skillups:", err);
      setSkillupsError("Unable to load dynamic skill development opportunities.");
    } finally {
      setSkillupsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "skillups" && !skillupsLoaded && !skillupsLoading) {
      fetchDynamicSkillUps();
    }
  }, [activeTab, skillupsLoaded, skillupsLoading]);

  const switcher = (
    <SectionSwitch
      value={activeTab}
      onChange={handleTabSwitch}
      items={[
        { id: "internships", label: "Internships", description: "Work with companies & govt — paid, virtual, WFH", Icon: GraduationCap, count: `${globalCounts.active.toLocaleString("en-IN")}+` },
        { id: "skillups", label: "SkillUps", description: "Free courses & certificates — SWAYAM, NPTEL", Icon: Zap, count: allSkillups.length > 0 ? allSkillups.length : "65+" },
      ]}
    />
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50/40 via-white to-green-50/20 font-sans">
      {activeTab === "internships" ? (
        <InternshipFinder initialInternships={initialInternships} switcher={switcher} />
      ) : (
        <SkillupFinder
          items={allSkillups.length > 0 ? allSkillups : skillupsList}
          loading={skillupsLoading || (!skillupsLoaded && !skillupsError)}
          error={skillupsError}
          onRetry={fetchDynamicSkillUps}
          switcher={switcher}
          onSelect={setSelectedSkillDetail}
          onSwitchToInternships={() => handleTabSwitch("internships")}
        />
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          DEDICATED SINGLE SKILLUP DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedSkillDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-100 relative my-auto">
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-6 sm:p-8 text-white rounded-t-3xl">
              <button
                type="button"
                onClick={() => setSelectedSkillDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                  {selectedSkillDetail.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-700">
                  {selectedSkillDetail.org}
                </span>
                {selectedSkillDetail.isExpired ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">
                    Application Closed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 font-bold">
                    Open for Enrollment
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedSkillDetail.title}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">

              {/* Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <span className="block text-[11px] font-bold text-orange-700 uppercase tracking-wider mb-1">
                    Organization / Source
                  </span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    {selectedSkillDetail.org}
                  </p>
                </div>

                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <span className="block text-[11px] font-bold text-orange-700 uppercase tracking-wider mb-1">
                    {selectedSkillDetail.enrollmentEndText ? "Enrollment End Date" : "Application Deadline"}
                  </span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    {selectedSkillDetail.enrollmentEndText || formatDateDDMMYYYY(selectedSkillDetail.deadline)}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Eligibility & Qualification
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedSkillDetail.qualifications}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Posted Date & Age Limit
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDateDDMMYYYY(selectedSkillDetail.postedDate)} • {selectedSkillDetail.age}
                  </p>
                </div>
              </div>

              {/* Course details — every skill-up column that has a value */}
              {selectedSkillDetail.details?.length > 0 && (
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <dl className="grid grid-cols-1 sm:grid-cols-2">
                    {selectedSkillDetail.details.map(([label, value]) => (
                      <div key={label} className="px-4 py-3 border-b border-slate-100 sm:odd:border-r">
                        <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</dt>
                        <dd className="text-sm font-semibold text-slate-800 mt-0.5 whitespace-pre-line">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Course Overview */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Program Description</span>
                </h3>
                {selectedSkillDetail.description ? (
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <JobRichText value={selectedSkillDetail.description} />
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    This SkillUp program ({selectedSkillDetail.title}) is offered under {selectedSkillDetail.org} to equip candidates with recognized practical competencies and vocational proficiency.
                  </p>
                )}
              </div>

              {[["Course Layout", selectedSkillDetail.courseLayout], ["Remark", selectedSkillDetail.remark], ["Note", selectedSkillDetail.note]].map(([label, value]) => value ? (
                <div key={label}>
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">{label}</h3>
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <JobRichText value={value} />
                  </div>
                </div>
              ) : null)}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSkillDetail(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {selectedSkillDetail.notificationUrl && (
                  <a
                    href={normalizeLink(selectedSkillDetail.notificationUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>View Notification</span>
                  </a>
                )}

                {selectedSkillDetail.applyLink && !selectedSkillDetail.isExpired && (
                  <a
                    href={normalizeLink(selectedSkillDetail.applyLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md cursor-pointer"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
