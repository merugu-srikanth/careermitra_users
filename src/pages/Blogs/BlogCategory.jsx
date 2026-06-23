import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import blogFallback from "../../assets/blog-sample.png";

const BLOGS_API = "https://careermitra.in/api/blogs";


const slugify = (s = "") =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "";

const getPrimary      = (b) => b?.categories?.[0]?.name || b?.category || "General";
const getAuthor       = (b) => b?.author?.author_name || b?.author_name || "Career Mitra";
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
const BlogCard = ({ blog }) => {
  const catSlug = slugify(getPrimary(blog));
  return (
    <Link to={`/${catSlug}/${blog.slug}`}>
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="relative overflow-hidden h-44 shrink-0">
          <img
            src={blog.featured_image || blogFallback}
            alt={blog.image_alt_text || blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = blogFallback; }}
          />
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
};

/* ── Main Component ── */
export default function BlogCategory() {
  const { categorySlug } = useParams();
  const location = useLocation();

  const [categoryName, setCategoryName] = useState("");
  const [parentInfo, setParentInfo]     = useState(null);
  const [blogs, setBlogs]               = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore]           = useState(false);
  const [error, setError]               = useState(null);

  /* ── Step 1: Resolve category ID via /api/blogs/filters, then fetch articles ── */
  useEffect(() => {
    setBlogs([]);
    setError(null);
    setHasMore(false);
    setInitialLoading(true);
    setCategoryName("");
    setParentInfo(null);

    const st = location.state;

    const fetchArticles = (id, isParent) => {
      const param = isParent ? `parent_category_id=${id}` : `child_category_id=${id}`;
      fetch(`${BLOGS_API}?${param}`)
        .then((r) => r.json())
        .then((data) => {
          const d = data.data || data;
          setBlogs(d.articles || []);
          setHasMore(false);
        })
        .catch((e) => setError(e.message || "Network error"))
        .finally(() => setInitialLoading(false));
    };

    // If we already have the ID from navigation state, skip the filters lookup
    if (st?.categoryId && st?.categoryName) {
      setCategoryName(st.categoryName);
      if (st.parentName) setParentInfo({ name: st.parentName, slug: slugify(st.parentName) });
      const isParent = !st.parentId;
      fetchArticles(st.categoryId, isParent);
      return;
    }

    // Direct URL — look up ID from /api/blogs/filters
    fetch("https://careermitra.in/api/blogs/filters")
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error();
        const parents  = data.data?.parents  || [];
        const children = data.data?.children || [];

        // Check children first (most specific match)
        const child = children.find((c) => slugify(c.name) === categorySlug);
        if (child) {
          const parent = parents.find((p) => p.id === child.parent_id);
          setCategoryName(child.name);
          if (parent) setParentInfo({ name: parent.name, slug: slugify(parent.name) });
          fetchArticles(child.id, false);
          return;
        }

        const parent = parents.find((p) => slugify(p.name) === categorySlug);
        if (parent) {
          setCategoryName(parent.name);
          fetchArticles(parent.id, true);
          return;
        }

        throw new Error("category not found");
      })
      .catch(() => {
        const fallback = categorySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        setCategoryName(st?.categoryName || fallback);
        setInitialLoading(false);
      });
  }, [categorySlug]);


  return (
    <>
      <SEO
        title={`${categoryName || categorySlug} Articles — Careermitra`}
        description={`Read the latest ${categoryName} articles, guides, job alerts and career tips on Careermitra — India's government jobs platform.`}
        keywords={`${categoryName}, career articles, government jobs, Careermitra, ${categoryName} articles, job alerts India`}
      />

      <div className="min-h-screen w-full bg-white pt-20 ">

        {/* ── Header ── */}
        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">

            {/* Breadcrumb: Home / [Parent?] / Category */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              {parentInfo && (
                <>
                  <span>/</span>
                  <Link to={`/${parentInfo.slug}`} className="hover:text-orange-500 transition-colors">{parentInfo.name}</Link>
                </>
              )}
              <span>/</span>
              <span className="text-orange-500 font-semibold">{categoryName || categorySlug}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              {categoryName || <span className="inline-block w-40 h-9 bg-gray-200 rounded-lg animate-pulse" />}
            </h1>
            {!initialLoading && blogs.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">{blogs.length} article{blogs.length !== 1 ? "s" : ""} loaded</p>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">{error}</p>
              <button
                onClick={() => { setError(null); window.location.reload(); }}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : initialLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : blogs.length === 0 ? (
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
                {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
}
