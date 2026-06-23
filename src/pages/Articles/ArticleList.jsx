import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import blogFallback from "../../assets/blog-sample.png";
import { useBlogs } from "../../context/BlogContext";
import NotFoundPage from "../../components/NotFoundPage";

const API_BASE = "https://careermitra.in/api";

/* ── Helpers ── */
const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

function buildArticleUrl(article) {
  const tree = article.categoryTree?.[0];
  if (!tree) return `/${article.slug}`;
  const parentSlug = toSlug(tree.parent?.name, tree.parent?.slug);
  const child = tree.children?.find(c => c.id === article.primary_category?._id);
  if (child) {
    const childSlug = toSlug(child.name, child.slug);
    return `/${parentSlug}/${childSlug}/${article.slug}`;
  }
  return `/${parentSlug}/${article.slug}`;
}

function getCategoryBreadcrumb(article) {
  const tree = article.categoryTree?.[0];
  if (!tree) return article.primary_category?.name || "";
  const child = tree.children?.find(c => c.id === article.primary_category?._id);
  return child ? `${tree.parent.name} › ${child.name}` : tree.parent.name;
}

const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }) : "";

const isSameDay = (a, b) =>
  !a || !b || new Date(a).toDateString() === new Date(b).toDateString();

const fmtViews = (n) =>
  !n ? null : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/* ── Card Skeleton ── */
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-24 bg-gray-200 rounded-full" />
      <div className="h-5 bg-gray-200 rounded-full" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
      <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
    </div>
  </div>
);

