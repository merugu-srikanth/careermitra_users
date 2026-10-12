/**
 * Public jobs filter state ⇄ URL query ⇄ API params.
 * The URL uses the same names as GET /api/jobs, so a shared link like
 * /latest-job-notifications?state=Telangana&qualificationLevel=Graduation
 * maps 1:1 onto the API query.
 */

import { toISTDateKey } from "./istDate";

export const LIST_FILTER_KEYS = [
  "state", "district", "qualificationLevel", "qualificationStream",
  "jobCategory", "sector", "language", "experienceLevel", "employmentNature",
];

export const EMPTY_JOB_FILTERS = {
  state: "",
  district: "",
  includeAllIndia: true,
  qualificationLevel: "",
  qualificationStream: "",
  jobCategory: "",
  sector: "",
  language: "",
  experienceLevel: "", // Freshers | Experienced (tabs above the search)
  employmentNature: "", // Contract (tab)
  age: "",
  applicationStatus: "", // "" = API default (open jobs: open + closing soon)
  closingWithin: "", // "" | "7" | "30" — deadline within N days (IST), sent as deadlineFrom / deadlineTo
};

export const CLOSING_WITHIN_OPTIONS = [
  { value: "", label: "All open" },
  { value: "7", label: "Closing in 7 days" },
  { value: "30", label: "Closing in 30 days" },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest posted" },
  { value: "deadline", label: "Deadline (soonest first)" },
  { value: "posts", label: "Most posts" },
  { value: "title", label: "Title (A–Z)" },
];

// Closed jobs are never public (they move to the Archive), so there is no "Closed" option.
export const APPLICATION_STATUS_OPTIONS = [
  { value: "", label: "Open" },
  { value: "closingSoon", label: "Closing soon (7 days)" },
];

const addDaysKey = (key, n) => new Date(new Date(`${key}T00:00:00Z`).getTime() + n * 86400000).toISOString().slice(0, 10);

/** URLSearchParams → filters (unknown / invalid values ignored). */
export function filtersFromSearchParams(sp) {
  const filters = { ...EMPTY_JOB_FILTERS };
  for (const key of LIST_FILTER_KEYS) filters[key] = sp.get(key) || "";
  const age = sp.get("age");
  if (age && /^\d{1,3}$/.test(age)) filters.age = age;
  const status = sp.get("applicationStatus");
  if (status === "closingSoon") filters.applicationStatus = status;
  const within = sp.get("closingWithin");
  if (CLOSING_WITHIN_OPTIONS.some((o) => o.value && o.value === within)) filters.closingWithin = within;
  if (sp.get("includeAllIndia") === "false") filters.includeAllIndia = false;
  return filters;
}

/** Filters → GET /api/jobs params (only the ones that are set). */
export function filtersToApiParams(filters = {}) {
  const params = {};
  for (const key of LIST_FILTER_KEYS) if (filters[key]) params[key] = filters[key];
  if (filters.state && filters.state !== "All India" && filters.includeAllIndia) params.includeAllIndia = "true";
  if (filters.age !== "" && filters.age !== undefined) params.age = filters.age;
  if (filters.applicationStatus) params.applicationStatus = filters.applicationStatus;
  if (filters.closingWithin) {
    const today = toISTDateKey(new Date());
    params.deadlineFrom = today;
    params.deadlineTo = addDaysKey(today, Number(filters.closingWithin));
  }
  return params;
}

/** Filters + search + sort → URL query string for sharing. */
export function filtersToUrlQuery(filters, { q = "", sort = "" } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  for (const [key, value] of Object.entries(filtersToApiParams(filters))) {
    if (!["includeAllIndia", "deadlineFrom", "deadlineTo"].includes(key)) params.set(key, value);
  }
  if (filters.state && filters.state !== "All India" && !filters.includeAllIndia) params.set("includeAllIndia", "false");
  if (filters.closingWithin) params.set("closingWithin", filters.closingWithin);
  if (sort && sort !== "latest") params.set("sort", sort);
  return params.toString();
}

export function countActiveFilters(filters) {
  return Object.keys(filtersToApiParams(filters)).filter((k) => k !== "includeAllIndia" && k !== "deadlineTo").length;
}
