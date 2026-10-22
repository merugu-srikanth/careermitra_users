/**
 * Internship finder (/internships) — reads each internship once into the
 * facts the filters need (education, branch, skills, work mode, stipend,
 * duration, days left, state), then filters and sorts in the browser.
 *
 * Older internships only have a few fields filled in, so most facts are
 * also read from the title, qualification, eligibility and location text.
 */

import { getDeadlineDayDifference } from "./jobDeadline";

// ── Filter options ────────────────────────────────────────────────────────────

const rx = (pattern) => new RegExp(pattern, "i");

export const EDUCATION_OPTIONS = [
  { value: "10th", label: "10th", test: rx("\\b(10th|ssc|matric|10 ?th)\\b") },
  { value: "12th", label: "12th", test: rx("\\b(12th|intermediate|inter|hsc|puc|10\\+2)\\b") },
  { value: "Diploma", label: "Diploma", test: rx("diploma|polytechnic") },
  { value: "ITI", label: "ITI", test: rx("\\biti\\b") },
  { value: "Any Graduate", label: "Any Graduate", test: rx("any (graduate|degree|discipline|stream)|graduat|\\bdegree\\b|\\bug\\b") },
  { value: "B.Tech", label: "B.Tech", test: rx("b\\.? ?tech|\\bb\\.?e\\b|engineering") },
  { value: "BCA", label: "BCA", test: rx("\\bbca\\b") },
  { value: "MCA", label: "MCA", test: rx("\\bmca\\b") },
  { value: "B.Sc", label: "B.Sc", test: rx("\\bb\\.? ?sc\\b") },
  { value: "M.Sc", label: "M.Sc", test: rx("\\bm\\.? ?sc\\b") },
  { value: "MBA", label: "MBA", test: rx("\\bmba\\b|\\bpgdm\\b") },
  { value: "M.Tech", label: "M.Tech", test: rx("m\\.? ?tech|\\bm\\.?e\\b") },
  { value: "B.Com", label: "B.Com", test: rx("\\bb\\.? ?com\\b|commerce") },
  { value: "BA", label: "BA", test: rx("\\bb\\.?a\\b|arts|humanities") },
];

export const BRANCH_OPTIONS = [
  { value: "CSE / IT", test: rx("\\bcse\\b|computer|\\bit\\b|information technology|software") },
  { value: "ECE", test: rx("\\bece\\b|electronics|communication") },
  { value: "EEE", test: rx("\\beee\\b|electrical (and|&) electronics") },
  { value: "Mechanical", test: rx("mechanical") },
  { value: "Civil", test: rx("\\bcivil\\b") },
  { value: "Electrical", test: rx("electrical") },
  { value: "AI / ML", test: rx("\\bai\\b|artificial intelligence|machine learning|\\bml\\b") },
  { value: "Data Science", test: rx("data scien|analytics|big data") },
  { value: "Any Branch", test: rx("any (branch|stream|discipline)|all branches") },
];

export const SKILL_OPTIONS = [
  { value: "Web Development", test: rx("\\bweb\\b|front ?end|back ?end|full ?stack|html|css") },
  { value: "React", test: rx("react") },
  { value: "Java", test: rx("\\bjava\\b") },
  { value: "Python", test: rx("python") },
  { value: "JavaScript", test: rx("javascript|\\bjs\\b|typescript") },
  { value: "Node.js", test: rx("node") },
  { value: "AI / ML", test: rx("\\bai\\b|artificial intelligence|machine learning|\\bml\\b|deep learning") },
  { value: "Data Science", test: rx("data scien|analytics|data analyst") },
  { value: "Cyber Security", test: rx("cyber|security") },
  { value: "Cloud", test: rx("cloud|aws|azure|gcp") },
  { value: "DevOps", test: rx("devops") },
  { value: "Testing", test: rx("testing|\\bqa\\b|quality assurance") },
  { value: "Marketing", test: rx("marketing|seo|social media|digital") },
  { value: "Design", test: rx("design|ui|ux|graphic") },
];

export const WORK_MODE_OPTIONS = ["Work From Home", "On-site", "Hybrid", "Part-time", "Full-time", "Virtual Internship"];

