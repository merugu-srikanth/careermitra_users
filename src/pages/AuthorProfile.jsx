import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { generatePersonSchema, generateWebPageSchema } from "../utils/schemaHelpers";

const slugify = (s = '') =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const isMongoId = (s) => /^[a-f0-9]{24}$/i.test(s);

const getBlogPath = (blog, detail) => {
  const cat = slugify(
    detail?.categories?.[0]?.name || detail?.category ||
    blog?.categories?.[0]?.name || blog?.category || 'general'
  );
  return `/${cat}/${blog.slug}`;
};

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const AP_STYLES = `
.ap-wrap { background:#f9fafb;min-height:100vh; }

/* container */
.ap-container { max-width:1100px;margin:0 auto;padding:40px 20px 80px; }

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

if (typeof document !== "undefined" && !document.getElementById("ap-styles")) {
  const el = document.createElement("style");
  el.id = "ap-styles";
  el.textContent = AP_STYLES;
  document.head.appendChild(el);
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
);
const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

/* ── Component ──────────────────────────────────────────────────────────── */
const AuthorProfile = () => {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null);
  const [assignedBlogs, setAssignedBlogs] = useState([]);
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);
  const [blogDetails, setBlogDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAuthor();
  }, [authorId]);

  const fetchAuthor = async () => {
    setLoading(true);
    setError("");
    try {
      let resolvedId = authorId;

      // If param is a slug (not a 24-char MongoDB hex ID), resolve to _id via blog data
      if (!isMongoId(authorId)) {
        const blogsRes = await fetch("https://careermitra.in/api/blogs");
        const blogsData = await blogsRes.json();
        const blogs = blogsData.data?.articles || [];
        const match = blogs
          .map((b) => b.author)
          .filter(Boolean)
          .find((a) => slugify(a.author_name || a.name || "") === authorId);
        if (!match?._id) throw new Error("Author not found");
        resolvedId = match._id;
      }

      const res = await fetch(`https://careermitra.in/api/authors/${resolvedId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Author not found");

      const authorData = data.data;
      setAuthor(authorData);
      setAssignedBlogs(authorData.assignedBlogs || []);

      // fetch blog details + suggested blogs in parallel
      await Promise.all([
        fetchBlogDetails(authorData.assignedBlogs || []),
        fetchSuggested(authorData.assignedBlogs || []),
      ]);
    } catch (e) {
      setError(e.message || "Unable to load author profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogDetails = async (blogs) => {
    if (!blogs.length) return;
    const results = await Promise.allSettled(
      blogs.map((b) =>
        fetch(`https://careermitra.in/api/blogs/slug/${b.slug}`).then((r) => r.json())
      )
    );
    const map = {};
    results.forEach((r, i) => {
      if (r.status === "fulfilled" && r.value?.success) {
        map[blogs[i].slug] = r.value.data;
      }
    });
    setBlogDetails(map);
  };

  const fetchSuggested = async (assignedBlogs) => {
    try {
      const assignedIds = new Set(assignedBlogs.map((b) => b._id));
      const res = await fetch("https://careermitra.in/api/blogs");
      const data = await res.json();
      const all = data?.data?.articles || [];
      setSuggestedBlogs(all.filter((b) => !assignedIds.has(b._id)).slice(0, 6));
    } catch {}
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="ap-loader-wrap">
      <div className="ap-spinner" />
      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Loading author profile…</p>
    </div>
  );

  /* ── Error ── */
  if (error || !author) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <p style={{ color: "#ef4444", marginBottom: 16 }}>{error || "Author not found"}</p>
      <Link to="/blogs" style={{ color: "#f97316", fontWeight: 600 }}>← Back to Blogs</Link>
    </div>
  );

  const { author_name, bio, avatar_url, social_links, createdAt, updatedAt, email } = author;
  const authorHandleBase = email?.split("@")[0] || author_name || "author";
  const authorHandle = `@${authorHandleBase.toLowerCase().replace(/[^a-z0-9_]/gi, "")}`;
  const totalViews = assignedBlogs.reduce(
    (sum, b) => sum + (blogDetails[b.slug]?.views || 0), 0
  );
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
      worksFor: "CareerMitra",
      sameAs: links.map(l => l.href)
    }),
    generateWebPageSchema({
      name: `${author_name} - Author Profile`,
      description: bio || `Read articles written by ${author_name} on Career Mitra — career guidance, govt jobs, and more.`,
      url: `/author/${slugify(author_name || authorId)}`
    })
  ];

  return (
    <>
      <SEO
        title={`${author_name} — Author at Career Mitra`}
        description={bio || `Read articles written by ${author_name} on Career Mitra — career guidance, govt jobs, and more.`}
        keywords={`${author_name}, career mitra author, career blog, government jobs`}
        url={`https://www.careermitra.in/author/${slugify(author_name || authorId)}`}
        image={avatar_url}
        type="profile"
        authorName={author_name}
        schema={authorSchemas}
      />

      <div className="ap-wrap">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden border-b border-[#e8ebdc] bg-[radial-gradient(circle_at_6%_8%,rgba(14,116,144,0.15),transparent_36%),radial-gradient(circle_at_94%_90%,rgba(234,88,12,0.18),transparent_36%),linear-gradient(145deg,#edf3e5_0%,#f8fbf5_45%,#f7f4ea_100%)] px-4 pb-12 pt-20 sm:px-5 sm:pt-22">
          <div className="pointer-events-none absolute -left-24 top-4 h-64 w-64 rounded-full bg-[#34d399]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#fb7185]/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[34px] border border-[#ece9e2] bg-white/80 shadow-[0_30px_60px_rgba(17,24,39,0.12)] backdrop-blur-sm md:grid-cols-[260px_1fr]">
            <div className="relative flex min-h-56 items-center justify-center p-5 md:min-h-82.5 md:p-0">
              <div className="absolute inset-0 translate-x-4 rounded-4xl bg-[linear-gradient(170deg,#f59e0b,#fb7185)] opacity-35" />
              <div className="absolute inset-0 translate-x-2 rounded-4xl bg-[linear-gradient(170deg,#10b981,#f97316)] opacity-25" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-4xl bg-[linear-gradient(160deg,#f472b6_0%,#a21caf_100%)]">
                <div className="relative flex h-33 w-33 items-center justify-center overflow-hidden rounded-full bg-[#f4e4d4] p-1 shadow-[0_12px_28px_rgba(17,24,39,0.35)]">
                  <div className="absolute inset-0.75 z-1 flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#f97316,#c2410c)] text-5xl font-extrabold text-white" aria-hidden="true">
                    {author_name?.charAt(0)?.toUpperCase()}
                  </div>

                  {avatar_url && (
                    <img
                      src={avatar_url}
                      alt={author_name}
                      className="relative z-2 h-full w-full rounded-full object-cover bg-white"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid items-stretch gap-4 px-5 py-6 sm:px-7 md:grid-cols-[1fr_64px] md:px-10 md:py-7">
              <div className="min-w-0">
                <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-widest text-[#9ca3af]">Career Mitra Author</p>
                <h1 className="mb-1.5 font-serif text-[clamp(1.6rem,3.2vw,2.3rem)] font-extrabold tracking-[-0.01em] text-[#111827]">{author_name}</h1>
                <p className="mb-3 text-[0.8rem] font-semibold text-[#6b7280]">{authorHandle}</p>

                <p className="mb-4 text-[0.95rem] leading-[1.72] text-[#4b5563] md:pr-3">
                  {bio || "This author writes practical, student-friendly content on careers, education, and job opportunities."}
                </p>

                {/* <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {email && (
                    <div className="rounded-xl border border-[#ece9e2] bg-white px-3 py-2.5 shadow-[0_2px_7px_rgba(17,24,39,0.04)]">
                      <span className="mb-0.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#9ca3af]">Email</span>
                      <a href={`mailto:${email}`} className="block break-all text-[0.82rem] font-semibold text-[#ea580c] hover:underline">{email}</a>
                    </div>
                  )}
                  {createdAt && (
                    <div className="rounded-xl border border-[#ece9e2] bg-white px-3 py-2.5 shadow-[0_2px_7px_rgba(17,24,39,0.04)]">
                      <span className="mb-0.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#9ca3af]">Member Since</span>
                      <span className="block text-[0.82rem] font-semibold text-[#374151]">{fmtDate(createdAt)}</span>
                    </div>
                  )}
                  {updatedAt && (
                    <div className="rounded-xl border border-[#ece9e2] bg-white px-3 py-2.5 shadow-[0_2px_7px_rgba(17,24,39,0.04)]">
                      <span className="mb-0.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#9ca3af]">Profile Updated</span>
                      <span className="block text-[0.82rem] font-semibold text-[#374151]">{fmtDateTime(updatedAt)}</span>
                    </div>
                  )}
                </div> */}

                {/* <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
                    <div className="px-5 py-3 text-center md:px-7 md:py-3.5">
                      <strong className="block text-2xl font-extrabold leading-none text-[#f97316] md:text-[1.5rem]">{assignedBlogs.length}</strong>
                      <span className="mt-1 block text-[0.75rem] uppercase tracking-[0.06em] text-[#9ca3af]">Articles</span>
                    </div>
                    {totalViews > 0 && (
                      <div className="border-l border-[#f0f0f0] px-5 py-3 text-center md:px-7 md:py-3.5">
                        <strong className="block text-2xl font-extrabold leading-none text-[#f97316] md:text-[1.5rem]">{totalViews.toLocaleString()}</strong>
                        <span className="mt-1 block text-[0.75rem] uppercase tracking-[0.06em] text-[#9ca3af]">Total Reads</span>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>

              {/* Social links */}
              {normalizedSocials.length > 0 && (
                <div className="flex flex-row items-start justify-start gap-2.5 border-t border-[#efede8] pt-3 md:flex-col md:items-center md:justify-center md:border-l md:border-t-0 md:pt-0">
                  {normalizedSocials.map(({ key, label, icon: Icon, href }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#111827] transition hover:-translate-y-px hover:border-[#ea580c] hover:bg-[#ea580c] hover:text-white [&_svg]:h-3.5 [&_svg]:w-3.5"
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
                {assignedBlogs.map((blog) => {
                  const detail = blogDetails[blog.slug];
                  return (
                    <Link key={blog._id} to={getBlogPath(blog, detail)} className="ap-blog-card">
                      {detail?.featured_image ? (
                        <img
                          src={detail.featured_image}
                          alt={blog.title}
                          className="ap-blog-img"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className="ap-blog-img-placeholder">
                          <BookIcon />
                        </div>
                      )}
                      <div className="ap-blog-body">
                        {detail?.category && (
                          <div className="ap-blog-cat">{detail.category}</div>
                        )}
                        <div className="ap-blog-title">{blog.title}</div>
                        <div className="ap-blog-arrow">
                          Read Article <ArrowRight />
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
                  <Link key={blog._id} to={getBlogPath(blog, null)} className="ap-suggest-card">
                    {blog.featured_image ? (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="ap-suggest-img"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="ap-suggest-img-placeholder" />
                    )}
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
};

export default AuthorProfile;
