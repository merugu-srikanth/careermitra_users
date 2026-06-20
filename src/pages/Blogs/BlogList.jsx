import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import blogFallback from '../../assets/blog-sample.png';

const BLOGLIST_STYLES = `

/* ── CONTAINER ── */
.bl-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 96px 24px 48px;
}
@media(min-width:1536px){ .bl-container { max-width: 1600px; padding: 104px 48px 56px; } }
@media(max-width:1280px){ .bl-container { padding: 88px 28px 40px; } }
@media(max-width:1024px){ .bl-container { padding: 80px 20px 36px; } }
@media(max-width:768px) { .bl-container { padding: 72px 16px 32px; } }
@media(max-width:480px) { .bl-container { padding: 64px 12px 24px; } }

/* ── FILTER PILLS ── */
.bl-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
.bl-pill {
  font-size: 0.82rem; font-weight: 500;
  padding: 7px 18px; border-radius: 100px; cursor: pointer;
  border: 1.5px solid #e5e7eb; color: #6b7280; background: #fff;
  transition: all 0.18s;
}
.bl-pill:hover { border-color: #f97316; color: #f97316; }
.bl-pill.active { background: #f97316; border-color: #f97316; color: #fff; }
@media(max-width:480px){ .bl-pill { padding: 6px 14px; font-size: 0.78rem; } }

/* ── FEATURED ── */
.bl-featured {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0; border-radius: 20px; overflow: hidden;
  background: #fff;
  border: 1.5px solid #f3f4f6;
  box-shadow: 0 8px 40px rgba(0,0,0,0.07);
  transition: box-shadow 0.25s, transform 0.25s;
}
.bl-featured:hover { box-shadow: 0 20px 60px rgba(249,115,22,0.12); transform: translateY(-4px); }
@media(max-width:768px){ .bl-featured { grid-template-columns: 1fr; } }
@media(max-width:480px){ .bl-featured { border-radius: 14px; } }

.bl-featured-img-wrap {
  position: relative; overflow: hidden;
  min-height: 340px;
}
@media(max-width:1024px){ .bl-featured-img-wrap { min-height: 300px; } }
@media(max-width:768px) { .bl-featured-img-wrap { min-height: 260px; } }
@media(max-width:480px) { .bl-featured-img-wrap { min-height: 210px; } }

.bl-featured-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s ease;
}
.bl-featured:hover .bl-featured-img { transform: scale(1.04); }
.bl-featured-badge {
  position: absolute; top: 16px; left: 16px;
  background: #f97316; color: #fff;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 5px 12px; border-radius: 100px;
  display: flex; align-items: center; gap: 5px;
}

.bl-featured-body {
  padding: 40px 44px;
  display: flex; flex-direction: column; justify-content: center;
}
@media(max-width:1280px){ .bl-featured-body { padding: 32px 36px; } }
@media(max-width:1024px){ .bl-featured-body { padding: 28px 28px; } }
@media(max-width:768px) { .bl-featured-body { padding: 24px 20px; } }
@media(max-width:480px) { .bl-featured-body { padding: 20px 16px; } }

.bl-featured-cat {
  font-size: 0.75rem; font-weight: 600;
  color: #f97316; text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.bl-featured-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.25rem, 2vw, 2rem); font-weight: 800;
  color: #111827; line-height: 1.25;
  margin: 0 0 14px;
  text-decoration: none; display: block;
  transition: color 0.2s;
}
.bl-featured-title:hover { color: #f97316; }
.bl-featured-desc {
  font-size: 0.95rem; color: #6b7280;
  line-height: 1.75; margin: 0 0 20px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.bl-featured-meta {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  font-size: 0.82rem; color: #9ca3af;
  margin-bottom: 24px;
}
.bl-featured-meta span { display: flex; align-items: center; gap: 5px; }
.bl-featured-meta svg { width: 13px; height: 13px; }

.bl-read-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: #f97316; color: #fff;
  font-size: 0.9rem; font-weight: 600;
  padding: 11px 22px; border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  align-self: flex-start;
  box-shadow: 0 4px 14px rgba(249,115,22,0.3);
  white-space: nowrap;
}
.bl-read-btn:hover { background: #ea580c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249,115,22,0.35); }
.bl-read-btn svg { width: 15px; height: 15px; transition: transform 0.2s; flex-shrink: 0; }
.bl-read-btn:hover svg { transform: translateX(3px); }

/* ── SECTION HEADING ── */
.bl-section-head {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 28px; padding-bottom: 14px;
  border-bottom: 2px solid #f3f4f6;
  position: relative;
}
.bl-section-head::after {
  content: '';
  position: absolute; bottom: -2px; left: 0;
  width: 60px; height: 2px; background: #f97316;
}
.bl-section-head h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.2rem, 2.5vw, 1.75rem); font-weight: 800; color: #111827; margin: 0;
}
.bl-section-head span, .bl-section-head a {
  font-size: 0.85rem; font-weight: 500;
  color: #9ca3af; text-decoration: none;
  display: flex; align-items: center; gap: 4px;
  white-space: nowrap;
}
.bl-section-head a { color: #f97316; font-weight: 600; }
.bl-section-head a:hover { color: #ea580c; }

/* ── BLOG CARDS GRID ── */
.bl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-content: start;
}
@media(min-width:1536px){ .bl-grid { grid-template-columns: repeat(4,1fr); gap: 32px; } }
@media(max-width:1024px){ .bl-grid { grid-template-columns: repeat(2,1fr); gap: 20px; } }
@media(max-width:600px) { .bl-grid { grid-template-columns: 1fr; gap: 16px; } }

.bl-card {
  background: #fff; border-radius: 16px;
  border: 1.5px solid #f3f4f6;
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
  display: flex; flex-direction: column;
}
.bl-card:hover {
  box-shadow: 0 12px 40px rgba(249,115,22,0.1);
  transform: translateY(-4px);
  border-color: rgba(249,115,22,0.3);
}
@media(max-width:480px){ .bl-card { border-radius: 12px; } }

.bl-card-img-wrap {
  overflow: hidden; position: relative; flex-shrink: 0;
  border-radius: 14px 14px 0 0;
  background: #f1f5f9;
  aspect-ratio: 16 / 9;
}
.bl-card-img {
  width: 100%; height: 100%; object-fit: contain;
  transition: transform 0.45s ease;
  display: block;
}

.bl-card:hover .bl-card-img { transform: scale(1.06); }
.bl-card-cat-badge {
  position: absolute; top: 12px; left: 12px;
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.07em; text-transform: uppercase;
  background: rgba(255,255,255,0.92);
  color: #f97316; padding: 4px 10px; border-radius: 100px;
  backdrop-filter: blur(4px);
}

.bl-card-body { padding: 20px 20px 18px; flex: 1; display: flex; flex-direction: column; }
@media(max-width:480px){ .bl-card-body { padding: 16px 14px 14px; } }

.bl-card-meta {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.75rem; color: #9ca3af;
  margin-bottom: 8px; flex-wrap: wrap;
}
.bl-card-meta svg { width: 11px; height: 11px; flex-shrink: 0; }
.bl-card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.05rem; font-weight: 700; color: #111827;
  line-height: 1.35; margin: 0 0 8px;
  text-decoration: none; display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  transition: color 0.18s;
}
.bl-card-title:hover { color: #f97316; }
.bl-card-desc {
  font-size: 0.87rem; color: #6b7280;
  line-height: 1.65; margin: 0 0 14px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  flex: 1;
}
.bl-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px; border-top: 1px solid #f3f4f6;
  gap: 8px;
}
.bl-card-author { font-size: 0.78rem; color: #9ca3af; min-width: 0; }
.bl-card-link {
  font-size: 0.8rem; font-weight: 600;
  color: #f97316; text-decoration: none;
  display: flex; align-items: center; gap: 4px;
  transition: gap 0.18s; flex-shrink: 0;
}
.bl-card-link:hover { gap: 7px; }
.bl-card-link svg { width: 12px; height: 12px; }

/* ── SKELETON ── */
.bl-skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e9eaeb 50%, #f3f4f6 75%);
  background-size: 200% 100%; animation: bl-shimmer 1.4s infinite; border-radius: 8px;
}
@keyframes bl-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── PAGINATION ── */
.bl-pag {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; margin-top: 36px; flex-wrap: wrap;
}
.bl-pag-btn {
  font-size: 0.87rem; font-weight: 500;
  padding: 8px 18px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; background: #fff; color: #374151;
  cursor: pointer; transition: all 0.18s;
}
.bl-pag-btn:hover:not(:disabled) { border-color: #f97316; color: #f97316; }
.bl-pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bl-pag-info { font-size: 0.87rem; color: #6b7280; padding: 0 6px; }

/* ── EMPTY / ERROR ── */
.bl-empty { text-align: center; padding: 48px 0 24px; }
.bl-empty svg { width: 52px; height: 52px; color: #e5e7eb; margin: 0 auto 16px; display: block; }
.bl-empty p { color: #9ca3af; font-size: 0.97rem; margin: 0 0 20px; }
`;