export const INTERNSHIP_TYPE_OPTIONS = ["Virtual Internship", "Full Time", "Part Time", "Up-Skilling/Training Programme"];

export const STIPEND_OPTIONS = [
  { value: "unpaid", label: "Unpaid" },
  { value: "1-5000", label: "₹1 – ₹5,000" },
  { value: "5001-10000", label: "₹5,001 – ₹10,000" },
  { value: "10001-20000", label: "₹10,001 – ₹20,000" },
  { value: "20001-", label: "₹20,000+" },
  { value: "performance", label: "Performance Based" },
  { value: "paid", label: "Paid (any amount)" },
];

export const DURATION_OPTIONS = [
  { value: "lt1", label: "< 1 Month", test: (m) => m < 1 },
  { value: "1-3", label: "1–3 Months", test: (m) => m >= 1 && m <= 3 },
  { value: "3-6", label: "3–6 Months", test: (m) => m > 3 && m <= 6 },
  { value: "6-12", label: "6–12 Months", test: (m) => m > 6 && m <= 12 },
  { value: "12+", label: "12+ Months", test: (m) => m > 12 },
];

export const DEADLINE_OPTIONS = [
  { value: "0", label: "Closing Today" },
  { value: "3", label: "Within 3 Days" },
  { value: "7", label: "Within 7 Days" },
  { value: "30", label: "Within 30 Days" },
  { value: "", label: "All" },
];