/* ── Article Card ── */
const ArticleCard = ({ article }) => {
  const breadcrumb  = getCategoryBreadcrumb(article);
  const createdAt   = article.createdAt   || article.published_at;
  const updatedAt   = article.updatedAt   || article.last_updated_at;
  const showUpdated = !isSameDay(createdAt, updatedAt);
  const views       = fmtViews(article.views);

  return (
    <Link to={buildArticleUrl(article)} className="group block h-full">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="relative overflow-hidden h-48 shrink-0">
          <img
            src={article.featured_image || blogFallback}
            alt={article.image_alt_text || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = blogFallback; }}
          />
        </div>

        <div className="p-5 flex-1 flex flex-col gap-2">
          {breadcrumb && (
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{breadcrumb}</span>
          )}

          <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
            {article.title}
          </h2>

          {article.short_description && (
            <p className="text-sm text-gray-500 line-clamp-2 flex-1">{article.short_description}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 border-t border-gray-50 text-[11px] text-gray-400 mt-auto">
            <span className="flex items-center gap-1.5">
              {article.author?.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.author_name}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[9px] font-bold text-orange-500">
                  {(article.author?.author_name || "C")[0].toUpperCase()}
                </span>
              )}
              {article.author?.author_name || "Career Mitra"}
            </span>

            <span>{fmtDateTime(createdAt)}</span>
            {views && <span>👁 {views}</span>}
            {showUpdated && (
              <span className="text-orange-400">🔄 {fmtDateTime(updatedAt)}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

/* ── Main Page ── */
export default function ArticleList() {
  // pathChild comes from /:parentSlug/:childSlug route
  // pathSlug comes from /:parentSlug/:slug route (via TwoSegmentResolver when type=category)
  const { parentSlug: pathParent, childSlug: pathChild, slug: pathSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Path-based routing takes priority over query params
  const isPathBased     = !!pathParent;
  const parentSlugParam = pathParent || searchParams.get("parent") || "";
  const childSlugParam  = pathChild || pathSlug || searchParams.get("child") || "";

  const [search,     setSearch]     = useState(searchParams.get("search") || "");
  const [filterData, setFilterData] = useState(null); // null = not yet loaded

  const debounceRef = useRef(null);

  const { blogs: allArticles, loading: contextLoading, error: contextError } = useBlogs();

  const loading = contextLoading;
  const error = contextError;

  /* ── Load filter options once ── */
  useEffect(() => {
    fetch("https://careermitra.in/api/blogs/filters")
      .then(r => r.json())
      .then(data => {
        const d = data.data || data;
        setFilterData({ parents: d.parents || [], children: d.children || [] });
      })
      .catch(() => setFilterData({ parents: [], children: [] }));
  }, []);

  /* ── Resolve URL slugs → category IDs (safe when filterData is null) ── */
  const parentId = filterData ? (filterData.parents.find(p => toSlug(p.name, p.slug) === parentSlugParam)?.id || "") : "";
  const childId  = filterData ? (filterData.children.find(c => toSlug(c.name, c.slug) === childSlugParam)?.id || "") : "";

  const articles = useMemo(() => {
    if (contextLoading || filterData === null) return [];
    let list = [...allArticles];

    if (childSlugParam) {
      const childCat = filterData.children.find(c => toSlug(c.name, c.slug) === childSlugParam);
      if (childCat) {
        list = list.filter(a => a.primary_category?._id === childCat.id);
      }
    } else if (parentSlugParam) {
      const parentCat = filterData.parents.find(p => toSlug(p.name, p.slug) === parentSlugParam);
      if (parentCat) {
        list = list.filter(a => {
          const tree = a.categoryTree?.[0];
          const pId = parentCat.id;
          return tree?.parent?.id === pId || tree?.parent?._id === pId;
        });
      }
    } else {
      const s = searchParams.get("search");
      if (s) {
        const q = s.toLowerCase().trim();
        list = list.filter(
          (a) =>
            String(a.title || "").toLowerCase().includes(q) ||
            String(a.short_description || "").toLowerCase().includes(q)
        );
      }
    }
    return list;
  }, [allArticles, parentSlugParam, childSlugParam, searchParams, filterData, contextLoading]);

  const total = articles.length;

  /* ── Filter handlers ── */
  const apply = useCallback((key, value) => {
    const next = new URLSearchParams();
    if (value) next.set(key, value);
    setSearchParams(next, { replace: true });
  }, [setSearchParams]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (isPathBased) navigate(`/articles?search=${encodeURIComponent(val.trim())}`);
      else apply("search", val.trim());
    }, 400);
  };

  const handleParent = (id) => {
    if (!id) { navigate(isPathBased ? "/articles" : "/articles"); return; }
    const parent = filterData?.parents.find(p => p.id === id);
    const slug = parent ? toSlug(parent.name, parent.slug) : id;
    navigate(`/${slug}`);
  };

  const handleChild = (id) => {
    if (!id) { navigate(parentSlugParam ? `/${parentSlugParam}` : "/articles"); return; }
    const child = filterData?.children.find(c => c.id === id);
    const slug = child ? toSlug(child.name, child.slug) : id;
    navigate(`/${parentSlugParam}/${slug}`);
  };

  const clearAll = () => {
    clearTimeout(debounceRef.current);
    setSearch("");
    navigate("/articles");
  };

  const hasFilter = !!(searchParams.get("search") || parentSlugParam || childSlugParam);
  const visibleChildren = parentId && filterData
    ? filterData.children.filter(c => c.parent_id === parentId)
    : (filterData?.children || []);

  const activeParent = filterData ? filterData.parents.find(p => p.id === parentId) : null;
  const activeChild  = filterData ? filterData.children.find(c => c.id === childId)  : null;
  const seoTitle = activeChild?.name
    ? `${activeChild.name} Articles | CareerMitra`
    : activeParent?.name
    ? `${activeParent.name} Articles | CareerMitra`
    : "Articles | CareerMitra";

  if (filterData) {
    if (parentSlugParam && !parentId) {
      return <NotFoundPage />;
    }
    if (childSlugParam && !childId) {
      return <NotFoundPage />;
    }
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description="Latest job notifications, government jobs, UPSC, SSC articles and career guides on CareerMitra."
        url="https://www.careermitra.in/articles"
      />

      <div className="min-h-screen bg-gray-50 pt-20">

        {/* ── Page Header ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 flex-wrap">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              {activeParent ? (
                <>
                  <span>›</span>
                  <Link to={`/${parentSlugParam}`} className="hover:text-orange-500 transition-colors">{activeParent.name}</Link>
                </>
              ) : (
                <>
                  <span>›</span>
                  <span className="text-orange-500 font-semibold">Articles</span>
                </>
              )}
              {activeChild && (
                <>
                  <span>›</span>
                  <span className="text-orange-500 font-semibold">{activeChild.name}</span>
                </>
              )}
            </nav>
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              {activeChild?.name || activeParent?.name || "Articles"}
            </h1>
            <p className="text-sm text-gray-400">
              {loading ? "Loading…" : `${total} article${total !== 1 ? "s" : ""}`}
              {hasFilter && !loading && (
                <button onClick={clearAll} className="ml-3 text-orange-500 font-semibold hover:underline">
                  Clear filters
                </button>
              )}
            </p>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white border-b border-gray-100 sticky top-[64px] z-30 shadow-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white"
              />
            </div>

            {/* Parent Category */}
            <select
              value={parentId}
              onChange={e => handleParent(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white min-w-[160px]"
            >
              <option value="">All Categories</option>
              {(filterData?.parents || []).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Sub-Category */}
            <select
              value={childId}
              onChange={e => handleChild(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white min-w-[160px]"
            >
              <option value="">Sub-Category</option>
              {visibleChildren.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

          </div>
        </div>

        {/* ── Articles Grid ── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4">{error}</p>
              <button onClick={clearAll} className="px-5 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition">
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-400 text-sm mb-6">No articles found for your search.</p>
              <button onClick={clearAll} className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => <ArticleCard key={a._id} article={a} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
