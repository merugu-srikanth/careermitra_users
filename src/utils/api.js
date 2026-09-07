export const API_BASE_URL = "https://www.careermitra.in/api";

export const API_ENDPOINTS = {
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  AUTH: `${API_BASE_URL}/auth`,
  JOBS: `${API_BASE_URL}/jobs`,
  MEDIA: `${API_BASE_URL}/media`,
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
  sort: "newest",
  jobType: "jobs",
  categoryId: "",
};

export function buildJobsListUrl(baseUrl, { page, limit, sort, jobType, categoryId } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (sort === "deadline") {
    params.set("closing_soon", "true");
  } else {
    params.set("sort", sort);
  }
  if (jobType) params.set("job_type", jobType);
  if (categoryId) params.set("category_id", categoryId);
  return `${baseUrl}/jobs?${params.toString()}`;
}

export const isApiSuccess = (responseData) =>
  Boolean(responseData?.success ?? responseData?.status);

export const getApiMessage = (responseData, fallback = "Request failed") =>
  responseData?.message || fallback;
