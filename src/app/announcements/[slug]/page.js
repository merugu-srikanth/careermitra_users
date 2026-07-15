"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";
import axios from "axios";
import DOMPurify from "dompurify";
import SEO from '@/components/SEO';
import { generateArticleSchema } from '@/utils/schemaHelpers';

const ANNOUNCEMENT_API_BASE =
  (process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_BASE || process.env.VITE_ANNOUNCEMENT_API_BASE) || "https://www.careermitra.in";
const ANNOUNCEMENTS_API = `${ANNOUNCEMENT_API_BASE}/api/announcements`;


const normalizeAnnouncement = (item) => ({
  id: item?.id || item?._id || "",
  title: item?.title || "Announcement",
  slug: item?.slug || "",
  url: item?.url || null,
  info: item?.info || "",
  image: item?.image || null,
  date: item?.date || null,
  time: item?.time || "",
  status: item?.status || "active",
  publishedAt: item?.publishedAt || item?.published_at || null,
  createdBy: item?.createdBy || item?.created_by || null,
  createdAt: item?.createdAt || item?.created_at || null,
  updatedAt: item?.updatedAt || item?.updated_at || null,
});

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sanitizeHtml = (html) => {
  if (!html) return "";
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target", "rel"] }).replace(
    /<a /g,
    '<a target="_blank" rel="noopener noreferrer" '
  );
};

