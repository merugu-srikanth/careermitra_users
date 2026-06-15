import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import SEO from "../../components/SEO";

const BLOGS_API = "https://careermitra.in/api/blogs";
const PAGE_SIZE = 9;

const slugify = (s = "") =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "";

const getPrimary    = (b) => b?.categories?.[0]?.name || b?.category || "General";
const getAuthor     = (b) => b?.author?.author_name || b?.author_name || "Career Mitra";
const getAuthorAvatar = (b) => b?.author?.avatar_url || null;

/* ── Card Skeleton ── */
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-24 bg-gray-200 rounded-full" />
      <div className="h-5 bg-gray-200 rounded-full" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
      <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
    </div>
  </div>
);

/* ── Blog Card ── */
const BlogCard = ({ blog, categorySlug }) => (
  <Link to={`/${categorySlug}/${blog.slug}`}>
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative overflow-hidden h-44 shrink-0">
        {blog.featured_image ? (
          <img
            src={blog.featured_image}
            alt={blog.image_alt_text || blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.target.parentNode.style.background = "#f9fafb"; e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {getPrimary(blog)}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3 flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {fmtDate(blog.published_at || blog.createdAt)}
          </span>
          {fmtTime(blog.published_at || blog.createdAt) && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {fmtTime(blog.published_at || blog.createdAt)}
            </span>
          )}
        </div>

        <p className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 hover:text-orange-500 transition-colors flex-1">
          {blog.title}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <Link
            to={`/author/${slugify(getAuthor(blog))}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
          >
            {getAuthorAvatar(blog) ? (
              <img
                src={getAuthorAvatar(blog)}
                alt={getAuthor(blog)}
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-gray-100"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-[9px] font-bold text-orange-500">
                {getAuthor(blog).charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-xs text-gray-400 truncate">{getAuthor(blog)}</span>
          </Link>
          <span className="flex items-center gap-1 text-xs font-bold text-orange-500 shrink-0">
            Read More
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>
    </article>
  </Link>
);

/* ── Main Component ── */
export default function BlogCategory() {
  const { categorySlug } = useParams();
  const location = useLocation();

  const [categoryName, setCategoryName] = useState("");
  const [allFilteredBlogs, setAllFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  /* Step 1: Resolve the real category name from slug */
  useEffect(() => {
    setPage(1);
    setAllFilteredBlogs([]);

    if (location.state?.categoryName) {
      setCategoryName(location.state.categoryName);
      return;
    }

    // Look in first 100 blogs to find exact category name matching this slug
    fetch(`${BLOGS_API}?page=1&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error();
        // Only look at the primary (first) category of each blog
        const match = (data.data?.blogs || [])
          .map((b) => b.categories?.[0])
          .filter(Boolean)
          .find((cat) => slugify(cat.name) === categorySlug);
        setCategoryName(
          match?.name ||
          categorySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        );
      })
      .catch(() =>
        setCategoryName(
          categorySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        )
      );
  }, [categorySlug]);

  /* Step 2: Fetch blogs and strictly filter by category slug — no fallback */
  useEffect(() => {
    if (!categoryName) return;
    setLoading(true);
    setError(null);
    setPage(1);

    // Fetch large batch so we catch all blogs in this category
    fetch(`${BLOGS_API}?page=1&limit=100&category=${encodeURIComponent(categoryName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message || "Failed to load");
        const all = data.data?.blogs || [];

        // Keep only blogs where this is the PRIMARY (first) category
        const matched = all.filter((b) => {
          const primary = b.categories?.[0];
          return primary && slugify(primary.name) === categorySlug;
        });

        setAllFilteredBlogs(matched);
      })
      .catch((e) => setError(e.message || "Network error"))
      .finally(() => setLoading(false));
  }, [categoryName, categorySlug]);

  // Client-side pagination of filtered results
  const totalBlogs = allFilteredBlogs.length;
  const totalPages = Math.max(1, Math.ceil(totalBlogs / PAGE_SIZE));
  const pagedBlogs = allFilteredBlogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title={`${categoryName || categorySlug} Articles — CareerMitra`}
        description={`Read the latest ${categoryName} articles, guides, job alerts and career tips on CareerMitra — India's government jobs platform.`}
        keywords={`${categoryName}, career articles, government jobs, CareerMitra, ${categoryName} blogs, job alerts India`}
      />

      <div className="min-h-screen bg-white pt-20">

        {/* ── Header ── */}
        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-orange-500 font-semibold">{categoryName || categorySlug}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                  {categoryName ? categoryName : (
                    <span className="inline-block w-40 h-9 bg-gray-200 rounded-lg animate-pulse" />
                  )}
                </h1>
                {!loading && (
                  <p className="text-sm text-gray-400 mt-2">
                    {totalBlogs > 0
                      ? `${totalBlogs} article${totalBlogs !== 1 ? "s" : ""} found`
                      : "No articles in this category yet"}
                  </p>
                )}
              </div>

              {/* <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all self-start sm:self-auto"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                All Blogs
              </Link> */}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => { setError(null); setPage(1); }}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : pagedBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-400 text-sm mb-6">
                No published articles in the <strong>{categoryName}</strong> category yet.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagedBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} categorySlug={categorySlug} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span key={`e${i}`} className="text-gray-400 px-1">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                            p === page
                              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                              : "border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
