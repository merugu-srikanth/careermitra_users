import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Search, FileText, Building2, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";

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

const isSkillUpdate = (item) => {
  const haystack = `${item?.subject || ""} ${item?.category || ""} ${item?.comments || ""}`.toLowerCase();
  return /(skill|upskill|training|course|workshop|certification|bootcamp|webinar)/.test(haystack);
};

/* ── Skeleton loader rows ──────────────────────────────────────────────── */
const SkeletonRow = ({ i }) => (
  <tr className="border-b border-orange-50">
    {[40, 20, 25, 30, 20].map((w, ci) => (
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

/* ── Mobile card skeleton ──────────────────────────────────────────────── */
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
              Internship Detail
            </span>
            <h2 className="text-lg font-black text-white leading-snug">{item.subject}</h2>
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
              <span className="text-gray-700 font-semibold">{formatDate(item.date)}</span>
              <span className="text-gray-400 text-xs">Posted</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-semibold">{formatDate(item.updatedAt)}</span>
              <span className="text-gray-400 text-xs">Updated</span>
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Eligibility / Category</p>
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {item.category || "Not specified"}
            </p>
          </div>

          {/* Details / Comments */}
          <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-2">Details</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {item.comments || "No additional details provided."}
            </p>
          </div>

          {/* Apply button */}
          <a
            href={normalizeLink(item.link)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

/* ── Mobile Card ───────────────────────────────────────────────────────── */
const MobileCard = ({ item, onView }) => (
  <article className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
    <div className="h-1 w-full" style={{ background: "linear-gradient(to right,#f97316,#fbbf24)" }} />
    <div className="p-2">
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-0.5 p-2 rounded-xl bg-orange-50 text-orange-500">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{item.subject}</h3>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-orange-50 text-[11px] font-semibold text-orange-600">
            <Calendar className="w-3 h-3" /> {formatDate(item.date)}
          </span>
        </div>
      </div>

      <p className="text-[11px] sm:text-xs text-gray-500 mb-3 bg-gray-50 rounded-xl p-2 leading-relaxed wrap-break-word whitespace-normal line-clamp-none sm:line-clamp-2">
        {item.category || "No eligibility specified"}
      </p>

      <div className="flex gap-1">
        <button
          onClick={() => onView(item)}
          className="flex-1 flex items-center gap-1 justify-center  py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View Details
        </button>
        <a
          href={normalizeLink(item.link)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          Apply <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </article>
);

/* ── Pagination ────────────────────────────────────────────────────────── */
const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;

  /* Build page number array with ellipsis */
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
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
              p === current
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

/* ── Main Component ────────────────────────────────────────────────────── */
const InternshipTable = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("internships");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("https://careermitra.in/api/public/api/news");
        const result = await res.json();
        if (result.status) {
          setItems(
            (result.data || []).map((item) => ({
              id: item.id,
              subject: item.subject,
              category: item.category,
              comments: item.comments,
              link: item.link,
              date: item.date,
              createdAt: item.created_at,
              updatedAt: item.updated_at,
              type: isSkillUpdate(item) ? "skillups" : "internships",
            }))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const typeFilteredItems = useMemo(() => {
    return items.filter((item) => item.type === activeType);
  }, [items, activeType]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return typeFilteredItems;
    return typeFilteredItems.filter((item) =>
      [item.subject, item.category, item.comments]
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
  const emptyText = activeType === "skillups"
    ? "No skill updates available right now"
    : "No internships found";
  const emptyHint = activeType === "skillups"
    ? "Please check again later for new skill programs and training updates."
    : "Try a different keyword to find matching internship updates.";

  return (
    <section className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>
      {/* ── Content ── */}
      <div className="md:max-w-7xl w-full mx-auto px-1 md:px-6">
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
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeType === "internships"
                  ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Internships
            </button>
            <button
              onClick={() => setActiveType("skillups")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeType === "skillups"
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
            {/* Desktop skeleton */}
            <div className="hidden md:block  rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="">
                  <tr>
                    {["#", "Internship Title", "Posted Date", "Eligibility", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => <SkeletonRow key={i} i={i} />)}
                </tbody>
              </table>
            </div>
            {/* Mobile skeleton */}
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
                <table className="w-full" style={{ minWidth: 780 }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(to right,#fff7ed,#ffedd5)" }}>
                      {["#", `${typeLabel} Title`, "Posted Date", "Eligibility", "View", "Apply"].map((h) => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50/80">
                    {pageItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-orange-50/40 transition-colors group"
                      >
                        {/* # */}
                        <td className="px-4 py-3 text-xs font-bold text-gray-400 whitespace-nowrap">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>

                        {/* Title — single line with ellipsis */}
                        <td className="px-4 py-3 max-w-65">
                          <p className="text-sm font-bold text-gray-900 truncate leading-snug" title={item.subject}>
                            {item.subject}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">Updated {formatDate(item.updatedAt)}</p>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-xs font-semibold text-orange-600">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.date)}
                          </span>
                        </td>

                        {/* Eligibility — single line */}
                        <td className="px-4 py-3 max-w-50">
                          <p className="text-sm text-gray-600 truncate" title={item.category || ""}>
                            {item.category || <span className="text-gray-400 italic text-xs">Not specified</span>}
                          </p>
                        </td>

                        {/* View button */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>

                        {/* Apply */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <a
                            href={normalizeLink(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
                          >
                            Apply <ExternalLink className="w-3.5 h-3.5" />
                          </a>
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

      {/* ── Detail Modal ── */}
      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default InternshipTable;