"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from "next/link";
import SEO from '@/components/SEO';
import { generateCollectionPageSchema, generateItemListSchema } from '@/utils/schemaHelpers';
import blogFallback from '@/assets/blog-sample.png';
import { useBlogs } from '@/context/BlogContext';

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
  width: 100%; height: 100%; object-fit: contain;
  background: #fff;
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
  font-family: 'Poppins', sans-serif;
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
.bl-section-head h2, .bl-section-head h1 {
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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

/* ── LOAD MORE BUTTON ── */
.bl-loadmore-wrap {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 48px;
}
.bl-loadmore-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #f97316;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 12px;
  border: 2px solid #f97316;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(249,115,22,0.08);
}
.bl-loadmore-btn:hover {
  background: #f97316;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249,115,22,0.2);
}

/* ── PDF ARTICLE STYLE ── */
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
.bl-doc-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.25rem, 2.3vw, 1.75rem);
  font-weight: 700;
  color: #000;
  margin-top: 40px;
  margin-bottom: 18px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}
.bl-doc-sub-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin-top: 28px;
  margin-bottom: 14px;
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
.bl-qual-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
}
@media(max-width: 640px) {
  .bl-qual-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
.bl-qual-card {
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  transition: transform 0.2s, box-shadow 0.2s;
}
.bl-qual-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}
.bl-qual-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.bl-qual-text {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.65;
}

/* ── FAQ SECTION ── */
.bl-faq-section {
  margin-top: 56px;
}
.bl-faq-item {
  background: #fff;
  border-radius: 18px;
  margin-bottom: 18px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}
.bl-faq-q {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  padding: 22px 28px;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: background 0.2s;
}
.bl-faq-q:hover {
  background: #f1f5f9;
}
.bl-faq-a {
  padding: 22px 28px;
  font-size: 0.98rem;
  color: #475569;
  line-height: 1.7;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}
