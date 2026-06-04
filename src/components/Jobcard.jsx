import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CalIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-500">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const PinIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-400">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const BagIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-400">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const PersonIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-400">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PostsIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-green-600">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const GridIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const TableIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

// Grid View Component (Mobile First)
function JobGridCard({
  title, org, lastDate, postedDate, location, applyLink,
  noOfPosts, age, qualifications, category
}) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const isExpired = lastDate && new Date(lastDate) < new Date();
  const isLoggedIn = Boolean(user || token || localStorage.getItem("token"));

  const handleApply = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      const url = applyLink?.startsWith("http") ? applyLink : `https://${applyLink}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate("/register");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, day] = d.split("-");
      return `${day}/${m}/${y}`;
    }
    const parsed = new Date(d);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-GB");
    }
    return d;
  };

  const getDaysLeftLabel = (d) => {
    if (!d) return "";
    const deadline = new Date(d);
    if (Number.isNaN(deadline.getTime())) return "";

    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / msPerDay);

    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Last day";
    if (daysLeft === 1) return "1 day left";
    return `${daysLeft} days left`;
  };

  const isActive = Boolean(lastDate) && !isExpired;

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden h-full hover:shadow-lg transition-shadow">
      <style>{`@keyframes daysZoomBlink { 0% { opacity: 0.75; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.07); } 100% { opacity: 0.75; transform: scale(0.95); } }`}</style>
      <div className="h-0.75 bg-orange-500 shrink-0" />
      <div className="flex flex-col gap-3 p-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          {category ? (
            <span className="self-start text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          ) : (
            <span className="self-start text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full">
              Job
            </span>
          )}

          {!!lastDate && (
            <span
              className={`text-[11px] font-semibold ${isExpired ? "text-red-500" : "text-green-600"}`}
              style={!isExpired ? { animation: "daysZoomBlink 1s ease-in-out infinite" } : undefined}
            >
              {isActive ? "Active - " : ""}{getDaysLeftLabel(lastDate)}
            </span>
          )}
        </div>
        <h2 className="text-S font-medium text-gray-900 leading-snug line-clamp-2">
          {title}
        </h2>
        <div className="relative">
          <div>
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-start gap-2">
                <BagIcon /><span className="text-sm text-gray-500 w-20 shrink-0">Organisation</span>
                <span className="text-sm font-medium text-gray-800 line-clamp-1">{org}</span>
              </div>
              {location && (
                <div className="flex items-center gap-2">
                  <PinIcon /><span className="text-sm text-gray-500 w-20 shrink-0">Location</span>
                  <span className="text-sm font-medium text-gray-800">{location}</span>
                </div>
              )}
              {age && (
                <div className="flex items-center gap-2">
                  <PersonIcon /><span className="text-sm text-gray-500 w-20 shrink-0">Age limit</span>
                  <span className="text-sm font-medium text-gray-800">{isLoggedIn ? `${age} years` : "Login required"}</span>
                </div>
              )}
              {noOfPosts && (
                <div className="flex items-center gap-2">
                  <PostsIcon /><span className="text-sm text-gray-500 w-20 shrink-0">Vacancies</span>
                  {isLoggedIn ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <PostsIcon /> {noOfPosts} {noOfPosts === 1 ? "Post" : "Posts"}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-800">Login required</span>
                  )}
                </div>
              )}
            </div>
            {qualifications && isLoggedIn && (
              <>
                <hr className="border-gray-100" />
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                  {qualifications}
                </p>
              </>
            )}
          </div>

          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-white/90 border border-orange-200 px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                Login to view full job details
              </span>
            </div>
          )}
        </div>
      </div>





      <div className="flex flex-col gap-2 px-2 py-2.5 bg-gray-50 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
           <CalIcon />
           <span className={`text-sm font-medium ${isExpired ? "text-red-500" : "text-orange-600"}`}>
      {isExpired ? "Expired: " : "Last date: "}{formatDate(lastDate)}
          </span>
  </div>



  <button
    onClick={handleApply}
    disabled={isExpired}
    className={`relative inline-flex items-center justify-center overflow-hidden text-sm font-medium px-1 py-1.5 rounded-lg shrink-0 whitespace-nowrap self-end sm:self-auto min-w-32.5
    ${isExpired
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer before:absolute before:inset-0 before:bg-linear-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full before:animate-[shine_1.2s_linear_infinite] hover:before:animate-none"
    }`}
  >
    <span className="relative z-10">
      {isExpired ? "Closed" : isLoggedIn ? "Apply Now →" : "Register & Apply"}
    </span>
  </button>
</div>
      











    </div>
  );
}

// Table View Component (Desktop First)
function JobTableRow({
  title, org, lastDate, postedDate, location, applyLink,
  noOfPosts, age, qualifications, category
}) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const isExpired = lastDate && new Date(lastDate) < new Date();
  const isLoggedIn = Boolean(user || token || localStorage.getItem("token"));

  const handleApply = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      const url = applyLink?.startsWith("http") ? applyLink : `https://${applyLink}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate("/register");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, day] = d.split("-");
      return `${day}/${m}/${y}`;
    }
    const parsed = new Date(d);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-GB");
    }
    return d;
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          {category && (
            <span className="text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full w-fit">
              {category}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-900">{title}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{org}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{location || "-"}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{isLoggedIn ? (age ? `${age} years` : "-") : "Login required"}</td>
      <td className="px-4 py-3">
        {noOfPosts && isLoggedIn ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
            <PostsIcon /> {noOfPosts}
          </span>
        ) : "-"}
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">{isLoggedIn ? (qualifications || "-") : "Login to view"}</p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <CalIcon />
          <span className={`text-xs font-medium ${isExpired ? "text-red-500" : "text-orange-600"}`}>
            {formatDate(lastDate)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <CalIcon />
          <span className={`text-xs font-medium ${isExpired ? "text-red-500" : "text-orange-600"}`}>
            {formatDate(postedDate)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <button onClick={handleApply} disabled={isExpired}
          className={`inline-flex min-w-29 items-center justify-center text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap
            ${isExpired ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"}`}>
          {isExpired ? "Closed" : isLoggedIn ? "Apply" : "Register & Apply"}
        </button>
      </td>
    </tr>
  );
}

// Main Component with View Toggle
export default function JobList(props) {
  const {
    jobs,
    title,
    org,
    lastDate,
    postedDate,
    location,
    applyLink,
    noOfPosts,
    age,
    qualifications,
    category,
  } = props;

  const isListMode = Array.isArray(jobs);
  const singleJob = {
    title,
    org,
    lastDate,
    postedDate,
    location,
    applyLink,
    noOfPosts,
    age,
    qualifications,
    category,
  };
  const hasSingleJobData = Boolean(title || org || applyLink || lastDate || category);
  const normalizedJobs = isListMode ? jobs : hasSingleJobData ? [singleJob] : [];

  // Support legacy single-card usage in Home/Latest sections.
  if (!isListMode) {
    if (!hasSingleJobData) return null;
    return <JobGridCard {...singleJob} />;
  }

  const [viewMode, setViewMode] = useState(() => {
    // Auto-detect based on screen size
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 'table' : 'grid';
    }
    return 'table';
  });

  // Listen to screen resize for auto-switching
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop && viewMode === 'grid') {
        setViewMode('table');
      } else if (!isDesktop && viewMode === 'table') {
        setViewMode('grid');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* View Toggle Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          title="Grid View"
        >
          <GridIcon />
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          title="Table View"
        >
          <TableIcon />
        </button>
      </div>

      {/* Grid View - Mobile First */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {normalizedJobs.map((job, index) => (
            <JobGridCard key={index} {...job} />
          ))}
        </div>
      )}

      {/* Table View - Desktop First */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Organisation
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Age Limit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vacancies
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Qualifications
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Posted Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {normalizedJobs.map((job, index) => (
                <JobTableRow key={index} {...job} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {normalizedJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found</p>
        </div>
      )}
    </div>
  );
}