export const SORT_OPTIONS = [
  { value: "relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "closing", label: "Closing Soon" },
  { value: "stipend", label: "Highest Stipend" },
];

// ── Location ──────────────────────────────────────────────────────────────────

/** State / UT → its main cities (to read "Bangalore", "Trichy" … as a state) and capital lat/lng (for "Nearby"). */
const STATES = {
  "Andhra Pradesh": { cities: ["visakhapatnam", "vizag", "vijayawada", "tirupati", "guntur", "nellore", "kurnool", "amaravati", "kakinada", "anantapur"], at: [16.51, 80.52] },
  "Arunachal Pradesh": { cities: ["itanagar"], at: [27.08, 93.61] },
  Assam: { cities: ["guwahati", "dibrugarh", "silchar"], at: [26.14, 91.79] },
  Bihar: { cities: ["patna", "gaya", "bhagalpur", "muzaffarpur"], at: [25.59, 85.14] },
  Chhattisgarh: { cities: ["raipur", "bhilai", "bilaspur"], at: [21.25, 81.63] },
  Goa: { cities: ["panaji", "margao", "vasco"], at: [15.49, 73.83] },
  Gujarat: { cities: ["ahmedabad", "surat", "vadodara", "rajkot", "gandhinagar"], at: [23.22, 72.65] },
  Haryana: { cities: ["gurgaon", "gurugram", "faridabad", "panipat", "ambala", "hisar"], at: [30.73, 76.78] },
  "Himachal Pradesh": { cities: ["shimla", "mandi", "dharamshala"], at: [31.1, 77.17] },
  Jharkhand: { cities: ["ranchi", "jamshedpur", "dhanbad"], at: [23.34, 85.31] },
  Karnataka: { cities: ["bengaluru", "bangalore", "mysuru", "mysore", "mangaluru", "mangalore", "hubli", "belagavi"], at: [12.97, 77.59] },
  Kerala: { cities: ["thiruvananthapuram", "trivandrum", "kochi", "cochin", "kozhikode", "calicut", "thrissur"], at: [8.52, 76.94] },
  "Madhya Pradesh": { cities: ["bhopal", "indore", "gwalior", "jabalpur"], at: [23.26, 77.41] },
  Maharashtra: { cities: ["mumbai", "pune", "nagpur", "nashik", "thane", "aurangabad", "navi mumbai"], at: [19.08, 72.88] },
  Manipur: { cities: ["imphal"], at: [24.82, 93.94] },
  Meghalaya: { cities: ["shillong"], at: [25.58, 91.89] },
  Mizoram: { cities: ["aizawl"], at: [23.73, 92.72] },
  Nagaland: { cities: ["kohima", "dimapur"], at: [25.67, 94.11] },
  Odisha: { cities: ["bhubaneswar", "cuttack", "rourkela"], at: [20.3, 85.82] },
  Punjab: { cities: ["ludhiana", "amritsar", "jalandhar", "mohali", "patiala"], at: [30.9, 75.85] },
  Rajasthan: { cities: ["jaipur", "jodhpur", "udaipur", "kota", "ajmer"], at: [26.91, 75.79] },
  Sikkim: { cities: ["gangtok"], at: [27.33, 88.61] },
  "Tamil Nadu": { cities: ["chennai", "coimbatore", "madurai", "trichy", "tiruchirappalli", "trichirappalli", "salem", "vellore", "tirunelveli"], at: [13.08, 80.27] },
  Telangana: { cities: ["hyderabad", "secunderabad", "warangal", "karimnagar", "nizamabad", "khammam"], at: [17.39, 78.49] },
  Tripura: { cities: ["agartala"], at: [23.83, 91.29] },
  "Uttar Pradesh": { cities: ["lucknow", "noida", "greater noida", "kanpur", "ghaziabad", "varanasi", "agra", "prayagraj", "allahabad"], at: [26.85, 80.95] },
  Uttarakhand: { cities: ["dehradun", "haridwar", "roorkee"], at: [30.32, 78.03] },
  "West Bengal": { cities: ["kolkata", "howrah", "durgapur", "siliguri", "kharagpur"], at: [22.57, 88.36] },
  Delhi: { cities: ["new delhi", "delhi", "timarpur"], at: [28.61, 77.21] },
  "Jammu and Kashmir": { cities: ["srinagar", "jammu"], at: [34.08, 74.8] },
  Ladakh: { cities: ["leh"], at: [34.15, 77.58] },
  Chandigarh: { cities: ["chandigarh"], at: [30.73, 76.78] },
  Puducherry: { cities: ["puducherry", "pondicherry"], at: [11.94, 79.81] },
};
export const PAN_INDIA = "Pan India / Remote";

function statesIn(text) {
  const t = ` ${text.toLowerCase()} `;
  return Object.entries(STATES)
    .filter(([name, { cities }]) => t.includes(name.toLowerCase()) || cities.some((c) => t.includes(c)))
    .map(([name]) => name);
}

/** Nearest state to a lat/lng (by its capital) — for "Nearby". */
export function nearestState(lat, lng) {
  let best = null;
  let bestD = Infinity;
  for (const [name, { at }] of Object.entries(STATES)) {
    const d = (at[0] - lat) ** 2 + (at[1] - lng) ** 2;
    if (d < bestD) { bestD = d; best = name; }
  }
  return best;
}

// ── Reading one internship ────────────────────────────────────────────────────

const clean = (v) => (v == null || String(v).trim() === "-" ? "" : String(v).trim());

function parseAmount(text) {
  const nums = String(text).replace(/,/g, "").match(/\d+(\.\d+)?/g);
  if (!nums) return 0;
  return Math.max(...nums.map(Number).filter((n) => n < 10_000_000));
}

function parseMonths(duration, value) {
  const t = String(duration || "").toLowerCase();
  const n = parseFloat(t.replace(/[^\d.]/g, " ").trim().split(/\s+/)[0]);
  if (Number.isFinite(n) && n > 0) {
    if (t.includes("week")) return n / 4.345;
    if (t.includes("day")) return n / 30;
    if (t.includes("year")) return n * 12;
    return n; // months
  }
  return Number(value) > 0 ? Number(value) : null;
}

/** Everything the filters need, worked out once per internship. */
export function readInternship(item) {
  const title = clean(item.internship_title);
  const eligibilityText = [item.qualification, item.qualification_level, item.branch_specialization, item.eligibility, item.academic_year]
    .map(clean).filter(Boolean).join(" · ");
  const subjectText = [title, clean(item.domain_sector), clean(item.skills_required)].filter(Boolean).join(" · ");
  const placeText = [item.location, item.state, item.district_city].map(clean).filter(Boolean).join(", ");
  const all = [title, item.company_name, item.domain_sector, item.skills_required, eligibilityText, placeText,
    item.internship_type, item.work_mode, item.organization_type, item.source].map(clean).filter(Boolean).join(" ").toLowerCase();

  // Stipend
  const textAmount = parseAmount(item.stipend);
  const amount = Math.max(Number(item.stipend_max) || 0, Number(item.stipend_min) || 0, /unpaid|free|^nil$/i.test(clean(item.stipend)) ? 0 : textAmount);
  const performance = /performance/i.test(`${item.stipend} ${item.stipend_type}`);
  const paid = amount > 0 || performance || (item.stipend_category === "Paid" && !/unpaid/i.test(clean(item.stipend)));

  // Work mode
  const mode = clean(item.work_mode).toLowerCase();
  const type = clean(item.internship_type);
  const remote = /remote|work from home|wfh|virtual|online/.test(`${mode} ${placeText.toLowerCase()}`) || type === "Virtual Internship";
  const workModes = new Set();
  if (remote) workModes.add("Work From Home");
  if (/on-?site|office|in-?person/.test(mode)) workModes.add("On-site");
  if (/hybrid/.test(mode)) workModes.add("Hybrid");
  if (type === "Part Time") workModes.add("Part-time");
  if (type === "Full Time") workModes.add("Full-time");
  if (type === "Virtual Internship") workModes.add("Virtual Internship");

  const states = statesIn(placeText);
  const panIndia = /pan india|all india|anywhere|remote|work from home/i.test(placeText) || (!states.length && remote);

  const daysLeft = item.last_date_to_apply ? getDeadlineDayDifference(item.last_date_to_apply) : null;
  const expired = item.is_expired === true || (daysLeft != null && daysLeft < 0);

  const government = /government|psu/i.test(clean(item.organization_type))
    || /\b(govt|government|ministry|drdo|isro|defence|aicte|bsnl|ongc|ntpc|railway|bhel|\bhal\b|iit|nit|nielit|nic)\b/i.test(`${item.company_name} ${title} ${item.domain_sector} ${item.source}`);
  const fresher = !clean(item.experience_required) || /fresher|^0|no experience|not required/i.test(clean(item.experience_required));
  const it = /software|developer|\bweb\b|\bit\b|computer|programming|\bdata\b|cyber|cloud|\bai\b|\bml\b|\bapp\b|coding|python|java/i.test(subjectText);

  const eduSource = `${eligibilityText} ${title}`;
  return {
    item,
    all,
    education: new Set(EDUCATION_OPTIONS.filter((o) => o.test.test(eduSource)).map((o) => o.value)),
    branches: new Set(BRANCH_OPTIONS.filter((o) => o.test.test(`${eligibilityText} ${subjectText}`)).map((o) => o.value)),
    skills: new Set(SKILL_OPTIONS.filter((o) => o.test.test(subjectText)).map((o) => o.value)),
    workModes,
    amount,
    paid,
    performance,
    months: parseMonths(item.duration, item.duration_value),
    states,
    panIndia,
    daysLeft,
    expired,
    government,
    fresher,
    it,
    featured: item.is_featured === true,
    createdAt: new Date(item.created_at || item.posted_on || 0).getTime(),
  };
}

// ── Filtering ─────────────────────────────────────────────────────────────────

export const EMPTY_FINDER_FILTERS = {
  q: "",
  education: [],
  branches: [],
  skills: [],
  workModes: [],
  type: "",
  stipend: "",
  duration: "",
  deadline: "",
  location: "",
  fresher: false,
  government: false,
  it: false,
  showExpired: true, // all internships are shown; active ones first, expired last
};

function stipendMatches(r, value) {
  if (!value) return true;
  if (value === "unpaid") return !r.paid;
  if (value === "paid") return r.paid;
  if (value === "performance") return r.performance;
  const [lo, hi] = value.split("-").map((n) => (n ? Number(n) : null));
  return r.amount >= lo && (hi == null || r.amount <= hi);
}

function deadlineMatches(r, value) {
  if (value === "") return true;
  return r.daysLeft != null && r.daysLeft >= 0 && r.daysLeft <= Number(value);
}

const anyOf = (selected, have) => !selected.length || selected.some((v) => have.has(v));

/** Search words all have to appear somewhere in the internship. */
function searchScore(r, q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 1;
  if (!words.every((w) => r.all.includes(w))) return 0;
  const title = clean(r.item.internship_title).toLowerCase();
  return 1 + words.filter((w) => title.includes(w)).length;
}

export function filterInternships(rows, f) {
  const out = [];
  for (const r of rows) {
    if (r.expired && !f.showExpired) continue;
    if (!anyOf(f.education, r.education)) continue;
    if (!anyOf(f.branches, r.branches)) continue;
    if (!anyOf(f.skills, r.skills)) continue;
    if (!anyOf(f.workModes, r.workModes)) continue;
    if (f.type && r.item.internship_type !== f.type) continue;
    if (!stipendMatches(r, f.stipend)) continue;
    if (f.duration && !(r.months != null && DURATION_OPTIONS.find((o) => o.value === f.duration)?.test(r.months))) continue;
    if (!deadlineMatches(r, f.deadline)) continue;
    if (f.location === PAN_INDIA ? !r.panIndia : f.location && !r.states.includes(f.location)) continue;
    if (f.fresher && !r.fresher) continue;
    if (f.government && !r.government) continue;
    if (f.it && !r.it) continue;
    const score = searchScore(r, f.q);
    if (!score) continue;
    out.push({ ...r, score });
  }
  return out;
}

export function sortInternships(rows, sort) {
  const byDeadline = (a, b) => (a.daysLeft ?? 99999) - (b.daysLeft ?? 99999);
  const list = [...rows];
  // Active internships always come first, expired ones last.
  const openFirst = (a, b) => Number(a.expired) - Number(b.expired);
  if (sort === "newest") return list.sort((a, b) => openFirst(a, b) || b.createdAt - a.createdAt);
  if (sort === "closing") return list.sort((a, b) => openFirst(a, b) || (a.expired ? byDeadline(b, a) : byDeadline(a, b)));
  if (sort === "stipend") return list.sort((a, b) => openFirst(a, b) || b.amount - a.amount || byDeadline(a, b));
  // Most relevant: open first, featured, best search match, then the soonest deadline.
  return list.sort((a, b) =>
    openFirst(a, b) || Number(b.featured) - Number(a.featured) || b.score - a.score || byDeadline(a, b) || b.createdAt - a.createdAt);
}

/** States that have at least one internship (for the Location dropdown). */
export function locationOptions(rows) {
  const counts = new Map();
  let pan = 0;
  for (const r of rows) {
    if (r.panIndia) pan++;
    for (const s of r.states) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [
    ...(pan ? [{ value: PAN_INDIA, count: pan }] : []),
    ...[...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([value, count]) => ({ value, count })),
  ];
}

/** Applied filters as chips: [{ key, value?, label }] — key/value is what to remove. */
export function activeFilterChips(f) {
  const chips = [];
  for (const v of f.education) chips.push({ key: "education", value: v, label: v });
  for (const v of f.branches) chips.push({ key: "branches", value: v, label: v });
  for (const v of f.skills) chips.push({ key: "skills", value: v, label: v });
  for (const v of f.workModes) chips.push({ key: "workModes", value: v, label: v });
  if (f.type) chips.push({ key: "type", label: f.type });
  if (f.stipend) chips.push({ key: "stipend", label: STIPEND_OPTIONS.find((o) => o.value === f.stipend)?.label });
  if (f.duration) chips.push({ key: "duration", label: DURATION_OPTIONS.find((o) => o.value === f.duration)?.label });
  if (f.deadline) chips.push({ key: "deadline", label: DEADLINE_OPTIONS.find((o) => o.value === f.deadline)?.label });
  if (f.location) chips.push({ key: "location", label: f.location });
  if (f.fresher) chips.push({ key: "fresher", label: "Fresher" });
  if (f.government) chips.push({ key: "government", label: "Government" });
  if (f.it) chips.push({ key: "it", label: "IT / Software" });
  if (!f.showExpired) chips.push({ key: "showExpired", label: "Active only" });
  return chips;
}

export function removeFilter(f, { key, value }) {
  if (Array.isArray(f[key])) return { ...f, [key]: f[key].filter((v) => v !== value) };
  return { ...f, [key]: EMPTY_FINDER_FILTERS[key] };
}

export const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
