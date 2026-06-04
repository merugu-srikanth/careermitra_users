import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import DOMPurify from "dompurify";
import { calculateProfileCompletion } from "../utils/profileCompletion";

import {
  FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars,
  FaMapMarkerAlt, FaBell, FaSignOutAlt, FaEdit, FaChevronRight,
  FaInfoCircle, FaBriefcase, FaCertificate, FaUserCog, FaLayerGroup,
  FaSchool, FaGraduationCap, FaUniversity, FaBook, FaFlask, FaTools,
  FaCog, FaSearch, FaExternalLinkAlt, FaTimes, FaCalendarAlt,
  FaBuilding, FaTag, FaFire, FaClock, FaFileAlt, FaImage,
  FaFilePdf, FaFileWord, FaChevronDown, FaChevronUp, FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { RiGovernmentFill } from "react-icons/ri";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const API_BASE = "https://www.careermitra.tech/api";

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
const isEmpty = (v) => {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (Array.isArray(v) && (v.length === 0 || v.every((i) => i === null || i === undefined || i === ""))) return true;
  if (typeof v === "object" && !Array.isArray(v)) return Object.keys(v).length === 0;
  return false;
};

const prettyKey = (key) => {
  if (!key) return "";
  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (ds) => {
  if (!ds) return "";
  const d = new Date(ds);
  if (isNaN(d.getTime())) return String(ds);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const calcAge = (dob) => {
  if (!dob) return "";
  const b = new Date(dob);
  if (isNaN(b.getTime())) return "";
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
};

const normBool = (v) => v === true || v === 1 || v === "1" || v === "true";

const fmtINR = (n) => {
  if (n === null || n === undefined || n === "") return "";
  const num = Number(n);
  if (isNaN(num)) return String(n);
  return `₹${num.toLocaleString("en-IN")}`;
};

const normSubStatus = (s) => {
  if (!s) return "Not specified";
  const v = String(s).toLowerCase();
  if (v === "success" || v === "active") return "Active";
  if (v === "failed") return "Failed";
  if (v === "pending") return "Pending";
  if (v === "expired") return "Expired";
  return s;
};

const getAlertType = (p) => {
  if (!p) return "Not specified";
  if (normBool(p.alert_both)) return "Both Job & Internship";
  if (normBool(p.alert_job)) return "Government Jobs";
  if (normBool(p.alert_internship)) return "Government Internships";
  return "Not specified";
};

const titleCase = (t) => {
  if (!t) return "";
  return t.toString().toLowerCase().split(" ").filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const parseDate = (d) => {
  if (!d) return null;
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, mo, day] = d.split("-").map(Number);
    const dt = new Date(y, mo - 1, day);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
};

const fmtDate2 = (d) => {
  const dt = parseDate(d);
  if (!dt) return "—";
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const daysLeft = (d) => {
  const dt = parseDate(d);
  if (!dt) return null;
  return Math.ceil((dt - new Date()) / (1000 * 60 * 60 * 24));
};

const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

/* ══════════════════════════════════════════
   EDUCATION FLATTEN
══════════════════════════════════════════ */
const flattenEdu = (edu) => {
  if (!edu) return {};
  const out = {
    qualification_level: edu.qualification_level,
    below10th_details: edu.below10th?.details,
    below10th_school_name: edu.below10th?.school_name,
    tenth_board: edu.tenth?.board,
    tenth_school_name: edu.tenth?.school_name,
    intermediate_course: edu.intermediate?.course,
    intermediate_course_other: edu.intermediate?.course_other,
    intermediate_board: edu.intermediate?.board,
    intermediate_vocational_subject: edu.intermediate?.vocational_subject,
    intermediate_college_name: edu.intermediate?.college_name,
    iti_trade: edu.iti?.trade,
    iti_trade_other: edu.iti?.trade_other,
    iti_college_name: edu.iti?.college_name,
    iti_current_year: edu.iti?.current_year,
    polytechnic_branch: edu.polytechnic?.branch,
    polytechnic_college_name: edu.polytechnic?.college_name,
    polytechnic_current_year: edu.polytechnic?.current_year,
    diploma_branch: edu.diploma?.branch,
    diploma_current_year: edu.diploma?.current_year,
    graduation_type: edu.graduation?.type,
    graduation_course: edu.graduation?.course,
    graduation_course_other: edu.graduation?.course_other,
    graduation_subject1: Array.isArray(edu.graduation?.subjects) ? edu.graduation.subjects[0] : undefined,
    graduation_subject2: Array.isArray(edu.graduation?.subjects) ? edu.graduation.subjects[1] : undefined,
    graduation_subject3: Array.isArray(edu.graduation?.subjects) ? edu.graduation.subjects[2] : undefined,
    graduation_specialization: edu.graduation?.specialization,
    graduation_college_name: edu.graduation?.college_name,
    graduation_current_year: edu.graduation?.current_year,
    graduation_qualified_in: edu.graduation?.qualified_in,
    second_graduation_type: edu.second_graduation?.type,
    second_graduation_course: edu.second_graduation?.course,
    second_graduation_course_other: edu.second_graduation?.course_other,
    second_graduation_subject1: Array.isArray(edu.second_graduation?.subjects) ? edu.second_graduation.subjects[0] : undefined,
    second_graduation_subject2: Array.isArray(edu.second_graduation?.subjects) ? edu.second_graduation.subjects[1] : undefined,
    second_graduation_subject3: Array.isArray(edu.second_graduation?.subjects) ? edu.second_graduation.subjects[2] : undefined,
    second_graduation_specialization: edu.second_graduation?.specialization,
    second_graduation_college_name: edu.second_graduation?.college_name,
    second_graduation_current_year: edu.second_graduation?.current_year,
    post_graduation_course: edu.post_graduation?.course,
    post_graduation_course_other: edu.post_graduation?.course_other,
    post_graduation_specialization: edu.post_graduation?.specialization,
    post_graduation_subject1: Array.isArray(edu.post_graduation?.subjects) ? edu.post_graduation.subjects[0] : undefined,
    post_graduation_subject2: Array.isArray(edu.post_graduation?.subjects) ? edu.post_graduation.subjects[1] : undefined,
    post_graduation_subject3: Array.isArray(edu.post_graduation?.subjects) ? edu.post_graduation.subjects[2] : undefined,
    post_graduation_college_name: edu.post_graduation?.college_name,
    post_graduation_current_year: edu.post_graduation?.current_year,
    second_post_graduation_course: edu.second_post_graduation?.course,
    second_post_graduation_course_other: edu.second_post_graduation?.course_other,
    second_post_graduation_specialization: edu.second_post_graduation?.specialization,
    second_post_graduation_subject1: Array.isArray(edu.second_post_graduation?.subjects) ? edu.second_post_graduation.subjects[0] : undefined,
    second_post_graduation_subject2: Array.isArray(edu.second_post_graduation?.subjects) ? edu.second_post_graduation.subjects[1] : undefined,
    second_post_graduation_subject3: Array.isArray(edu.second_post_graduation?.subjects) ? edu.second_post_graduation.subjects[2] : undefined,
    second_post_graduation_college_name: edu.second_post_graduation?.college_name,
    second_post_graduation_current_year: edu.second_post_graduation?.current_year,
    phd_research_field: edu.phd?.research_field,
    phd_university: edu.phd?.university,
    phd_university_name: edu.phd?.university_name,
    phd_current_year: edu.phd?.current_year,
    other_course_code: edu.other?.course_code,
    other_course_full_name: edu.other?.course_full_name,
    other_education_full_name: edu.other?.education_full_name,
    other_education_current_year: edu.other?.current_year,
  };
  Object.keys(out).forEach((k) => { if (isEmpty(out[k])) delete out[k]; });
  return out;
};

const EDU_GROUPS = [
  { key: "below10th",             label: "Below 10th",            icon: <FaSchool />,        bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     prefixes: ["below10th_"],             excludePrefixes: [] },
  { key: "tenth",                 label: "10th Standard",         icon: <FaSchool />,        bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", prefixes: ["tenth_"],                 excludePrefixes: [] },
  { key: "intermediate",          label: "Intermediate / 12th",   icon: <FaBook />,          bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   prefixes: ["intermediate_"],          excludePrefixes: [] },
  { key: "iti",                   label: "ITI",                   icon: <FaTools />,         bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-700",    prefixes: ["iti_"],                   excludePrefixes: [] },
  { key: "polytechnic",           label: "Polytechnic",           icon: <FaCog />,           bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  prefixes: ["polytechnic_"],           excludePrefixes: [] },
  { key: "diploma",               label: "Diploma",               icon: <FaCertificate />,   bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700",  prefixes: ["diploma_"],               excludePrefixes: [] },
  { key: "graduation",            label: "Graduation",            icon: <FaGraduationCap />, bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700",  prefixes: ["graduation_"],            excludePrefixes: ["second_graduation_"] },
  { key: "second_graduation",     label: "Second Graduation",     icon: <FaGraduationCap />, bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", prefixes: ["second_graduation_"],     excludePrefixes: [] },
  { key: "post_graduation",       label: "Post Graduation",       icon: <FaUniversity />,    bg: "bg-cyan-50",    border: "border-cyan-200",    text: "text-cyan-700",    prefixes: ["post_graduation_"],       excludePrefixes: ["second_post_graduation_"] },
  { key: "second_post_graduation",label: "Second Post Graduation",icon: <FaUniversity />,    bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     prefixes: ["second_post_graduation_"],excludePrefixes: [] },
  { key: "phd",                   label: "PhD / Doctorate",       icon: <FaFlask />,         bg: "bg-green-50",   border: "border-green-200",   text: "text-green-700",   prefixes: ["phd_"],                   excludePrefixes: [] },
  { key: "other",                 label: "Other Education",       icon: <FaBook />,          bg: "bg-gray-50",    border: "border-gray-200",    text: "text-gray-600",    prefixes: ["other_"],                 excludePrefixes: [] },
];

const buildEduGroups = (flatEdu) => {
  if (!flatEdu || Object.keys(flatEdu).length === 0) return [];
  const assigned = new Set();
  const groups = [];
  if (flatEdu["qualification_level"]) assigned.add("qualification_level");
  EDU_GROUPS.forEach((g) => {
    const fields = [];
    Object.entries(flatEdu).forEach(([k, v]) => {
      if (assigned.has(k) || isEmpty(v)) return;
      const match = g.prefixes.some((p) => k.startsWith(p));
      const excl = g.excludePrefixes.some((ep) => k.startsWith(ep));
      if (match && !excl) {
        let lbl = k;
        for (const p of g.prefixes) { if (lbl.startsWith(p)) { lbl = lbl.slice(p.length); break; } }
        fields.push({ key: k, label: prettyKey(lbl), value: v });
        assigned.add(k);
      }
    });
    if (fields.length) groups.push({ ...g, fields });
  });
  const remaining = [];
  Object.entries(flatEdu).forEach(([k, v]) => {
    if (assigned.has(k) || isEmpty(v)) return;
    remaining.push({ key: k, label: prettyKey(k), value: v });
  });
  if (remaining.length) {
    groups.push({
      key: "other_rem", label: "Other Details", icon: <FaInfoCircle />,
      bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", fields: remaining,
    });
  }
  return groups;
};

/* ══════════════════════════════════════════
   BUILD PROFILE SECTIONS
══════════════════════════════════════════ */
const buildSections = (profile, age) => {
  if (!profile) return [];
  const sections = [];
  const usedKeys = new Set();
  const HIDE = new Set(["id", "role_id"]);

  const pick = (obj, keys) => {
    const out = {};
    keys.forEach((k) => {
      if (!obj || HIDE.has(k) || isEmpty(obj[k])) return;
      out[k] = obj[k]; usedKeys.add(k);
    });
    return out;
  };

  const push = (title, icon, data) => {
    if (!data) return;
    const cleaned = {};
    Object.entries(data).forEach(([k, v]) => { if (!HIDE.has(k) && !isEmpty(v)) cleaned[k] = v; });
    if (Object.keys(cleaned).length) sections.push({ title, icon, data: cleaned });
  };

  const personal = pick(profile, ["name","email","phone","gender","date_of_birth","current_status","social_status","additional_support"]);
  if (!isEmpty(profile?.date_of_birth) && age) personal.age = `${age} years`;
  push("Personal Information", <FaUser />, personal);

  usedKeys.add("subscription"); usedKeys.add("all_subscriptions");
  const sub = profile.subscription;
  const allSubs = Array.isArray(profile.all_subscriptions) ? profile.all_subscriptions : [];
  if (sub && typeof sub === "object") {
    push("Subscription", <FaLayerGroup />, {
      plan_name: sub.plan_name, amount: fmtINR(sub.amount),
      status: normSubStatus(sub.status), start_date: sub.start_date, end_date: sub.end_date,
    });
  } else {
    push("Subscription", <FaLayerGroup />, { status: "Not specified" });
  }
  if (allSubs.length) {
    sections.push({ title: "All Subscriptions", icon: <FaLayerGroup />, isArray: true,
      data: allSubs.map(s => ({ plan_name: s.plan_name, amount: fmtINR(s.amount), status: normSubStatus(s.status), start_date: s.start_date, end_date: s.end_date })) });
  }

  usedKeys.add("education");
  sections.push({ title: "Education", icon: <FaGraduationCap />, isEducation: true, data: profile.education || {} });

  push("Location", <FaMapMarkerAlt />, pick(profile, ["current_location","state","district"]));

  if (profile.preferences && typeof profile.preferences === "object") {
    const prefData = {};
    if (Array.isArray(profile.preferences)) {
      profile.preferences.forEach((p, i) => { prefData[`preference_${i + 1}`] = p; });
    } else {
      Object.entries(profile.preferences).forEach(([key, value]) => {
        if (value && Array.isArray(value.selected) && value.selected.length) prefData[key] = value.selected.join(", ");
      });
    }
    if (Object.keys(prefData).length) sections.push({ title: "Preferences", icon: <FaBriefcase />, data: prefData });
    usedKeys.add("preferences");
  }

  push("Certifications & Skills", <FaCertificate />, pick(profile, ["has_technical_certification","technical_certification_details","any_other_certification_from_board_of_education","qualified_teacher_exam"]));
  push("Career & Job Alerts", <FaBriefcase />, pick(profile, ["how_did_you_come_across_career_mitra","highest_education_institution_type"]));
  push("Account Information", <FaInfoCircle />, pick(profile, ["created_at","updated_at"]));

  Object.entries(profile).forEach(([k, v]) => {
    if (HIDE.has(k) || usedKeys.has(k) || isEmpty(v)) return;
    if (Array.isArray(v)) { usedKeys.add(k); sections.push({ title: prettyKey(k), icon: <FaInfoCircle />, isArray: true, data: v }); }
  });
  Object.entries(profile).forEach(([k, v]) => {
    if (HIDE.has(k) || usedKeys.has(k) || isEmpty(v)) return;
    if (typeof v === "object" && !Array.isArray(v)) {
      const cleaned = {};
      Object.entries(v).forEach(([kk, vv]) => { if (!HIDE.has(kk) && !isEmpty(vv)) cleaned[kk] = vv; });
      if (Object.keys(cleaned).length) { usedKeys.add(k); sections.push({ title: prettyKey(k), icon: <FaInfoCircle />, data: cleaned }); }
    }
  });
  return sections;
};

/* ══════════════════════════════════════════
   ATOMS
══════════════════════════════════════════ */
const Spinner = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
      <p className="text-gray-500 font-medium">Loading your profile…</p>
    </div>
  </div>
);

const SectionCard = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-orange-500">{icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        <span className="text-gray-400 text-xs">{open ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      {open && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
};

const InfoRow = ({ label, value, icon }) => {
  let display = value;
  if (typeof value === "boolean") display = value ? "Yes" : "No";
  const isDateKey = label && (
    label.toLowerCase().includes("date") ||
    label.toLowerCase().includes("created") ||
    label.toLowerCase().includes("updated")
  );
  const final = isDateKey ? formatDate(display) : display;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-orange-400 mt-0.5 shrink-0 text-xs">{icon || <FaInfoCircle />}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">{label}</p>
        <p className="text-sm text-gray-700 font-medium break-words">
          {isEmpty(final)
            ? <span className="text-gray-300 italic text-xs">Not specified</span>
            : String(final)}
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   EDUCATION SECTION
══════════════════════════════════════════ */
const EducationSection = ({ flatEdu }) => {
  const qualLevel = flatEdu?.qualification_level;
  const groups = useMemo(() => buildEduGroups(flatEdu), [flatEdu]);
  return (
    <SectionCard title="Education" icon={<FaGraduationCap />}>
      <div className="p-5">
        {qualLevel && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-orange-50 rounded-xl border border-orange-100">
            <FaGraduationCap className="text-orange-500 shrink-0" />
            <span className="text-sm text-gray-600">
              Highest Qualification:{" "}
              <strong className="text-orange-600">{prettyKey(qualLevel)}</strong>
            </span>
          </div>
        )}
        {groups.length === 0 && (
          <p className="text-gray-400 text-sm italic">No education data available</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {groups.map((g, i) => (
            <div key={i} className={`rounded-xl border ${g.bg} ${g.border} p-4`}>
              <div className={`flex items-center gap-2 mb-3 text-xs font-bold ${g.text}`}>
                {g.icon} {g.label}
              </div>
              <div className="space-y-1.5">
                {g.fields.map((f) => (
                  <div key={f.key} className="flex justify-between gap-2">
                    <span className="text-xs text-gray-500">{f.label}</span>
                    <span className="text-xs font-semibold text-gray-700 text-right">
                      {isEmpty(f.value) ? "—" : String(f.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

/* ══════════════════════════════════════════
   JOBS PANEL
══════════════════════════════════════════ */
const JobsPanel = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileRequired, setProfileRequired] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const today = useMemo(() => new Date(), []);

  const normRange = useCallback((f, t) => {
    if (!f || !t) return { from: f || "", to: t || "" };
    return f > t ? { from: t, to: f } : { from: f, to: t };
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true); setError(""); setProfileRequired(false);
        const { from, to } = normRange(appliedFrom, appliedTo);
        const res = await axios.get(`${API_BASE}/job-posts-assigned/my-assigned`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          params: { ...(from ? { from_date: from } : {}), ...(to ? { to_date: to } : {}) },
        });
        if (res.data?.status === true) {
          setJobs(res.data?.assigned_job_posts?.data || []);
        } else {
          const msg = res.data?.message || "Failed to load jobs";
          if (msg === "Education profile not found") setProfileRequired(true);
          else setError(msg);
          setJobs([]);
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Unable to fetch jobs");
        setJobs([]);
      } finally { setLoading(false); }
    })();
  }, [token, appliedFrom, appliedTo, normRange]);

  const filtered = useMemo(() =>
    jobs.slice()
      .sort((a, b) => new Date(b.application_deadline) - new Date(a.application_deadline))
      .filter((j) => {
        const d = parseDate(j.application_deadline);
        const exp = d ? d < today : false;
        const sm =
          status === "all" ||
          (status === "current" && !exp) ||
          (status === "expired" && exp);
        const q = search.trim().toLowerCase();
        const tm =
          !q ||
          (j?.title || "").toLowerCase().includes(q) ||
          (j?.jobsource?.site_name || "").toLowerCase().includes(q) ||
          (j?.jobsource?.category?.name || "").toLowerCase().includes(q);
        return sm && tm;
      }),
    [jobs, search, status, today]
  );

  const stats = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter(j => { const d = parseDate(j.application_deadline); return d && d >= today; }).length,
    expired: jobs.filter(j => { const d = parseDate(j.application_deadline); return d && d < today; }).length,
  }), [jobs, today]);

  const clearAll = () => {
    setSearch(""); setStatus("all");
    setFromDate(""); setToDate("");
    setAppliedFrom(""); setAppliedTo("");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
      <p className="text-gray-500 text-sm">Finding eligible jobs…</p>
    </div>
  );
  if (profileRequired) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400 text-3xl">
        <RiGovernmentFill />
      </div>
      <h3 className="font-bold text-gray-800 text-lg">Complete Your Profile First</h3>
      <p className="text-gray-500 text-sm max-w-xs">Add education details to unlock personalized job matches.</p>
      <button
        onClick={() => navigate("/user-profile-filling")}
        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
      >
        Complete Profile <FaChevronRight size={10} />
      </button>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="text-gray-200 text-5xl"><FaBriefcase /></div>
      <p className="text-gray-500 font-medium">{error}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",  val: stats.total,   cls: "bg-[#1e2a4a] text-white" },
          { label: "Live",   val: stats.active,  cls: "bg-orange-500 text-white", dot: true },
          { label: "Closed", val: stats.expired, cls: "bg-white border border-gray-200 text-gray-700" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.cls}`}>
            <div className="text-2xl font-black">{s.val}</div>
            <div className="text-xs font-semibold mt-0.5 flex items-center justify-center gap-1">
              {s.dot && <FaFire className="text-yellow-300" size={10} />}
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <input
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Search title, org, category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FaTimes size={11} />
              </button>
            )}
          </div>
          <select
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="current">Live Only</option>
            <option value="expired">Closed Only</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input type="date" className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <span className="text-gray-400 text-xs font-medium">→</span>
          <input type="date" className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={toDate} onChange={e => setToDate(e.target.value)} />
          <button
            onClick={() => { const { from, to } = normRange(fromDate, toDate); setAppliedFrom(from); setAppliedTo(to); }}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
          >Apply</button>
          <button
            onClick={clearAll}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
          ><FaTimes size={9} /> Clear</button>
          <div className="ml-auto flex gap-1">
            {[["cards","⊞"],["table","☰"]].map(([m,ic]) => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${viewMode === m ? "bg-[#1e2a4a] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 font-medium">{filtered.length} jobs found</p>
      </div>

      {/* Cards view */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 gap-3">
          {filtered.length ? filtered.map((job) => {
            const dObj = parseDate(job.application_deadline);
            const isExp = dObj ? dObj < today : false;
            const dl = daysLeft(job.application_deadline);
            const urgent = dl !== null && dl >= 0 && dl <= 5;
            return (
              <div key={job.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${isExp ? "border-gray-200" : urgent ? "border-orange-300" : "border-gray-100"}`}>
                <div className={`h-1 ${isExp ? "bg-gray-200" : urgent ? "bg-orange-400" : "bg-[#1e2a4a]"}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{titleCase(job.job_type) || "Job"}</span>
                      {urgent && !isExp && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                          <FaFire size={9} />{dl}d left
                        </span>
                      )}
                      {isExp
                        ? <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-medium">Closed</span>
                        : <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Live</span>}
                    </div>
                    <button onClick={() => setSelectedJob(job)} className="text-xs text-orange-500 font-bold hover:underline shrink-0">
                      Details
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-3 leading-snug">{titleCase(job.title)}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                    {[
                      { icon: <FaBuilding size={10} />, val: titleCase(job?.jobsource?.site_name) },
                      { icon: <FaTag size={10} />, val: titleCase(job?.jobsource?.category?.name) },
                      { icon: <FaGraduationCap size={10} />, val: job.qualifications },
                      { icon: <span className="text-[10px]">👥</span>, val: job.no_of_posts ? `Posts: ${job.no_of_posts}` : null },
                      { icon: <span className="text-[10px]">🎂</span>, val: job.age ? `Age: ${job.age} yrs` : null },
                    ].filter(i => i.val).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="text-gray-400 shrink-0">{item.icon}</span>
                        <span className="truncate">{item.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="text-xs text-gray-400">
                      Posted {fmtDate2(job.posted_date)} ·{" "}
                      <span className={isExp ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                        Deadline {fmtDate2(job.application_deadline)}
                      </span>
                    </div>
                    {!isExp && job.apply_link ? (
                      <a href={job.apply_link} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors">
                        Apply <FaExternalLinkAlt size={9} />
                      </a>
                    ) : isExp ? (
                      <span className="text-xs text-gray-400 italic">Closed</span>
                    ) : (
                      <span className="text-xs text-gray-400">No link</span>
                    )}
                  </div>
                  {job.comments && (
                    <div className="mt-2.5 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                      💬 {titleCase(job.comments)}
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center py-20 gap-4 text-center bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-200 text-6xl"><RiGovernmentFill /></div>
              <p className="font-bold text-gray-400">No Jobs Found</p>
              <button onClick={clearAll} className="text-xs text-orange-500 font-semibold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1e2a4a] text-white">
                {["Title","Org","Category","Qualification","Posted","Deadline","Age","Status","Apply"].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(job => {
                const dObj = parseDate(job.application_deadline);
                const isExp = dObj ? dObj < today : false;
                return (
                  <tr key={job.id} className={`hover:bg-gray-50 transition-colors ${isExp ? "opacity-60" : ""}`}>
                    <td className="px-3 py-3 max-w-[160px]">
                      <div className="font-semibold text-gray-800 truncate">{titleCase(job.title)}</div>
                      <button onClick={() => setSelectedJob(job)} className="text-orange-500 text-[10px] hover:underline">View</button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{titleCase(job?.jobsource?.site_name)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{titleCase(job?.jobsource?.category?.name)}</td>
                    <td className="px-3 py-3 max-w-[120px] truncate">{safe(job.qualifications)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{fmtDate2(job.posted_date)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${isExp ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                        {fmtDate2(job.application_deadline)}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{safe(job.age ? job.age + " yrs" : "N/A")}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${isExp ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                        {isExp ? "Closed" : "Live"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {!isExp && job.apply_link ? (
                        <a href={job.apply_link} target="_blank" rel="noreferrer"
                          className="text-orange-500 font-bold flex items-center gap-1 hover:underline whitespace-nowrap">
                          Apply <FaExternalLinkAlt size={9} />
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && <div className="py-12 text-center text-gray-400 text-sm">No jobs found</div>}
        </div>
      )}

      {/* Job detail modal */}
      {selectedJob && (() => {
        const dObj = parseDate(selectedJob.application_deadline);
        const isExp = dObj ? dObj < today : false;
        const dl = daysLeft(selectedJob.application_deadline);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className={`h-1.5 ${isExp ? "bg-gray-200" : "bg-orange-500"}`} />
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{titleCase(selectedJob.job_type) || "Job"}</span>
                  {isExp
                    ? <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full">Closed</span>
                    : <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Live</span>}
                  {dl !== null && dl >= 0 && dl <= 5 && !isExp && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaFire size={9} />{dl}d
                    </span>
                  )}
                </div>
                <button onClick={() => setSelectedJob(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                  <FaTimes size={13} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                <h2 className="text-xl font-black text-gray-800 mb-5 leading-snug">{titleCase(selectedJob.title)}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Organization",  val: titleCase(selectedJob?.jobsource?.site_name) || "—", icon: <FaBuilding /> },
                    { label: "Category",      val: titleCase(selectedJob?.jobsource?.category?.name) || "—", icon: <FaTag /> },
                    { label: "Qualification", val: safe(selectedJob.qualifications), icon: <FaGraduationCap /> },
                    { label: "Age Limit",     val: safe(selectedJob.age ? selectedJob.age + " years" : "N/A"), icon: <span>🎂</span> },
                    { label: "No. of Posts",  val: safe(selectedJob.no_of_posts), icon: <span>👥</span> },
                    { label: "Posted",        val: fmtDate2(selectedJob.posted_date), icon: <FaCalendarAlt /> },
                    { label: "Deadline",      val: fmtDate2(selectedJob.application_deadline), icon: <FaClock />, accent: isExp ? "text-red-500" : "text-green-600" },
                    { label: "Job Type",      val: titleCase(selectedJob.job_type), icon: <FaBriefcase /> },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">{item.icon} {item.label}</p>
                      <p className={`text-sm font-bold ${item.accent || "text-gray-800"}`}>{item.val}</p>
                      {item.label === "Deadline" && dl !== null && !isExp && (
                        <p className="text-xs text-green-500 mt-0.5">{dl} days remaining</p>
                      )}
                    </div>
                  ))}
                </div>
                {selectedJob.comments && (
                  <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700">
                    💬 {titleCase(selectedJob.comments)}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setSelectedJob(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                  Close
                </button>
                {!isExp && selectedJob.apply_link ? (
                  <a href={selectedJob.apply_link} target="_blank" rel="noreferrer"
                    className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2 transition-colors">
                    Apply Now <FaExternalLinkAlt size={11} />
                  </a>
                ) : isExp ? (
                  <div className="flex-1 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold text-center">
                    Applications Closed
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

/* ══════════════════════════════════════════
   ANNOUNCEMENTS PANEL
══════════════════════════════════════════ */
const AnnouncementsPanel = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sel, setSel] = useState(null);

  const fmtEvtDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };
  const fmtEvtTime = (t) => {
    if (!t) return "";
    return new Date(`1970-01-01T${t}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const fmtHTML = (html) => {
    if (!html) return "";
    return DOMPurify.sanitize(html, { ADD_ATTR: ["target","rel"] })
      .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await axios.get(`${API_BASE}/marketing-events/my-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.status) setEvents(res.data.events || []);
        else setError("No events found");
      } catch { setError("Failed to load events"); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const active = events.filter(e => e.is_active);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
    </div>
  );
  if (error) return <div className="text-center py-16 text-gray-400">{error}</div>;
  if (!active.length) return (
    <div className="flex flex-col items-center py-20 gap-3">
      <div className="text-5xl">🔔</div>
      <p className="text-gray-500 font-medium">No announcements yet</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {active.map(e => (
        <div key={e.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
          <div className="h-1 bg-orange-400" />
          <div className="p-5 flex items-start gap-4">
            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 text-xl shrink-0">
              <FaBell />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-sm mb-1 leading-snug">{e.event_title || "Announcement"}</h4>
              <p className="text-xs text-gray-400 mb-3">
                📅 {fmtEvtDate(e.event_date || e.created_at)}
                {e.event_time && ` · ⏰ ${fmtEvtTime(e.event_time)}`}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setSel(e)}
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors">
                  Read More
                </button>
                {e.event_link && (
                  <a href={e.event_link} target="_blank" rel="noreferrer"
                    className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors">
                    Join Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSel(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="h-1.5 bg-orange-400" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="font-bold text-gray-800 text-lg">Announcement</span>
              <button onClick={() => setSel(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                <FaTimes size={13} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <h3 className="text-xl font-black text-gray-800">{sel.event_title}</h3>
              <p className="text-sm text-gray-400">
                📅 {fmtEvtDate(sel.event_date || sel.created_at)}
                {sel.event_time && ` · ⏰ ${fmtEvtTime(sel.event_time)}`}
              </p>
              {sel.event_link && (
                <a href={sel.event_link} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors">
                  Join Now ✅
                </a>
              )}
              <div className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fmtHTML(sel.marketing_info) }} />
              {sel.event_link && (
                <a href={sel.event_link} target="_blank" rel="noreferrer"
                  className="block text-center py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors">
                  Open Link
                </a>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setSel(null)}
                className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   MEDIA PANEL
══════════════════════════════════════════ */
const MediaPanel = ({ profile }) => {
  const list = useMemo(() => {
    const l = profile?.media || profile?.documents || profile?.files || profile?.uploads || profile?.attachments || [];
    return Array.isArray(l) ? l : [];
  }, [profile]);

  const guessIcon = (item) => {
    const s = `${(item?.name || item?.file_name || item?.title || "")} ${(item?.url || item?.path || item?.link || "")}`.toLowerCase();
    if (s.includes(".pdf")) return <FaFilePdf className="text-red-500 text-xl" />;
    if (s.includes(".doc")) return <FaFileWord className="text-blue-500 text-xl" />;
    if (s.includes(".png") || s.includes(".jpg") || s.includes(".jpeg") || s.includes(".webp"))
      return <FaImage className="text-green-500 text-xl" />;
    return <FaFileAlt className="text-gray-400 text-xl" />;
  };

  if (!list.length) return (
    <div className="flex flex-col items-center py-20 gap-3">
      <div className="text-5xl">📁</div>
      <p className="text-gray-500 font-medium">No media uploaded</p>
      <p className="text-xs text-gray-400">Documents and files will appear here</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {list.map((item, idx) => {
        const url = item?.url || item?.link || item?.path || "";
        const title = item?.name || item?.file_name || item?.title || `Media ${idx + 1}`;
        const sub = item?.type || item?.mime_type || item?.category || "File";
        return (
          <div key={item?.id || idx} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center">
                {guessIcon(item)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 truncate">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold rounded-xl transition-colors">
                Open <FaExternalLinkAlt size={9} />
              </a>
            ) : (
              <div className="w-full py-2 bg-gray-50 text-gray-400 text-xs text-center rounded-xl">No URL</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════
   PROFILE PANEL
══════════════════════════════════════════ */
const ProfilePanel = ({ profile, age, sections }) => {
  const HIDE = new Set(["id","role_id","token","password"]);
  return (
    <div>
      {sections.map((sec, idx) => {
        if (sec.isEducation) return <EducationSection key={idx} flatEdu={sec.data} />;

        if (sec.isArray && Array.isArray(sec.data)) {
          return (
            <SectionCard key={idx} title={sec.title} icon={sec.icon} defaultOpen={false}>
              <div className="p-5 space-y-3">
                {sec.data.map((item, i) => {
                  if (typeof item !== "object") return (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-orange-400 mt-0.5">•</span>{String(item)}
                    </div>
                  );
                  const cleaned = Object.entries(item || {}).filter(([k, v]) => !HIDE.has(k) && !isEmpty(v));
                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-1">
                      {cleaned.map(([k, v]) => <InfoRow key={k} label={prettyKey(k)} value={v} />)}
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          );
        }

        const entries = Object.entries(sec.data || {}).filter(([k]) => !HIDE.has(k));
        if (!entries.length) return null;
        return (
          <SectionCard key={idx} title={sec.title} icon={sec.icon}>
            <div className="px-5 py-3">
              {entries.map(([k, v]) => {
                let icon = <FaInfoCircle />;
                if (k === "email") icon = <FaEnvelope />;
                else if (k === "phone") icon = <FaPhone />;
                else if (k === "date_of_birth") icon = <FaBirthdayCake />;
                else if (k === "gender") icon = <FaVenusMars />;
                else if (k.toLowerCase().includes("location") || k === "state" || k === "district") icon = <FaMapMarkerAlt />;
                else if (k.toLowerCase().includes("job")) icon = <FaBriefcase />;
                else if (k.toLowerCase().includes("cert")) icon = <FaCertificate />;
                const showVal = (k.includes("created_at") || k.includes("updated_at") || k === "date_of_birth")
                  ? formatDate(v) : v;
                return <InfoRow key={k} label={prettyKey(k)} value={showVal} icon={icon} />;
              })}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════ */
const UserProfile = () => {
    const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* fetch profile */
  useEffect(() => {
    if (!token) { setLoading(false); setError("Authentication required"); return; }
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data?.status) throw new Error(res.data?.message || "Failed to fetch profile");
        const d = res.data?.data || {};
        setProfile({
          ...d,
          notify: normBool(d.notify),
          alert_job: normBool(d.alert_job),
          alert_internship: normBool(d.alert_internship),
          alert_both: normBool(d.alert_both),
          qualified_teacher_exam: normBool(d.qualified_teacher_exam),
          education: flattenEdu(d.education),
          subscription: d.subscription || null,
          all_subscriptions: Array.isArray(d.all_subscriptions) ? d.all_subscriptions : [],
          media: d.media || d.documents || d.files || [],
        });
        setAge(calcAge(d.date_of_birth));
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || "Error fetching profile";
        setError(msg); toast.error(msg);
        if (e?.response?.status === 401) logout();
      } finally { setLoading(false); }
    })();
  }, [token, logout]);

  const profileCompletion = useMemo(() => calculateProfileCompletion(profile), [profile]);

  useEffect(() => {
    if (loading || !profile) return;
    if (isEmpty((profile.education || {}).qualification_level)) {
      const t = setTimeout(() => navigate("/user-profile-filling"), 120000);
      return () => clearTimeout(t);
    }
  }, [loading, profile, navigate]);

  const sections = useMemo(() => {
    if (!profile) return [];
    const c = { ...profile }; delete c.token; delete c.password;
    return buildSections(c, age);
  }, [profile, age]);

  const handleLogout = () => {
    toast.warning(
      <div>
        <p className="font-semibold mb-3 text-gray-800">Sure you want to logout?</p>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-bold"
            onClick={() => { toast.dismiss(); logout(); }}>Yes, Logout</button>
          <button className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold"
            onClick={() => toast.dismiss()}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeButton: false, draggable: false, closeOnClick: false }
    );
  };

  if (loading) return <Spinner />;

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400 text-3xl">
          <FaTimes />
        </div>
        <h3 className="font-black text-gray-800 mb-2 text-lg">Something went wrong</h3>
        <p className="text-gray-500 text-sm mb-5">{error}</p>
        {error === "Authentication required"
          ? <a href="/signin" className="inline-block px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors">Sign In</a>
          : <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors">Try Again</button>}
      </div>
    </div>
  );

  if (!profile) return null;

  const edu = profile.education || {};
  const subStatus = normSubStatus(profile.subscription?.status);

  /* Nav config */
  const navItems = [
    { id: "profile",       label: "User Profile",      icon: <FaUser size={14} /> },
    { id: "jobs",          label: "Job Notifications",  icon: <RiGovernmentFill size={14} /> },
    { id: "announcements", label: "Announcements",      icon: <FaBell size={14} /> },
    { id: "media",         label: "Media",              icon: <FaImage size={14} /> },
    { id: "settings",      label: "Settings",           icon: <FaCog size={14} /> },
  ];

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex overflow-hidden">

      {/* ════════════════════════════════
          LEFT SIDEBAR — dark navy
      ════════════════════════════════ */}
      <aside className="w-64 min-h-screen bg-[#1e2a4a] flex flex-col shrink-0 hidden md:flex sticky top-10 h-[calc(100vh-40px)]">

        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
              C
            </div>
            <span className="text-white font-black text-sm tracking-widest uppercase">Career Mitra</span>
          </div>
        </div>

        {/* Avatar card */}
        <div className="mx-4 mt-5 mb-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-3 text-white text-3xl">
            <FaUser />
          </div>
          <p className="text-white font-bold text-sm truncate">{profile.name || "User"}</p>
          <p className="text-white/50 text-xs truncate mt-0.5">{profile.email}</p>
          {profile.subscription?.plan_name && (
            <span className="inline-flex items-center gap-1 mt-2 text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full font-bold">
              <FaStar size={9} /> {profile.subscription.plan_name}
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === item.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg">
            <FaSignOutAlt size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════
          RIGHT MAIN AREA
      ════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-10 z-10 shadow-sm">
          <div>
            <h1 className="font-black text-gray-800 text-base leading-tight">
              {navItems.find(n => n.id === activeTab)?.label || ""}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {activeTab === "profile"       && "Your personal information & qualifications"}
              {activeTab === "jobs"          && "Government job opportunities matched for you"}
              {activeTab === "announcements" && "Latest events and announcements"}
              {activeTab === "settings"      && "Manage your account settings"}
              {activeTab === "media"         && "Uploaded documents and files"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress pill */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: `${profileCompletion}%` }} />
              </div>
              <span className="text-xs font-black text-gray-600">{profileCompletion}%</span>
            </div>
            {profileCompletion === 100 && (
              <button onClick={() => navigate("/user-profile-filling")}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e2a4a] hover:bg-[#263660] text-white rounded-xl text-xs font-bold transition-colors">
                <FaEdit size={11} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto mt-6 p-5">

          {/* Mobile tabs */}
          <div className="md:hidden flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 gap-1 mb-5 overflow-x-auto">
            {navItems.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 min-w-[60px] flex flex-col items-center py-2.5 px-1 rounded-xl text-[10px] font-bold transition-all gap-1 ${
                  activeTab === t.id ? "bg-[#1e2a4a] text-white" : "text-gray-400 hover:bg-gray-50"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Incomplete profile banner */}
          {profileCompletion < 100 && activeTab === "profile" && (
            <div className="mb-4 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                  <FaInfoCircle />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Profile Incomplete</p>
                  <p className="text-xs text-gray-500">Add education details to get personalised job matches</p>
                </div>
              </div>
              <button onClick={() => navigate("/user-profile-filling")}
                className="shrink-0 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                Complete <FaChevronRight size={9} />
              </button>
            </div>
          )}

          {/* Profile tab – quick summary cards */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {/* Quick info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <FaUser className="text-orange-400" /> Quick Info
                </p>
                <p className="font-black text-gray-800 text-base truncate">{profile.name || "—"}</p>
                <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                {age && <p className="text-xs text-gray-500 mt-1">{age} yrs · {profile.gender || ""}</p>}
                {profile.current_location && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FaMapMarkerAlt size={9} className="text-orange-400" />{profile.current_location}
                  </p>
                )}
              </div>

              {/* Subscription */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <FaLayerGroup className="text-orange-400" /> Subscription
                </p>
                {profile.subscription?.plan_name ? (
                  <>
                    <p className="font-black text-gray-800 text-base">{profile.subscription.plan_name}</p>
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold mt-1 ${
                      subStatus === "Active" ? "bg-green-100 text-green-700" :
                      subStatus === "Expired" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                    }`}>{subStatus}</span>
                    {profile.subscription.end_date && (
                      <p className="text-xs text-gray-400 mt-1.5">Until {formatDate(profile.subscription.end_date)}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">No active plan</p>
                )}
              </div>

              {/* Job alerts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <FaBell className="text-orange-400" /> Job Alerts
                </p>
                <p className="font-semibold text-gray-700 text-sm mb-2">{getAlertType(profile)}</p>
                {[
                  { label: "Job Alerts",        active: normBool(profile.alert_job) || normBool(profile.alert_both) },
                  { label: "Internship Alerts",  active: normBool(profile.alert_internship) || normBool(profile.alert_both) },
                ].map(a => (
                  <div key={a.label} className="flex items-center justify-between text-xs py-1">
                    <span className="text-gray-500">{a.label}</span>
                    <span className={a.active ? "text-green-500" : "text-gray-300"}>
                      {a.active ? <FaCheckCircle /> : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab views ── */}
          {activeTab === "profile"       && <ProfilePanel profile={profile} age={age} sections={sections} />}
          {activeTab === "jobs"          && <JobsPanel token={token} />}
          {activeTab === "announcements" && <AnnouncementsPanel token={token} />}
          {activeTab === "media"         && <MediaPanel profile={profile} />}
          {activeTab === "settings"      && (
            <div className="max-w-xl space-y-4">
              {/* Account actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <FaUserCog className="text-orange-500" />
                  <span className="font-bold text-gray-800">Account Settings</span>
                </div>
                <div className="p-4 space-y-2">
                  <button onClick={() => navigate("/user-profile-filling")}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                        <FaEdit size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">Edit Profile</p>
                        <p className="text-xs text-gray-400">Update your personal & education info</p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-300 group-hover:text-orange-400 transition-colors" size={12} />
                  </button>
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
                        <FaSignOutAlt size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">Logout</p>
                        <p className="text-xs text-gray-400">Sign out of your account</p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-300 group-hover:text-red-400 transition-colors" size={12} />
                  </button>
                </div>
              </div>

              {/* Account details card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account Details</p>
                {[
                  { label: "Email",       val: profile.email,              icon: <FaEnvelope /> },
                  { label: "Phone",       val: profile.phone,              icon: <FaPhone /> },
                  { label: "Member Since",val: formatDate(profile.created_at), icon: <FaCalendarAlt /> },
                ].map(item => !isEmpty(item.val) && (
                  <InfoRow key={item.label} label={item.label} value={item.val} icon={item.icon} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;