/* ── Skeleton loader ── */
const Skeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-24 pb-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="h-9 w-28 rounded-xl bg-gray-200 animate-pulse mb-6" />
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-64 bg-gray-200 animate-pulse" />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-4 rounded bg-gray-100 animate-pulse ${i === 4 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-60 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function AnnouncementDetail() {
  const params = useParams();
  const { slug } = params;
  const { state: navState } = useLocation(); // { id } passed from navigate()
  const router = useRouter();
  const navigate = (to, options) => { if (options?.replace) { router.replace(to); } else { router.push(to); } };

  const [announcement, setAnnouncement] = useState(null);
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);
  // If id was passed via router state, skip skeleton — fetch happens in background
  const [loading, setLoading] = useState(!navState?.id);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchById = async (id) => {
      try {
        const res = await axios.get(`${ANNOUNCEMENTS_API}/${id}`, { headers: { Accept: "application/json" } });
        const detail = normalizeAnnouncement(res?.data?.data || {});
        if (!cancelled && detail?.id) setAnnouncement(detail);
      } catch (e) {
        // only show error if we have no data at all
        if (!cancelled && !announcement) {
          setError(e?.response?.data?.message || "Failed to load announcement.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchListForSidebar = () => {
      axios.get(ANNOUNCEMENTS_API, { headers: { Accept: "application/json" } })
        .then(res => {
          const list = Array.isArray(res?.data?.data)
            ? res.data.data.map(normalizeAnnouncement)
            : [];
          if (!cancelled) setLatestAnnouncements(list.filter((i) => i.status === "active" && i.slug));
        })
        .catch(() => {});
    };

    const run = async () => {
      setError("");

      if (navState?.id) {
        // Fast path: ID already known — fetch detail + sidebar in PARALLEL
        fetchById(navState.id);
        fetchListForSidebar();
      } else {
        // Slow path (direct URL): fetch list to resolve slug → id, sidebar comes free
        try {
          setLoading(true);
          const listRes = await axios.get(ANNOUNCEMENTS_API, { headers: { Accept: "application/json" } });
          const list = Array.isArray(listRes?.data?.data)
            ? listRes.data.data.map(normalizeAnnouncement)
            : [];
          if (!cancelled) setLatestAnnouncements(list.filter((i) => i.status === "active" && i.slug));
          const matched = list.find((i) => i.slug === slug);
          if (!matched?.id) {
            if (!cancelled) { setError("Announcement not found."); setLoading(false); }
            return;
          }
          await fetchById(matched.id);
        } catch (e) {
          if (!cancelled) {
            setError(e?.response?.data?.message || "Failed to load announcement.");
            setLoading(false);
          }
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [slug]);

  const metaItems = useMemo(() => {
    if (!announcement) return [];
    const rows = [];
    if (announcement.date) rows.push({ label: "Date", value: formatDate(announcement.date), icon: "🗓️" });
    // if (announcement.publishedAt) rows.push({ label: "Published", value: formatDate(announcement.publishedAt), icon: "📅" });
    // if (announcement.time) rows.push({ label: "Time", value: announcement.time, icon: "🕐" });
    rows.push({ label: "Status", value: announcement.status || "active", icon: "✅" });
    return rows;
  }, [announcement]);

  const latestFive = useMemo(
    () => latestAnnouncements.filter((i) => i.slug !== slug).slice(0, 5),
    [latestAnnouncements, slug]
  );

  if (loading) return <Skeleton />;

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Announcement Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">{error || "The announcement you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const announcementSchemas = announcement ? [
    generateArticleSchema({
      type: "NewsArticle",
      headline: announcement.title,
      description: announcement.info ? announcement.info.replace(/<[^>]*>/g, '').slice(0, 160) : announcement.title,
      image: announcement.image,
      publishedAt: announcement.publishedAt || announcement.createdAt,
      modifiedAt: announcement.updatedAt || announcement.publishedAt || announcement.createdAt,
      url: `/announcements/${announcement.slug}`,
      authorName: "CareerMitra Editorial Team"
    })
  ] : [];

  return (
    <>
      <SEO
        title={`${announcement.title} | Career Mitra`}
        description={announcement.info ? announcement.info.replace(/<[^>]*>/g, '').slice(0, 160) : announcement.title}
        url={`https://careermitra.in/announcements/${announcement.slug}`}
        schema={announcementSchemas}
      />
      {/* Prose + responsive styles */}
      <style>{`
        .ann-prose h1,.ann-prose h2,.ann-prose h3,.ann-prose h4{font-weight:700;color:#111827;line-height:1.3;margin:1.2em 0 0.5em}
        .ann-prose h1{font-size:clamp(1.25rem,3vw,1.6rem)}
        .ann-prose h2{font-size:clamp(1.1rem,2.5vw,1.35rem);border-bottom:2px solid #fde8d4;padding-bottom:6px}
        .ann-prose h3{font-size:clamp(1rem,2vw,1.15rem)}
        .ann-prose p{margin:0 0 1em;color:#374151;line-height:1.8;font-size:clamp(0.875rem,1.5vw,1rem)}
        .ann-prose ul,.ann-prose ol{padding-left:1.4em;margin:0 0 1em;color:#374151}
        .ann-prose li{margin-bottom:0.4em;line-height:1.7}
        .ann-prose a{color:#f97316;text-decoration:underline;font-weight:600;word-break:break-word}
        .ann-prose a:hover{color:#ea580c}
        .ann-prose-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:10px;margin:1em 0;border:1px solid #f3f4f6;width:100%}
        .ann-prose-table-wrap table{min-width:600px;width:100%;border-collapse:collapse;font-size:0.88rem;table-layout:auto}
        .ann-prose th{background:#fff7ed;color:#c2410c;font-weight:700;padding:10px 14px;text-align:left;border:1px solid #fde8d4;white-space:nowrap;min-width:80px}
        .ann-prose td{padding:9px 14px;border:1px solid #f3f4f6;color:#374151;white-space:normal;word-break:break-word}
        .ann-prose tr:nth-child(even) td{background:#fafafa}
        .ann-prose tr:hover td{background:#fff7ed/20}
        .ann-prose strong{font-weight:700;color:#111827}
        .ann-prose blockquote{border-left:4px solid #f97316;padding:10px 16px;background:#fff7ed;border-radius:0 8px 8px 0;margin:1em 0;color:#92400e;font-style:italic}
        .ann-prose img{max-width:100%!important;height:auto!important;border-radius:10px;margin:0.5em 0;display:block}
        .ann-prose *:not(table):not(thead):not(tbody):not(tr):not(th):not(td) {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        @media(max-width:480px){
          .ann-prose th,.ann-prose td{padding:7px 10px;font-size:0.8rem}
        }
      `}</style>
 
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
 
        {/* ── Hero Banner ── */}
        <div className="bg-white border-b border-gray-100 pt-20 sm:pt-24 pb-5 sm:pb-8 px-4 shadow-sm">
          <div className="max-w-6xl mx-auto">
 
            {/* Breadcrumb + back */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap min-w-0">
                <Link href="/" className="hover:text-orange-500 transition shrink-0">Home</Link>
                <span className="shrink-0">/</span>
                <span className="text-gray-500 font-medium truncate max-w-[200px] sm:max-w-sm">{announcement.title}</span>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 px-3 py-1.5 rounded-lg transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
 
            {/* Title block */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              <span className="shrink-0 w-1 sm:w-1.5 h-8 sm:h-10 bg-orange-500 rounded-full mt-1" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900 leading-tight break-words">
                  {announcement.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  {announcement.date && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                      </svg>
                      {formatDate(announcement.date)}
                    </span>
                  )}
                  {announcement.time && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M12 6v6l4 2" strokeWidth="2"/>
                      </svg>
                      {announcement.time}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${announcement.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${announcement.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                    {announcement.status === "active" ? "Active" : announcement.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
          <div className="grid lg:grid-cols-[1fr_290px] gap-5 sm:gap-6 items-start">

            {/* ── MAIN CONTENT ── */}
            <div className="space-y-4 sm:space-y-5 min-w-0">

              {/* Image */}
              {announcement.image && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full max-h-80 sm:max-h-105 lg:max-h-120 object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              {/* Info / HTML content */}
              {announcement.info && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-100">
                    <span className="w-1 h-5 bg-orange-500 rounded-full shrink-0" />
                    <h2 className="text-sm sm:text-base font-bold text-gray-800">Announcement Details</h2>
                  </div>
                  {/* Wrap content so internal tables scroll horizontally on mobile */}
                  <div className="ann-prose">
                    <div
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.info).replace(/<table/gi,'<div class="ann-prose-table-wrap"><table').replace(/<\/table>/gi,'</table></div>') }}
                    />
                  </div>
                </div>
              )}
 
              {/* ── Details Table ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 sm:px-6 py-3.5 bg-linear-to-r from-orange-500 to-orange-400">
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">Quick Details</h2>
                </div>
 
                {/* Rows */}
                <div className="divide-y divide-gray-100">
                  {metaItems.map((meta, idx) => (
                    <div
                      key={meta.label}
                      className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <span className="text-sm sm:text-base w-6 sm:w-7 text-center shrink-0">{meta.icon}</span>
                      <span className="w-20 sm:w-28 shrink-0 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">
                        {meta.label}
                      </span>
                      <span className="w-px h-4 bg-gray-200 shrink-0" />
                      {meta.label === "Status" ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${meta.value === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.value === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                          {meta.value.charAt(0).toUpperCase() + meta.value.slice(1)}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 break-words min-w-0">{meta.value}</span>
                      )}
                    </div>
                  ))}
 
                  {/* Official link row */}
                  {announcement.url && (
                    <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 ${metaItems.length % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <span className="text-sm sm:text-base w-6 sm:w-7 text-center shrink-0">🔗</span>
                      <span className="w-20 sm:w-28 shrink-0 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">
                        Official
                      </span>
                      <span className="w-px h-4 bg-gray-200 shrink-0" />
                      <a
                        href={announcement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm shadow-orange-200 shrink-0"
                      >
                        <span className="hidden xs:inline">Visit Portal</span>
                        <span className="xs:hidden">Open</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
 
            </div>
 
            {/* ── SIDEBAR ── */}
            <aside className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 w-full overflow-hidden">
                <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-gray-100">
                  <span className="w-1 h-5 bg-orange-500 rounded-full" />
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">Latest Announcements</h3>
                </div>

                {latestFive.length ? (
                  <div className="flex flex-col gap-2.5">
                    {latestFive.map((item) => (
                      <Link key={item.id || item.slug}
                        href={`/announcements/${item.slug}`}
                        className="flex gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition group"
                      >
                        <div className="shrink-0 w-1 bg-orange-200 rounded-full group-hover:bg-orange-400 transition self-stretch" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition leading-snug line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(item.date)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No other announcements.</p>
                )}
              </div>

              {/* Share / tip card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
                <div className="text-2xl mb-2">🔔</div>
                <h4 className="font-bold text-base mb-1">Stay Updated</h4>
                <p className="text-orange-100 text-xs leading-relaxed">
                  Check back regularly for the latest government job announcements and career updates.
                </p>
                <Link href="/jobs"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                >
                  View All Jobs
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
