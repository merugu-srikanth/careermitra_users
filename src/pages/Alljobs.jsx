import { useState, useMemo } from "react";
import AllJobCard from "../components/AllJobCard";
import SEO from "../components/SEO";
import { getDeadlineStatusText, isDeadlineExpired, getDeadlineDayDifference } from "../utils/jobDeadline";
import { useJobs } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";


// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 shrink-0">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const BriefcaseEmptyIcon = () => (
  <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-orange-200 mx-auto mb-4">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const TableIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const GraduationIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 3L1 9l11 6 11-6-11-6z" />
    <path d="M5 13v6a8 8 0 0 0 14 0v-6" />
  </svg>
);

const ITEMS_PER_PAGE = 12;
const JOB_TYPE_TABS = [
  { key: "jobs", label: "Jobs" },
  { key: "internship", label: "Internships" },
  { key: "skillup", label: "Skillup" },
  // { key: "jobs", label: "jobs" },
];

const normalizeExternalUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

// pickFirst and toDateOnly helper functions have been removed since mapping is handled in context

// mapApiJob helper has been removed since jobs are mapped via context

// ── Pagination ─────────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = [];
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-12">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevLeft />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200
              ${p === current
                ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-110"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
              }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevRight />
      </button>
    </div>
  );
}

// ── Table View Component ──────────────────────────────────────────────────────
function TableView({ jobs, onApply, onViewNotification, onViewQual }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-y-auto max-h-[70vh]">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-linear-to-r from-orange-50 to-amber-50 sticky top-0">
            <tr>
              <th scope="col" className="w-10 px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">s no</th>
              <th scope="col" className="w-[28%] px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="w-[16%] px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Qualification</th>
              <th scope="col" className="w-[12%] px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
              <th scope="col" className="w-[8%] px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Posts</th>
              <th scope="col" className="w-[8%] px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Age Limit</th>
              {/* <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th> */}
              <th scope="col" className="w-[14%] px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Dates</th>
              <th scope="col" className="w-[14%] px-2 py-3 border border-amber-300 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {jobs.map((job, idx) => {
              const isExpired = isDeadlineExpired(job.lastDate);
              const isActive = !isExpired;
              const deadlineStatusText = getDeadlineStatusText(job.lastDate);
              const isExpiryAlert = String(deadlineStatusText || "").toLowerCase().includes("expires");
              return (
                <tr key={job.id} className="hover:bg-orange-50/30 transition-colors duration-150 group">
                  <td className="px-2 py-3 border border-amber-300 align-top text-sm text-gray-400 font-mono">{idx + 1}</td>
                  <td className="px-2 py-3 border border-amber-300 align-top">
                    <div className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors whitespace-normal wrap-break-word leading-snug">
                      {job.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <BuildingIcon />
                      <span className="whitespace-normal wrap-break-word leading-snug">{job.org}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 align-top">
                    <div className="text-xs text-gray-600 leading-snug">
                      {job.qualifications && job.qualifications.length > 30
                        ? `${job.qualifications.substring(0, 30)}...`
                        : (job.qualifications || "-")}
                    </div>
                    {job.qualifications && job.qualifications.length > 30 && (
                      <button
                        onClick={() => onViewQual({ title: job.title, qualifications: job.qualifications })}
                        className="mt-1 text-[11px] font-semibold text-orange-500 hover:text-orange-700 hover:underline transition-colors"
                      >
                        View More ↓
                      </button>
                    )}
                  </td>
                  <td className="px-2 py-3 border border-amber-300 align-top">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 whitespace-normal wrap-break-word leading-snug">
                      {job.category}
                    </span>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 align-top">
                    <div className="flex items-center gap-1.5">
                      <UsersIcon />
                      <span className="text-sm font-semibold text-gray-700">{job.noOfPosts?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 align-top text-sm text-gray-600 whitespace-normal wrap-break-word">{job.age} years</td>
                  {/* <td className="px-2 py-3 border border-amber-300 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <LocationIcon />
                      <span className="text-sm text-gray-600">{job.location || "All India"}</span>
                    </div>
                  </td> */}
                  <td className="px-2 py-3 border border-amber-200 align-top">
                    <div className="flex flex-col gap-2 text-xs leading-snug">
                      <div className="flex items-start gap-1.5 text-gray-600">
                        <span className="mt-0.5 shrink-0"><CalendarIcon /></span>
                        <div className="min-w-0 whitespace-normal wrap-break-word">
                          <span className="font-semibold text-gray-500">Posted:</span>{" "}
                          <span className="font-medium text-gray-700">{job.postedDate || "-"}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0"><CalendarIcon /></span>
                        <div className="min-w-0 flex flex-col gap-1">
                          <span className={`font-semibold whitespace-normal wrap-break-word ${isExpired ? "text-red-600" : "text-orange-700"}`}>
                            Deadline: {job.lastDate || "-"}
                          </span>
                          {deadlineStatusText && (
                            <span
                              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-bold border ${isExpiryAlert
                                ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                                : isExpired
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : "bg-green-100 text-green-700 border-green-300"
                                }`}
                            >
                              {deadlineStatusText}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 align-top text-center">
                    <div className="flex flex-col items-stretch justify-center gap-1.5">
                      <button
                        onClick={() => onViewNotification(job.notificationUrl, isExpired)}
                        disabled={!isActive || !job.notificationUrl}
                        className={`text-xs font-bold px-2 py-1.5 rounded-lg transition-all duration-200 whitespace-normal wrap-break-word leading-tight
                          ${isActive && job.notificationUrl
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        View Notification
                      </button>
                      <button
                        onClick={() => onApply(job.applyLink, isExpired)}
                        disabled={!isActive}
                        className={`text-xs font-bold px-2 py-1.5 rounded-lg transition-all duration-200 whitespace-normal wrap-break-word leading-tight
                          ${isActive
                            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {isActive ? "Apply" : "Closed"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AllJobs() {
  const { token } = useAuth();
  const { allJobs, loading: contextLoading, error: contextError } = useJobs();

  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [qualModal, setQualModal] = useState(null); // stores qualification text to show in modal
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortBy, setSortBy] = useState("newest");
  const [jobType, setJobType] = useState("jobs");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState(() => (
    typeof window !== "undefined" && window.innerWidth < 768 ? "grid" : "table"
  )); // "grid" or "table"

  const loading = contextLoading;
  const error = contextError;

  const categoryOptions = useMemo(() => {
    const fetchedCategories = [];
    const seenCatIds = new Set();
    allJobs.forEach((job) => {
      if (!job.categoryId || seenCatIds.has(job.categoryId)) return;
      seenCatIds.add(job.categoryId);
      fetchedCategories.push({ id: job.categoryId, name: job.category || "General" });
    });
    return fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [allJobs]);

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...allJobs];

    // 1. Filter by jobType
    if (jobType) {
      result = result.filter((j) => {
        const type = String(j.jobType || "").toLowerCase();
        if (jobType === "jobs") {
          return type !== "internship" && type !== "skillup" && type !== "skill_up";
        } else if (jobType === "internship") {
          return type === "internship" || type === "internships";
        } else if (jobType === "skillup") {
          return type === "skillup" || type === "skill up" || type === "skill_up";
        }
        return true;
      });
    }

    // 2. Filter by search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (j) =>
          String(j.title || "").toLowerCase().includes(q) ||
          String(j.org || "").toLowerCase().includes(q) ||
          String(j.qualifications || "").toLowerCase().includes(q)
      );
    }

    // 3. Filter by category (State)
    if (selectedCategoryId) {
      result = result.filter((j) => String(j.categoryId) === String(selectedCategoryId));
    }

    // 4. Filter by status
    if (statusFilter === "active") {
      result = result.filter((j) => !isDeadlineExpired(j.lastDate));
    } else if (statusFilter === "expired") {
      result = result.filter((j) => isDeadlineExpired(j.lastDate));
    } else if (statusFilter === "expiring_soon") {
      result = result.filter((j) => {
        if (isDeadlineExpired(j.lastDate)) return false;
        const days = getDeadlineDayDifference(j.lastDate);
        return days !== null && days >= 0 && days <= 7;
      });
    }

    // 5. Sort
    if (sortBy === "newest" || sortBy === "oldest") {
      const asc = sortBy === "oldest";
      result.sort((a, b) => {
        const dateA = new Date(a.postedDateRaw || a.createdAt || 0);
        const dateB = new Date(b.postedDateRaw || b.createdAt || 0);
        return asc ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === "deadline") {
      result.sort((a, b) => {
        if (!a.lastDate && !b.lastDate) return 0;
        if (!a.lastDate) return 1;
        if (!b.lastDate) return -1;
        return new Date(a.lastDate) - new Date(b.lastDate);
      });
    }

    return result;
  }, [allJobs, jobType, search, selectedCategoryId, statusFilter, sortBy]);

  // Total items matching filters
  const totalItems = filteredAndSortedJobs.length;

  // Total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  // Paginated subset
  const paginated = useMemo(() => {
    return filteredAndSortedJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [filteredAndSortedJobs, page]);

  // Total Posts (vacancies sum of matching filtered items)
  const totalPosts = useMemo(() => {
    return filteredAndSortedJobs.reduce((s, j) => s + (Number(j.noOfPosts) || 0), 0);
  }, [filteredAndSortedJobs]);

  // Note: organisationsCount and the reset page useEffect are removed to resolve ESLint issues. Page resetting is handled in event handlers.

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = Boolean(search || selectedCategoryId || statusFilter !== "active" || sortBy !== "newest" || jobType !== "jobs");

  const clearFilters = () => {
    setSearch("");
    setSelectedCategoryId("");
    setStatusFilter("active");
    setSortBy("newest");
    setJobType("jobs");
    setPage(1);
  };

  const handleApply = (applyLink, isExpired) => {
    if (isExpired) return;
    const url = normalizeExternalUrl(applyLink);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleViewNotification = (notificationUrl, isExpired) => {
    if (isExpired || !notificationUrl) return;
    const url = normalizeExternalUrl(notificationUrl);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };



  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50/40 via-white to-green-50/20">
      <SEO
        title="Government Jobs 2026: Latest Govt Jobs Notifications in India | Careermitra"
        description="Get latest Government Jobs 2026 notifications, Sarkari Naukri updates, exam alerts, results, and recruitment updates across India."
        keywords="government jobs 2026, latest govt jobs notifications, sarkari naukri 2026, free job alerts, govt job updates, central govt jobs, state govt jobs, latest recruitment notifications"
        url="https://www.careermitra.in/jobs"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-b from-orange-100 via-orange-100 to-orange-700 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center mt-9">
          {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-orange-500/90 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-white/25">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {totalItems} Active Listings • {totalPosts.toLocaleString()} Total Vacancies
          </div> */}

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-4 tracking-tight leading-none">
            Government{" "}
            <span className="text-orange-600">Job Listings</span>
          </h1>
          <p className="text-orange-600 text-xl max-w-2xl mx-auto mb-10">
            Verified government vacancies from top organisations across India. Updated regularly.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl p-1.5 gap-2 border border-white/30">
              <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0">
                <SearchIcon />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by title, organisation..."
                  className="flex-1 min-w-0 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent py-2.5"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    <XIcon />
                  </button>
                )}
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-base font-bold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md shrink-0 w-full sm:w-auto">
                Search
              </button>
            </div>
          </div>

          {/* <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { label: "Total Jobs", val: totalItems },
              { label: "Total Posts", val: totalPosts.toLocaleString() },
              { label: "Organisations", val: organisationsCount },
              { label: "Categories", val: categoryOptions.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-2.5 text-white text-center min-w-25">
                <div className="text-2xl font-black">{stat.val}</div>
                <div className="text-sm text-orange-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Job Type Tabs ───────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {JOB_TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setJobType(tab.key);
                setSelectedCategoryId("");
                setPage(1);
              }}
              className={`text-sm font-bold px-4 py-2 rounded-xl border transition-all duration-200
                ${jobType === tab.key
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-sm sm:text-base text-gray-500 text-center sm:text-left">
            Showing <span className="font-bold text-gray-800">{paginated.length}</span> jobs
            {hasFilters && <span className="text-orange-500 font-semibold"> (filtered)</span>}
            <span className="text-gray-400"> • Page {page} of {totalPages || 1}</span>
          </p>
 
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white shadow-sm text-orange-500" : "text-gray-500 hover:text-orange-400"}`}
                title="Grid View"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === "table" ? "bg-white shadow-sm text-orange-500" : "text-gray-500 hover:text-orange-400"}`}
                title="Table View"
              >
                <TableIcon />
              </button>
            </div>
 
            {/* Sort Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => { setSortBy("newest"); setPage(1); }}
                className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${sortBy === "newest"
                    ? "bg-white shadow-sm text-orange-500 font-extrabold"
                    : "text-gray-500 hover:text-orange-400"
                  }`}
              >
                Latest Posted
              </button>
              <button
                onClick={() => { setSortBy("deadline"); setPage(1); }}
                className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${sortBy === "deadline"
                    ? "bg-white shadow-sm text-orange-500 font-extrabold"
                    : "text-gray-500 hover:text-orange-400"
                  }`}
              >
                Closing within 1 Week
              </button>
            </div>

            {/* Sort */}
            {/* <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="text-base border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-600 font-medium cursor-pointer"
            >
              <option value="newest">Latest Posted</option>
              <option value="oldest">Oldest Posted</option>
              <option value="deadline">Closing Soonest</option>
            </select> */}


            {/* Clear */}
            {/* {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-2 rounded-xl transition-all duration-200"
              >
                <XIcon /> Clear All
              </button>
            )} */}
          </div>
        </div>

        {/* ── Job Display (Grid or Table) ───────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Jobs...</h3>
            <p className="text-gray-400 text-sm">Please wait while we fetch latest listings.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <h3 className="text-xl font-bold text-red-600 mb-2">Failed to load jobs</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">{error}</p>
            <button
              onClick={() => setPage(1)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-200"
            >
              Retry
            </button>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <BriefcaseEmptyIcon />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Jobs Found</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              {hasFilters
                ? "No jobs match your current filters. Try adjusting your search."
                : "No active listings right now. Check back soon."}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.map((job) => (
              <AllJobCard
                key={job.id}
                title={job.title}
                org={job.org}
                lastDate={job.lastDate}
                postedDate={job.postedDate}
                // location={job.location}
                applyLink={job.applyLink}
                notificationUrl={job.notificationUrl}
                noOfPosts={job.noOfPosts}
                age={job.age}
                qualifications={job.qualifications}
                category={job.category}
              />
            ))}
          </div>
        ) : (
          <TableView jobs={paginated} onApply={handleApply} onViewNotification={handleViewNotification} onViewQual={setQualModal} />
        )}

        {/* ── Pagination ───────────────────────────────────────────────────────── */}
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />

        {paginated.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min((page - 1) * ITEMS_PER_PAGE + paginated.length, totalItems || paginated.length)} of {totalItems || paginated.length} jobs
          </p>
        )}
      </div>

      {/* ── Qualification Modal ── */}
      {qualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setQualModal(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                  <svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">Qualification Requirements</h3>
              </div>
              <button
                onClick={() => setQualModal(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <XIcon />
              </button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto px-5 py-4">
              <h4 className="text-sm font-bold text-slate-900 mb-3">{qualModal.title}</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{qualModal.qualifications}</p>
            </div>
            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                onClick={() => setQualModal(null)}
                className="w-full py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}