"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SEO from "@/components/SEO";
import { generatePersonSchema, generateWebPageSchema } from "@/utils/schemaHelpers";
import blogFallback from "@/assets/blog-sample.png";

const slugify = (s = '') =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getBlogPath = (blog, detail) => {
  const art = detail || blog;
  const tree = art?.categoryTree?.[0];
  if (!tree) {
    const cat = slugify(
      art?.categories?.[0]?.name || art?.category || 'general'
    );
    return `/${cat}/${art.slug}`;
  }
  const parentSlug = slugify(tree.parent?.name || tree.parent?.slug);
  const childId = art.primary_category?._id || art.primary_category;
  const child = tree.children?.find(c => c.id === childId || c._id === childId);
  if (child) {
    const childSlug = slugify(child.name || child.slug);
    return `/${parentSlug}/${childSlug}/${art.slug}`;
  }
  return `/${parentSlug}/${art.slug}`;
};

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const AP_STYLES = `
.ap-wrap { background:#f9fafb;min-height:100vh; }

/* container */
.ap-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 48px 16px 80px;
}
@media (min-width: 768px) {
  .ap-container {
    padding-left: 3.75rem; /* px-15 */
    padding-right: 3.75rem;
  }
}

/* section header */
.ap-section-head { display:flex;align-items:center;gap:12px;margin-bottom:24px; }
.ap-section-head h2 { font-family:'Playfair Display',Georgia,serif;font-size:1.35rem;font-weight:700;color:#111827;margin:0; }
.ap-section-head-line { flex:1;height:1px;background:linear-gradient(90deg,#f97316,transparent); }
.ap-section-badge { background:#fff7ed;color:#f97316;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:3px 10px;border-radius:100px;border:1px solid rgba(249,115,22,0.2); }

/* author blogs grid */
.ap-blogs-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-bottom:52px; }
@media(max-width:640px){ .ap-blogs-grid { grid-template-columns:1fr;gap:14px; } }

.ap-blog-card {
  background:#fff;border-radius:14px;border:1px solid #f0ece8;
  overflow:hidden;text-decoration:none;color:inherit;
  display:block;transition:box-shadow 0.2s,transform 0.2s;
  box-shadow:0 2px 8px rgba(0,0,0,0.04);
}
.ap-blog-card:hover { box-shadow:0 8px 28px rgba(249,115,22,0.12);transform:translateY(-3px); }
.ap-blog-img { width:100%;height:160px;object-fit:cover;display:block; }
.ap-blog-img-placeholder {
  height:140px;
  background:linear-gradient(135deg,#fff7ed 0%,#fef3c7 50%,#f0fdf4 100%);
  display:flex;align-items:center;justify-content:center;
}
.ap-blog-img-placeholder svg { width:36px;height:36px;color:#f97316;opacity:0.4; }
.ap-blog-body { padding:16px 18px; }
.ap-blog-cat { font-size:0.7rem;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px; }
.ap-blog-title { font-size:0.97rem;font-weight:700;color:#111827;line-height:1.45;margin:0 0 10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
.ap-blog-arrow { display:flex;align-items:center;gap:6px;font-size:0.8rem;font-weight:600;color:#f97316; }
.ap-blog-arrow svg { width:14px;height:14px;transition:transform 0.18s; }
.ap-blog-card:hover .ap-blog-arrow svg { transform:translateX(4px); }

/* suggested grid */
.ap-suggest-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px; }
@media(max-width:640px){ .ap-suggest-grid { grid-template-columns:1fr;gap:12px; } }

.ap-suggest-card {
  background:#fff;border-radius:12px;border:1px solid #f0f0f0;
  padding:16px;text-decoration:none;color:inherit;display:block;
  transition:box-shadow 0.2s,transform 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.04);
}
.ap-suggest-card:hover { box-shadow:0 6px 20px rgba(249,115,22,0.1);transform:translateY(-2px); }
.ap-suggest-img { width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:10px;display:block; }
.ap-suggest-img-placeholder { width:100%;height:110px;border-radius:8px;margin-bottom:10px;background:#f3f4f6; }
.ap-suggest-title { font-size:0.85rem;font-weight:600;color:#111827;line-height:1.4;margin:0 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
.ap-suggest-author { font-size:0.73rem;color:#9ca3af; }

/* loader */
.ap-loader-wrap { display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px; }
.ap-spinner { width:44px;height:44px;border:3px solid #fed7aa;border-top-color:#f97316;border-radius:50%;animation:ap-spin 0.8s linear infinite; }
@keyframes ap-spin { to { transform:rotate(360deg); } }

/* join date chip */
.ap-joined { font-size:0.78rem;color:#9ca3af;margin-top:10px; }

/* empty */
.ap-empty { text-align:center;padding:40px 20px;color:#9ca3af;font-size:0.95rem; }
`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
);
const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