if (typeof document !== 'undefined' && !document.getElementById('bl-styles')) {
  const el = document.createElement('style');
  el.id = 'bl-styles'; el.textContent = BLOGLIST_STYLES;
  document.head.appendChild(el);
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

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
  authorAvatar: blog?.author?.avatar_url || null,
});

const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);


const CardSkeleton = () => (
  <div className="bl-card" style={{padding: 0}}>
    <div className="bl-skeleton" style={{height:200, borderRadius:'16px 16px 0 0'}} />
    <div style={{padding: '20px'}}>
      <div className="bl-skeleton" style={{height:11, width:'38%', marginBottom:10}} />
      <div className="bl-skeleton" style={{height:16, marginBottom:7}} />
      <div className="bl-skeleton" style={{height:16, width:'70%', marginBottom:14}} />
      <div className="bl-skeleton" style={{height:11, width:'55%'}} />
    </div>
  </div>
);

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputVal, setInputVal] = useState('');

  const fetchBlogs = async (search = '') => {
    setLoading(true); setError(null);
    try {
      let url = 'https://careermitra.in/api/blogs';
      if (search) url += `?search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      const d = data.data || data;
      const allBlogs = (d.articles || []).map(normalizeBlog);
      setTotalCount(allBlogs.length);
      if (!search) {
        setFeatured(allBlogs[0] || null);
        setBlogs(allBlogs.slice(1));
      } else {
        setFeatured(null);
        setBlogs(allBlogs);
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  // Refetch when search changes
  useEffect(() => {
    fetchBlogs(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e) => { e.preventDefault(); setSearchTerm(inputVal); };

  return (
    <>
      <SEO
        title="Articles | Career Mitra — Govt Jobs, Career Guides & More"
        description="Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra."
        keywords="govt jobs 2026, career guide, exam tips, sarkari naukri, government jobs"
        url="https://www.careermitra.in/government-jobs"
        type="website"
        image="https://www.careermitra.in/og-articles.png"
      />
      <div style={{ background: '#fff' }}>
        <div className="bl-container">

          {/* ── CATEGORY FILTER PILLS ── */}
          {/* {dynamicCategories.length > 0 && (
            <div className="bl-filters">
              <Link to="/blogs" className="bl-pill active">All</Link>
              {dynamicCategories.map(cat => (
                <Link
                  key={cat}
                  to={`/${slugify(cat)}`}
                  state={{ categoryName: cat }}
                  className="bl-pill"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )} */}

          {/* ── FEATURED ── */}
          {featured && !loading && (
            <div style={{ marginBottom: 0 }}>
              <div className="bl-section-head" style={{ marginBottom: 20 }}>
                <h2>Featured Story</h2>
              </div>
              <div className="bl-featured">
                <div className="bl-featured-img-wrap">
                  <img
                    src={featured.featured_image || blogFallback}
                    alt={featured.image_alt_text || featured.title}
                    className="bl-featured-img"
                    onError={e => { e.target.onerror = null; e.target.src = blogFallback; }}
                  />
                  <div className="bl-featured-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:11,height:11}}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Featured
                  </div>
                </div>
                <div className="bl-featured-body">
                  <div className="bl-featured-cat">{featured.primaryCategory}</div>
                  <Link to={`/${slugify(featured.primaryCategory)}/${featured.slug}`} className="bl-featured-title">
                    {featured.title}
                  </Link>
                  <p className="bl-featured-desc">{featured.short_description}</p>
                  <div className="bl-featured-meta">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13}}>
                        <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                      </svg>
                      <Link to={`/author/${slugify(featured.authorDisplayName)}`} style={{ color: '#111827', textDecoration: 'none' }}>
                        {featured.authorDisplayName}
                      </Link>
                    </span>
                    <span><CalIcon />{fmtDate(featured.createdAt || featured.created_at || featured.published_at)}</span>
                    <span><ClockIcon />{fmtTime(featured.createdAt || featured.created_at || featured.published_at)}</span>
                  </div>
                  <Link to={`/${slugify(featured.primaryCategory)}/${featured.slug}`} className="bl-read-btn">
                    Read Full Article <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {featured && !loading && <div style={{ height: 48 }} />}

          {/* ── All Government Jobs HEADING ── */}
          <div className="bl-section-head">
            <h2>{searchTerm ? 'Search Results' : 'All Government Jobs'}</h2>
            {!loading && totalCount > 0 && (
              <span>{totalCount} article{totalCount !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* ── GRID / STATES ── */}
          {loading ? (
            <div className="bl-grid">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="bl-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>{error}</p>
              <button className="bl-pag-btn" style={{margin:'0 auto', display:'block'}} onClick={() => fetchBlogs(1, searchTerm)}>
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 && !featured ? (
            <div className="bl-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-3-3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              </svg>
              <p>No articles found{searchTerm ? ` for "${searchTerm}"` : ''}. Try a different search term.</p>
            </div>
          ) : (
            <>
              <div className="bl-grid">
                {blogs.map((blog) => (
                  <article key={blog._id} className="bl-card">
                    <div className="bl-card-img-wrap">
                      <img
                        src={blog.featured_image || blogFallback}
                        alt={blog.image_alt_text || blog.title}
                        className="bl-card-img"
                        loading="lazy"
                        onError={e => { e.target.onerror = null; e.target.src = blogFallback; }}
                      />
                      {blog.primaryCategory && <span className="bl-card-cat-badge">{blog.primaryCategory}</span>}
                    </div>
                    <div className="bl-card-body">
                      <div className="bl-card-meta">
                        <span style={{display:'flex',alignItems:'center',gap:4}}>
                          <CalIcon />{fmtDate(blog.createdAt || blog.created_at || blog.published_at)}
                        </span>
                        <span style={{color:'#e5e7eb'}}>·</span>
                        <span style={{display:'flex',alignItems:'center',gap:4}}>
                          <ClockIcon />{fmtTime(blog.createdAt || blog.created_at || blog.published_at)}
                        </span>
                      </div>
                      <Link to={`/${slugify(blog.primaryCategory)}/${blog.slug}`} className="bl-card-title">
                        {blog.title}
                      </Link>
                      {/* <p className="bl-card-desc">{blog.short_description}</p> */}
                      <div className="bl-card-footer">
                        <Link
                          to={`/author/${slugify(blog.authorDisplayName)}`}
                          className="bl-card-author"
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}
                        >
                          {blog.authorAvatar ? (
                            <img
                              src={blog.authorAvatar}
                              alt={blog.authorDisplayName}
                              style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #f3f4f6' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, fontWeight: 700, color: '#f97316' }}>
                              {(blog.authorDisplayName || 'C').charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                            {blog.authorDisplayName}
                          </span>
                        </Link>
                        <Link to={`/${slugify(blog.primaryCategory)}/${blog.slug}`} className="bl-card-link">
                          Read More <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
