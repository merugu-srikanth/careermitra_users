import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Search, FileText, Building2, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useJobs } from "../context/JobContext";

const JOBS_API = "https://careermitra.in/api/jobs";
const ITEMS_PER_PAGE = 10;

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const normalizeLink = (link) => {
  if (!link) return "#";
  return link.startsWith("http") ? link : `https://${link}`;
};

const normalizeJob = (item) => ({
  id: item._id,
  title: item.title,
  org: item.source_name || "-",
  qualifications: item.qualifications || "-",
  applyLink: item.apply_link || null,
  notificationUrl: item.notification_url || null,
  postedDate: item.posted_date || null,
  deadline: item.application_deadline || null,
  age: item.age || "-",
  posts: item.no_of_posts ?? "-",
  type: item.job_type === "internship" ? "internships" : "skillups",
});

/* ── Skeleton loader rows ──────────────────────────────────────────────── */
const SkeletonRow = ({ i }) => (
  <tr className="border-b border-orange-50">
    {[30, 25, 20, 25, 20, 15].map((w, ci) => (
      <td key={ci} className="px-4 py-3">
        <div
          className="h-4 rounded-lg animate-pulse"
          style={{
            width: `${w + Math.random() * 20}%`,
            background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.6s ease-in-out infinite ${i * 0.08}s`,
          }}
        />
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-orange-100 p-4 space-y-3">
    <div className="h-5 w-3/4 rounded-lg bg-gray-200 animate-pulse" />
    <div className="h-4 w-1/3 rounded-full bg-orange-100 animate-pulse" />
    <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
    <div className="h-10 rounded-xl bg-orange-100 animate-pulse" />
  </div>
);

/* ── Detail Modal ──────────────────────────────────────────────────────── */
const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.28s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        {/* Modal header */}
        <div className="relative rounded-t-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 40%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative p-6 pr-14">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200 block mb-1">
              {item.type === "internships" ? "Internship" : "Skill Up"}
            </span>
            <h2 className="text-lg font-black text-white leading-snug">{item.title}</h2>
            <p className="text-orange-100 text-xs mt-1 font-medium">{item.org}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/35 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-4">
          {/* Date row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl text-sm">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700 font-semibold">{formatDate(item.postedDate)}</span>
              <span className="text-gray-400 text-xs">Start Date</span>
            </div>
            {item.deadline && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-sm">
                <Calendar className="w-4 h-4 text-red-400" />
                <span className="text-gray-700 font-semibold">{formatDate(item.deadline)}</span>
                <span className="text-gray-400 text-xs">Deadline</span>
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Posts</p>
              <p className="text-base font-black text-orange-500">{item.posts}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Age Limit</p>
              <p className="text-sm font-bold text-gray-800">{item.age}</p>
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-2">Qualifications</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.qualifications}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            {item.applyLink && (
              <a
                href={normalizeLink(item.applyLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {item.notificationUrl && (
              <a
                href={normalizeLink(item.notificationUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-orange-600 border-2 border-orange-200 hover:bg-orange-50 transition-all"
              >
                <FileText className="w-4 h-4" /> View Notification
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Mobile Card ───────────────────────────────────────────────────────── */
const MobileCard = ({ item, onView }) => (
  <article className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
    <div className="h-1 w-full" style={{ background: "linear-gradient(to right,#f97316,#fbbf24)" }} />
    <div className="p-3">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-0.5 p-2 rounded-xl bg-orange-50 text-orange-500 shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{item.title}</h3>
          <p className="text-[11px] text-orange-500 font-semibold truncate mt-0.5">{item.org}</p>
        </div>
      </div>

      {/* Date badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-[11px] font-semibold text-orange-600">
          <Calendar className="w-3 h-3" /> {formatDate(item.postedDate)}
        </span>
        {item.deadline && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-[11px] font-semibold text-red-500">
            <Calendar className="w-3 h-3" /> {formatDate(item.deadline)}
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[11px] font-semibold text-blue-500">
          {item.posts} Posts
        </span>
      </div>

      <p className="text-[11px] text-gray-500 mb-3 bg-gray-50 rounded-xl p-2 leading-relaxed line-clamp-2">
        {item.qualifications}
      </p>

      <div className="flex gap-1.5">
        <button
          onClick={() => onView(item)}
          className="flex-1 flex items-center gap-1 justify-center py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        {item.applyLink && (
          <a
            href={normalizeLink(item.applyLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Apply <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  </article>
);

/* ── Pagination ────────────────────────────────────────────────────────── */
const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${p === current
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600"
              }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const InternshipTable = () => {
  const { allJobs, loading: contextLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("internships");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const loading = contextLoading;

  const items = useMemo(() => {
    if (contextLoading) return [];
    return allJobs
      .filter((j) => j.jobType === "internship" || j.jobType === "skillup")
      .map((j) => ({
        id: j.id,
        title: j.title,
        org: j.org || "-",
        qualifications: j.qualifications || "-",
        applyLink: j.applyLink || null,
        notificationUrl: j.notificationUrl || null,
        postedDate: j.postedDate || null,
        deadline: j.lastDate || null,
        age: j.age || "-",
        posts: j.noOfPosts ?? "-",
        type: j.jobType === "internship" ? "internships" : "skillups",
      }));
  }, [allJobs, contextLoading]);

  const typeFilteredItems = useMemo(
    () => items.filter((item) => item.type === activeType),
    [items, activeType]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return typeFilteredItems;
    return typeFilteredItems.filter((item) =>
      [item.title, item.org, item.qualifications]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [typeFilteredItems, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeType]);

  const typeLabel = activeType === "skillups" ? "Skill Updates" : "Internships";
  const emptyText = activeType === "skillups" ? "No skill updates available" : "No internships found";
  const emptyHint = activeType === "skillups"
    ? "Check back later for new skill programs and training updates."
    : "Try a different keyword to find matching internships.";

  return (
    <section style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>
      <div className="md:max-w-7xl w-full mx-auto px-1 md:px-6">

        {/* ── Search + Tabs bar ── */}
        <div className="mb-4 md:mb-6 bg-white/90 backdrop-blur rounded-2xl border border-orange-100 p-3 md:p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between shadow-sm">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${typeLabel.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-orange-100 bg-orange-50/40 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div className="self-end md:self-auto inline-flex items-center gap-1.5 p-1 rounded-xl bg-gray-900 shadow-inner">
            <button
              onClick={() => setActiveType("internships")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeType === "internships"
                  ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow"
                  : "text-gray-200 hover:bg-white/10"
                }`}
            >
              <FileText className="w-3.5 h-3.5" /> Internships
            </button>
            <button
              onClick={() => setActiveType("skillups")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeType === "skillups"
                  ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow"
                  : "text-gray-200 hover:bg-white/10"
                }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Skill Updates
            </button>
          </div>
        </div>

        {loading ? (
          <>
            <div className="hidden md:block rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    {["#", "Title", "Organization", "Qualification", "Posted", "Deadline", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{[...Array(8)].map((_, i) => <SkeletonRow key={i} i={i} />)}</tbody>
              </table>
            </div>
            <div className="md:hidden space-y-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-3xl border border-gray-200 shadow-sm px-6 text-center">
            <div className="p-4 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-800">{emptyText}</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">{emptyHint}</p>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="hidden md:block bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: 860 }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(to right,#fff7ed,#ffedd5)" }}>
                      {["#", `${typeLabel} Title`, "Organization", "Qualification", "Start Date", "Deadline", "Posts", "Apply"].map((h) => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50/80">
                    {pageItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-orange-50/40 transition-colors group">
                        {/* # */}
                        <td className="px-4 py-3 text-xs font-bold text-gray-400 whitespace-nowrap">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>
                        {/* Title */}
                        <td className="px-4 py-3 max-w-56">
                          <p className="text-sm font-bold text-gray-900 truncate leading-snug" title={item.title}>
                            {item.title}
                          </p>
                        </td>
                        {/* Org */}
                        <td className="px-4 py-3 max-w-40">
                          <p className="text-xs text-orange-600 font-semibold truncate" title={item.org}>{item.org}</p>
                        </td>
                        {/* Qualification */}
                        <td className="px-4 py-3 max-w-52">
                          <p className="text-xs text-gray-600 truncate" title={item.qualifications}>{item.qualifications}</p>
                        </td>
                        {/* Posted */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-xs font-semibold text-orange-600">
                            <Calendar className="w-3 h-3" />{formatDate(item.postedDate)}
                          </span>
                        </td>
                        {/* Deadline */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-xs font-semibold text-red-500">
                            <Calendar className="w-3 h-3" />{formatDate(item.deadline)}
                          </span>
                        </td>
                        {/* Posts */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-black text-gray-700">{item.posts}</span>
                        </td>
                        {/* Apply */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {item.applyLink && (
                              <a
                                href={normalizeLink(item.applyLink)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-all"
                              >
                                Apply <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="md:hidden space-y-4">
              {pageItems.map((item) => (
                <MobileCard key={item.id} item={item} onView={setSelectedItem} />
              ))}
            </div>

            <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
          </>
        )}
      </div>

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.92) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </section>
  );
};

export default InternshipTable;
