/**
 * IST (Asia/Kolkata) helpers for job dates — mirrors
 * careermitra-backend/src/utils/istDate.util.ts; keep them in sync.
 *
 * A job's postedDate / deadline is a calendar date stored as UTC midnight of
 * its IST day (17 Oct 2026 → "2026-10-17T00:00:00.000Z"). Always display it
 * with formatISTDate. Local-time getters (`getDate()`, `setHours(0,0,0,0)`)
 * or `new Date("2026-10-17")` shift the day for anyone outside India — that
 * was the "one day early" bug.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
export const CLOSING_SOON_DAYS = 7;

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function buildDay(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
}

/** Any date value (ISO, YYYY-MM-DD, DD-MM-YYYY, "17 Oct 2026", Date) → UTC midnight of its IST day, or null. */
export function parseISTDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date || /T\d{2}:\d{2}/.test(String(value))) {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return null;
    const ist = new Date(d.getTime() + IST_OFFSET_MS);
    return buildDay(ist.getUTCFullYear(), ist.getUTCMonth() + 1, ist.getUTCDate());
  }
  const s = String(value).trim();
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return buildDay(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/); // day-first, never MM/DD
  if (m) return buildDay(+m[3], +m[2], +m[1]);
  m = s.match(/^(\d{1,2})[\s-]+([A-Za-z]{3,9})[\s,-]+(\d{4})$/);
  if (m) {
    const month = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()) + 1;
    return month ? buildDay(+m[3], month, +m[1]) : null;
  }
  return null;
}

/** "17 Oct 2026" (default) in Asia/Kolkata; "" for no/invalid date. */
export function formatISTDate(value, options = { day: "2-digit", month: "short", year: "numeric" }) {
  const d = parseISTDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata", ...options });
}

/** "17/10/2026" in Asia/Kolkata. */
export function formatISTDateNumeric(value) {
  return formatISTDate(value, { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** "2026-10-17" for the IST day (URL params, <input type="date">). */
export function toISTDateKey(value) {
  const d = parseISTDate(value);
  return d ? d.toISOString().slice(0, 10) : "";
}

/** Today as UTC midnight of the IST calendar day. */
export function todayIST() {
  return parseISTDate(new Date());
}

/** 0 = closes today, negative = closed, null = no deadline. */
export function getDaysLeft(deadline) {
  const day = parseISTDate(deadline);
  if (!day) return null;
  return Math.round((day.getTime() - todayIST().getTime()) / DAY_MS);
}

/** "Open" | "Closing Soon" | "Closed" — open for the whole deadline day in IST. */
export function getApplicationStatus(deadline) {
  const daysLeft = getDaysLeft(deadline);
  if (daysLeft === null) return "Open";
  if (daysLeft < 0) return "Closed";
  if (daysLeft <= CLOSING_SOON_DAYS) return "Closing Soon";
  return "Open";
}
