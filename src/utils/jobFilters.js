/**
 * Public jobs filter state ⇄ URL query ⇄ API params.
 * The URL uses the same names as GET /api/jobs, so a shared link like
 * /latest-job-notifications?state=Telangana&qualificationLevel=Graduation
 * maps 1:1 onto the API query.
 */

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
};

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest posted" },
  { value: "deadline", label: "Deadline (soonest first)" },
  { value: "posts", label: "Most posts" },
  { value: "title", label: "Title (A–Z)" },
];

export const APPLICATION_STATUS_OPTIONS = [
  { value: "", label: "Open" },
  { value: "closingSoon", label: "Closing soon (7 days)" },
  { value: "closed", label: "Closed" },
];

/** URLSearchParams → filters (unknown / invalid values ignored). */
export function filtersFromSearchParams(sp) {
  const filters = { ...EMPTY_JOB_FILTERS };
  for (const key of LIST_FILTER_KEYS) filters[key] = sp.get(key) || "";
  const age = sp.get("age");
  if (age && /^\d{1,3}$/.test(age)) filters.age = age;
  const status = sp.get("applicationStatus");
  if (status === "closingSoon" || status === "closed") filters.applicationStatus = status;
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
  return params;
}

/** Filters + search + sort → URL query string for sharing. */
export function filtersToUrlQuery(filters, { q = "", sort = "" } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  for (const [key, value] of Object.entries(filtersToApiParams(filters))) {
    if (key !== "includeAllIndia") params.set(key, value);
  }
  if (filters.state && filters.state !== "All India" && !filters.includeAllIndia) params.set("includeAllIndia", "false");
  if (sort && sort !== "latest") params.set("sort", sort);
  return params.toString();
}

export function countActiveFilters(filters) {
  return Object.keys(filtersToApiParams(filters)).filter((k) => k !== "includeAllIndia").length;
}
