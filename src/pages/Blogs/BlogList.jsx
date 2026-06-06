  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import SEO from '../../components/SEO';

  /* ─── Global styles injected once ─────────────────────────────────────── */
  const BLOGLIST_STYLES = `



  /* hero */
  .bl-hero {
    background: #fff;
    padding: 96px 0 0;
    position: relative;
    overflow: hidden;
  }
  .bl-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 60% -10%, rgba(249,115,22,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .bl-hero-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: '', ; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #f97316;
    background: rgba(249,115,22,0.08);
    border: 1px solid rgba(249,115,22,0.2);
    padding: 5px 14px; border-radius: 100px;
    margin-bottom: 16px;
  }
  .bl-hero-label span { width: 6px; height: 6px; background: #f97316; border-radius: 50%; display: inline-block; animation: bl-pulse 1.6s ease-in-out infinite; }
  @keyframes bl-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

  .bl-hero-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 800;
    color: #111827; line-height: 1.15; margin: 0 0 16px;
  }
  .bl-hero-title em { font-style: italic; color: #f97316; }
  .bl-hero-sub {
    font-family: '', ;
    font-size: 1.05rem; color: #6b7280; line-height: 1.7;
    max-width: 500px; margin: 0 0 32px;
  }

  /* search bar */
  .bl-search-wrap {
    display: flex; align-items: center; gap: 0;
    background: #fff; border: 2px solid #f3f4f6;
    border-radius: 14px; overflow: hidden;
    max-width: 440px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bl-search-wrap:focus-within {
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.1);
  }
  .bl-search-icon { padding: 0 14px; color: #9ca3af; flex-shrink: 0; }
  .bl-search-input {
    flex: 1; border: none; outline: none;
    font-family: '', ; font-size: 0.95rem;
    color: #111827; padding: 13px 0;
    background: transparent;
  }
  .bl-search-input::placeholder { color: #9ca3af; }
  .bl-search-btn {
    background: #f97316; color: #fff; border: none; cursor: pointer;
    padding: 13px 20px; font-family: '', ;
    font-size: 0.9rem; font-weight: 600;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .bl-search-btn:hover { background: #ea580c; }

  /* filter pills */
  .bl-filters { display: flex; flex-wrap: wrap; gap: 8px; }
  .bl-pill {
    font-family: '', ; font-size: 0.82rem; font-weight: 500;
    padding: 7px 18px; border-radius: 100px; cursor: pointer;
    border: 1.5px solid #e5e7eb; color: #6b7280; background: #fff;
    transition: all 0.18s;
  }
  .bl-pill:hover { border-color: #f97316; color: #f97316; }
  .bl-pill.active { background: #f97316; border-color: #f97316; color: #fff; }

  /* featured blog */
  .bl-featured {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0; border-radius: 20px; overflow: hidden;
    background: #fff;
    border: 1.5px solid #f3f4f6;
    box-shadow: 0 8px 40px rgba(0,0,0,0.07);
    transition: box-shadow 0.25s, transform 0.25s;
    margin-bottom: 72px;
  }
  .bl-featured:hover { box-shadow: 0 20px 60px rgba(249,115,22,0.12); transform: translateY(-4px); }
  @media(max-width:768px){ .bl-featured { grid-template-columns: 1fr; } }

  .bl-featured-img-wrap {
    position: relative; overflow: hidden;
    min-height: 360px;
  }
  .bl-featured-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s ease;
  }
  .bl-featured:hover .bl-featured-img { transform: scale(1.04); }
  .bl-featured-badge {
    position: absolute; top: 16px; left: 16px;
    background: #f97316; color: #fff;
    font-family: '', ; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px;
    display: flex; align-items: center; gap: 5px;
  }

  .bl-featured-body {
    padding: 40px 44px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .bl-featured-cat {
    font-family: '', ; font-size: 0.75rem; font-weight: 600;
    color: #f97316; text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  .bl-featured-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 800;
    color: #111827; line-height: 1.25;
    margin: 0 0 14px;
    text-decoration: none; display: block;
    transition: color 0.2s;
  }
  .bl-featured-title:hover { color: #f97316; }
  .bl-featured-desc {
    font-family: '', ; font-size: 0.97rem; color: #6b7280;
    line-height: 1.75; margin: 0 0 24px;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }
  .bl-featured-meta {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    font-family: '', ; font-size: 0.82rem; color: #9ca3af;
    margin-bottom: 28px;
  }
  .bl-featured-meta span { display: flex; align-items: center; gap: 5px; }
  .bl-featured-meta svg { width: 13px; height: 13px; }

  .bl-read-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #f97316; color: #fff;
    font-family: '', ; font-size: 0.9rem; font-weight: 600;
    padding: 12px 24px; border-radius: 12px;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    align-self: flex-start;
    box-shadow: 0 4px 14px rgba(249,115,22,0.3);
  }
  .bl-read-btn:hover { background: #ea580c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249,115,22,0.35); }
  .bl-read-btn svg { width: 16px; height: 16px; transition: transform 0.2s; }
  .bl-read-btn:hover svg { transform: translateX(3px); }

  /* section heading */
  .bl-section-head {
    display: flex; align-items: baseline; justify-content: space-between;
    margin-bottom: 32px; padding-bottom: 16px;
    border-bottom: 2px solid #f3f4f6;
    position: relative;
  }
  .bl-section-head::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 64px; height: 2px; background: #f97316;
  }
  .bl-section-head h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0;
  }
  .bl-section-head a {
    font-family: '', ; font-size: 0.88rem; font-weight: 600;
    color: #f97316; text-decoration: none;
    display: flex; align-items: center; gap: 4px;
  }
  .bl-section-head a:hover { color: #ea580c; }

  /* blog cards grid */
  .bl-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  @media(max-width:1024px){ .bl-grid { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:640px){ .bl-grid { grid-template-columns: 1fr; } }

  .bl-card {
    background: #fff; border-radius: 16px;
    border: 1.5px solid #f3f4f6;
    overflow: hidden;
    transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
    display: flex; flex-direction: column;
  }
  .bl-card:hover {
    box-shadow: 0 12px 40px rgba(249,115,22,0.1);
    transform: translateY(-5px);
    border-color: rgba(249,115,22,0.3);
  }
  .bl-card-img-wrap { overflow: hidden; position: relative; }
  .bl-card-img {
    width: 100%; height: 200px; object-fit: cover;
    transition: transform 0.45s ease;
    display: block;
  }
  .bl-card:hover .bl-card-img { transform: scale(1.06); }
  .bl-card-cat-badge {
    position: absolute; top: 12px; left: 12px;
    font-family: '', ; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.07em; text-transform: uppercase;
    background: rgba(255,255,255,0.92);
    color: #f97316; padding: 4px 10px; border-radius: 100px;
    backdrop-filter: blur(4px);
  }
  .bl-card-body { padding: 22px 22px 20px; flex: 1; display: flex; flex-direction: column; }
  .bl-card-meta {
    display: flex; align-items: center; gap: 10px;
    font-family: '', ; font-size: 0.77rem; color: #9ca3af;
    margin-bottom: 10px;
  }
  .bl-card-meta svg { width: 11px; height: 11px; }
  .bl-card-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem; font-weight: 700; color: #111827;
    line-height: 1.35; margin: 0 0 10px;
    text-decoration: none; display: block;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    transition: color 0.18s;
  }
  .bl-card-title:hover { color: #f97316; }
  .bl-card-desc {
    font-family: '', ; font-size: 0.875rem; color: #6b7280;
    line-height: 1.65; margin: 0 0 16px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    flex: 1;
  }
  .bl-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 14px; border-top: 1px solid #f9fafb;
  }
  .bl-card-author { font-family: '', ; font-size: 0.8rem; color: #9ca3af; }
  .bl-card-link {
    font-family: '', ; font-size: 0.82rem; font-weight: 600;
    color: #f97316; text-decoration: none;
    display: flex; align-items: center; gap: 4px;
    transition: gap 0.18s;
  }
  .bl-card-link:hover { gap: 7px; }
  .bl-card-link svg { width: 13px; height: 13px; }

  /* skeleton */
  .bl-skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e9eaeb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: bl-shimmer 1.4s infinite; border-radius: 8px; }
  @keyframes bl-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* pagination */
  .bl-pag { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 56px; }
  .bl-pag-btn {
    font-family: '', ; font-size: 0.88rem; font-weight: 500;
    padding: 9px 20px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: #fff; color: #374151;
    cursor: pointer; transition: all 0.18s;
  }
  .bl-pag-btn:hover:not(:disabled) { border-color: #f97316; color: #f97316; }
  .bl-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .bl-pag-info { font-family: '', ; font-size: 0.88rem; color: #6b7280; padding: 0 8px; }

  /* empty / error */
  .bl-empty { text-align: center; padding: 80px 0; }
  .bl-empty svg { width: 64px; height: 64px; color: #e5e7eb; margin: 0 auto 20px; display: block; }
  .bl-empty p { font-family: '', ; color: #9ca3af; font-size: 1rem; }

  .bl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  @media(max-width:640px){
    .bl-container { padding: 0 14px 56px; }
    .bl-featured-img-wrap { min-height: 220px; }
    .bl-featured-body { padding: 22px 18px; }
    .bl-card-img { height: 180px; }
    .bl-card-body { padding: 18px 16px 16px; }
    .bl-pag { flex-wrap: wrap; }
  }
  `;

  if (typeof document !== 'undefined' && !document.getElementById('bl-styles')) {
    const el = document.createElement('style');
    el.id = 'bl-styles'; el.textContent = BLOGLIST_STYLES;
    document.head.appendChild(el);
  }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const getPrimaryCategory = (blog) =>
    blog?.categories?.[0]?.name || blog?.category || 'General';

  const getAuthorName = (blog) =>
    blog?.author?.author_name || blog?.author_name || 'Career Mitra';

  const getAuthorId = (blog) =>
    blog?.author?._id || blog?.author_id || blog?.authorId || '';

  const slugify = (value = '') =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const normalizeBlog = (blog) => ({
    ...blog,
    primaryCategory: getPrimaryCategory(blog),
    authorDisplayName: getAuthorName(blog),
    authorId: getAuthorId(blog),
  });

  const CalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
  const BlogSearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );

  const CATEGORIES = ['All', 'Blog', 'Guide', 'News', 'Career'];

  const CardSkeleton = () => (
    <div className="bl-card" style={{padding: 0}}>
      <div className="bl-skeleton" style={{height:200, borderRadius:'16px 16px 0 0'}} />
      <div style={{padding: '22px'}}>
        <div className="bl-skeleton" style={{height:12, width:'40%', marginBottom:10}} />
        <div className="bl-skeleton" style={{height:18, marginBottom:8}} />
        <div className="bl-skeleton" style={{height:18, width:'75%', marginBottom:16}} />
        <div className="bl-skeleton" style={{height:12, width:'60%'}} />
      </div>
    </div>
  );

  const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNextPage: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchBlogs = async (page = 1, search = '', category = '') => {
      setLoading(true); setError(null);
      try {
        let url = `https://careermitra.in/api/blogs?page=${page}&limit=9`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          const payload = data?.data || {};
          const rawBlogs = Array.isArray(payload.blogs)
            ? payload.blogs
            : (Array.isArray(data?.blogs) ? data.blogs : []);
          const allBlogs = rawBlogs.map(normalizeBlog);
          if (page === 1 && !search && !category) {
            setFeatured(allBlogs[0] || null);
            setBlogs(allBlogs.slice(1));
          } else {
            setFeatured(null);
            setBlogs(allBlogs);
          }
          setPagination(payload.pagination || { page: 1, totalPages: 1, total: 0, hasNextPage: false });
        } else { setError(data.message || 'Failed to fetch blogs'); }
      } catch { setError('Network error. Please try again.'); }
      finally { setLoading(false); }
    };

    useEffect(() => { fetchBlogs(1, searchTerm, selectedCategory); }, [searchTerm, selectedCategory]);

    const handleSearch = (e) => { e.preventDefault(); setSearchTerm(inputVal); };
    const handlePageChange = (p) => {
      if (p >= 1 && p <= pagination.totalPages) {
        fetchBlogs(p, searchTerm, selectedCategory);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <>
        <SEO
          title="Blog | Career Mitra — Govt Jobs, Career Guides & More"
          description="Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra."
          keywords="govt jobs 2026, career guide, exam tips, sarkari naukri, government jobs"
          url="https://www.careermitra.in/blogs"
          type="website"
          image="https://www.careermitra.in/og-blog.png"
        />
        <div className="bl-root" style={{background:'#fff', minHeight:'100vh'}}>

        {/* ── HERO ── */}
  <section className="relative w-full min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">

    {/* 🌈 Background Gradient */}
    <div className="absolute inset-0 bg-linear-to-br from-orange-50 via-white to-orange-100" />

    {/* 🔮 Floating Orbs */}
    <div className="absolute inset-0 overflow-hidden">
      
      <div className="absolute w-72 h-72 bg-orange-300/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      
      <div className="absolute w-96 h-96 bg-pink-300/20 rounded-full blur-3xl bottom-10 right-10 animate-[float_8s_ease-in-out_infinite]"></div>
      
      <div className="absolute w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl top-1/2 left-1/3 animate-[float_10s_ease-in-out_infinite]"></div>

    </div>

    {/* ✨ Content */}
    <div className="relative max-w-3xl w-full text-center z-10">

      {/* Label */}
      <div className="flex items-center justify-center gap-2 text-orange-500 font-medium mb-4">
        <span className="w-6 h-0.5 bg-orange-500"></span>
        Latest Articles & Guides
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Your Career,<br />
        <em className="text-orange-500 not-italic">Mindfully Guided</em>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-lg mb-8">
        Insights, exam strategies, job alerts, and career guides — everything you need to land your dream government job.
      </p>

      <form onSubmit={handleSearch} className="flex items-center justify-center mb-6">
        <div className="flex items-center w-full max-w-xl bg-white/80 backdrop-blur-md shadow-lg rounded-full overflow-hidden border border-white/40">
          
          <span className="px-3 text-gray-400">
            <BlogSearchIcon />
          </span>

          <input
            className="flex-1 min-w-0 px-2 py-3 text-sm md:text-base outline-none bg-transparent"
            placeholder="Search articles, guides, topics…"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />

          <button
            type="submit"
            className="bg-orange-500 text-white px-4 md:px-6 py-3 text-sm md:text-base whitespace-nowrap hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(cat === "All" ? "" : cat)
            }
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === (cat === "All" ? "" : cat)
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white/70 backdrop-blur text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div> */}

    </div>
  </section>
 
          <div className="bl-container">

            {/* ── FEATURED ── */}
            {featured && !loading && (
              <div style={{marginBottom:0}}>
                <div className="bl-section-head" style={{marginBottom:24}}>
                  <h2>Featured Story</h2>
                </div>
                <div className="bl-featured">
                  <div className="bl-featured-img-wrap">
                    <img
                      src={featured.featured_image}
                      alt={featured.image_alt_text || featured.title}
                      className="bl-featured-img"
                      onError={e => { e.target.style.background='#f9fafb'; e.target.src=''; }}
                    />
                    <div className="bl-featured-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{width:12,height:12}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      Featured
                    </div>
                  </div>
                  <div className="bl-featured-body">
                    <div className="bl-featured-cat">{featured.primaryCategory}</div>
                    <Link to={`/blog/${featured.slug}`} className="bl-featured-title">{featured.title}</Link>
                    <p className="bl-featured-desc">{featured.short_description}</p>
                    <div className="bl-featured-meta">
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
                        <Link to={`/author/${featured.authorId || slugify(featured.authorDisplayName)}`} style={{ color: '#111827', textDecoration: 'none' }}>
                          {featured.authorDisplayName}
                        </Link>
                      </span>
                      <span><CalIcon />{fmtDate(featured.published_at || featured.createdAt)}</span>
                      {/* <span><EyeIcon />{(featured.views || 0).toLocaleString()} views</span> */}
                    </div>
                    <Link to={`/blog/${featured.slug}`} className="bl-read-btn">
                      Read Full Article <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* spacing between featured & grid */}
            {featured && !loading && <div style={{height:64}} />}

            {/* ── CARDS GRID ── */}
            <div className="bl-section-head">
              <h2>{searchTerm || selectedCategory ? 'Search Results' : 'All Articles'}</h2>
              {pagination.total > 0 && (
                <span style={{fontFamily:"'',", fontSize:'0.85rem', color:'#9ca3af'}}>
                  {pagination.total} articles
                </span>
              )}
            </div>

            {loading ? (
              <div className="bl-grid">
                {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="bl-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p>{error}</p>
                <button className="bl-pag-btn" style={{margin:'0 auto', display:'block'}} onClick={() => fetchBlogs(1, searchTerm, selectedCategory)}>Try Again</button>
              </div>
            ) : blogs.length === 0 && !featured ? (
              <div className="bl-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-3-3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                <p>No articles found. Try a different search.</p>
              </div>
            ) : (
              <>
                <div className="bl-grid">
                  {blogs.map((blog) => (
                    <article key={blog._id} className="bl-card">
                      <div className="bl-card-img-wrap">
                        <img
                          src={blog.featured_image}
                          alt={blog.image_alt_text || blog.title}
                          className="bl-card-img"
                          loading="lazy"
                          onError={e => { e.target.parentNode.style.background='#f9fafb'; e.target.style.display='none'; }}
                        />
                        {blog.primaryCategory && <span className="bl-card-cat-badge">{blog.primaryCategory}</span>}
                      </div>
                      <div className="bl-card-body">
                        <div className="bl-card-meta">
                          <span style={{display:'flex',alignItems:'center',gap:4}}><CalIcon />{fmtDate(blog.published_at || blog.createdAt)}</span>
                          <span style={{color:'#e5e7eb'}}>·</span>
                          <span style={{display:'flex',alignItems:'center',gap:4}}><EyeIcon />{(blog.views||0).toLocaleString()}</span>
                        </div>
                        <Link to={`/blog/${blog.slug}`} className="bl-card-title">{blog.title}</Link>
                        <p className="bl-card-desc">{blog.short_description}</p>
                        <div className="bl-card-footer">
                          <Link
                            to={`/author/${blog.authorId || slugify(blog.authorDisplayName)}`}
                            className="bl-card-author"
                            style={{ textDecoration: 'none' }}
                          >
                            {blog.authorDisplayName}
                          </Link>
                          <Link to={`/blog/${blog.slug}`} className="bl-card-link">
                            Read More <ArrowIcon />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bl-pag">
                    <button className="bl-pag-btn" disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>← Previous</button>
                    <span className="bl-pag-info">Page {pagination.page} of {pagination.totalPages}</span>
                    <button className="bl-pag-btn" disabled={!pagination.hasNextPage} onClick={() => handlePageChange(pagination.page + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  export default BlogList;