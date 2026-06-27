import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import BlogAuthor from '../../components/BlogAuthor';
import blogFallback from '../../assets/blog-sample.png';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const BD_STYLES = `

/* progress bar */
.bd-progress { position:fixed;top:0;left:0;right:0;z-index:9999;height:3px;background:transparent; }
.bd-progress-fill { height:100%;background:linear-gradient(90deg,#f97316,#eab308,#22c55e);transition:width 0.1s linear; }

/* layout */
.bd-layout { display:grid;grid-template-columns:1fr 300px;gap:40px;align-items:start; }
@media(max-width:1024px){ .bd-layout { grid-template-columns:1fr;gap:24px; } }

/* article */
.bd-article { min-width:0; }

/* hero image */
.bd-hero-img-wrap { border-radius:20px;overflow:hidden;margin-bottom:32px;box-shadow:0 12px 48px rgba(0,0,0,0.1);position:relative; }
.bd-hero-img { width:100%;height:auto;object-fit:cover;display:block; }
.bd-hero-cat { position:absolute;top:16px;left:16px;background:#f97316;color:#fff;font-family:'',;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;border-radius:100px; }

/* title */
.bd-title { font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:#111827;line-height:1.2;margin:0 0 20px; }

/* meta row */
.bd-meta { display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:16px 0;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;margin-bottom:28px; }
.bd-meta-item { display:flex;align-items:center;gap:6px;font-family:'',;font-size:0.82rem;color:#6b7280; }
.bd-meta-item svg { width:13px;height:13px; }
.bd-meta-item.author { color:#111827;font-weight:600; }

/* ── AI SUMMARY BOX ── */
.bd-summary-btn {
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,#f97316,#ea580c);
  color:#fff;border:none;cursor:pointer;
  font-family:'',;font-size:0.9rem;font-weight:600;
  padding:12px 22px;border-radius:12px;margin-bottom:32px;
  box-shadow:0 4px 16px rgba(249,115,22,0.3);
  transition:transform 0.18s,box-shadow 0.18s;
}
.bd-summary-btn:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(249,115,22,0.38); }
.bd-summary-btn svg { width:16px;height:16px; }

.bd-summary-box {
  background:linear-gradient(135deg,#fff7ed 0%,#fef9f5 100%);
  border:1.5px solid rgba(249,115,22,0.2);
  border-radius:16px;margin-bottom:36px;overflow:hidden;
}
.bd-summary-header {
  background:linear-gradient(135deg,#f97316,#ea580c);
  padding:12px 20px;display:flex;align-items:center;gap:10px;
}
.bd-summary-header span { font-family:'',;font-size:0.85rem;font-weight:700;color:#fff;letter-spacing:0.03em; }
.bd-summary-header svg { width:16px;height:16px;color:#fff; }
.bd-summary-dot { width:8px;height:8px;border-radius:50%;background:#fff;opacity:0.7;animation:bd-blink 1s step-end infinite; }
@keyframes bd-blink { 0%,100%{opacity:0.7}50%{opacity:0} }

.bd-summary-body { padding:20px 24px; }
.bd-summary-text {
  font-family:'Source Serif 4',Georgia,serif;
  font-size:0.97rem;color:#374151;line-height:1.85;
  margin:0;white-space:pre-wrap;
}
.bd-cursor { display:inline-block;width:2px;height:1em;background:#f97316;margin-left:2px;vertical-align:text-bottom;animation:bd-blink 0.75s step-end infinite; }

/* short desc callout */
.bd-callout {
  position:relative;border-radius:16px;overflow:hidden;margin-bottom:32px;
  background:linear-gradient(135deg,#fff7ed,#f0fdf4);border:1px solid rgba(249,115,22,0.13);
}
.bd-callout-bar { position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,#f97316,#22c55e); }
.bd-callout-inner { padding:20px 24px 20px 28px; }
.bd-callout-inner p { font-family:'Source Serif 4',Georgia,serif;font-size:1.05rem;font-style:italic;color:#374151;margin:0;line-height:1.75; }

/* article content */
.bd-content { line-height:1.85;color:#1f2937; }
.bd-content > p:first-of-type::first-letter { font-weight:800;font-size:4.2rem;line-height:0.8;float:left;margin:0.1em 0.12em -0.05em 0;color:#f97316; }
.bd-content p { margin:0 0 1.35rem;text-align:justify;hyphens:auto; }
.bd-content h1 { font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;font-weight:800;color:#111827;margin:2rem 0 0.8rem;padding-bottom:0.4rem;border-bottom:3px solid #f97316; }
.bd-content h2 { font-family:'Playfair Display',Georgia,serif;font-size:1.4rem;font-weight:700;color:#111827;margin:2rem 0 0.8rem;position:relative;padding-left:1rem; }
.bd-content h2::before { content:'';position:absolute;left:0;top:0.15em;bottom:0.15em;width:4px;border-radius:4px;background:linear-gradient(180deg,#f97316,#22c55e); }
.bd-content h3 { font-size:1.1rem;font-weight:600;color:#374151;margin:1.6rem 0 0.6rem;display:flex;align-items:center;gap:0.5rem; }
.bd-content h3::before { content:'';display:inline-block;width:18px;height:3px;background:#f97316;border-radius:3px;flex-shrink:0; }
.bd-content h4 { font-size:0.8rem;font-weight:700;color:#f97316;margin:1.4rem 0 0.4rem;text-transform:uppercase;letter-spacing:0.08em; }
.bd-content strong,.bd-content b { font-weight:700;color:#111827; }
.bd-content em,.bd-content i { font-style:italic;color:#4b5563; }
.bd-content ul { list-style:none;padding:0.75rem 1rem;margin:0.4rem 0 1.35rem;background:linear-gradient(135deg,#fff7ed,#f0fdf4);border-radius:12px;border:1px solid rgba(249,115,22,0.12); }
.bd-content ul li { position:relative;padding:0.35rem 0 0.35rem 1.6rem;border-bottom:1px dashed rgba(249,115,22,0.15);font-size:0.97rem;color:#374151; }
.bd-content ul li:last-child { border-bottom:none; }
.bd-content ul li::before { content:'';position:absolute;left:0.2rem;top:0.8rem;width:7px;height:7px;background:#f97316;border-radius:50%;box-shadow:0 0 0 3px rgba(249,115,22,0.15); }
.bd-content ol { list-style:none;counter-reset:ol-c;padding:0;margin:0.4rem 0 1.35rem; }
.bd-content ol li { counter-increment:ol-c;position:relative;padding:0.55rem 0.9rem 0.55rem 3.2rem;margin-bottom:5px;background:#fff;border-radius:10px;border:1px solid #f3f4f6;box-shadow:0 2px 6px rgba(0,0,0,0.04);color:#374151;transition:box-shadow 0.18s,transform 0.18s; }
.bd-content ol li:hover { box-shadow:0 4px 14px rgba(249,115,22,0.1);transform:translateX(3px); }
.bd-content ol li::before { content:counter(ol-c);position:absolute;left:0.65rem;top:50%;transform:translateY(-50%);width:1.75rem;height:1.75rem;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:0.72rem;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(249,115,22,0.3); }
.bd-content blockquote { margin:1.8rem 0;padding:1.2rem 1.5rem;background:#fff;border-left:5px solid #f97316;border-radius:0 14px 14px 0;box-shadow:0 4px 20px rgba(249,115,22,0.08);position:relative;overflow:hidden; }
.bd-content blockquote::before { content:'\\201C';position:absolute;top:-0.6rem;left:0.8rem;font-family:'Playfair Display',Georgia,serif;font-size:5rem;line-height:1;color:rgba(249,115,22,0.1);pointer-events:none; }
.bd-content blockquote p { margin:0;font-style:italic;font-size:1.05rem;line-height:1.65;color:#374151;position:relative;z-index:1;text-align:left; }
.bd-content blockquote p::first-letter { all:unset; }

/* ── BEAUTIFUL TABLE ── */
.bd-content-table-wrap {
  overflow-x:auto;margin:1.2rem 0;
  border-radius:12px;
  border:1.5px solid #e2e8f0;
  box-shadow:0 2px 12px rgba(0,0,0,0.06);
  -webkit-overflow-scrolling:touch;background:#fff;
}
.bd-content-table-wrap::-webkit-scrollbar { height:4px; }
.bd-content-table-wrap::-webkit-scrollbar-track { background:#f1f5f9; }
.bd-content-table-wrap::-webkit-scrollbar-thumb { background:#f97316;border-radius:4px; }
.bd-content table { width:100%;border-collapse:collapse;font-size:0.85rem;min-width:360px;background:#fff; }
.bd-content thead tr { background:linear-gradient(135deg,#f97316 0%,#ea580c 100%); }
.bd-content th {
  padding:0.55rem 0.9rem;color:#fff;font-weight:700;text-align:left;
  font-size:0.74rem;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;
  border-right:1px solid rgba(255,255,255,0.2);
}
.bd-content th:last-child { border-right:none; }
.bd-content tbody tr { transition:background 0.12s;background:#fff; }
.bd-content tbody tr:hover { background:#fff7ed; }
.bd-content td {
  padding:0.45rem 0.9rem;
  border-bottom:1px solid #e2e8f0;
  border-right:1px solid #e2e8f0;
  color:#374151;vertical-align:middle;line-height:1.5;background:#fff;
}
.bd-content td:last-child { border-right:none; }
.bd-content tbody tr:last-child td { border-bottom:none; }
@media(max-width:640px){
  .bd-content th { padding:0.45rem 0.65rem;font-size:0.7rem; }
  .bd-content td { padding:0.38rem 0.65rem;font-size:0.82rem; }
}

.bd-content code { font-family:'Courier New',monospace;font-size:0.87em;background:#fff7ed;color:#ea580c;padding:0.15em 0.45em;border-radius:5px;border:1px solid #fed7aa; }
.bd-content pre { background:#1a1a2e;color:#e2e8f0;padding:1.1rem 1.3rem;border-radius:12px;overflow-x:auto;margin:1.2rem 0;font-size:0.86rem;line-height:1.7;box-shadow:0 8px 28px rgba(0,0,0,0.18); }
.bd-content pre code { background:none;color:inherit;border:none;padding:0; }
.bd-content hr { border:none;height:1px;background:linear-gradient(90deg,transparent,#f97316 30%,#22c55e 70%,transparent);margin:2rem 0; }
.bd-content img { max-width:100%;height:auto;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,0.09);margin:1.5rem auto;display:block; }
.bd-content a { color:#f97316;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1.5px;transition:color 0.18s; }
.bd-content a:hover { color:#ea580c; }

/* responsive mobile tweaks */
@media(max-width:768px){
  .bd-content p { margin:0 0 1.1rem; }
  .bd-content h1 { font-size:1.5rem;margin:1.5rem 0 0.7rem; }
  .bd-content h2 { font-size:1.22rem;margin:1.5rem 0 0.6rem; }
  .bd-content h3 { font-size:1.03rem;margin:1.2rem 0 0.5rem; }
  .bd-content blockquote { padding:1rem 1.2rem;margin:1.4rem 0; }
  .bd-content ul,.bd-content ol { margin:0.3rem 0 1.1rem; }
}
@media(max-width:480px){
  .bd-content > p:first-of-type::first-letter { font-size:3.2rem; }
}

/* tags */
.bd-tags { display:flex;flex-wrap:wrap;gap:8px;margin:28px 0; }
.bd-tag { font-family:'',;font-size:0.8rem;font-weight:500;color:#6b7280;background:#f3f4f6;padding:6px 14px;border-radius:100px;transition:all 0.18s;cursor:pointer;text-decoration:none; }
.bd-tag:hover { background:#fff7ed;color:#f97316;border-color:#f97316; }

/* share */
.bd-share { display:flex;align-items:center;gap:10px;padding:20px 0;border-top:1px solid #f3f4f6;margin-top:16px; }
.bd-share-label { font-family:'',;font-size:0.85rem;color:#9ca3af;margin-right:4px; }
.bd-share-btn { width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;color:#fff;transition:transform 0.18s,opacity 0.18s; }
.bd-share-btn:hover { transform:scale(1.12);opacity:0.9; }
.bd-share-copy { font-family:'',;font-size:0.8rem;font-weight:600;color:#22c55e;margin-left:4px; }

/* ── SIDEBAR ── */
.bd-sidebar { position:sticky;top:88px; }
@media(max-width:1024px){ .bd-sidebar { position:static; } }

.bd-sidebar-card {
  background:#fff;border-radius:16px;
  border:1.5px solid #f3f4f6;
  overflow:hidden;margin-bottom:20px;
}
.bd-sidebar-head {
  padding:12px 18px;display:flex;align-items:center;gap:8px;
  font-family:'',;font-size:0.82rem;font-weight:700;
  letter-spacing:0.04em;text-transform:uppercase;
}
.bd-sidebar-head svg { width:14px;height:14px; }
.bd-sidebar-head.orange { background:linear-gradient(135deg,#f97316,#ea580c);color:#fff; }
.bd-sidebar-head.green  { background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff; }
.bd-sidebar-head.dark   { background:#111827;color:#fff; }
.bd-sidebar-body { padding:16px; }

/* author card */
.bd-author-avatar {
  width:64px;height:64px;border-radius:50%;
  background:linear-gradient(135deg,#f97316,#ea580c);
  display:flex;align-items:center;justify-content:center;
  font-family:'',;font-size:1.4rem;font-weight:700;color:#fff;
  margin:0 auto 12px;
}
.bd-author-name { font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;font-weight:700;color:#111827;text-align:center;margin:0 0 4px; }
.bd-author-role { font-family:'',;font-size:0.8rem;color:#9ca3af;text-align:center;margin:0 0 14px; }
.bd-author-stats { display:flex;justify-content:center;gap:20px; }
.bd-author-stat { text-align:center; }
.bd-author-stat strong { display:block;font-family:'',;font-size:1rem;font-weight:700;color:#111827; }
.bd-author-stat span { font-family:'',;font-size:0.72rem;color:#9ca3af; }

/* related mini cards */
.bd-related-item { display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #f9fafb;text-decoration:none; }
.bd-related-item:last-child { border-bottom:none;padding-bottom:0; }
.bd-related-item:first-child { padding-top:0; }
.bd-related-img { width:60px;height:60px;border-radius:10px;object-fit:cover;flex-shrink:0; }
.bd-related-img-placeholder { width:60px;height:60px;border-radius:10px;background:#f3f4f6;flex-shrink:0; }
.bd-related-title { font-family:'',;font-size:0.82rem;font-weight:600;color:#111827;line-height:1.4;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color 0.18s; }
.bd-related-item:hover .bd-related-title { color:#f97316; }
.bd-related-date { font-family:'',;font-size:0.73rem;color:#9ca3af; }

/* sidebar tags */
.bd-sidebar-tags { display:flex;flex-wrap:wrap;gap:7px;padding:14px 16px; }
.bd-sidebar-tag { font-family:'',;font-size:0.77rem;font-weight:500;background:#f9fafb;color:#6b7280;padding:5px 12px;border-radius:100px;text-decoration:none;transition:all 0.18s;border:1px solid #f3f4f6; }
.bd-sidebar-tag:hover { background:#fff7ed;color:#f97316;border-color:rgba(249,115,22,0.25); }

/* alert box */
.bd-alert { background:linear-gradient(135deg,#111827,#1f2937);border-radius:16px;padding:20px;text-align:center;margin-bottom:20px; }
.bd-alert-icon { font-size:1.8rem;margin-bottom:8px; }
.bd-alert-title { font-family:'',;font-size:0.9rem;font-weight:700;color:#fff;margin:0 0 4px; }
.bd-alert-sub { font-family:'',;font-size:0.78rem;color:#9ca3af;margin:0 0 14px; }
.bd-alert-btn { display:block;background:#f97316;color:#fff;font-family:'',;font-size:0.85rem;font-weight:600;padding:10px;border-radius:10px;text-decoration:none;transition:background 0.18s; }
.bd-alert-btn:hover { background:#ea580c; }

/* breadcrumb */
.bd-crumb { display:flex;align-items:center;gap:6px;font-family:'',;font-size:0.82rem;color:#9ca3af;padding:20px 0 28px; }
.bd-crumb a { color:#9ca3af;text-decoration:none;transition:color 0.18s; }
.bd-crumb a:hover { color:#f97316; }
.bd-crumb svg { width:10px;height:10px; }

/* back btn */
.bd-back { display:inline-flex;align-items:center;gap:7px;font-family:'',;font-size:0.85rem;font-weight:600;color:#f97316;text-decoration:none;background:#fff7ed;padding:9px 16px;border-radius:10px;transition:all 0.18s;margin-bottom:20px; }
.bd-back:hover { background:#ffedd5; }
.bd-back svg { width:13px;height:13px; }
`;

