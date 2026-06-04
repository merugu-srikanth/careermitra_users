import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import DOMPurify from "dompurify";
import SEO from "../components/SEO";
import { API_BASE_URL, API_ENDPOINTS, getApiMessage, isApiSuccess } from "../utils/api";
import { calculateProfileCompletion } from "../utils/profileCompletion";

/* ═══════════════════════════════════════════════
   INLINE SVG ICONS  (no external icon library)
═══════════════════════════════════════════════ */
const Ic = {
  User: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>,
  Email: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /></svg>,
  Phone: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /></svg>,
  Cake: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c1.1 0 2-.9 2-2 0-.4-.1-.7-.3-1L12 0l-1.7 3c-.2.3-.3.6-.3 1 0 1.1.9 2 2 2zm4.6 9.7-1.1-1.1-1.1 1.1c-.8.8-2.1.8-2.8 0l-1.1-1.1-1.1 1.1c-.4.4-.9.6-1.4.6-.4 0-.8-.1-1.1-.3V21c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-5.9c-.3.2-.7.3-1.1.3-.5 0-1-.2-1.3-.6zM21 9H3c-.6 0-1 .4-1 1v3c0 1.1.9 2 2 2 .5 0 1-.2 1.4-.6l1.1-1.1 1.1 1.1c.8.8 2 .8 2.8 0l1.1-1.1 1.1 1.1c.4.4.9.6 1.4.6s1-.2 1.4-.6l1.1-1.1 1.1 1.1c.4.4.9.6 1.4.6 1.1 0 2-.9 2-2v-3c0-.6-.4-1-1-1z" /></svg>,
  Gender: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9s3.1 7 7 7c.3 0 .5 0 .8-.1V18H11v2h1.8v2h2v-2H16v-2h-1.2v-2.1c.3 0 .5.1.8.1 3.9 0 7-3.1 7-7S15.9 2 12 2zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" /></svg>,
  Pin: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" /></svg>,
  Bell: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4c0-.8-.7-1.5-1.5-1.5S10.5 3.2 10.5 4v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>,
  Logout: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.4 1.4L18.2 11H9v2h9.2l-2.6 2.6L17 17l5-5-5-5zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z" /></svg>,
  Edit: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>,
  ChevR: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.6 7.4 13.2 12l-4.6 4.6L10 18l6-6-6-6z" /></svg>,
  ChevD: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M7.4 8.6L12 13.2l4.6-4.6L18 10l-6 6-6-6 1.4-1.4z" /></svg>,
  ChevU: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M7.4 15.4L12 10.8l4.6 4.6L18 14l-6-6-6 6 1.4 1.4z" /></svg>,
  Info: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>,
  Bag: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.2c.1-.3.2-.6.2-1 0-1.7-1.3-3-3-3h-6C7.3 2 6 3.3 6 5c0 .4.1.7.2 1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v1H9V5zm11 14H4V8h16v11z" /></svg>,
  Cert: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4zm0 4l5 2.2V11c0 3.5-2.3 6.8-5 7.9-2.7-1.1-5-4.4-5-7.9V7.2L12 5z" /></svg>,
  Grad: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.2V17l7 4 7-4v-3.8L12 17l-7-3.8zM12 3L1 9l11 6 9-4.9V17h2V9L12 3z" /></svg>,
  Cog: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M19.1 12.9c0-.3.1-.6.1-.9s0-.6-.1-.9l2-1.6c.2-.2.2-.4.1-.6l-1.9-3.2c-.1-.2-.4-.3-.6-.2l-2.4 1c-.5-.4-1-.7-1.6-.9l-.4-2.5c0-.2-.3-.4-.5-.4h-3.8c-.2 0-.5.2-.5.4l-.4 2.5c-.6.2-1.1.5-1.6.9l-2.4-1c-.2-.1-.5 0-.6.2l-1.9 3.2c-.1.2-.1.5.1.6l2 1.6c0 .3-.1.6-.1.9s0 .6.1.9L2.9 14.5c-.2.2-.2.4-.1.6l1.9 3.2c.1.2.4.3.6.2l2.4-1c.5.4 1 .7 1.6.9l.4 2.5c.1.2.3.4.5.4h3.8c.2 0 .5-.2.5-.4l.4-2.5c.6-.2 1.1-.5 1.6-.9l2.4 1c.2.1.5 0 .6-.2l1.9-3.2c.1-.2.1-.5-.1-.6l-1.8-1.6zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" /></svg>,
  Search: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z" /></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4z" /></svg>,
  Clock: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>,
  Cal: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" /></svg>,
  Bld: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>,
  Tag: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" /></svg>,
  Ext: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7z" /></svg>,
  Star: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.3l-5.2 3.1 1.4-5.9L3.6 10l6-.5L12 4l2.4 5.5 6 .5-4.6 4.5 1.4 5.9z" /></svg>,
  Layers: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" /></svg>,
  Img: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>,
  File: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>,
  Gov: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 8v2h20V8L12 3zm-7 7v8H3v2h18v-2h-2v-8h-2v8h-4v-8h-2v8H7v-8H5zm7-3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" /></svg>,
  Lock: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" /></svg>,
  Eye: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" /></svg>,
  EyeOff: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.8 0 5 2.2 5 5 0 .6-.1 1.2-.4 1.8l2.9 2.9c1.5-1.3 2.7-3 3.4-4.7C21.3 7.6 17 4.5 12 4.5c-1.3 0-2.6.3-3.8.7l2.1 2.1c.6-.2 1.1-.3 1.7-.3zM2 4.3l2.3 2.3.4.4C3.1 8.3 1.8 10.1 1 12c1.7 4.4 6 7.5 11 7.5 1.5 0 3-.3 4.3-.8l.4.4 2.7 2.7 1.2-1.2L3.2 3 2 4.3zm5.5 5.5l1.5 1.5c-.1.3-.1.5-.1.7 0 1.7 1.3 3 3 3 .2 0 .5 0 .7-.1l1.5 1.5c-.7.3-1.4.5-2.2.5-2.8 0-5-2.2-5-5 0-.8.2-1.5.6-2.1z" /></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>,
  Alert: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>,
};

const cx = (...a) => a.filter(Boolean).join(" ");

/* ═══════════════ CONSTANTS ═══════════════ */
const API_BASE = API_BASE_URL;
const TAB_IDS = ["profile", "jobs", "announcements", "media", "settings"];

