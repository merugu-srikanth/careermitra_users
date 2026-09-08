"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaVideo, FaImage, FaTag, FaRegClock,
  FaExternalLinkAlt, FaYoutube, FaSearch, FaChevronLeft, FaChevronRight
} from "react-icons/fa";

import { generateWebPageSchema } from '@/utils/schemaHelpers';

/* ─── Config ──────────────────────────────────────────────── */
const API_BASE    = "https://careermitra.in/api/media";
const DEFAULT_LIMIT = 32;

const EVENTS_DOC_STYLES = `
.bl-article-doc {
  background: #f8fafc;
  border-radius: 24px;
  padding: 45px;
  margin-top: 64px;
  border: 1px solid #e2e8f0;
}
@media(max-width: 768px) {
  .bl-article-doc {
    padding: 28px 20px;
    border-radius: 16px;
    margin-top: 48px;
  }
}
.bl-doc-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.6rem, 3.2vw, 2.5rem);
  font-weight: 700;
  color: #000;
  line-height: 1.25;
  margin-bottom: 28px;
  text-align: center;
}
.bl-doc-p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 24px;
}
.bl-doc-link {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s;
}
.bl-doc-link:hover {
  color: #1d4ed8;
}
`;

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
      initial={false}
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
export default function EventsPage({ initialData }) {
  const hasInitialData = !!initialData;
  const [media, setMedia]           = useState(initialData?.media || []);
  const [loading, setLoading]       = useState(!hasInitialData);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount ?? 0);
  const [activeTab, setActiveTab]   = useState("all");
  const [sortOrder, setSortOrder]   = useState("newest");
  const [search, setSearch]         = useState("");
  const [error, setError]           = useState("");
  const skipNextFetch               = useRef(hasInitialData);
  const isFirstReset                = useRef(true);

  // Reset page and clear media list on filter or search changes
  useEffect(() => {
    if (isFirstReset.current) {
      isFirstReset.current = false;
      return;
    }
    setPage(1);
    setMedia([]);
  }, [activeTab, sortOrder, search]);

  useEffect(() => {
    // Skip the very first fetch when the server already supplied page 1 (default filters)
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
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
        const newMedia = Array.isArray(data.media) ? data.media : [];

        if (page === 1) {
          setMedia(newMedia);
        } else {
          setMedia((prev) => [...prev, ...newMedia]);
        }
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

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="w-full mx-auto px-4 md:px-15 py-8 text-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-2xl sm:text-5xl font-black text-orange-600 leading-tight mx-auto">
              Events & Media
            </h1>
            <p className="mt-1.5 text-sm text-slate-400 max-w-lg mx-auto">
              Browse the latest images, videos and announcements published by Career Mitra.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="w-full mx-auto px-4 md:px-15 py-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] items-center">

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
      <main className="w-full mx-auto px-4 md:px-15 py-8">

        {/* Count line */}
        {!loading && !error && media.length > 0 && (
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
              initial={hasInitialData && page === 1 ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {media.length === 0 && !loading ? (
                <div className="col-span-full rounded-2xl border border-slate-100 bg-white p-14 text-center">
                  <p className="font-semibold text-slate-400 text-sm">No media found.</p>
                  <p className="mt-1 text-xs text-slate-300">Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  {media.map((item, i) => (
                    <MediaCard key={item._id || item.id || i} item={item} index={i} />
                  ))}
                  {loading && Array.from({ length: 8 }).map((_, i) => <MediaSkeleton key={i} />)}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {!loading && page < totalPages && (
          <div className="flex justify-center mt-10 mb-6">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-8 py-3 bg-white text-orange-600 border-2 border-orange-500 rounded-xl font-bold hover:bg-orange-500 hover:text-white hover:scale-[1.02] transform transition duration-200 shadow-sm"
            >
              Load More
            </button>
          </div>
        )}

        {/* ── PDF Content Document Section ── */}
        <div className="bl-article-doc max-w-4xl mx-auto">
          <style dangerouslySetInnerHTML={{ __html: EVENTS_DOC_STYLES }} />
          <h2 className="bl-doc-title">
            Career Mitra Events & Media - Government Jobs & Career Events
          </h2>
          
          <p className="bl-doc-p">
            The Career Mitra Events & Media page is a dedicated section for viewing the latest images, videos, and announcements shared by <Link href="/" className="bl-doc-link">Career Mitra</Link>. The page is designed to keep students, job seekers, and government job aspirants updated on the platform’s recent activities and media content.
          </p>
          
          <p className="bl-doc-p">
            Career Mitra is a platform that shares government job notifications and career advice for people across India. The Events and Media page adds a visual side to this work. Anyone can see recent pictures, watch videos, or check <a href="https://www.youtube.com/@CareerMitraaa" target="_blank" rel="noopener noreferrer" className="bl-doc-link">YouTube</a> content in one place. There is no need to search through different parts of the website. Everything lies together in clear categories.
          </p>
          
          <p className="bl-doc-p">
            A search bar is also provided for viewers to find specific content fast. This helps busy job seekers who want quick answers without wasting time. This page is useful for anyone who wants more than job alerts.
          </p>
          
          <p className="bl-doc-p">
            Career Mitra shares news about <Link href="/government-jobs" className="bl-doc-link">government recruitment</Link>, career tips, internships, and skill-building programs. Its main site brings updates from central and state departments, banks, defense organizations, and other public offices.
          </p>
          
          <p className="bl-doc-p">
            The Events and Media page adds another layer by showing these updates in a visual form. This section also fits into Career Mitra's larger goal, which is to make career information simple and easy to reach. The platform gives job suggestions based on user profiles, shares daily opportunity updates, and sends alerts for government jobs.
          </p>
          
          <p className="bl-doc-p">
            Users can also read guidance articles. These explain eligibility rules, how recruitment works, and different career paths in government jobs. In short, the Career Mitra Events and Media page acts as one place for all visual and announcement content.
          </p>
          
          <p className="bl-doc-p">
            Students, fresh graduates, and job aspirants can browse recent photos, videos, and updates here. At the same time, they can explore other career resources on the site. The layout is simple. The categories are clear. This makes it easy for anyone to browse and stay updated on what Career Mitra is doing.
          </p>
        </div>
      </main>
    </div>
  );
}