if (typeof document !== 'undefined' && !document.getElementById('bd-styles')) {
  const el = document.createElement('style'); el.id = 'bd-styles'; el.textContent = BD_STYLES;
  document.head.appendChild(el);
}

const wrapTables = (html) => {
  if (!html) return '';
  let processed = html
    .replace(/<table/g, '<div class="bd-content-table-wrap"><table')
    .replace(/<\/table>/g, '</table></div>');
  
  // Add rel="nofollow noopener noreferrer" to all external links
  processed = processed.replace(/<a\s+([^>]*href="([^"]+)"[^>]*)>/gi, (match, attrs, href) => {
    const isExternal = href && !href.startsWith("/") && !href.startsWith("#") && !href.includes("careermitra.in") && !href.includes("localhost");
    if (isExternal) {
      let newAttrs = attrs.replace(/\s*rel="[^"]*"/gi, "");
      newAttrs += ' rel="nofollow noopener noreferrer"';
      if (!/target="/gi.test(newAttrs)) {
        newAttrs += ' target="_blank"';
      }
      return `<a ${newAttrs}>`;
    }
    return match;
  });
  return processed;
};

/* fmtDate */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

/* Reading progress */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return <div className="bd-progress"><div className="bd-progress-fill" style={{ width: `${pct}%` }} /></div>;
};

