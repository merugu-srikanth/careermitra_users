import { filtersToApiParams } from "./jobFilters";

export const API_BASE_URL = "https://www.careermitra.in/api";

export const API_ENDPOINTS = {
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  AUTH: `${API_BASE_URL}/auth`,
  JOBS: `${API_BASE_URL}/jobs`,
  MEDIA: `${API_BASE_URL}/media`,
  PG_ENTRANCE: `${API_BASE_URL}/pg-entrance`,
};

// ── Public vs. internal origins ─────────────────────────────────────────────
// Browser code must always hit the public origin. Server-side code (Server
// Components, route handlers) should hit the Express service directly so the
// request never leaves the VPS through Nginx only to come back into itself.
//
// INTERNAL_API_URL is a server-only env var (no NEXT_PUBLIC_ prefix — it must
// never reach the client bundle) pointing at the Express service's internal
// origin, e.g. INTERNAL_API_URL=http://127.0.0.1:<express-port>/api. Falls
// back to the public URL when unset so any environment that hasn't been
// configured yet (local dev, preview) keeps working exactly as before.
export const PUBLIC_API_BASE_URL = API_BASE_URL;
export const INTERNAL_API_BASE_URL = process.env.INTERNAL_API_URL || PUBLIC_API_BASE_URL;

// ── Jobs list query — single source of truth ────────────────────────────────
// The "default" listing view (page 1, no filters) — used both by the server
// fetch that seeds first paint and by the client component's initial state,
// so the two are structurally guaranteed to match rather than kept in sync
// by hand.
export const JOBS_LIST_DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  sort: "latest",
  jobType: "jobs",
  categoryId: "",
};

// ── Job-collection listing endpoint per job type ────────────────────────────
// Every listing accepts the same query params (page, limit, sort, search,
// state, district, qualificationLevel, age, applicationStatus, …) and returns
// { data: { jobs, pagination, appliedFilters } }.
//   ""/"all"   → /jobs                    (All Types)
//   jobs       → /jobs?jobType=jobs       (regular jobs + "both")
//   both       → /jobs?jobType=both       (only "both")
//   internship → /jobs/internships        (job-collection internship + "both")
//   skillup    → /jobs/skillup            (only skillups)
// The standalone Internship module (/internships, data.internships) is a
// separate API with its own shape — the Internships page uses it directly.
export function getJobsListingEndpoint(baseUrl, jobType) {
  if (jobType === "skillup") return { url: `${baseUrl}/jobs/skillup`, params: {} };
  if (jobType === "internship") return { url: `${baseUrl}/jobs/internships`, params: {} };
  if (!jobType || jobType === "all") return { url: `${baseUrl}/jobs`, params: {} };
  return { url: `${baseUrl}/jobs`, params: { jobType } };
}

export function buildJobsListingUrl(baseUrl, jobType, query = {}) {
  const { url, params: scopeParams } = getJobsListingEndpoint(baseUrl, jobType);
  const params = new URLSearchParams();
  Object.entries({ ...scopeParams, ...query }).forEach(([key, value]) => {
    // "latest" is the API's default sort — leaving it out also keeps the URL
    // valid for older backends that only know newest/oldest/expired.
    if (key === "sort" && value === "latest") return;
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/** filters: the public filter panel's state (utils/jobFilters.js). */
export function buildJobsListUrl(baseUrl, { page, limit, sort, jobType, categoryId, filters } = {}) {
  return buildJobsListingUrl(baseUrl, jobType, {
    page,
    limit,
    sort,
    categoryId,
    ...filtersToApiParams(filters),
  });
}

export const isApiSuccess = (responseData) =>
  Boolean(responseData?.success ?? responseData?.status);

export const getApiMessage = (responseData, fallback = "Request failed") =>
  responseData?.message || fallback;