export default function AuthorProfilePage({ initialData = null }) {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(initialData?.author || null);
  const [assignedBlogs, setAssignedBlogs] = useState(initialData?.assignedBlogs || []);
  const [suggestedBlogs, setSuggestedBlogs] = useState(initialData?.suggestedBlogs || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    if (!initialData) {
      fetchAuthor();
    }
  }, [authorId, initialData]);

  // Only hit when the server didn't already provide initialData. A single
  // call to our own public author API, instead of the multi-fetch
  // (blog list -> author -> per-blog detail -> blog list again) waterfall
  // this page used to run entirely client-side.
  const fetchAuthor = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/authors/${authorId}`);
      const payload = await res.json();
      if (!payload.success) throw new Error(payload.message || "Author not found");

      setAuthor(payload.data.author);
      setAssignedBlogs(payload.data.assignedBlogs || []);
      setSuggestedBlogs(payload.data.suggestedBlogs || []);
    } catch (e) {
      setError(e.message || "Unable to load author profile.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="ap-loader-wrap mt-24">
      <style dangerouslySetInnerHTML={{ __html: AP_STYLES }} />
      <div className="ap-spinner" />
      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Loading author profile…</p>
    </div>
  );

  /* ── Error ── */
  if (error || !author) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }} className="mt-20">
      <style dangerouslySetInnerHTML={{ __html: AP_STYLES }} />
      <p style={{ color: "#ef4444", marginBottom: 16 }}>{error || "Author not found"}</p>
      <Link href="/" style={{ color: "#f97316", fontWeight: 600 }}>← Back to Home</Link>
    </div>
  );

  const { author_name, bio, avatar_url, social_links, createdAt, handle: authorHandle, role } = author;
  const totalViews = assignedBlogs.reduce((sum, b) => sum + (b.views || 0), 0);
  
  const normalizedSocials = [
    { key: "linkedin", label: "LinkedIn", icon: LinkedInIcon, url: social_links?.linkedin },
    { key: "twitter", label: "Twitter", icon: TwitterIcon, url: social_links?.twitter },
    { key: "website", label: "Website", icon: WebIcon, url: social_links?.website },
  ]
    .map((item) => {
      const raw = item.url?.trim();
      if (!raw) return null;
      const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      return { ...item, href };
    })
    .filter(Boolean);

  const authorSchemas = [
    generatePersonSchema({
      name: author_name,
      jobTitle: role || "Author",
      worksFor: "Careermitra",
      sameAs: normalizedSocials.map(l => l.href)
    }),
    generateWebPageSchema({
      name: `${author_name} - Author Profile`,
      description: bio || `Read articles written by ${author_name} on Career Mitra — career guidance, govt jobs, and more.`,
      url: `/author/${slugify(author_name || authorId)}`
    })
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: AP_STYLES }} />

      <div className="ap-wrap">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden border-b border-[#e8ebdc] bg-[radial-gradient(circle_at_6%_8%,rgba(14,116,144,0.15),transparent_36%),radial-gradient(circle_at_94%_90%,rgba(234,88,12,0.18),transparent_36%),linear-gradient(145deg,#edf3e5_0%,#f8fbf5_45%,#f7f4ea_100%)] px-4 md:px-15 pb-10 pt-24 md:pt-32 md:pb-12">
          <div className="pointer-events-none absolute -left-24 top-4 h-64 w-64 rounded-full bg-[#34d399]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#fb7185]/20 blur-3xl" />

          <div className="relative mx-auto grid w-full overflow-hidden rounded-[24px] border border-[#ece9e2] bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-sm grid-cols-1 md:grid-cols-[240px_1fr] p-6 md:p-8 gap-6 md:gap-8 items-center max-w-[1300px]">
            {/* Avatar Column */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full p-1 bg-gradient-to-tr from-[#f97316] via-[#ea580c] to-[#e11d48] shadow-lg">
                <div className="h-full w-full rounded-full overflow-hidden bg-white flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#fed7aa] to-[#fecdd3] text-4xl md:text-5xl font-extrabold text-[#ea580c]" aria-hidden="true">
                    {author_name?.charAt(0)?.toUpperCase()}
                  </div>
                  {avatar_url && (
                    <img
                      src={avatar_url}
                      alt={author_name}
                      className="relative z-10 h-full w-full rounded-full object-cover bg-white"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="flex flex-col justify-between h-full text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#f97316] bg-[#fff7ed] px-2.5 py-1 rounded-full border border-orange-100">
                    {role || "Author"}
                  </span>
                  {createdAt && (
                    <span className="text-[0.7rem] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      Joined {fmtDate(createdAt)}
                    </span>
                  )}
                </div>

                <h1 className="mb-1 font-serif text-2xl md:text-3.5xl font-extrabold tracking-tight text-[#111827]">
                  {author_name}
                </h1>
                <p className="mb-4 text-xs font-semibold text-gray-400">
                  {authorHandle}
                </p>

                <p className="mb-6 text-[0.95rem] leading-[1.65] text-gray-600 max-w-2xl">
                  {bio || "This author writes practical, student-friendly content on careers, education, and job opportunities."}
                </p>
              </div>

              {/* Stats & Social links row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#efede8] pt-4 mt-auto">
                <div className="flex gap-6 items-center">
                  <div className="text-center sm:text-left">
                    <span className="block text-xl font-bold text-gray-900">{assignedBlogs.length}</span>
                    <span className="text-xs text-gray-400 font-medium">Articles</span>
                  </div>
                  {totalViews > 0 && (
                    <div className="text-center sm:text-left border-l border-gray-200 pl-6">
                      <span className="block text-xl font-bold text-gray-900">{totalViews.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 font-medium">Total Views</span>
                    </div>
                  )}
                </div>

                {normalizedSocials.length > 0 && (
                  <div className="flex items-center gap-2">
                    {normalizedSocials.map(({ key, label, icon: Icon, href }) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:-translate-y-0.5 hover:border-[#ea580c] hover:bg-[#fff7ed] hover:text-[#ea580c] shadow-sm [&_svg]:h-4 [&_svg]:w-4"
                        aria-label={label}
                        title={label}
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="ap-container">

          {/* Author's Blogs */}
          {assignedBlogs.length > 0 ? (
            <>
              <div className="ap-section-head">
                <h2>Articles by {author_name}</h2>
                <div className="ap-section-line" />
                <span className="ap-section-badge">{assignedBlogs.length} posts</span>
              </div>

              <div className="ap-blogs-grid">
                {assignedBlogs.map((blog) => (
                  <Link key={blog._id || blog.slug} href={getBlogPath(blog)} className="ap-blog-card">
                    <div className="ap-blog-body">
                      {blog.category && (
                        <div className="ap-blog-cat">{blog.category}</div>
                      )}
                      <div className="ap-blog-title">{blog.title}</div>
                      <div className="ap-blog-arrow">
                        Read Article <ArrowRight />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="ap-empty">No published articles yet.</div>
          )}

          {/* Suggested Blogs */}
          {suggestedBlogs.length > 0 && (
            <>
              <div className="ap-section-head">
                <h2>You May Also Like</h2>
                <div className="ap-section-line" />
              </div>

              <div className="ap-suggest-grid">
                {suggestedBlogs.map((blog) => (
                  <Link key={blog._id} href={getBlogPath(blog)} className="ap-suggest-card">
                    <img
                      src={blog.featured_image || blogFallback.src || blogFallback}
                      alt={blog.title}
                      className="ap-suggest-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = blogFallback.src || blogFallback;
                      }}
                    />
                    <div className="ap-suggest-title">{blog.title}</div>
                    <div className="ap-suggest-author">
                      By {blog.author?.author_name || blog.author_name || "Career Mitra"}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