/* icons */
const ChevronRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>;
const ArrowLeft = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const CalIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>;
const SparkleIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const FireIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.5 0 10-4.5 10-10 0-2.6-1-5-2.7-6.8C17.8 7 16 9 13 9c1-3-1-6-3-7-2.5 3-3 6-1 9-2.5-1-4-3-4-5-1.5 1.5-2 4-2 6 0 5.5 4.5 10 9 10z"/></svg>;
const TagIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const BellIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const LinkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

const readTime = (html) => {
  if (!html) return 5;
  return Math.max(1, Math.ceil(html.replace(/<[^>]+>/g, '').split(/\s+/).length / 200));
};

const getInitials = (name) => (name || 'CM').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getBlogPath = (b) => {
  const cat = slugify(b?.categories?.[0]?.name || b?.category || 'general');
  return `/${cat}/${b.slug}`;
};

/* ── Main Component ───────────────────────────────────────────────────────── */
const BlogDetail = () => {
  // supports both /:categorySlug/:blogSlug (new) and /blog/:slug (legacy)
  const { slug, blogSlug } = useParams();
  const actualSlug = blogSlug || slug;
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [parentCategory, setParentCategory] = useState(null); // { name, slug }

  // AI summary state
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const typingRef = useRef(null);

  useEffect(() => { fetchBlog(); fetchRecent(); window.scrollTo(0, 0); }, [actualSlug]);
  useEffect(() => () => clearInterval(typingRef.current), []);

  const fetchBlog = async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`https://careermitra.in/api/blogs/slug/${actualSlug}`);
      const d = await r.json();
      if (d.success) {
        setBlog(d.data);
        resolveParentCategory(d.data);
      } else setError(d.message || 'Article not found');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const resolveParentCategory = async (blogData) => {
    const primaryCat = blogData?.categories?.[0];
    if (!primaryCat) return;

    // 1. Check if backend already populated parent info on the category object
    if (primaryCat.parentName) {
      setParentCategory({ name: primaryCat.parentName, slug: slugify(primaryCat.parentName) });
      return;
    }
    if (primaryCat.parent?.name) {
      setParentCategory({ name: primaryCat.parent.name, slug: slugify(primaryCat.parent.name) });
      return;
    }

    // 2. Look for parent in the blog's own categories array
    const parentId = primaryCat.parentId || primaryCat.parent_id;
    if (parentId) {
      const found = (blogData.categories || []).find(c => (c._id || c.id) === parentId);
      if (found) {
        setParentCategory({ name: found.name, slug: slugify(found.name) });
        return;
      }
      // 3. Fetch from categories API as last resort
      try {
        const cr = await fetch('https://careermitra.in/api/categories');
        const cd = await cr.json();
        const all = cd.data || cd.categories || [];
        const match = all.find(c => (c._id || c.id) === parentId);
        if (match) setParentCategory({ name: match.name, slug: slugify(match.name) });
      } catch { }
    }
  };

  const fetchRecent = async () => {
    try {
      const r = await fetch('https://careermitra.in/api/blogs?page=1&limit=6');
      const d = await r.json();
      if (d.success) setRecentBlogs((d.data.blogs || []).filter(b => b.slug !== actualSlug).slice(0, 4));
    } catch { }
  };

  /* typewriter effect */
  const startTypewriter = (text) => {
    setSummaryText(''); setTyping(true); let i = 0;
    clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      setSummaryText(text.slice(0, ++i));
      if (i >= text.length) { clearInterval(typingRef.current); setTyping(false); }
    }, 18);
  };

  const handleSummary = () => {
    if (summaryVisible) { setSummaryVisible(false); setSummaryText(''); return; }
    setSummaryVisible(true);
    // Build a summary from blog data without external API
    const lines = [];
    const raw = (blog.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const sentences = raw.match(/[^.!?]+[.!?]+/g) || [];
    const short = blog.short_description || '';

    lines.push(`📌 Overview\n${short}`);
    if (sentences.length > 0) {
      lines.push(`\n\n✨ Key Highlights`);
      // Pick ~4 sentences from different parts of the content
      const picks = [0, Math.floor(sentences.length * 0.25), Math.floor(sentences.length * 0.55), Math.floor(sentences.length * 0.8)];
      picks.forEach(idx => {
        const s = (sentences[idx] || '').trim();
        if (s.length > 30) lines.push(`\n• ${s}`);
      });
    }
    if (blog.tags && blog.tags.length) lines.push(`\n\n🏷️ Topics: ${blog.tags.join(', ')}`);

    startTypewriter(lines.join(''));
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid #fed7aa', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error || !blog) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, color: '#f3f4f6', fontFamily: "'Playfair Display',serif" }}>404</div>
      <p style={{  color: '#6b7280', marginBottom: 24 }}>{error || 'Article not found'}</p>
      <Link to="/all-articles" style={{ background: '#f97316', color: '#fff', padding: '12px 24px', borderRadius: 12, textDecoration: 'none',  fontWeight: 600 }}>Back to Articles</Link>
    </div>
  );

  const authorName = blog.author?.author_name || blog.author_name || 'Career Mitra';
  const authorId = blog.author?._id || blog.author_id || blog.authorId || '';
  const primaryCategory = blog.categories?.[0]?.name || blog.category || 'General';

  return (
    <>
      <SEO
        title={blog.meta_title || blog.title}
        description={blog.meta_description || blog.short_description}
        keywords={(blog.tags || []).join(', ')}
        url={`https://www.careermitra.in${getBlogPath(blog)}`}
        image={blog.featured_image}
        type="article"
        publishedAt={blog.published_at || blog.createdAt}
        modifiedAt={blog.updatedAt}
        authorName={authorName}
      />

      <ReadingProgress />

      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', paddingTop: 80 }}>

          {/* Breadcrumb: Home / Parent? / Primary / Title */}
          <nav className="bd-crumb">
            <Link to="/">Home</Link>
            {parentCategory && (
              <>
                <ChevronRight />
                <Link to={`/${parentCategory.slug}`}>{parentCategory.name}</Link>
              </>
            )}
            <ChevronRight />
            <Link to={`/${slugify(primaryCategory)}`}>{primaryCategory}</Link>
            <ChevronRight />
            <span style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{blog.title}</span>
          </nav>

          {/* 70/30 Layout */}
          <div className="bd-layout">

            {/* ── LEFT: Article ── */}
            <article className="bd-article">
              <Link to={`/${slugify(primaryCategory)}`} className="bd-back"><ArrowLeft /> {primaryCategory}</Link>

              {/* Hero image */}
              <div className="bd-hero-img-wrap">
                <img src={blog.featured_image || blogFallback} alt={blog.image_alt_text || blog.title}
                  className="bd-hero-img" loading="eager"
                  onError={e => { e.target.onerror = null; e.target.src = blogFallback; }} />
                {primaryCategory && <span className="bd-hero-cat">{primaryCategory}</span>}
              </div>

              {/* Title */}
              <h1 className="bd-title">{blog.title}</h1>
                 {/* Short description callout */}
              {blog.short_description && (
                <div className="bd-callout">
                  <div className="bd-callout-bar" />
                  <div className="bd-callout-inner">
                    <p>"{blog.short_description}"</p>
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="bd-meta">
                <div className="bd-meta-item author">
                  {blog.author?.avatar_url ? (
                    <img
                      src={blog.author.avatar_url}
                      alt={authorName}
                      style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fed7aa', flexShrink: 0 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {getInitials(authorName)}
                    </span>
                  )}
                  <Link to={`/author/${slugify(authorName)}`} style={{ color: '#111827', textDecoration: 'none' }}>
                    {authorName}
                  </Link>
                </div>
                <div className="bd-meta-item"><CalIcon /> {fmtDate(blog.createdAt || blog.created_at || blog.published_at)}</div>
                <div className="bd-meta-item"><ClockIcon /> {fmtTime(blog.createdAt || blog.created_at || blog.published_at)}</div>
              </div>

              {/* Primary category only — secondary categories are excluded to keep slug/breadcrumb consistent */}
              {primaryCategory && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {[{ name: primaryCategory }].map((cat, i) => (
                    <Link
                      key={i}
                      to={`/${slugify(cat.name)}`}
                      state={{ categoryName: cat.name }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: '0.78rem', fontWeight: 600,
                        color: '#f97316', background: '#fff7ed',
                        border: '1.5px solid rgba(249,115,22,0.25)',
                        padding: '5px 14px', borderRadius: 100,
                        textDecoration: 'none', transition: 'all 0.18s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#ffedd5'; e.currentTarget.style.borderColor = '#f97316'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)'; }}
                    >
                      <span style={{ width: 12, height: 12, display: 'flex', flexShrink: 0 }}><TagIcon /></span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* ── AI SUMMARY BUTTON ── */}
              <button className="bd-summary-btn" onClick={handleSummary}>
                <SparkleIcon />
                {summaryVisible ? 'Hide Summary' : '✨ AI Summary — Click to Summarise'}
              </button>

              {/* Summary box with typewriter */}
              {summaryVisible && (
                <div className="bd-summary-box">
                  <div className="bd-summary-header">
                    <SparkleIcon />
                    <span>AI-Generated Summary</span>
                    {typing && <div className="bd-summary-dot" style={{ marginLeft: 'auto' }} />}
                  </div>
                  <div className="bd-summary-body">
                    <p className="bd-summary-text">
                      {summaryText}
                      {typing && <span className="bd-cursor" />}
                    </p>
                  </div>
                </div>
              )}

           

              {/* ── MAIN CONTENT ── */}
              <div className="bd-content"
                dangerouslySetInnerHTML={{ __html: wrapTables(blog.content || '<p>Content coming soon…</p>') }} />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div>
                  <div style={{  fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, marginTop: 32 }}>Tags</div>
                  <div className="bd-tags">
                    {blog.tags.map((tag, i) => <span key={i} className="bd-tag">#{tag}</span>)}
                  </div>
                </div>
              )}

              {/* Share */}
              {/* <div className="bd-share">
                <span className="bd-share-label">Share:</span>
                <button className="bd-share-btn" style={{ background: '#1877F2' }} aria-label="Facebook"
                  onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </button>
                <button className="bd-share-btn" style={{ background: '#1DA1F2' }} aria-label="Twitter"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                </button>
                <button className="bd-share-btn" style={{ background: '#0A66C2' }} aria-label="LinkedIn"
                  onClick={() => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </button>
                <button className="bd-share-btn" style={{ background: copied ? '#22c55e' : '#6b7280' }} aria-label="Copy link" onClick={handleCopy}>
                  {copied ? <CheckIcon /> : <LinkIcon />}
                </button>
                {copied && <span className="bd-share-copy">Copied!</span>}
              </div> */}
            </article>

            {/* ── RIGHT: Sticky Sidebar ── */}
            <aside className="bd-sidebar">

              {/* Author card */}
              {/* <BlogAuthor
                author={blog.author}
                views={blog.views}
                tagsCount={blog.tags?.length}
              /> */}

              {/* Latest blogs */}
              {recentBlogs.length > 0 && (
                <div className="bd-sidebar-card">
                  <div className="bd-sidebar-head green"><FireIcon /> Latest Articles</div>
                  <div className="bd-sidebar-body">
                    {recentBlogs.map(post => (
                      <Link key={post._id} to={getBlogPath(post)} className="bd-related-item">
                        <img
                          src={post.featured_image || blogFallback}
                          alt={post.title}
                          className="bd-related-img"
                          onError={e => { e.target.onerror = null; e.target.src = blogFallback; }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="bd-related-title">{post.title}</div>
                          <div className="bd-related-date">{fmtDate(post.published_at || post.createdAt)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags cloud */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="bd-sidebar-card">
                  <div className="bd-sidebar-head dark"><TagIcon /> Tabs</div>
                  <div className="bd-sidebar-tags">
                    {blog.tags.map((tag, i) => <span key={i} className="bd-sidebar-tag">#{tag}</span>)}
                  </div>
                </div>
              )}

              {/* Job alert CTA */}
              {/* <div className="bd-alert">
                <div className="bd-alert-icon">🔔</div>
                <div className="bd-alert-title">Never Miss a Job Alert</div>
                <div className="bd-alert-sub">Get real-time govt job updates straight to you</div>
                <Link to="/user-dashboard" className="bd-alert-btn">Enable Notifications</Link>
              </div> */}

              {/* Article stats */}
              <div className="bd-sidebar-card">
                <div className="bd-sidebar-head" style={{ background: 'linear-gradient(135deg,#f97316,#22c55e)', color: '#fff' }}>
                  <EyeIcon /> Article Stats
                </div>
                <div className="bd-sidebar-body">
                  {[
                    { label: 'Read Time', val: `${readTime(blog.content)} min` },
                    { label: 'Published', val: fmtDate(blog.createdAt || blog.created_at || blog.published_at) },
                    { label: 'Category', val: blog.category || 'General' },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f9fafb' }}>
                      <span style={{  fontSize: '0.8rem', color: '#9ca3af' }}>{label}</span>
                      <span style={{  fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;