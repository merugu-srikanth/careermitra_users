/**
 * How one internship is shown in the finder (card and table). `r` is readInternship(item).
 */

import { GraduationCap, Home, Landmark, Building2 } from "lucide-react";

export const clean = (v) => (v == null || String(v).trim() === "-" ? "" : String(v).trim());
export const normalizeLink = (link) => (link ? (link.startsWith("http") ? link : `https://${link}`) : null);

const slugOf = (title) => (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "");

/** The old detail-page URL (/internships/<title-slug>). Many internships share a title, so the id picks the exact one. */
export const detailHref = (item) => `/internships/${slugOf(item.internship_title) || item.id}${item.id ? `?id=${item.id}` : ""}`;

export const LOGO_COLORS = ["bg-orange-50 text-orange-600", "bg-blue-50 text-blue-600", "bg-emerald-50 text-emerald-600", "bg-violet-50 text-violet-600", "bg-amber-50 text-amber-700", "bg-rose-50 text-rose-600"];

export function initials(name) {
  const words = clean(name).replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || "?").slice(0, 2)).toUpperCase();
}

export function stipendText(r) {
  const s = clean(r.item.stipend);
  if (r.amount > 0) {
    const min = Number(r.item.stipend_min) || 0;
    const max = Number(r.item.stipend_max) || 0;
    if (min && max && min !== max) return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")} / Month`;
    return s && !/^\d+$/.test(s) ? s : `₹${r.amount.toLocaleString("en-IN")} / Month`;
  }
  if (r.performance) return "Performance based";
  return "Unpaid";
}

export function placeText(r) {
  const item = r.item;
  const place = clean(item.district_city) || clean(item.state) || clean(item.location);
  if (r.workModes.has("Work From Home") && (!place || /pan india/i.test(place))) return "Remote";
  return place || "India";
}

/** The one tag shown: Government → Hybrid → Work From Home → Freshers Eligible. */
export function tagFor(r) {
  if (r.government) return { label: "Government", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: Landmark };
  if (r.workModes.has("Hybrid")) return { label: "Hybrid", cls: "bg-violet-50 text-violet-700 border-violet-200", Icon: Building2 };
  if (r.workModes.has("Work From Home")) return { label: "Work From Home", cls: "bg-blue-50 text-blue-700 border-blue-200", Icon: Home };
  if (r.fresher) return { label: "Freshers Eligible", cls: "bg-teal-50 text-teal-700 border-teal-200", Icon: GraduationCap };
  return null;
}

export function daysLeftText(r) {
  if (r.expired) return "Closed";
  if (r.daysLeft == null) return "";
  if (r.daysLeft === 0) return "Closes today";
  return `${r.daysLeft} day${r.daysLeft === 1 ? "" : "s"} left`;
}
