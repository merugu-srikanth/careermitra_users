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

export function formatDateDDMonYYYY(val) {
  if (!val) return "-";
  
  // Format DD/MM/YYYY string
  if (typeof val === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split("/");
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }
  }

  // Format YYYY-MM-DD
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }
  }

  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return String(val);
}

export function toTitleCase(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s|-|\/)\S/g, (char) => char.toUpperCase());
}

export function isItemExpired(deadline) {
  if (!deadline) return false;
  
  let targetDate = null;
  if (typeof deadline === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(deadline)) {
    const [d, m, y] = deadline.split("/");
    targetDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), 23, 59, 59);
  } else {
    targetDate = new Date(deadline);
    if (isNaN(targetDate.getTime())) return false;
    targetDate.setHours(23, 59, 59, 999);
  }

  return targetDate.getTime() < Date.now();
}