/* ═══════════════ UTILS ═══════════════ */
const isEV = (v) => {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (Array.isArray(v) && (v.length === 0 || v.every(i => i === null || i === undefined || i === ""))) return true;
  if (typeof v === "object" && !Array.isArray(v)) return Object.keys(v).length === 0;
  return false;
};
const prettyKey = (k) => !k ? "" : String(k).replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim().replace(/\b\w/g, c => c.toUpperCase());
const fmtDate = (s) => { if (!s) return ""; const d = new Date(s); if (isNaN(d)) return String(s); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`; };
const calcAge = (dob) => { if (!dob) return ""; const b = new Date(dob); if (isNaN(b)) return ""; const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() - b.getMonth() < 0 || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
const normBool = (v) => v === true || v === 1 || v === "1" || v === "true";
const fmtINR = (n) => { if (n === null || n === undefined || n === "") return ""; const num = Number(n); if (isNaN(num)) return String(n); return `₹${num.toLocaleString("en-IN")}`; };
const normSubStatus = (s) => { if (!s) return "Not specified"; const v = String(s).toLowerCase(); if (v === "success" || v === "active") return "Active"; if (v === "failed") return "Failed"; if (v === "pending") return "Pending"; if (v === "expired") return "Expired"; return s; };
const getAlertType = (p) => { if (!p) return "Not specified"; if (normBool(p.alert_both)) return "Both Job & Internship"; if (normBool(p.alert_job)) return "Government Jobs"; if (normBool(p.alert_internship)) return "Government Internships"; return "Not specified"; };
const toTC = (t) => { if (!t) return ""; return t.toString().toLowerCase().split(" ").filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" "); };
const parseDate = (d) => { if (!d) return null; if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y, m, day] = d.split("-").map(Number); const dt = new Date(y, m - 1, day); return isNaN(dt) ? null : dt; } const dt = new Date(d); return isNaN(dt) ? null : dt; };
const fmtDate2 = (d) => { const dt = parseDate(d); if (!dt) return "—"; return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };
const daysLeft = (d) => { const dt = parseDate(d); if (!dt) return null; return Math.ceil((dt - new Date()) / 86400000); };
const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const toDateOrNull = (d) => {
  const dt = parseDate(d);
  return dt && !isNaN(dt) ? dt : null;
};

/* ═══════════════ EDUCATION ═══════════════ */
const flattenEducation = (edu) => {
  if (!edu) return {};
  const first = (...vals) => vals.find((v) => v !== undefined && v !== null);
  const gradSubjects = Array.isArray(edu.graduation?.subjects)
    ? edu.graduation.subjects
    : [edu.graduation_subject1, edu.graduation_subject2, edu.graduation_subject3];
  const pgSubjects = Array.isArray(edu.post_graduation?.subjects)
    ? edu.post_graduation.subjects
    : [edu.pg_subject1, edu.pg_subject2, edu.pg_subject3];
  const secondGradSubjects = Array.isArray(edu.second_graduation?.subjects)
    ? edu.second_graduation.subjects
    : [edu.second_graduation_subject1, edu.second_graduation_subject2, edu.second_graduation_subject3];
  const secondPgSubjects = Array.isArray(edu.second_post_graduation?.subjects)
    ? edu.second_post_graduation.subjects
    : [edu.second_pg_subject1, edu.second_pg_subject2, edu.second_pg_subject3];

  const out = {
    qualification_level: edu.qualification_level,
    below10th_details: first(edu.below10th?.details, edu.below10th_details), below10th_school_name: first(edu.below10th?.school_name, edu.below10th_schoolname),
    tenth_board: first(edu.tenth?.board, edu["10th_board"], edu.tenth_board), tenth_school_name: first(edu.tenth?.school_name, edu["10th_schoolname"], edu.tenth_schoolname),
    intermediate_course: first(edu.intermediate?.course, edu.intermediate_course), intermediate_course_other: first(edu.intermediate?.course_other, edu.intermediate_course_other),
    intermediate_board: first(edu.intermediate?.board, edu.intermediate_board), intermediate_vocational_subject: first(edu.intermediate?.vocational_subject, edu.intermediate_vocational_subject),
    intermediate_college_name: first(edu.intermediate?.college_name, edu.intermediate_college_name),
    iti_trade: first(edu.iti?.trade, edu.iti_trade), iti_trade_other: first(edu.iti?.trade_other, edu.iti_trade_other),
    iti_college_name: first(edu.iti?.college_name, edu.iti_college_name), iti_current_year: first(edu.iti?.current_year, edu.iti_current_year),
    polytechnic_branch: first(edu.polytechnic?.branch, edu.polytechnic_branch), polytechnic_college_name: first(edu.polytechnic?.college_name, edu.polytechnic_college_name), polytechnic_current_year: first(edu.polytechnic?.current_year, edu.polytechnic_current_year),
    diploma_branch: first(edu.diploma?.branch, edu.diploma_branch), diploma_current_year: first(edu.diploma?.current_year, edu.diploma_current_year),
    graduation_type: first(edu.graduation?.type, edu.graduation_type), graduation_course: first(edu.graduation?.course, edu.graduation_course), graduation_course_other: first(edu.graduation?.course_other, edu.graduation_course_other),
    graduation_subject1: first(gradSubjects[0], edu.graduation_subject1),
    graduation_subject2: first(gradSubjects[1], edu.graduation_subject2),
    graduation_subject3: first(gradSubjects[2], edu.graduation_subject3),
    graduation_specialization: first(edu.graduation?.specialization, edu.graduation_specialization), graduation_college_name: first(edu.graduation?.college_name, edu.graduation_college_name),
    graduation_current_year: first(edu.graduation?.current_year, edu.graduation_current_year), graduation_qualified_in: first(edu.graduation?.qualified_in, edu.graduation_qualified_in),
    second_graduation_type: first(edu.second_graduation?.type, edu.second_graduation_type), second_graduation_course: first(edu.second_graduation?.course, edu.second_graduation_course),
    second_graduation_specialization: first(edu.second_graduation?.specialization, edu.second_graduation_specialization), second_graduation_college_name: first(edu.second_graduation?.college_name, edu.second_graduation_college_name),
    second_graduation_current_year: first(edu.second_graduation?.current_year, edu.second_graduation_current_year),
    second_graduation_subject1: first(secondGradSubjects[0], edu.second_graduation_subject1),
    second_graduation_subject2: first(secondGradSubjects[1], edu.second_graduation_subject2),
    second_graduation_subject3: first(secondGradSubjects[2], edu.second_graduation_subject3),
    post_graduation_course: first(edu.post_graduation?.course, edu.post_graduation_course), post_graduation_course_other: first(edu.post_graduation?.course_other, edu.post_graduation_course_other),
    post_graduation_specialization: first(edu.post_graduation?.specialization, edu.post_graduation_specialization),
    post_graduation_subject1: first(pgSubjects[0], edu.pg_subject1),
    post_graduation_subject2: first(pgSubjects[1], edu.pg_subject2),
    post_graduation_subject3: first(pgSubjects[2], edu.pg_subject3),
    post_graduation_college_name: first(edu.post_graduation?.college_name, edu.pg_college_name), post_graduation_current_year: first(edu.post_graduation?.current_year, edu.pg_current_year),
    second_post_graduation_course: first(edu.second_post_graduation?.course, edu.second_post_graduation_course), second_post_graduation_specialization: first(edu.second_post_graduation?.specialization, edu.second_post_graduation_specialization),
    second_post_graduation_college_name: first(edu.second_post_graduation?.college_name, edu.second_pg_college_name), second_post_graduation_current_year: first(edu.second_post_graduation?.current_year, edu.second_pg_current_year),
    second_post_graduation_subject1: first(secondPgSubjects[0], edu.second_pg_subject1),
    second_post_graduation_subject2: first(secondPgSubjects[1], edu.second_pg_subject2),
    second_post_graduation_subject3: first(secondPgSubjects[2], edu.second_pg_subject3),
    phd_research_field: first(edu.phd?.research_field, edu.phd_research_field), phd_university: first(edu.phd?.university, edu.phd_university), phd_university_name: first(edu.phd?.university_name, edu.phd_university_name), phd_current_year: first(edu.phd?.current_year, edu.phd_current_year),
    other_course_code: first(edu.other?.course_code, edu.other_course_code), other_course_full_name: first(edu.other?.course_full_name, edu.other_course_full_name),
    other_education_full_name: first(edu.other?.education_full_name, edu.other_education_full_name), other_education_current_year: first(edu.other?.current_year, edu.other_education_current_year),
  };
  Object.keys(out).forEach(k => { if (isEV(out[k])) delete out[k]; });
  return out;
};

const EDU_GROUPS = [
  { key: "below10th", label: "Below 10th", prefixes: ["below10th_"], excludePrefixes: [], badgeBg: "bg-sky-100", badgeText: "text-sky-700", dot: "bg-sky-400" },
  { key: "tenth", label: "10th Standard", prefixes: ["tenth_"], excludePrefixes: [], badgeBg: "bg-teal-100", badgeText: "text-teal-700", dot: "bg-teal-400" },
  { key: "intermediate", label: "Intermediate / 12th", prefixes: ["intermediate_"], excludePrefixes: [], badgeBg: "bg-amber-100", badgeText: "text-amber-700", dot: "bg-amber-400" },
  { key: "iti", label: "ITI", prefixes: ["iti_"], excludePrefixes: [], badgeBg: "bg-pink-100", badgeText: "text-pink-700", dot: "bg-pink-400" },
  { key: "polytechnic", label: "Polytechnic", prefixes: ["polytechnic_"], excludePrefixes: [], badgeBg: "bg-violet-100", badgeText: "text-violet-700", dot: "bg-violet-400" },
  { key: "diploma", label: "Diploma", prefixes: ["diploma_"], excludePrefixes: [], badgeBg: "bg-orange-100", badgeText: "text-orange-700", dot: "bg-orange-400" },
  { key: "graduation", label: "Graduation", prefixes: ["graduation_"], excludePrefixes: ["second_graduation_"], badgeBg: "bg-indigo-100", badgeText: "text-indigo-700", dot: "bg-indigo-400" },
  { key: "second_graduation", label: "Second Graduation", prefixes: ["second_graduation_"], excludePrefixes: [], badgeBg: "bg-fuchsia-100", badgeText: "text-fuchsia-700", dot: "bg-fuchsia-400" },
  { key: "post_graduation", label: "Post Graduation", prefixes: ["post_graduation_"], excludePrefixes: ["second_post_graduation_"], badgeBg: "bg-red-100", badgeText: "text-red-700", dot: "bg-red-400" },
  { key: "second_post_graduation", label: "Second Post Graduation", prefixes: ["second_post_graduation_"], excludePrefixes: [], badgeBg: "bg-rose-100", badgeText: "text-rose-700", dot: "bg-rose-400" },
  { key: "phd", label: "PhD / Doctorate", prefixes: ["phd_"], excludePrefixes: [], badgeBg: "bg-green-100", badgeText: "text-green-700", dot: "bg-green-400" },
  { key: "other", label: "Other Education", prefixes: ["other_"], excludePrefixes: [], badgeBg: "bg-gray-100", badgeText: "text-gray-600", dot: "bg-gray-400" },
];

const buildEduGroups = (flatEdu) => {
  if (!flatEdu || Object.keys(flatEdu).length === 0) return [];
  const assigned = new Set();
  const groups = [];
  if (flatEdu["qualification_level"]) assigned.add("qualification_level");
  EDU_GROUPS.forEach(g => {
    const fields = [];
    Object.entries(flatEdu).forEach(([k, v]) => {
      if (assigned.has(k) || isEV(v)) return;
      const match = g.prefixes.some(p => k.startsWith(p));
      const excl = g.excludePrefixes.some(ep => k.startsWith(ep));
      if (match && !excl) {
        let lbl = k;
        for (const p of g.prefixes) { if (lbl.startsWith(p)) { lbl = lbl.slice(p.length); break; } }
        fields.push({ key: k, label: prettyKey(lbl), value: v });
        assigned.add(k);
      }
    });
    if (fields.length) groups.push({ ...g, fields });
  });
  const rem = [];
  Object.entries(flatEdu).forEach(([k, v]) => { if (!assigned.has(k) && !isEV(v)) rem.push({ key: k, label: prettyKey(k), value: v }); });
  if (rem.length) groups.push({ key: "other_rem", label: "Other Details", badgeBg: "bg-gray-100", badgeText: "text-gray-600", dot: "bg-gray-400", fields: rem });
  return groups;
};

/* ═══════════════ AVATAR ═══════════════ */
const AvatarSVG = ({ size = 64 }) => (
  <div style={{ width: size, height: size }} className="rounded-2xl bg-orange-100 overflow-hidden flex items-end justify-center border-2 border-orange-200/50 shrink-0">
    <svg viewBox="0 0 64 72" style={{ width: size }} fill="none">
      <rect x="14" y="42" width="36" height="30" rx="6" fill="#2d3a6b" />
      <path d="M24 42 L32 50 L40 42" stroke="#f97316" strokeWidth="1.5" fill="none" />
      <ellipse cx="32" cy="30" rx="14" ry="16" fill="#f4a674" />
      <ellipse cx="18" cy="30" rx="3" ry="4" fill="#f4a674" />
      <ellipse cx="46" cy="30" rx="3" ry="4" fill="#f4a674" />
      <path d="M18 24 Q32 13 46 24" fill="#f97316" />
      <rect x="21" y="11" width="22" height="14" rx="4" fill="#ea580c" />
      <rect x="15" y="22" width="34" height="4" rx="2" fill="#f97316" />
      <ellipse cx="27" cy="30" rx="2.5" ry="3" fill="white" />
      <ellipse cx="37" cy="30" rx="2.5" ry="3" fill="white" />
      <ellipse cx="27.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e" />
      <ellipse cx="37.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e" />
      <path d="M27 37 Q32 41 37 37" stroke="#c0622e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

/* ═══════════════ SPINNER ═══════════════ */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-14 h-14 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
    <p className="text-orange-400 font-medium">Loading your profile…</p>
  </div>
);

/* ═══════════════ ACCORDION CARD ═══════════════ */
const AccordionCard = ({ title, icon, iconBg = "bg-orange-100", children, defaultOpen = true, badge = null }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-orange-100/80  overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={cx("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <span className="text-orange-600 w-4 h-4">{icon}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">{title}</span>
            {badge && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
          </div>
        </div>
        <div className={cx("w-6 h-6 rounded-lg flex items-center justify-center transition-all", open ? "bg-orange-100 text-orange-500" : "bg-gray-100 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-400")}>
          {open ? <Ic.ChevU className="w-3 h-3" /> : <Ic.ChevD className="w-3 h-3" />}
        </div>
      </button>
      <div className={cx("transition-all duration-300 overflow-hidden", open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0")}>
        <div className="border-t border-orange-50">{children}</div>
      </div>
    </div>
  );
};

/* ═══════════════ INFO ROW ═══════════════ */
const InfoRow = ({ label, value, icon }) => {
  let display = value;
  if (typeof value === "boolean") display = value ? "Yes" : "No";
  const isDate = label.toLowerCase().includes("date") || label.toLowerCase().includes("created") || label.toLowerCase().includes("updated");
  const final = isDate ? fmtDate(display) : display;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-orange-50/70 last:border-0">
      <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-orange-400 w-3 h-3">{icon || <Ic.Info className="w-3 h-3" />}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-slate-700 font-semibold break-words leading-relaxed">
          {isEV(final) ? <span className="text-slate-300 italic font-normal text-xs">Not specified</span> : String(final)}
        </p>
      </div>
    </div>
  );
};

/* ═══════════════ EDUCATION SECTION ═══════════════ */
const EducationSection = ({ flatEdu }) => {
  const qualLevel = flatEdu?.qualification_level;
  const groups = useMemo(() => buildEduGroups(flatEdu), [flatEdu]);
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    groups.forEach((g, i) => { init[i] = i < 3; });
    return init;
  });

  useEffect(() => {
    const init = {};
    groups.forEach((g, i) => { init[i] = true; });
    setOpenGroups(init);
  }, [groups.length]);

  const toggleGroup = (i) => setOpenGroups(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <AccordionCard title="Education" icon={<Ic.Grad className="w-4 h-4" />} badge={groups.length ? `${groups.length} levels` : null}>
      <div className="p-4">
        {qualLevel && (
          <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <Ic.Grad className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Highest Qualification</p>
              <p className="text-sm font-black text-orange-700">{prettyKey(qualLevel)}</p>
            </div>
          </div>
        )}
        {!groups.length && <p className="text-slate-400 text-sm italic py-4 text-center">No education data available</p>}

        {/* Nested accordions for each edu group */}
        <div className="space-y-2">
          {groups.map((g, i) => (
            <div key={i} className="rounded-xl border border-orange-100 overflow-hidden">
              <button
                onClick={() => toggleGroup(i)}
                className="w-full flex items-center justify-between px-4 py-3 bg-orange-50/50 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={cx("w-2 h-2 rounded-full shrink-0", g.dot || "bg-orange-400")} />
                  <span className={cx("text-xs font-bold px-2.5 py-1 rounded-full", g.badgeBg, g.badgeText)}>
                    {g.label}
                  </span>
                  <span className="text-xs text-slate-400">{g.fields.length} field{g.fields.length !== 1 ? "s" : ""}</span>
                </div>
                <span className={cx("w-5 h-5 rounded flex items-center justify-center text-slate-400 transition-transform", openGroups[i] ? "rotate-0" : "-rotate-90")}>
                  <Ic.ChevD className="w-3 h-3" />
                </span>
              </button>
              {openGroups[i] && (
                <div className="px-4 pb-3 pt-2 bg-white">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {g.fields.map(f => (
                      <div key={f.key} className="min-w-0">
                        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider truncate">{f.label}</p>
                        <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{isEV(f.value) ? "—" : String(f.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AccordionCard>
  );
};

/* ═══════════════ BUILD SECTIONS ═══════════════ */
const buildSections = (profile, age) => {
  if (!profile) return [];
  const sections = [];
  const used = new Set();
  const HIDE = new Set(["id", "role_id"]);
  const pick = (obj, keys) => { const out = {}; keys.forEach(k => { if (!obj || HIDE.has(k) || isEV(obj[k])) return; out[k] = obj[k]; used.add(k); }); return out; };
  const push = (title, icon, data, extra = {}) => { if (!data) return; const c = {}; Object.entries(data).forEach(([k, v]) => { if (!HIDE.has(k) && !isEV(v)) c[k] = v; }); if (Object.keys(c).length) sections.push({ title, icon, data: c, ...extra }); };

  const personal = pick(profile, ["name", "email", "phone", "gender", "date_of_birth", "current_status", "social_status", "additional_support"]);
  if (!isEV(profile?.date_of_birth) && age) personal.age = `${age} years`;
  push("Personal Information", <Ic.User className="w-4 h-4" />, personal);

  // used.add("subscription"); used.add("all_subscriptions");
  const sub = profile.subscription || null;
  const allSubs = Array.isArray(profile.all_subscriptions) ? profile.all_subscriptions : [];
  if (sub && typeof sub === "object") push("Subscription", <Ic.Layers className="w-4 h-4" />, { plan_name: sub.plan_name, amount: fmtINR(sub.amount), status: normSubStatus(sub.status), start_date: sub.start_date, end_date: sub.end_date });
  // else push("Subscription", <Ic.Layers className="w-4 h-4" />, { status: "Not specified" });
  if (allSubs.length) sections.push({ title: "All Subscriptions", icon: <Ic.Layers className="w-4 h-4" />, isArray: true, data: allSubs.map(s => ({ plan_name: s.plan_name, amount: fmtINR(s.amount), status: normSubStatus(s.status), start_date: s.start_date, end_date: s.end_date })) });

  used.add("education");
  sections.push({ title: "Education", icon: <Ic.Grad className="w-4 h-4" />, isEducation: true, data: profile.education || {} });

  push("Location", <Ic.Pin className="w-4 h-4" />, pick(profile, ["current_location", "state", "district"]));

  if (profile.preferences && typeof profile.preferences === "object") {
    const pd = {};
    if (Array.isArray(profile.preferences)) profile.preferences.forEach((p, i) => pd[`preference_${i + 1}`] = p);
    else Object.entries(profile.preferences).forEach(([k, v]) => { if (v && Array.isArray(v.selected) && v.selected.length) pd[k] = v.selected.join(", "); });
    if (Object.keys(pd).length) sections.push({ title: "Preferences", icon: <Ic.Bag className="w-4 h-4" />, data: pd });
    used.add("preferences");
  }

  push("Certifications & Skills", <Ic.Cert className="w-4 h-4" />, pick(profile, ["has_technical_certification", "technical_certification_details", "any_other_certification_from_board_of_education", "qualified_teacher_exam"]));
  //   push("Career & Job Alerts",<Ic.Bag className="w-4 h-4"/>,pick(profile,["how_did_you_come_across_career_mitra","highest_education_institution_type"]));
  push("Account Information", <Ic.Info className="w-4 h-4" />, pick(profile, ["created_at", "updated_at"]));

  Object.entries(profile).forEach(([k, v]) => { if (HIDE.has(k) || used.has(k) || isEV(v)) return; if (Array.isArray(v)) { used.add(k); sections.push({ title: prettyKey(k), icon: <Ic.Info className="w-4 h-4" />, isArray: true, data: v }); } });
  Object.entries(profile).forEach(([k, v]) => { if (HIDE.has(k) || used.has(k) || isEV(v)) return; if (typeof v === "object" && !Array.isArray(v)) { const c = {}; Object.entries(v).forEach(([kk, vv]) => { if (!HIDE.has(kk) && !isEV(vv)) c[kk] = vv; }); if (Object.keys(c).length) { used.add(k); sections.push({ title: prettyKey(k), icon: <Ic.Info className="w-4 h-4" />, data: c }); } } });
  return sections;
};

/* ═══════════════ SMART TWO-COLUMN LAYOUT ═══════════════ */
// Assigns sections to left/right columns smartly by content size
const splitIntoColumns = (sections) => {
  const FORCE_LEFT = new Set(["Personal Information", "Education", "All Subscriptions"]);
  const FORCE_RIGHT = new Set(["Subscription", "Location", "Certifications & Skills", "Career & Job Alerts", "Account Information"]);
  const left = [], right = [];
  sections.forEach(sec => {
    if (sec.isEducation || FORCE_LEFT.has(sec.title)) { left.push(sec); return; }
    if (FORCE_RIGHT.has(sec.title)) { right.push(sec); return; }
    // Remaining: balance by count
    if (left.length <= right.length) left.push(sec);
    else right.push(sec);
  });
  return { left, right };
};

/* ═══════════════ SECTION RENDERER ═══════════════ */
const SectionRenderer = ({ sec, idx }) => {
  const HIDE = new Set(["id", "role_id", "token", "password"]);
  if (sec.isEducation) return <EducationSection key={idx} flatEdu={sec.data} />;

  if (sec.isArray && Array.isArray(sec.data)) {
    return (
      <AccordionCard key={idx} title={sec.title} icon={sec.icon} defaultOpen={false}>
        <div className="p-4 space-y-2">
          {sec.data.map((item, i) => {
            if (typeof item !== "object") return <div key={i} className="flex items-start gap-2 text-sm text-slate-600 py-1"><span className="text-orange-400 mt-0.5">•</span>{String(item)}</div>;
            const cleaned = Object.entries(item || {}).filter(([k, v]) => !HIDE.has(k) && !isEV(v));
            return <div key={i} className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 space-y-1">{cleaned.map(([k, v]) => <InfoRow key={k} label={prettyKey(k)} value={v} />)}</div>;
          })}
        </div>
      </AccordionCard>
    );
  }

  const entries = Object.entries(sec.data || {}).filter(([k]) => !HIDE.has(k));
  if (!entries.length) return null;
  const fieldCount = entries.length;

  return (
    <AccordionCard key={idx} title={sec.title} icon={sec.icon} badge={fieldCount > 4 ? `${fieldCount} fields` : null}>
      <div className="px-5 py-2 pb-4">
        {entries.map(([k, v]) => {
          let icon = <Ic.Info className="w-3 h-3" />;
          if (k === "email") icon = <Ic.Email className="w-3 h-3" />;
          if (k === "phone") icon = <Ic.Phone className="w-3 h-3" />;
          if (k === "date_of_birth") icon = <Ic.Cake className="w-3 h-3" />;
          if (k === "gender") icon = <Ic.Gender className="w-3 h-3" />;
          if (k.toLowerCase().includes("location") || k === "state" || k === "district") icon = <Ic.Pin className="w-3 h-3" />;
          if (k.toLowerCase().includes("job")) icon = <Ic.Bag className="w-3 h-3" />;
          if (k.toLowerCase().includes("cert")) icon = <Ic.Cert className="w-3 h-3" />;
          const val = (k.includes("created_at") || k.includes("updated_at") || k === "date_of_birth") ? fmtDate(v) : v;
          return <InfoRow key={k} label={prettyKey(k)} value={val} icon={icon} />;
        })}
      </div>
    </AccordionCard>
  );
};

/* ═══════════════ PROFILE PANEL ═══════════════ */
const ProfilePanel = ({ sections, profile, age }) => {
  const subStatus = normSubStatus(profile?.subscription?.status);
  const { left, right } = useMemo(() => splitIntoColumns(sections), [sections]);

  return (
    <div className="space-y-4">
      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Age", value: age ? `${age} yrs` : "—", icon: <Ic.Cake className="w-4 h-4" />, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Status", value: toTC(profile?.current_status) || "—", icon: <Ic.Alert className="w-4 h-4" />, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Location", value: profile?.current_location || "—", icon: <Ic.Pin className="w-4 h-4" />, color: "text-red-500", bg: "bg-red-50" },
          //   { label:"Alerts", value: getAlertType(profile).replace("Government ","").replace("Both ",""), icon:<Ic.Bell className="w-4 h-4"/>, color:"text-indigo-500", bg:"bg-indigo-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-orange-100 px-4 py-3 flex items-center gap-3 ">
            <div className={cx("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", s.bg)}>
              <span className={s.color}>{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-xs font-bold text-slate-700 truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column masonry layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* LEFT column */}
        <div className="space-y-4  ">
          {left.map((sec, i) => <SectionRenderer key={i} sec={sec} idx={i} />)}
        </div>
        {/* RIGHT column */}
        <div className="space-y-4">
          {right.map((sec, i) => <SectionRenderer key={i + 100} sec={sec} idx={i + 100} />)}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ JOBS PANEL ═══════════════ */
const JobsPanel = ({ token }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selJob, setSelJob] = useState(null);
  const [view, setView] = useState("cards");
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await axios.get(`${API_BASE}/user/recommended-jobs`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          params: { page, limit: LIMIT },
        });
        if (res.data?.success === true) {
          setJobs(res.data?.data?.jobs || []);
          setPagination(res.data?.data?.pagination || {});
        } else {
          setError(res.data?.message || "Failed to load recommended jobs");
          setJobs([]);
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Unable to fetch jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, page]);

  // Client-side filter on current page results
  const filtered = useMemo(() => {
    return jobs.slice().filter(job => {
      const d = parseDate(job.application_deadline);
      const isExp = d ? d < today : false;
      const ok = status === "all" || (status === "current" && !isExp) || (status === "expired" && isExp);
      const q = search.trim().toLowerCase();
      const sm = !q ||
        (job?.title || "").toLowerCase().includes(q) ||
        (job?.source_name || "").toLowerCase().includes(q) ||
        (job?.category_name || "").toLowerCase().includes(q);
      return ok && sm;
    });
  }, [jobs, search, status, today]);

  const stats = useMemo(() => ({
    total: pagination.total || jobs.length,
    active: jobs.filter(j => { const d = parseDate(j.application_deadline); return d && d >= today; }).length,
    expired: jobs.filter(j => { const d = parseDate(j.application_deadline); return d && d < today; }).length,
  }), [jobs, today, pagination.total]);

  const STATUS_BADGE_BASE = "inline-flex items-center justify-center min-w-[60px] text-xs px-2.5 py-1 rounded-full font-semibold";
  const LIVE_BADGE_CLASS = `${STATUS_BADGE_BASE} bg-green-300 text-green-950 border border-green-500`;
  const LIVE_BADGE_STYLE = { animation: "liveBadgeBlink 1s ease-in-out infinite" };
  const CLOSED_BADGE_CLASS = `${STATUS_BADGE_BASE} bg-red-100 text-red-600`;

  if (loading) return <div className="flex flex-col items-center py-20 gap-3"><div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" /><p className="text-orange-400 text-sm">Finding recommended jobs…</p></div>;
  if (error) return (
    <div className="flex flex-col items-center py-16 gap-4 text-center">
      <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center"><Ic.Bag className="w-7 h-7 text-orange-400" /></div>
      <p className="text-slate-600 font-medium">{error}</p>
      <button onClick={() => navigate("/user-profile-filling")} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-200">Complete Profile <Ic.ChevR className="w-3 h-3" /></button>
    </div>
  );

  return (
    <div className="space-y-4">
      <style>{`@keyframes liveBadgeBlink { 0%, 100% { background-color: #86efac; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.32); } 50% { background-color: #4ade80; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14); } }`}</style>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", v: stats.total, bg: "bg-orange-500 text-white" },
          { label: "Live", v: stats.active, bg: "bg-green-300 text-green-950 border border-green-500", pulse: true },
          { label: "Closed", v: stats.expired, bg: "bg-slate-200 text-slate-700" },
        ].map(s => (
          <div key={s.label} className={cx("rounded-2xl p-4 text-center", s.bg)} style={s.pulse ? LIVE_BADGE_STYLE : undefined}>
            <div className="text-2xl font-black">{s.v}</div>
            <div className="text-xs font-semibold opacity-90">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-orange-100 p-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Ic.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300 w-3 h-3" />
            <input className="w-full pl-9 pr-8 py-2.5 text-sm border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30" placeholder="Search title, org, category…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 hover:text-orange-500"><Ic.X className="w-3 h-3" /></button>}
          </div>
          <select className="text-sm border border-orange-100 rounded-xl px-3 py-2 bg-orange-50/30 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="current">Live</option>
            <option value="expired">Closed</option>
          </select>
          <div className="flex gap-1">
            {["cards", "table"].map(m => (
              <button key={m} onClick={() => setView(m)} className={cx("px-3 py-2 rounded-xl text-xs font-bold transition-colors", view === m ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500 hover:bg-orange-100")}>
                {m === "cards" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-orange-400 font-medium">{filtered.length} jobs on this page · {stats.total} total recommended</p>
      </div>

      {/* Card view */}
      {view === "cards" && (
        <div className="grid grid-cols-1 gap-3">
          {filtered.length ? filtered.map(job => {
            const dObj = parseDate(job.application_deadline);
            const isExp = dObj ? dObj < today : false;
            const dl = daysLeft(job.application_deadline);
            const urgent = dl !== null && dl >= 0 && dl <= 5;
            return (
              <div key={job._id} className={cx("bg-white rounded-2xl border transition-all hover:shadow-md overflow-hidden", isExp ? "border-slate-200 opacity-80" : urgent ? "border-orange-300" : "border-orange-100")}>
                <div className={cx("h-1.5 w-full", isExp ? "bg-slate-200" : urgent ? "bg-linear-to-r from-red-400 to-orange-400" : "bg-linear-to-r from-orange-400 to-amber-400")} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-semibold">{toTC(job.job_type) || "Job"}</span>
                      {urgent && !isExp && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">{dl}d left</span>}
                      {isExp
                        ? <span className={CLOSED_BADGE_CLASS}>Closed</span>
                        : <span className={LIVE_BADGE_CLASS} style={LIVE_BADGE_STYLE}>Live</span>}
                    </div>
                    <button onClick={() => setSelJob(job)} className="shrink-0 text-xs text-orange-500 font-bold hover:underline">Details</button>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3 leading-snug">{toTC(job.title)}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                    {[
                      { icon: <Ic.Bld className="w-3 h-3" />, val: toTC(job.source_name) },
                      { icon: <Ic.Tag className="w-3 h-3" />, val: toTC(job.category_name) },
                      { icon: <Ic.Grad className="w-3 h-3" />, val: job.qualifications },
                      { icon: <span className="text-[10px]">👥</span>, val: job.no_of_posts ? `Posts: ${job.no_of_posts}` : null },
                      { icon: <span className="text-[10px]">🎂</span>, val: job.age ? `Age: ${job.age} yrs` : null },
                    ].filter(i => i.val).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="text-orange-400 shrink-0">{item.icon}</span>
                        <span className="truncate">{item.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-orange-50">
                    <div className="text-xs text-slate-400">
                      Posted {fmtDate2(job.posted_date)} · <span className={isExp ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>Due {fmtDate2(job.application_deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.notification_url && (
                        <a href={job.notification_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-blue-600 text-xs font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">
                          Notification PDF <Ic.Ext className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {isExp
                        ? <span className="text-xs text-slate-400 italic">Closed</span>
                        : job.apply_link
                          ? <a href={job.apply_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-orange-200">Apply <Ic.Ext className="w-2.5 h-2.5" /></a>
                          : <span className="text-xs text-slate-400">No link</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center py-16 gap-3 text-center bg-white rounded-2xl border border-orange-100">
              <div className="text-4xl">🏛️</div>
              <p className="font-bold text-slate-500">No Jobs Found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or complete your profile</p>
            </div>
          )}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="bg-white rounded-2xl border border-orange-100 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-linear-to-r from-orange-500 to-amber-500 text-white">
                {["Title", "Organization", "Category", "Qualification", "Posts", "Age", "Posted", "Deadline", "Status", "Links"].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {filtered.map(job => {
                const dObj = parseDate(job.application_deadline);
                const isExp = dObj ? dObj < today : false;
                return (
                  <tr key={job._id} className={cx("hover:bg-orange-50/50 transition-colors", isExp ? "opacity-60" : "")}>
                    <td className="px-3 py-3" style={{ maxWidth: 180 }}>
                      <div className="font-semibold text-slate-800 truncate max-w-[170px]">{toTC(job.title)}</div>
                      <button onClick={() => setSelJob(job)} className="text-orange-500 text-[11px] hover:underline">View</button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">{toTC(job.source_name) || "—"}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{toTC(job.category_name) || "—"}</td>
                    <td className="px-3 py-3" style={{ maxWidth: 120 }}><span className="truncate block max-w-[115px]">{safe(job.qualifications)}</span></td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{safe(job.no_of_posts ?? "—")}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{job.age ? job.age + " yrs" : "—"}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{fmtDate2(job.posted_date)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isExp
                        ? <span className="px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">{fmtDate2(job.application_deadline)}</span>
                        : <span className={LIVE_BADGE_CLASS} style={LIVE_BADGE_STYLE}>{fmtDate2(job.application_deadline)}</span>}
                    </td>
                    <td className="px-3 py-3">
                      {isExp
                        ? <span className={CLOSED_BADGE_CLASS}>Closed</span>
                        : <span className={LIVE_BADGE_CLASS} style={LIVE_BADGE_STYLE}>Live</span>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {job.notification_url && (
                          <a href={job.notification_url} target="_blank" rel="noreferrer" className="text-orange-500 font-bold flex items-center gap-1 hover:underline whitespace-nowrap">Notification PDF <Ic.Ext className="w-2.5 h-2.5" /></a>
                        )}
                        {!isExp && job.apply_link
                          ? <a href={job.apply_link} target="_blank" rel="noreferrer" className="text-orange-500 font-bold flex items-center gap-1 hover:underline whitespace-nowrap">Apply <Ic.Ext className="w-2.5 h-2.5" /></a>
                          : !job.notification_url && <span className="text-slate-400">—</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && <div className="py-12 text-center text-slate-400 text-sm">No jobs found</div>}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-orange-100 px-4 py-3">
          <p className="text-xs text-slate-500">Page <span className="font-bold text-orange-600">{pagination.page}</span> of <span className="font-bold">{pagination.totalPages}</span> · {pagination.total} total</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className={cx("px-3 py-1.5 rounded-xl text-xs font-bold transition-colors", pagination.hasPrevPage ? "bg-orange-50 text-orange-500 hover:bg-orange-100" : "bg-slate-50 text-slate-300 cursor-not-allowed")}
            >← Prev</button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasNextPage}
              className={cx("px-3 py-1.5 rounded-xl text-xs font-bold transition-colors", pagination.hasNextPage ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-50 text-slate-300 cursor-not-allowed")}
            >Next →</button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selJob && (() => {
        const dObj = parseDate(selJob.application_deadline);
        const isExp = dObj ? dObj < today : false;
        const dl = daysLeft(selJob.application_deadline);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelJob(null)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className={cx("h-1.5 w-full", isExp ? "bg-slate-300" : "bg-linear-to-r from-orange-400 to-amber-400")} />
              <div className="flex items-center justify-between px-6 py-4 border-b border-orange-50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-semibold">{toTC(selJob.job_type) || "Job"}</span>
                  {isExp
                    ? <span className={CLOSED_BADGE_CLASS}>Closed</span>
                    : <span className={LIVE_BADGE_CLASS} style={LIVE_BADGE_STYLE}>Live</span>}
                  {dl !== null && dl >= 0 && dl <= 5 && !isExp && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">{dl}d left</span>}
                </div>
                <button onClick={() => setSelJob(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 hover:bg-orange-100 text-orange-400"><Ic.X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                <h2 className="text-xl font-black text-orange-600 mb-4">{toTC(selJob.title)}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Organization", val: toTC(selJob.source_name) || "—", icon: <Ic.Bld className="w-3 h-3" /> },
                    { label: "Category", val: toTC(selJob.category_name) || "—", icon: <Ic.Tag className="w-3 h-3" /> },
                    { label: "Age Limit", val: selJob.age ? selJob.age + " years" : "—", icon: <span>🎂</span> },
                    { label: "No. of Posts", val: safe(selJob.no_of_posts ?? "—"), icon: <span>👥</span> },
                    { label: "Posted", val: fmtDate2(selJob.posted_date), icon: <Ic.Cal className="w-3 h-3" /> },
                    { label: "Deadline", val: fmtDate2(selJob.application_deadline), icon: <Ic.Clock className="w-3 h-3" />, accent: isExp ? "text-red-500" : "text-green-600" },
                    { label: "Qualification", val: safe(selJob.qualifications), icon: <Ic.Grad className="w-3 h-3" />, full: true },
                  ].map(item => (
                    <div key={item.label} className={cx("bg-orange-50 rounded-xl p-3 border border-orange-100", item.full && "col-span-2")}>
                      <p className="text-xs text-orange-400 flex items-center gap-1.5 mb-1">{item.icon}{item.label}</p>
                      <p className={cx("text-sm font-normal", item.accent || "text-slate-800")}>{item.val}</p>
                      {item.label === "Deadline" && dl !== null && !isExp && <p className="text-xs text-red-500 mt-0.5">{dl} days left</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-orange-50 flex gap-3">
                <button onClick={() => setSelJob(null)} className="flex-1 py-2.5 border border-orange-200 text-orange-500 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors">Close</button>
                {selJob.notification_url && (
                  <a href={selJob.notification_url} target="_blank" rel="noreferrer" className="flex-1 py-2.5 bg-orange-50 border border-orange-300 text-orange-600 rounded-xl text-sm font-bold text-center hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                    Notification <Ic.Ext className="w-3 h-3" />
                  </a>
                )}
                {!isExp && selJob.apply_link
                  ? <a href={selJob.apply_link} target="_blank" rel="noreferrer" className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold text-center hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200">Apply Now <Ic.Ext className="w-3 h-3" /></a>
                  : isExp ? <div className="flex-1 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-sm font-semibold text-center">Applications Closed</div>
                  : null}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

/* ═══════════════ ANNOUNCEMENTS ═══════════════ */
const AnnouncementsPanel = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sel, setSel] = useState(null);
  const fmtEvtDate = d => !d ? "" : new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const fmtEvtTime = t => !t ? "" : new Date(`1970-01-01T${t}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const safeHTML = h => !h ? "" : DOMPurify.sanitize(h, { ADD_ATTR: ["target", "rel"] }).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');

  useEffect(() => {
    if (!token) return;
    (async () => { try { setLoading(true); setError(""); const res = await axios.get(`${API_BASE}/marketing-events/my-events`, { headers: { Authorization: `Bearer ${token}` } }); if (res.data?.status) setEvents(res.data.events || []); else setError("No events found"); } catch { setError("Failed to load events"); } finally { setLoading(false); } })();
  }, [token]);

  const active = events.filter(e => e.is_active);
  if (loading) return <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" /></div>;
  if (error) return <div className="text-center py-10 text-slate-400 text-sm">{error}</div>;
  if (!active.length) return <div className="flex flex-col items-center py-16 gap-3"><div className="text-4xl">🔔</div><p className="text-slate-500 font-semibold">No announcements yet</p></div>;

  return (
    <div className="space-y-3">
      {active.map(e => (
        <div key={e.id} className="bg-white rounded-2xl border border-orange-100 overflow-hidden hover:shadow-md transition-all ">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 w-full" />
          <div className="p-4 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100"><Ic.Bell className="w-5 h-5 text-orange-500" /></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{e.event_title || "Announcement"}</h4>
              <p className="text-xs text-orange-400 font-medium mb-3">📅 {fmtEvtDate(e.event_date || e.created_at)}{e.event_time && " · ⏰ " + fmtEvtTime(e.event_time)}</p>
              <div className="flex gap-2">
                <button onClick={() => setSel(e)} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors">Read More</button>
                {e.event_link && <a href={e.event_link} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-colors">Join Now</a>}
              </div>
            </div>
          </div>
        </div>
      ))}
      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSel(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 w-full" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-50"><span className="font-bold text-slate-800 text-lg">Announcement</span><button onClick={() => setSel(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 hover:bg-orange-100 text-orange-400"><Ic.X className="w-3.5 h-3.5" /></button></div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <h3 className="text-xl font-black text-slate-800">{sel.event_title}</h3>
              <p className="text-sm text-orange-400 font-medium">📅 {fmtEvtDate(sel.event_date || sel.created_at)}{sel.event_time && " · ⏰ " + fmtEvtTime(sel.event_time)}</p>
              {sel.event_link && <a href={sel.event_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors">Join Now ✅</a>}
              <div className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: safeHTML(sel.marketing_info) }} />
            </div>
            <div className="px-6 py-4 border-t border-orange-50"><button onClick={() => setSel(null)} className="w-full py-2.5 border border-orange-200 text-orange-500 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════ MEDIA PANEL ═══════════════ */
const MediaPanel = ({ profile }) => {
  const list = useMemo(() => { const l = profile?.media || profile?.documents || profile?.files || profile?.uploads || profile?.attachments || []; return Array.isArray(l) ? l : []; }, [profile]);
  const guessIcon = item => { const s = `${(item?.name || item?.file_name || item?.title || "")} ${(item?.url || item?.path || item?.link || "")}`.toLowerCase(); if (s.includes(".pdf")) return "📄"; if (s.includes(".doc")) return "📝"; if (s.includes(".png") || s.includes(".jpg") || s.includes(".jpeg") || s.includes(".webp")) return "🖼️"; return "📁"; };
  if (!list.length) return <div className="flex flex-col items-center py-16 gap-3"><div className="text-5xl">📁</div><p className="text-slate-500 font-semibold">No media uploaded</p><p className="text-xs text-slate-400">Documents and files will appear here</p></div>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {list.map((item, idx) => {
        const url = item?.url || item?.link || item?.path || "";
        const title = item?.name || item?.file_name || item?.title || `Media ${idx + 1}`;
        const sub = item?.type || item?.mime_type || item?.category || "File";
        return (
          <div key={item?.id || idx} className="bg-white border border-orange-100 rounded-2xl p-4 hover:shadow-md transition-all ">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-2xl border border-orange-100">{guessIcon(item)}</div>
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-slate-700 truncate">{title}</p><p className="text-xs text-orange-400">{sub}</p></div>
            </div>
            {url ? <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 w-full py-2 bg-orange-50 text-orange-500 text-xs font-bold rounded-xl hover:bg-orange-100 transition-colors border border-orange-100">Open<Ic.Ext className="w-2.5 h-2.5" /></a> : <div className="w-full py-2 bg-gray-50 text-gray-400 text-xs text-center rounded-xl">No URL</div>}
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════ RESET PASSWORD MODAL ═══════════════ */
const ResetPasswordModal = ({ token, email, onClose }) => {
  const [pw, setPw] = useState(""); const [cf, setCf] = useState("");
  const [showPw, setShowPw] = useState(false); const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!pw || pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pw !== cf) { setError("Passwords do not match."); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/reset-password`, { email: email || "", token, password: pw, password_confirmation: cf }, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (res.data?.status || res.status === 200) { setSuccess(true); toast.success("Password reset successfully!"); setTimeout(onClose, 1500); }
      else setError(res.data?.message || "Reset failed.");
    } catch (e) { setError(e?.response?.data?.message || e?.message || "Reset failed."); }
    finally { setLoading(false); }
  };

  const strength = pw.length >= 12 ? 4 : pw.length >= 8 ? 3 : pw.length >= 5 ? 2 : pw.length >= 2 ? 1 : 0;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColors = ["bg-orange-100", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-green-400"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 w-full" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-50">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><Ic.Lock className="w-5 h-5 text-orange-600" /></div><div><p className="font-bold text-slate-800 text-sm">Reset Password</p><p className="text-xs text-orange-400">Choose a new secure password</p></div></div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 hover:bg-orange-100 text-orange-400"><Ic.X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 text-3xl">✓</div>
              <p className="font-bold text-slate-800">Password Updated!</p>
              <p className="text-sm text-slate-400">Redirecting…</p>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">⚠️ {error}</div>}
              <div>
                <label className="text-xs font-bold text-orange-500 uppercase tracking-wider block mb-1.5">New Password</label>
                <div className="relative"><input type={showPw ? "text" : "password"} className="w-full pr-10 pl-4 py-3 text-sm border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30" placeholder="At least 8 characters" value={pw} onChange={e => setPw(e.target.value)} /><button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 hover:text-orange-500">{showPw ? <Ic.EyeOff className="w-4 h-4" /> : <Ic.Eye className="w-4 h-4" />}</button></div>
              </div>
              {pw && (<div><div className="flex gap-1 mb-1">{[1, 2, 3, 4].map(i => <div key={i} className={cx("h-1.5 flex-1 rounded-full transition-all", strength >= i ? strengthColors[strength] : "bg-orange-100")} />)}</div><p className="text-xs text-orange-400 font-medium">{strengthLabel}</p></div>)}
              <div>
                <label className="text-xs font-bold text-orange-500 uppercase tracking-wider block mb-1.5">Confirm Password</label>
                <div className="relative"><input type={showCf ? "text" : "password"} className="w-full pr-10 pl-4 py-3 text-sm border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-orange-50/30" placeholder="Repeat your password" value={cf} onChange={e => setCf(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} /><button onClick={() => setShowCf(!showCf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 hover:text-orange-500">{showCf ? <Ic.EyeOff className="w-4 h-4" /> : <Ic.Eye className="w-4 h-4" />}</button></div>
                {cf && pw && <p className={cx("text-xs mt-1.5 font-semibold", cf === pw ? "text-green-500" : "text-red-400")}>{cf === pw ? "✓ Passwords match" : "✗ Passwords don't match"}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-3 border border-orange-200 text-orange-500 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Resetting…</> : "Reset Password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ SETTINGS PANEL ═══════════════ */
const SettingsPanel = ({ token, email, navigate, handleLogout }) => {
  const [showReset, setShowReset] = useState(false);
  return (
    <>
      <div className="max-w-xl space-y-4">
        <div className="bg-white rounded-2xl border border-orange-100  overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center"><Ic.Cog className="w-4 h-4 text-orange-500" /></div>
            <p className="font-bold text-slate-800">Account Settings</p>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Edit Profile", desc: "Update your personal & education info", icon: <Ic.Edit className="w-4 h-4" />, color: "bg-orange-100 text-orange-600", action: () => navigate("/user-profile-filling"), hover: "hover:bg-orange-50 hover:border-orange-200" },
              // { label: "Reset Password", desc: "Change your account password", icon: <Ic.Lock className="w-4 h-4" />, color: "bg-blue-100 text-blue-600", action: () => setShowReset(true), hover: "hover:bg-blue-50 hover:border-blue-200" },
              { label: "Logout", desc: "Sign out of your account", icon: <Ic.Logout className="w-4 h-4" />, color: "bg-red-100 text-red-500", action: handleLogout, hover: "hover:bg-red-50 hover:border-red-200", chevHover: "group-hover:text-red-500" },
            ].map(item => (
              <button key={item.label} onClick={item.action} className={cx("w-full flex items-center justify-between px-4 py-4 rounded-xl border border-orange-100 transition-all group", item.hover)}>
                <div className="flex items-center gap-4">
                  <div className={cx("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>{item.icon}</div>
                  <div className="text-left"><p className="text-sm font-bold text-slate-800">{item.label}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
                </div>
                <Ic.ChevR className={cx("w-3.5 h-3.5 text-slate-300 transition-colors", item.chevHover || "group-hover:text-orange-400")} />
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100  p-5">
          <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">Account Details</p>
          {[{ label: "Email", val: email, icon: <Ic.Email className="w-3 h-3" /> }].map(item => !isEV(item.val) && <InfoRow key={item.label} label={item.label} value={item.val} icon={item.icon} />)}
        </div>
      </div>
      {showReset && <ResetPasswordModal token={token} email={email} onClose={() => setShowReset(false)} />}
    </>
  );
};

/* ═══════════════ MAIN ═══════════════ */
const UserProfilePage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    return TAB_IDS.includes(tab) ? tab : "profile";
  });
  const [profile, setProfile] = useState(null);
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobsNavCount, setJobsNavCount] = useState({ total: 0, liveCount: 0, newCount: 0 });
  const [annNavCount, setAnnNavCount] = useState({ total: 0, newCount: 0 });

  const seenStorageKey = useMemo(() => {
    const ident = profile?.id || profile?.email || user?.id || user?.email || "guest";
    return `cm_dashboard_seen_${ident}`;
  }, [profile?.id, profile?.email, user?.id, user?.email]);

  const getSeenState = useCallback(() => {
    try {
      const raw = localStorage.getItem(seenStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [seenStorageKey]);

  const markTabAsSeen = useCallback((tabId) => {
    if (tabId !== "jobs" && tabId !== "announcements") return;
    const key = tabId === "jobs" ? "jobs_seen_at" : "announcements_seen_at";
    const next = { ...getSeenState(), [key]: new Date().toISOString() };
    try {
      localStorage.setItem(seenStorageKey, JSON.stringify(next));
    } catch {
      // Ignore storage write failures in private mode or restricted browsers.
    }
    if (tabId === "jobs") setJobsNavCount((prev) => ({ ...prev, newCount: 0 }));
    if (tabId === "announcements") setAnnNavCount((prev) => ({ ...prev, newCount: 0 }));
  }, [getSeenState, seenStorageKey]);

  const handleTabSwitch = useCallback((tabId) => {
    if (!TAB_IDS.includes(tabId)) return;
    setActiveTab(tabId);
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); setError("Authentication required"); return; }
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await axios.get(API_ENDPOINTS.USER_PROFILE, { headers: { Authorization: `Bearer ${token}` } });
        if (!isApiSuccess(res.data)) throw new Error(getApiMessage(res.data, "Failed"));

        const payload = res.data?.data || {};
        const userData = payload?.user || payload || {};
        const educationData = payload?.education || userData?.education || {};
        const sportsData = payload?.sports || userData?.sports || null;
        const d = { ...userData, education: educationData, sports: sportsData };

        setProfile({ ...d, notify: normBool(d.notify), alert_job: normBool(d.alert_job), alert_internship: normBool(d.alert_internship), alert_both: normBool(d.alert_both), qualified_teacher_exam: normBool(d.qualified_teacher_exam), education: flattenEducation(d.education), subscription: d.subscription || null, all_subscriptions: Array.isArray(d.all_subscriptions) ? d.all_subscriptions : [], media: d.media || d.documents || d.files || [] });
        setAge(calcAge(d.date_of_birth));
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || "Error";
        setError(msg); toast.error(msg);
        if (e?.response?.status === 401) logout();
      } finally { setLoading(false); }
    })();
  }, [token, logout]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const seen = getSeenState();
        const jobsSeenAt = toDateOrNull(seen.jobs_seen_at);
        const annSeenAt = toDateOrNull(seen.announcements_seen_at);

        const [jobsResult, annResult] = await Promise.allSettled([
          axios.get(`${API_BASE}/user/recommended-jobs`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            params: { page: 1, limit: 100 },
          }),
          axios.get(`${API_BASE}/marketing-events/my-events`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (jobsResult.status === "fulfilled") {
          const jobsData = jobsResult.value?.data;
          const jobs = jobsData?.data?.jobs || jobsData?.jobs || [];
          const jobsTotal = jobsData?.data?.pagination?.total ?? jobs.length;
          const jobsNewCount = jobs.filter((j) => {
            const created = toDateOrNull(j?.posted_date || j?.createdAt || j?.updatedAt);
            return created && (!jobsSeenAt || created > jobsSeenAt);
          }).length;
          setJobsNavCount({ total: jobsTotal, liveCount: jobsTotal, newCount: activeTab === "jobs" ? 0 : jobsNewCount });
        }

        if (annResult.status === "fulfilled") {
          const activeEvents = (annResult.value?.data?.events || []).filter((e) => e?.is_active);
          const annNewCount = activeEvents.filter((e) => {
            const created = toDateOrNull(e?.event_date || e?.created_at || e?.updated_at);
            return created && (!annSeenAt || created > annSeenAt);
          }).length;
          setAnnNavCount({ total: activeEvents.length, newCount: activeTab === "announcements" ? 0 : annNewCount });
        }
      } catch {
        // no-op — allSettled handles individual failures above
      }
    })();
  }, [token, activeTab, getSeenState]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (TAB_IDS.includes(tab) && tab !== activeTab) {
      handleTabSwitch(tab, false);
    }
  }, [location.search, activeTab, handleTabSwitch]);

  useEffect(() => {
    if (activeTab === "jobs" || activeTab === "announcements") markTabAsSeen(activeTab);
  }, [activeTab, markTabAsSeen]);

  const profileCompletion = useMemo(() => calculateProfileCompletion(profile), [profile]);

  useEffect(() => {
    if (loading || !profile) return;
    if (isEV((profile.education || {}).qualification_level)) { const t = setTimeout(() => navigate("/user-profile-filling"), 120000); return () => clearTimeout(t); }
  }, [loading, profile, navigate]);

  const sections = useMemo(() => { if (!profile) return []; const c = { ...profile }; delete c.token; delete c.password; return buildSections(c, age); }, [profile, age]);

  const handleLogout = () => {
    toast.warning(
      <div><p className="mb-2 font-semibold text-slate-800">Sure you want to logout?</p><div className="flex gap-2"><button className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-bold" onClick={() => { toast.dismiss(); logout(); }}>Yes</button><button className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold" onClick={() => toast.dismiss()}>Cancel</button></div></div>,
      { autoClose: false, closeButton: false, draggable: false, closeOnClick: false }
    );
  };

  if (loading) return <div className="mt-10 min-h-screen bg-orange-50/30"><Spinner /></div>;
  if (error) return (
    <div className="mt-10 min-h-screen bg-orange-50/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl  border border-orange-100 p-10 text-center max-w-sm">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-400 text-2xl">✕</div>
        <h3 className="font-bold text-slate-800 mb-2">Something went wrong</h3>
        <p className="text-slate-500 text-sm mb-4">{error}</p>
        {error === "Authentication required" ? <a href="/signin" className="inline-block px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200">Sign In</a> : <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200">Try Again</button>}
      </div>
    </div>     

    
  );
  if (!profile) return null;

  const edu = profile.education || {};
  const headerTags = [age ? `${age} years` : null, profile?.gender, edu.qualification_level, profile?.current_status].filter(Boolean);
  const subStatus = normSubStatus(profile?.subscription?.status);
  const subBadge = subStatus === "Active" ? "bg-green-100 text-green-700" : subStatus === "Expired" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600";

  const NAV = [
    { id: "profile", label: "My Profile", icon: <Ic.User className="w-3.5 h-3.5" />, desc: "Info & education" },
    { id: "jobs", label: "Job Posts", icon: <Ic.Gov className="w-3.5 h-3.5" />, desc: "Eligible govt jobs", count: jobsNavCount.total, liveCount: jobsNavCount.liveCount, newCount: jobsNavCount.newCount },
    // { id: "announcements", label: "Announcements", icon: <Ic.Bell className="w-3.5 h-3.5" />, desc: "Events & alerts", count: annNavCount.total, newCount: annNavCount.newCount },
    { id: "media", label: "Media", icon: <Ic.Img className="w-3.5 h-3.5" />, desc: "Uploaded documents" },
    { id: "settings", label: "Settings", icon: <Ic.Cog className="w-3.5 h-3.5" />, desc: "Account & security" },
  ];

  return (
    <div className="bg-slate-100 mt-20">
      <SEO
        title="Student Dashboard | Career Mitra"
        description="Access your personalized dashboard to explore govt jobs, internships, and career resources tailored for students. Stay updated with the latest opportunities and manage your profile effectively."
        keywords="student dashboard, govt jobs for students, internships for students, career resources, personalized job recommendations, profile management, career guidance"
        url="https://www.careermitra.in/user-dashboard"
      />

      {/* ── DASHBOARD SHELL: fixed below navbar+ticker (top-24 = 96px) ── */}
      <div className="flex sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">

        {/* ══════════════════════════════════
            LEFT SIDEBAR
        ══════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-full bg-white border-r border-slate-200 overflow-hidden z-20">

          {/* ── User card ── */}
          <div className="shrink-0 px-5 pt-5 pb-4 border-b border-slate-100"
            style={{ background: "linear-gradient(135deg,#fff7ed 0%,#ffffff 100%)" }}>
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <AvatarSVG size={46} />
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-800 truncate leading-tight">{profile.name || "User"}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{profile.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                  Student
                </span>
              </div>
            </div>
            {/* Completion bar */}
            <div className="bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">Profile Completion</span>
                <span className={cx("text-[10px] font-black", profileCompletion === 100 ? "text-green-500" : "text-orange-500")}>
                  {profileCompletion}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cx("h-full rounded-full transition-all duration-700",
                    profileCompletion === 100 ? "bg-linear-to-r from-green-400 to-emerald-500" : "bg-linear-to-r from-orange-400 to-amber-500"
                  )}
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {profileCompletion < 100 ? "Add education to unlock job matches" : "Profile fully complete ✓"}
              </p>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="shrink-0 grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/60">
            {[
              { label: "Jobs", v: jobsNavCount.total, color: "text-orange-500" },
              { label: "Events", v: annNavCount.total, color: "text-violet-500" },
              { label: "Age", v: age || "—", color: "text-slate-600" },
            ].map(s => (
              <div key={s.label} className="py-3 text-center">
                <p className={cx("text-lg font-black", s.color)}>{s.v}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Nav items ── */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5" style={{ scrollbarWidth: "none" }}>
            {NAV.map(t => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabSwitch(t.id)}
                  className={cx(
                    "group w-full text-left px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 relative overflow-hidden",
                    active
                      ? "bg-orange-500 shadow-md shadow-orange-200/60"
                      : "hover:bg-orange-50 border border-transparent hover:border-orange-100"
                  )}
                >
                  {/* icon */}
                  <span className={cx(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-500"
                  )}>
                    {t.icon}
                  </span>

                  {/* text */}
                  <div className="min-w-0 flex-1">
                    <p className={cx("text-sm font-bold leading-none truncate",
                      active ? "text-white" : "text-slate-700 group-hover:text-orange-600"
                    )}>{t.label}</p>
                    <p className={cx("text-[10px] mt-0.5 truncate",
                      active ? "text-orange-100" : "text-slate-400"
                    )}>{t.desc}</p>
                  </div>

                  {/* badge */}
                  {typeof t.count === "number" && (
                    <span className={cx("shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full leading-none",
                      active ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"
                    )}>{t.count}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Subscription mini-card ── */}
          {profile.subscription?.plan_name && (
            <div className="shrink-0 mx-3 mb-3 p-3 rounded-2xl bg-violet-50 border border-violet-100">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Ic.Layers className="w-3 h-3 text-violet-400 shrink-0" />
                  <p className="text-xs font-bold text-violet-700 truncate">{profile.subscription.plan_name}</p>
                </div>
                <span className={cx("text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0", subBadge)}>{subStatus}</span>
              </div>
              {profile.subscription.end_date && (
                <p className="text-[10px] text-violet-400 flex items-center gap-1">
                  <Ic.Cal className="w-2.5 h-2.5" />Until {fmtDate(profile.subscription.end_date)}
                </p>
              )}
            </div>
          )}

          {/* ── Logout ── */}
          <div className="shrink-0 px-3 py-3 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-500 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-all group"
            >
              <span className="w-8 h-8 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center shrink-0 transition-all">
                <Ic.Logout className="w-3.5 h-3.5 text-red-500" />
              </span>
              <span className="text-sm font-semibold text-red-500">Logout</span>
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════
            RIGHT PANEL
        ══════════════════════════════════ */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-slate-100">

          {/* ── Sticky top bar (desktop) ── */}
          <div className="shrink-0 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Student Dashboard</p>
              <h2 className="text-base font-black text-slate-800 leading-tight truncate">
                Welcome back, <span className="text-orange-500">{profile.name?.split(" ")[0] || "User"}</span> 👋
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* <div className="hidden sm:flex items-center gap-2">
                <span className="text-[11px] bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                  {NAV.find(n => n.id === "jobs")?.count || 0} Jobs
                </span>
                <span className="text-[11px] bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                  {NAV.find(n => n.id === "announcements")?.count || 0} Events
                </span>
              </div> */}
              {profileCompletion < 100 ? (
                <button
                  onClick={() => navigate("/user-profile-filling")}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white text-xl font-bold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-orange-200"
                >
                  Complete Profile
                </button>
              ) : (
                <button
                  onClick={() => navigate("/user-profile-filling")}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white text-xl font-bold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-orange-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ── Mobile horizontal tab bar ── */}
          <div className="lg:hidden shrink-0 bg-white border-b border-slate-200 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {NAV.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTabSwitch(t.id)}
                  className={cx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 relative",
                    activeTab === t.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {t.icon}
                  {t.label}
                  {t.newCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {t.newCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Scrollable content area ── */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
            <div />

            {/* Incomplete profile banner */}
            {profileCompletion < 100 && activeTab === "profile" && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <Ic.Alert className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Profile Incomplete</p>
                    <p className="text-xs text-slate-500">Add education details to unlock personalized job matches</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/user-profile-filling")}
                  className="shrink-0 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  Complete <Ic.ChevR className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Tab panels — each rendered at 60vh with internal scroll */}
            <div className="h-[70vh] overflow-y-auto rounded-2xl" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
              {activeTab === "profile" && <ProfilePanel sections={sections} profile={profile} age={age} />}
              {activeTab === "jobs" && <JobsPanel token={token} />}
              {activeTab === "announcements" && <AnnouncementsPanel token={token} />}
              {activeTab === "media" && <MediaPanel profile={profile} />}
              {activeTab === "settings" && <SettingsPanel token={token} email={profile.email} navigate={navigate} handleLogout={handleLogout} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;