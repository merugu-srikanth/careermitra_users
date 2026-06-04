import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaVideo, FaImage, FaTag, FaRegClock,
  FaExternalLinkAlt, FaYoutube, FaSearch, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import SEO from "../components/SEO";

/* ─── Config ──────────────────────────────────────────────── */
const API_BASE    = "https://careermitra.in/api/media";
const DEFAULT_LIMIT = 8;

const MEDIA_TABS = [
  { key: "all",     label: "All",     icon: FaCalendarAlt },
  { key: "image",   label: "Images",  icon: FaImage },
  { key: "video",   label: "Videos",  icon: FaVideo },
  { key: "youtube", label: "YouTube", icon: FaYoutube },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

async function fetchAsBase64(url) {
  if (!url) return null;
  try {
    const r = await fetch(url);
    const blob = await r.blob();
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

/* ─── Skeleton ────────────────────────────────────────────── */
function MediaSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
      <div className="h-44 bg-slate-100 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 rounded-full bg-slate-100 animate-pulse w-1/3" />
        <div className="h-4 rounded-full bg-slate-100 animate-pulse w-3/4" />
        <div className="h-3 rounded-full bg-slate-100 animate-pulse w-full" />
      </div>
    </div>
  );
}

/* ─── Card ────────────────────────────────────────────────── */
function MediaCard({ item, index }) {
  const fileUrl = item.file_url?.startsWith("http")
    ? item.file_url
    : `https://careermitra.in/api${item.file_url}`;

  const [mediaSrc, setMediaSrc] = useState(null);

  useEffect(() => {
    if (item.media_type !== "image" && item.media_type !== "video") return;
    let cancelled = false;
    fetchAsBase64(fileUrl).then((src) => { if (!cancelled) setMediaSrc(src); });
    return () => { cancelled = true; };
  }, [fileUrl, item.media_type]);

  const youtubeEmbedUrl = item.youtube_id
    ? `https://www.youtube.com/embed/${item.youtube_id}`
    : item.file_url?.includes("youtube.com/embed/")
      ? item.file_url
      : null;

  const typeBadge = {
    video:   { bg: "bg-rose-50 text-rose-600 border-rose-100",   icon: <FaVideo size={9} />,    label: "Video"   },
    youtube: { bg: "bg-red-50 text-red-600 border-red-100",      icon: <FaYoutube size={9} />,  label: "YouTube" },
    image:   { bg: "bg-violet-50 text-violet-600 border-violet-100", icon: <FaImage size={9} />, label: "Image"  },
  }[item.media_type] || { bg: "bg-slate-50 text-slate-500 border-slate-100", icon: <FaImage size={9} />, label: "Media" };

  return (
    <motion.article
      className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      {/* Media area */}
      <div className="relative overflow-hidden bg-slate-50"
        style={{ height: item.media_type === "youtube" ? "auto" : "11rem" }}>

        {item.media_type === "image" && (
          mediaSrc
            ? <img src={mediaSrc} alt={item.title || "media"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="h-full flex items-center justify-center"><FaImage className="text-slate-300 text-3xl animate-pulse" /></div>
        )}

        {item.media_type === "video" && (
          mediaSrc
            ? <video controls className="h-full w-full object-cover"><source src={mediaSrc} type={item.mime_type || "video/mp4"} /></video>
            : <div className="h-full flex items-center justify-center"><FaVideo className="text-slate-300 text-3xl" /></div>
        )}

        {item.media_type === "youtube" && youtubeEmbedUrl && (
          <iframe
            width="100%" height="200"
            src={youtubeEmbedUrl}
            title={item.title || "YouTube video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="block"
          />
        )}

        {/* Type badge */}
        <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeBadge.bg}`}>
          {typeBadge.icon} {typeBadge.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {item.category && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
            <FaTag size={8} /> {item.category}
          </span>
        )}
        <h3 className="mt-2 text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
          {item.title || "Untitled"}
        </h3>
        {item.description && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        {/* <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 pt-3">
          <span className="flex items-center gap-1">
            <FaRegClock size={9} />
            {formatDate(item.createdAt || item.updatedAt)}
          </span>
          <span className="flex items-center gap-1 text-violet-500 font-medium group-hover:text-violet-700 transition-colors">
            View <FaExternalLinkAlt size={8} />
          </span>
        </div> */}
      </div>
    </motion.article>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function EventsPage() {
  const [media, setMedia]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab]   = useState("all");
  const [sortOrder, setSortOrder]   = useState("newest");
  const [search, setSearch]         = useState("");
  const [error, setError]           = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchMedia() {
      setLoading(true); setError("");
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(DEFAULT_LIMIT), sort: sortOrder });
        if (activeTab !== "all") params.set("media_type", activeTab);
        if (search.trim()) params.set("search", search.trim());
        const response = await fetch(`${API_BASE}?${params.toString()}`);
        const payload  = await response.json();
        if (cancelled) return;
        const data = payload?.data || payload || {};
        setMedia(Array.isArray(data.media) ? data.media : []);
        setTotalCount(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 1);
      } catch {
        if (!cancelled) setError("Unable to load media. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMedia();
    return () => { cancelled = true; };
  }, [page, activeTab, sortOrder, search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans mt-20">
      <SEO title="Media & Events" description="Browse the latest media and events shared by Career Mitra." />

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-full mx-auto px-5 sm:px-8 py-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Career Mitra</p> */}
            <h1 className="text-2xl sm:text-5xl font-black text-orange-600 leading-tight mx-auto">
              Events & Media
            </h1>
            <p className="mt-1.5 text-sm text-slate-400 max-w-lg mx-auto">
              Browse the latest images, videos and announcements published by Career Mitra.
            </p>

            {/* Stats pills */}
            {/* <div className="mt-4 flex items-center gap-3 flex-wrap">
              {[
                { label: "Total", value: totalCount, color: "bg-violet-50 text-violet-700 border-violet-100" },
                { label: "Page", value: `${page} / ${totalPages}`, color: "bg-slate-50 text-slate-600 border-slate-200" },
                { label: "Showing", value: media.length, color: "bg-orange-50 text-orange-600 border-orange-100" },
              ].map(s => (
                <span key={s.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.color}`}>
                  <span className="font-black">{loading ? "—" : s.value}</span>
                  <span className="opacity-60">{s.label}</span>
                </span>
              ))}
            </div> */}
          </motion.div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-full mx-auto px-5 sm:px-8 py-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] items-center">

          {/* Tabs */}
          <div className="grid w-full grid-cols-2 gap-1 rounded-3xl border border-slate-200/80 bg-slate-100/90 p-1 shadow-sm sm:grid-cols-4">
            {MEDIA_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setPage(1); }}
                  className={`relative flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-full bg-linear-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/20"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {Icon && <Icon size={14} className={active ? "text-white" : "text-slate-400"} />}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[11px]" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search…"
                className="w-40 sm:w-52 rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-300 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200 transition"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-600 focus:border-violet-400 focus:outline-none transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-full mx-auto px-5 sm:px-8 py-8">

        {/* Count line */}
        {!loading && !error && (
          <p className="text-xs text-slate-400 mb-5">
            Showing <span className="font-semibold text-slate-600">{media.length}</span> of{" "}
            <span className="font-semibold text-slate-600">{totalCount}</span> items
          </p>
        )}

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <p className="font-semibold text-red-500 text-sm">{error}</p>
              <p className="mt-1 text-xs text-slate-400">Please refresh or try again later.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeTab}-${page}-${search}`}
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {loading
                ? Array.from({ length: DEFAULT_LIMIT }).map((_, i) => <MediaSkeleton key={i} />)
                : media.length === 0
                  ? (
                    <div className="col-span-full rounded-2xl border border-slate-100 bg-white p-14 text-center">
                      <p className="font-semibold text-slate-400 text-sm">No media found.</p>
                      <p className="mt-1 text-xs text-slate-300">Try adjusting your filters.</p>
                    </div>
                  )
                  : media.map((item, i) => (
                    <MediaCard key={item._id || item.id || i} item={item} index={i} />
                  ))
              }
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            className="mt-8 flex items-center justify-center gap-1.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft size={9} /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      page === p
                        ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                        : "border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next <FaChevronRight size={9} />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