`;

if (typeof document !== 'undefined') {
  let el = document.getElementById('bl-styles');
  if (!el) {
    el = document.createElement('style');
    el.id = 'bl-styles';
    document.head.appendChild(el);
  }
  el.textContent = BLOGLIST_STYLES;
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
const isSameDay = (a, b) => !a || !b || new Date(a).toDateString() === new Date(b).toDateString();

/** Published date always wins over createdAt — createdAt is when the draft was first saved, not when it went live. */
const getPublishedAt = (blog) => blog?.published_at || blog?.createdAt || blog?.created_at;
/** Only present when the admin checked "Show on public article" — backend strips it otherwise. */
const getUpdatedAt = (blog) => blog?.last_updated_at || null;
/**
 * Only show "Updated" when it's genuinely later than the publish date —
 * stale/imported last_updated_at values can predate published_at, which
 * would otherwise render as a nonsensical "Updated" time before "Published".
 */
const shouldShowUpdated = (blog) => {
  const updated = getUpdatedAt(blog);
  const published = getPublishedAt(blog);
  return Boolean(updated) && new Date(updated).getTime() > new Date(published).getTime() && !isSameDay(published, updated);
};

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
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);


const CardSkeleton = () => (
  <div className="bl-card" style={{ padding: 0 }}>
    <div className="bl-skeleton" style={{ height: 200, borderRadius: '16px 16px 0 0' }} />
    <div style={{ padding: '20px' }}>
      <div className="bl-skeleton" style={{ height: 11, width: '38%', marginBottom: 10 }} />
      <div className="bl-skeleton" style={{ height: 16, marginBottom: 7 }} />
      <div className="bl-skeleton" style={{ height: 16, width: '70%', marginBottom: 14 }} />
      <div className="bl-skeleton" style={{ height: 11, width: '55%' }} />
    </div>
  </div>
);


const buildArticleUrl = (article) => {
  const tree = article?.categoryTree?.[0];
  if (!tree) return `/${article?.slug}`;
  const parentSlug = slugify(tree.parent?.name || tree.parent?.slug);
  const childId = article.primary_category?._id || article.primary_category;
  const child = tree.children?.find(c => c.id === childId || c._id === childId);
  if (child) {
    const childSlug = slugify(child.name || child.slug);
    return `/${parentSlug}/${childSlug}/${article.slug}`;
  }
  return `/${parentSlug}/${article.slug}`;
};

const BlogList = () => {
  const { blogs: allBlogs, loading: contextLoading, error: contextError } = useBlogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [visibleCount, setVisibleCount] = useState(32);
  const [faqOpen, setFaqOpen] = useState({});

  useEffect(() => {
    setVisibleCount(32);
  }, [searchTerm]);

  const toggleFaq = (idx) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const blogListSchemas = useMemo(() => {
    if (!allBlogs || allBlogs.length === 0) return [];
    
    const collectionSchema = generateCollectionPageSchema({
      name: "Government Jobs | Career Mitra — Govt Jobs, Career Guides & More",
      description: "Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra.",
      url: "/government-jobs"
    });
    
    const itemListItems = allBlogs.slice(0, 20).map((blog) => ({
      name: blog.title,
      url: `https://www.careermitra.in/government-jobs`,
      item: {
        title: blog.title,
        description: blog.short_description || blog.content?.substring(0, 150),
        publishedAt: blog.published_at || blog.created_at,
        url: `https://www.careermitra.in/government-jobs`,
        authorName: blog.author?.author_name || blog.author_name || "Career Mitra"
      }
    }));
    
    const itemListSchema = generateItemListSchema(itemListItems);
    
    return [collectionSchema, itemListSchema].filter(Boolean);
  }, [allBlogs]);

  const loading = contextLoading;
  const error = contextError;

  const filteredBlogs = useMemo(() => {
    if (contextLoading) return [];
    let list = [...allBlogs];
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (b) =>
          String(b.title || "").toLowerCase().includes(q) ||
          String(b.short_description || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allBlogs, searchTerm, contextLoading]);

  const blogs = filteredBlogs;
  const displayedBlogs = useMemo(() => {
    return blogs.slice(0, visibleCount);
  }, [blogs, visibleCount]);

  const totalCount = filteredBlogs.length;

  const handleSearch = (e) => { e.preventDefault(); setSearchTerm(inputVal); };

  return (
    <>
      <div style={{ background: '#fff' }}>
        <div className="bl-container">
    
          {/* ── All Government Jobs HEADING ── */}
          <div className="bl-section-head">
            <h1>{searchTerm ? 'Search Results' : 'All Government Jobs'}</h1>
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
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
              <button className="bl-pag-btn" style={{ margin: '0 auto', display: 'block' }} onClick={() => fetchBlogs(1, searchTerm)}>
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bl-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-3-3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <p>No articles found{searchTerm ? ` for "${searchTerm}"` : ''}. Try a different search term.</p>
            </div>
          ) : (
            <>
              <div className="bl-grid">
                {displayedBlogs.map((blog) => (
                  <article key={blog._id} className="bl-card">
                    <div className="bl-card-img-wrap">
                      <img
                        src={blog.featured_image || blogFallback}
                        alt={blog.image_alt_text || blog.title}
                        className="bl-card-img"
                        loading="lazy"
                        onError={e => { e.target.onerror = null; e.target.src = blogFallback; }}
                      />
                    </div>
                    <div className="bl-card-body">
                      <div className="bl-card-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <CalIcon />{fmtDate(getPublishedAt(blog))}
                        </span>
                        <span style={{ color: '#e5e7eb', flexShrink: 0 }}>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <ClockIcon />{fmtTime(getPublishedAt(blog))}
                        </span>
                      </div>
                      {shouldShowUpdated(blog) && (
                        <div className="bl-card-meta" style={{ marginTop: -4, color: '#f97316' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            <EditIcon />Updated {fmtDate(getUpdatedAt(blog))}, {fmtTime(getUpdatedAt(blog))}
                          </span>
                        </div>
                      )}
                      <Link href={buildArticleUrl(blog)} className="bl-card-title">
                        {blog.title}
                      </Link>
                      <div className="bl-card-footer">
                        <Link href={`/author/${slugify(blog.authorDisplayName)}`}
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
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {blog.authorDisplayName}
                          </span>
                        </Link>
                        <Link href={buildArticleUrl(blog)} className="bl-card-link">
                          Read More <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {visibleCount < blogs.length && (
                <div className="bl-loadmore-wrap">
                  <button
                    className="bl-loadmore-btn"
                    onClick={() => setVisibleCount(prev => prev + 32)}
                  >
                    Load More Articles
                  </button>
                </div>
              )}

              {/* ── PDF Content Document Section ── */}
              <div className="bl-article-doc">
                <h2 className="bl-doc-title">
                  Latest Government Jobs 2026: Govt Job Notifications, Eligibility & Career Guidance
                </h2>
                
                <h3 className="bl-doc-subtitle">Latest Government Jobs 2026</h3>
                <p className="bl-doc-p">
                  Aspiring candidates across India have a fully scheduled recruitment calendar to track in 2026. UPSC, SSC, IBPS, and Railway Recruitment Boards have all released fresh notifications this year, covering civil services, banking, railways, and defense.
                </p>
                <p className="bl-doc-p">
                  Railway Group D alone has drawn tens of thousands of vacancies in its <Link href="/railway-jobs" className="bl-doc-link">latest recruitment</Link>, while SSC's exam calendar covers CGL, CHSL, MTS, and GD Constable. State boards continue to run parallel drives for police, teaching, and clerical posts on independent timelines, so checking each recruiting body's official notice remains essential.
                </p>

                <h3 className="bl-doc-subtitle">Government Jobs 2026 by Qualification</h3>
                <p className="bl-doc-p">
                  Job seekers at every education level have a defined entry point into government service. Recruitment in India is structured around minimum qualifications, and each tier opens access to a distinct set of departments and pay grades.
                </p>

                <div className="bl-qual-grid">
                  <div className="bl-qual-card">
                    <h4 className="bl-qual-title">10th Pass Government Jobs 2026</h4>
                    <p className="bl-qual-text">
                      Candidates with a 10th class pass certificate can apply for SSC MTS, SSC GD Constable, Railway Group D, and DDA Multi-Tasking Staff posts. These roles include peon, constable, trackman, and helper positions across railways, municipal bodies, and paramilitary forces. Physical fitness tests apply for constable and defense-linked posts.
                    </p>
                  </div>
                  
                  <div className="bl-qual-card">
                    <h4 className="bl-qual-title">12th Pass Government Jobs 2026</h4>
                    <p className="bl-qual-text">
                      Class 12th pass holders can target SSC CHSL, Delhi Police Constable, state police, and forest guard posts, and clerical roles in railways and PSUs. These openings typically lead to Lower Division Clerk, Postal Assistant, or Data Entry Operator positions with a defined promotion path.
                    </p>
                  </div>
                  
                  <div className="bl-qual-card">
                    <h4 className="bl-qual-title">Graduate Government Jobs 2026</h4>
                    <p className="bl-qual-text">
                      Graduates make up the largest applicant pool nationwide, competing for SSC CGL, bank PO and clerk posts, UPSC Civil Services, and state PSC exams. A bachelor's degree in any discipline qualifies for most of these, though technical posts such as Junior Engineer require an engineering degree.
                    </p>
                  </div>
                  
                  <div className="bl-qual-card">
                    <h4 className="bl-qual-title">ITI & Diploma Government Jobs 2026</h4>
                    <p className="bl-qual-text">
                      Technical candidates with an ITI or diploma qualification find openings as a technician, junior engineer, and Trade Apprentice across Railways, ISRO, DRDO, and BHEL. Apprentice schemes under these organizations run through the year and often lead into full-time technical roles later.
                    </p>
                  </div>
                </div>

                <h3 className="bl-doc-subtitle">Central Government Jobs 2026</h3>
                <p className="bl-doc-p">
                  Job seekers aiming for <Link href="/central-government-jobs" className="bl-doc-link">central government jobs</Link> can apply through UPSC, SSC, IBPS, RRB, Defence Recruitment portals, and individual ministries. This category covers civil services, banking, railways, defense, income tax, customs, and central armed police forces. Central posts generally carry all-India transfer liability and a pay structure set by the applicable Pay Commission, along with pension and allowance benefits.
                </p>

                <h3 className="bl-doc-subtitle">State Government Jobs 2026</h3>
                <p className="bl-doc-p">
                  Candidates preferring to stay within their home state can rely on <Link href="/state-government-jobs" className="bl-doc-link">state Public Service Commissions</Link> and Staff Selection Boards, which recruit for police, teaching, revenue, and health departments. State PSC exams, police constable drives, and teacher eligibility tests run on independent calendars through 2026, and registration happens directly on the relevant state portal.
                </p>

                <h3 className="bl-doc-subtitle">Railway Jobs 2026</h3>
                <p className="bl-doc-p">
                  <Link href="/railway-jobs" className="bl-doc-link">Railway</Link> aspirants continue to have the largest single recruitment pipeline in the country. Indian Railways hires through Railway Recruitment Boards for Assistant Loco Pilot, Technician, NTPC, and Junior Engineer posts, and through Railway Recruitment Cells at the zonal level for Group D and apprentice roles.
                </p>
                <p className="bl-doc-p">
                  A single Centralized Employment Notice can carry tens of thousands of vacancies across CBT-1, CBT-2, physical tests, and document verification stages, so tracking updates on the relevant zonal RRB website is the reliable approach.
                </p>

                <h3 className="bl-doc-subtitle">Bank Jobs 2026</h3>
                <p className="bl-doc-p">
                  <Link href="/bank-jobs" className="bl-doc-link">Banking</Link> aspirants have several major recruitment drives open in 2026, including SBI Clerk, IBPS Clerk and PO, LIC AAO, NABARD Grade A, and NHB Assistant Manager. IBPS publishes a tentative calendar each year for its Common Recruitment Process across Public Sector Banks and Regional Rural Banks. Banking exams typically run through a Preliminary, Mains, and Interview format, with a Group Discussion round added for some officer-level posts.
                </p>

                <h3 className="bl-doc-subtitle">Defense Jobs 2026</h3>
                <p className="bl-doc-p">
                  Candidates who prefer <Link href="/defence-jobs" className="bl-doc-link">defense</Link> service can enter through Agniveer recruitment in the Army, Navy, and Air Force. Officer-level entry through UPSC's CDS and NDA exams or central armed police forces through SSC GD and UPSC CAPF exams. Agniveer intake follows a fixed annual rally and written exam schedule, while NDA and CDS entry runs twice a year. Physical standards, medical fitness, and a written exam form the common structure across most defense recruitment.
                </p>

                <h3 className="bl-doc-subtitle">SSC Government Jobs 2026</h3>
                <p className="bl-doc-p">
                  Job seekers targeting Group B and C central posts rely heavily on the <Link href="/ssc-jobs" className="bl-doc-link">Staff Selection Commission's</Link> annual exam calendar. This includes CGL for graduate-level posts, CHSL for 12th pass candidates, MTS and GD Constable for 10th pass candidates, and the Junior Engineer and Stenographer exams for technical roles. Exact dates should be confirmed against the official SSC website closer to each exam.
                </p>

                <h3 className="bl-doc-subtitle">UPSC Government Jobs 2026</h3>
                <p className="bl-doc-p">
                  Candidates aiming for the highest tier of central service look to the <Link href="/upsc-jobs" className="bl-doc-link">Union Public Service Commission</Link>, which recruits for Civil Services, combined defense services, the National Defence Academy, engineering services, and the Central Armed Police Forces through separate annual exams. UPSC's Annual Calendar, released at the start of the year, lists notification, exam, and result dates for every exam it conducts.
                </p>

                <h3 className="bl-doc-subtitle">Government Job Eligibility 2026</h3>
                <p className="bl-doc-p">
                  Every applicant should confirm three factors before applying: educational qualification, age limit, and nationality. Most central government posts require Indian citizenship, though certain categories permit subjects of Nepal, Bhutan, or specific refugee groups with government clearance. Qualification is verified again at the document stage, so holding the required certificate before applying matters more than holding it by the result date.
                </p>

                <h3 className="bl-doc-subtitle">Government Job Age Limit</h3>
                <p className="bl-doc-p">
                  Age-eligible candidates should note that limits vary by post and category. Most central government jobs set an upper age limit between 27 and 32 years for unreserved candidates, with relaxation of 3 years for OBC and 5 years for SC/ST candidates. Defense entry schemes such as Agniveer and NDA set narrower bands, generally between 17.5 and 23 years, since these posts recruit at an earlier stage.
                </p>

                <h3 className="bl-doc-subtitle">How to Apply for Government Jobs</h3>
                <p className="bl-doc-p">
                  Applying for a government job follows a similar process across recruiting bodies. First, candidates register on the official portal. Next, they fill in personal and educational details, then upload a photograph and signature in the specified format. After that, they pay the application fee online and submit the form before the closing date.
                </p>
                <p className="bl-doc-p">
                  Keeping scanned copies ready in advance saves time. This includes the photograph, signature, Class 10 marksheet, degree certificate, and category certificate. Having these on hand prevents delays when a notification opens with a short application window.
                </p>

                <h3 className="bl-doc-subtitle">Government Job Selection Process</h3>
                <p className="bl-doc-p">
                  Candidates preparing for selection rounds should expect a written exam followed by a skill test, physical test, or interview depending on the post. Group C and D posts typically end at the written exam and document verification stage.
                </p>
                <p className="bl-doc-p">
                  Group B and A posts add a Mains exam and Interview round, as seen in SSC CGL and UPSC Civil Services. Banking exams follow a Preliminary and Mains structure, with an Interview or Group Exercise added for officer-level posts.
                </p>

                <h3 className="bl-doc-subtitle">Government Job Career Guidance</h3>
                <p className="bl-doc-p">
                  Serious aspirants benefit from a structured plan rather than switching between exams. Shortlisting two or three exams that match qualifications and interest, studying the syllabus and previous year papers for those exams, and building a weekly revision schedule work better than an open-ended approach.
                </p>
                <p className="bl-doc-p">
                  General awareness and quantitative aptitude form common ground across most competitive government exams, so strengthening these areas benefits multiple applications at once.
                </p>

                <h3 className="bl-doc-subtitle">Government Internships & Apprenticeships</h3>
                <p className="bl-doc-p">
                  Early-career candidates can use apprenticeship routes to enter government organizations without a full recruitment exam. DRDO, ISRO, BHEL, and various PSUs run <Link href="/internships" className="bl-doc-link">apprentice programs</Link> for ITI, diploma, and graduate candidates throughout the year, often as walk-in or direct application drives with limited seats.
                </p>
                <p className="bl-doc-p">
                  These programs pay a stipend and give apprenticeship candidates a scoring advantage in later regular recruitment at some organizations.
                </p>

                <h3 className="bl-doc-subtitle">Latest Government Job Updates</h3>
                <p className="bl-doc-p">
                  Regular readers of recruitment news will find fresh notices opening through 2026 across teaching, technical, clerical, and defense categories. These include Central Railway's teacher recruitment drive, BHEL's project engineer intake, and ISRO's recruitment for assistant, steno, and clerical roles. Official department websites remain the first and most reliable source for any new notification.
                </p>

                <h3 className="bl-doc-subtitle">Why Choose Career Mitra for Government Job Updates?</h3>
                <p className="bl-doc-p">
                  Career-focused readers gain an advantage using Career Mitra, which tracks notifications directly from official recruitment bodies and organizes them by qualification, sector, and state. Every listing links back to the source notification, and eligibility, age limit, and selection process details are summarized for quick reference, reducing time spent searching scattered portals.
                </p>

                {/* FAQ Section */}
                <div className="bl-faq-section">
                  <h3 className="bl-doc-subtitle" style={{ borderBottom: 'none', marginBottom: 24, textAlign: 'center' }}>
                    Frequently Asked Questions About Government Jobs
                  </h3>
                  
                  {[
                    {
                      q: "Which government jobs can a 10th-pass candidate apply for in 2026?",
                      a: "SSC MTS, SSC GD Constable, and Railway Group D accept Class 10 as the minimum qualification."
                    },
                    {
                      q: "What is the general age limit for central government jobs?",
                      a: "Most posts set the upper limit between 27 and 32 years for unreserved candidates, with relaxation for reserved categories."
                    },
                    {
                      q: "How can candidates track railway recruitment updates?",
                      a: "Railway notices are released CEN-wise, so following the RRB website for the relevant zone is the reliable approach."
                    },
                    {
                      q: "Is there an application fee for government exams?",
                      a: "Most recruiting bodies charge a fee for general and OBC candidates, with waivers commonly available for SC, ST, women, and persons with disabilities."
                    },
                    {
                      q: "What is the typical selection process for bank jobs?",
                      a: "Banking recruitment generally follows a Preliminary exam, Mains exam and an Interview or Group Exercise for officer-level posts."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="bl-faq-item">
                      <div className="bl-faq-q" onClick={() => toggleFaq(idx)}>
                        <span>{faq.q}</span>
                        <span style={{ transition: 'transform 0.2s', transform: faqOpen[idx] ? 'rotate(180deg)' : 'rotate(0)' }}>
                          ▼
                        </span>
                      </div>
                      {faqOpen[idx] && (
                        <div className="bl-faq-a">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
