import { formatISTDate, getDaysLeft } from "./istDate";

/**
 * Uniform Formatters & Sanitizers for CareerMitra
 * Fixes:
 * - Currency double symbol (₹₹ -> ₹)
 * - Duration normalization ('06 Months' -> '6 Months')
 * - Date formatting ('DD Mon YYYY', e.g., '16 Aug 2026')
 * - Title case conversion
 * - Unified stipend parsing
 */

export function cleanCurrency(val) {
  if (!val) return "";
  let str = String(val).trim();
  // Strip all ₹, INR, Rs., Rs, and leading/trailing whitespace
  str = str.replace(/^(?:₹|INR|Rs\.?|RS\.?|\s)+/i, "").trim();
  return str;
}

export function formatStipend(item) {
  if (!item) return "Unpaid";
  
  const category = (item.stipend_category || item.stipendCategory || "").toLowerCase();
  let stipend = item.stipend || item.stipend_amount || item.salary || "";
  stipend = cleanCurrency(stipend);

  if (
    category === "unpaid" ||
    category === "free" ||
    stipend.toLowerCase() === "unpaid" ||
    stipend.toLowerCase() === "free" ||
    stipend === "0" ||
    !stipend
  ) {
    return "Unpaid";
  }

  // If numeric e.g. "5000" or "15000"
  const numericMatch = stipend.match(/^(\d+)(?:\/.*)?$/);
  if (numericMatch) {
    const num = parseInt(numericMatch[1], 10);
    const hasPerMonth = stipend.toLowerCase().includes("month") || stipend.includes("/m");
    return `₹${num.toLocaleString("en-IN")}${hasPerMonth ? "/month" : ""}`;
  }

  // If already formatted like "5,000/month"
  if (/^\d{1,3}(,\d{3})*(?:\/.*)?$/.test(stipend)) {
    return `₹${stipend}`;
  }

  return `₹${stipend}`;
}

export function formatStipendDisplay(item) {
  const stipend = formatStipend(item);
  return cleanCurrency(stipend);
}

export function normalizeDuration(val) {
  if (!val) return "Not Specified";
  let str = String(val).trim();
  
  // Replace leading zero e.g. "06 Months" -> "6 Months", "03 months" -> "3 Months"
  str = str.replace(/^0(\d+)/, "$1");
  
  // Normalize casing for months/weeks/days/years
  str = str.replace(/\bmonths?\b/gi, "Months");
  str = str.replace(/\bweeks?\b/gi, "Weeks");
  str = str.replace(/\bdays?\b/gi, "Days");
  str = str.replace(/\byears?\b/gi, "Years");
  
  return str;
}

// Dates are shown as their IST calendar day ("17 Oct 2026"), whatever the visitor's timezone.
export function formatDateDDMonYYYY(val) {
  if (!val) return "-";
  return formatISTDate(val) || String(val);
}

export function toTitleCase(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s|-|\/)\S/g, (char) => char.toUpperCase());
}

// Open for the whole deadline day in IST.
export function isItemExpired(deadline) {
  const days = getDaysLeft(deadline);
  return days !== null && days < 0;
}
