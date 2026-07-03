import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import SEO from "../../components/SEO";
import { generateArticleSchema, generatePersonSchema, generateFAQSchema } from "../../utils/schemaHelpers";
import blogFallback from "../../assets/blog-sample.png";

const API_BASE = "https://careermitra.in/api";

/* ── Helpers ── */
const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

function buildArticleUrl(article) {
  const tree = article.categoryTree?.[0];
  if (!tree) return `/${article.slug}`;
  const parentSlug = toSlug(tree.parent?.name, tree.parent?.slug);
  const child = tree.children?.find(c => c.id === article.primary_category?._id);
  if (child) return `/${parentSlug}/${toSlug(child.name, child.slug)}/${article.slug}`;
  return `/${parentSlug}/${article.slug}`;
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

/* ── Inject heading IDs for TOC ── */
function processContent(html) {
  if (!html) return { html: "" };
  const clean = DOMPurify.sanitize(html);
  let i = 0;
  let processed = clean.replace(/<h([23])([^>]*)>/gi, (_, level, attrs) => {
    return `<h${level}${attrs} id="section-${i++}">`;
  });
  // Add rel="nofollow noopener noreferrer" to all external links in the content
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
  return { html: processed };
}

function extractTOCItems(html) {
  if (typeof document === "undefined") return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const items = [];
  div.querySelectorAll("h2, h3").forEach((el, i) => {
    items.push({ id: `section-${i}`, text: el.textContent.trim(), level: parseInt(el.tagName[1]) });
  });
  return items;
}

/* ── Text-to-Speech ── */
function useTTS() {
  const [ttsState, setTtsState] = useState("idle"); // "idle" | "playing" | "paused"
  const utterRef = useRef(null);

  const speak = useCallback((text, rate = 1) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang  = "en-IN";
    u.rate  = rate;
    u.pitch = 1;
    u.onend   = () => setTtsState("idle");
    u.onerror = () => setTtsState("idle");
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setTtsState("playing");
  }, []);

  const pause  = useCallback(() => { window.speechSynthesis.pause();  setTtsState("paused");  }, []);
  const resume = useCallback(() => { window.speechSynthesis.resume(); setTtsState("playing"); }, []);
  const stop   = useCallback(() => { window.speechSynthesis.cancel(); setTtsState("idle");    }, []);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  return { ttsState, speak, pause, resume, stop };
}

/* ── AI Summary with typewriter effect ── */
function AISummary({ text }) {
  const [open, setOpen]           = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const timerRef = useRef(null);

  const toggle = () => {
    if (open) {
      clearInterval(timerRef.current);
      setOpen(false);
      setDisplayed("");
      setDone(false);
      return;
    }
    setOpen(true);
    setDisplayed("");
    setDone(false);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, 18);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="mb-6 rounded-xl overflow-hidden border border-indigo-100 shadow-sm">
      {/* Header button */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-orange-600 hover:bg-orange-700 transition-colors text-left"
      >
        <span className="text-xl leading-none">🤖</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-black text-white">AI Summary</span>
          <span className="text-xs text-indigo-200 ml-2">{open ? "click to close" : "click to read"}</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className="w-4 h-4 text-indigo-200 shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Typewriter content */}
      {open && (
        <div className="px-5 py-4 bg-indigo-50 border-t border-indigo-100">
          <p className="text-gray-700 text-sm leading-relaxed">
            {displayed}
            {!done && (
              <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Share Bar ── */
function ShareBar({ url, title }) {
  const [copied, setCopied] = useState(false);

  const enc   = encodeURIComponent;
  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${enc(title + " " + url)}`,
      color: "bg-[#25D366] hover:bg-[#1ebe59]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.847L.057 23.882a.5.5 0 0 0 .611.612l6.108-1.603A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 0 1-5.007-1.374l-.36-.214-3.724.977.995-3.63-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      color: "bg-[#1877F2] hover:bg-[#1462c8]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
      color: "bg-[#0088cc] hover:bg-[#0077b5]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: `https://www.instagram.com/`,
      color: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      ),
      onClick: (e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(url).then(() => {});
        window.open("https://www.instagram.com/", "_blank");
      },
    },
  ];

  const copyLink = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 py-4 border-y border-gray-100">
      <span className="text-xs font-black text-gray-400 uppercase tracking-wider mr-1">Share:</span>
      {links.map(({ label, href, color, icon, onClick }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={onClick}
          title={`Share on ${label}`}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-sm ${color}`}
        >
          {icon}
          {label}
        </a>
      ))}

      {/* Copy link */}
      <button
        onClick={copyLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 hover:-translate-y-0.5 ${
          copied
            ? "bg-green-50 border-green-300 text-green-600"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        )}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}

/* ── Reading progress bar ── */
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const h = el.scrollHeight - el.clientHeight;
      setPct(h > 0 ? Math.min(100, (top / h) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-60 bg-gray-200">
      <div className="h-full bg-orange-500 transition-all duration-75" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── TOC ── */
function TableOfContents({ items }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-20% 0px -75% 0px" });
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;
  return (
    <div className="border border-orange-100 rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-orange-500 text-white font-bold text-sm"
      >
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Table of Contents
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <nav className="px-5 py-4 space-y-0.5 bg-orange-50/40">
          {items.map(({ id, text, level }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActive(id);
              }}
              className={`block text-sm py-1.5 transition-colors ${level === 3 ? "pl-4" : ""} ${active === id ? "text-orange-600 font-semibold" : "text-gray-600 hover:text-orange-500"}`}
            >
              {level === 3 ? "↳ " : "• "}{text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

/* ── Related article card ── */
const RelatedCard = ({ article }) => (
  <Link to={buildArticleUrl(article)} className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
    <div className="shrink-0 w-18 h-13 rounded-lg overflow-hidden bg-gray-100">
      <img
        src={article.featured_image || blogFallback}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={e => { e.target.src = blogFallback; }}
      />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-1">
        {article.title}
      </p>
      <p className="text-[11px] text-gray-400">{fmtDateTime(article.createdAt || article.published_at)}</p>
    </div>
  </Link>
);

/* ── Loading skeleton ── */
const DetailSkeleton = () => (
  <div className="min-h-screen bg-white pt-16 animate-pulse">
    <div className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-2">
        {[80, 140, 200].map(w => (
          <div key={w} className="h-3 bg-gray-200 rounded" style={{ width: w }} />
        ))}
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
          <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
          <div className="aspect-video w-full bg-gray-200 rounded-xl mb-5" />
          <div className="h-8 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-5" />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded mb-3" style={{ width: `${75 + (i % 3) * 8}%` }} />
          ))}
        </div>
        <div className="space-y-5">
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-36 bg-gray-200 rounded-xl" />
          <div className="h-56 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/* ── Main Component ── */
export default function ArticleDetail() {
  // Handles all route patterns:
  // /articles/:slug | /articles/:p/:slug | /articles/:p/:c/:slug
  // /:parentSlug/:slug (TwoSegmentResolver) | /:parentSlug/:childSlug/:articleSlug
  const { parentSlug, childSlug, slug: paramSlug, articleSlug } = useParams();
  const slug = articleSlug || paramSlug;
  const navigate = useNavigate();

  const [article,       setArticle]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [related,       setRelated]       = useState([]);
  const [tocItems,      setTocItems]      = useState([]);
  const [processedHtml, setProcessedHtml] = useState("");
  const [readingMode,   setReadingMode]   = useState(false);
  const [ttsRate,       setTtsRate]       = useState(1);
  const contentRef = useRef(null);
  const { ttsState, speak, pause, resume, stop } = useTTS();

  /* ── Plain text for TTS (strips HTML tags) ── */
  const plainText = useMemo(() => {
    if (!processedHtml) return "";
    const div = document.createElement("div");
    div.innerHTML = processedHtml;
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  }, [processedHtml]);

  /* ── Auto-start TTS when reading mode turns on; stop when off ── */
  useEffect(() => {
    if (readingMode && plainText) {
      speak(plainText, ttsRate);
    } else {
      stop();
    }
  }, [readingMode]); // intentionally only on readingMode toggle

  useEffect(() => {
    setLoading(true); setError(null); setArticle(null);
    setRelated([]); setTocItems([]); setProcessedHtml("");
    window.scrollTo(0, 0);

    fetch(`${API_BASE}/blogs/slug/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success === false) throw new Error(data.message || "Article not found");
        const art = data.article || data.data || data;

        // Validate that category slugs in route match the actual article category tree
        const artTree = art.categoryTree?.[0];
        const artParentSlug = artTree ? toSlug(artTree.parent?.name, artTree.parent?.slug) : "";
        const artPrimaryChild = artTree?.children?.find(c => c.id === art.primary_category?._id);
        const artChildSlug = artPrimaryChild ? toSlug(artPrimaryChild.name, artPrimaryChild.slug) : "";

        // If route has parentSlug, it must match the article's actual parent category slug
        if (parentSlug && parentSlug !== artParentSlug) {
          throw new Error("Article not found");
        }
        // If route has childSlug, it must match the article's actual child category slug
        if (childSlug && childSlug !== artChildSlug) {
          throw new Error("Article not found");
        }

        // Canonical URL Redirect check to prevent SEO duplicates (e.g. redirect trailing slashes or capital cases if any)
        const canonicalPath = buildArticleUrl(art);
        if (window.location.pathname !== canonicalPath) {
          navigate(canonicalPath, { replace: true });
          return;
        }

        setArticle(art);

        const { html } = processContent(art.content || "");
        setProcessedHtml(html);
        setTimeout(() => {
          if (contentRef.current) setTocItems(extractTOCItems(html));
        }, 100);

        const parentId = art.categoryTree?.[0]?.parent?.id;
        if (parentId) {
          fetch(`${API_BASE}/blogs?parent_category_id=${parentId}`)
            .then(r => r.json())
            .then(rd => {
              const list = (rd.data || rd).articles || [];
              setRelated(list.filter(a => a.slug !== slug).slice(0, 5));
            })
            .catch(() => {});
        }
      })
      .catch(e => setError(e.message || "Article not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (processedHtml && contentRef.current) setTocItems(extractTOCItems(processedHtml));
  }, [processedHtml]);

  const tree         = article?.categoryTree?.[0];
  const primaryChild = tree?.children?.find(c => c.id === article?.primary_category?._id);
  const createdAt    = article?.createdAt    || article?.published_at;
  const updatedAt    = article?.updatedAt    || article?.last_updated_at;
  const showUpdated  = !isSameDay(createdAt, updatedAt);
  const views        = fmtViews(article?.views);
  const canonicalUrl = article ? `https://www.careermitra.in${buildArticleUrl(article)}` : "";
  const parentHref   = tree ? `/${toSlug(tree.parent.name, tree.parent.slug)}` : "/";
  const childHref    = primaryChild ? `${parentHref}/${toSlug(primaryChild.name, primaryChild.slug)}` : null;
  const backHref     = childHref || parentHref;
  const backLabel    = primaryChild?.name || tree?.parent?.name;

  const articleSchemas = useMemo(() => {
    if (!article) return [];
    
    // 1. Article Schema
    const articleSchema = generateArticleSchema({
      headline: article.meta_title || article.title,
      description: article.meta_description || article.short_description,
      image: article.featured_image,
      publishedAt: createdAt,
      modifiedAt: updatedAt,
      authorName: article.author?.author_name || "Career Mitra Editorial Team",
      authorUrl: article.author?._id ? `/author/${article.author?._id}` : undefined,
      url: buildArticleUrl(article)
    });
    
    // 2. Person (Author) Schema
    const personSchema = generatePersonSchema({
      name: article.author?.author_name || "Career Mitra Editorial Team",
      jobTitle: "Author",
      worksFor: "CareerMitra"
    });
    
    // 3. FAQ Schema
    const faqSchema = generateFAQSchema(article.faqs);
    
    return [articleSchema, personSchema, faqSchema].filter(Boolean);
  }, [article, createdAt, updatedAt]);

  if (loading) return <DetailSkeleton />;

  if (error || !article) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 pt-16">
      <div className="text-8xl font-black text-gray-100">404</div>
      <p className="text-gray-500 text-lg font-semibold">{error || "Article not found"}</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition">
        Back to Home
      </Link>
    </div>
  );

  return (
    <>
      <ReadingProgress />

      <SEO
        title={`${article.meta_title || article.title} | CareerMitra`}
        description={article.meta_description || article.short_description}
        keywords={(article.meta_keywords || article.tags || []).join(", ")}
        url={canonicalUrl}
        image={article.featured_image}
        imageAlt={article.image_alt_text || article.title}
        type="article"
        publishedAt={createdAt}
        modifiedAt={updatedAt}
        authorName={article.author?.author_name}
        tags={article.tags || []}
        section={primaryChild?.name || tree?.parent?.name}
        schema={articleSchemas}
      />

      <div className={`min-h-screen pt-26 transition-colors duration-300 ${readingMode ? "bg-amber-50 pb-24" : "bg-white"}`}>

        {/* ── Breadcrumb bar ── */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
            <nav className="flex items-center flex-wrap gap-1.5 text-[11px] text-gray-400">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              {tree && (
                <>
                  <span className="text-gray-300">›</span>
                  <Link to={parentHref} className="hover:text-orange-500 transition-colors">{tree.parent.name}</Link>
                </>
              )}
              {primaryChild && (
                <>
                  <span className="text-gray-300">›</span>
                  <Link to={childHref} className="hover:text-orange-500 transition-colors">{primaryChild.name}</Link>
                </>
              )}
              <span className="text-gray-300">›</span>
              <span className="text-gray-500 truncate max-w-60 sm:max-w-sm">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Main two-column layout ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className={`grid gap-8 items-start ${readingMode ? "lg:grid-cols-1 max-w-3xl mx-auto" : "lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]"}`}>

            {/* ══════ LEFT — Main Article ══════ */}
            <main>

              {/* ← Back to category */}
              {backLabel && (
                <button
                  onClick={() => navigate(backHref)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors mb-3"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  {backLabel}
                </button>
              )}

              {/* Share bar */}
              <ShareBar url={canonicalUrl} title={article.title} />

                 {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-orange-500 leading-snug mb-3">
                {article.title}
              </h1>

              {/* AI Summary — typewriter on click */}
              {article.short_description && (
                <AISummary text={article.short_description} />
              )}

              {/* Featured image — full width of this column */}
              <div className="relative rounded-xl overflow-hidden mb-5 bg-gray-100">
                <img
                  src={article.featured_image || blogFallback}
                  alt={article.image_alt_text || article.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "460px", minHeight: "220px" }}
                  onError={e => { e.target.src = blogFallback; }}
                />
                {/* Category overlay badge */}
                {(primaryChild || tree) && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-gray-900/85 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                      {primaryChild?.name || tree?.parent?.name}
                    </span>
                  </div>
                )}
              </div>

           

            

              {/* Author + Meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2">
                  {article.author?.avatar_url ? (
                    <img
                      src={article.author.avatar_url}
                      alt={article.author.author_name}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-500">
                      {(article.author?.author_name || "C")[0].toUpperCase()}
                    </span>
                  )}
                  <span className="font-semibold text-gray-700 text-sm">{article.author?.author_name || "CareerMitra"}</span>
                </div>

                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {fmtDateTime(createdAt)}
                </span>

                {showUpdated && (
                  <span className="text-orange-500 text-xs font-medium">Updated {fmtDateTime(updatedAt)}</span>
                )}

                {/* Reading Mode toggle */}
                <button
                  onClick={() => setReadingMode(v => !v)}
                  className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    readingMode
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  {readingMode ? "Exit Reading" : "Reading Mode"}
                </button>
              </div>

             

              {/* TOC */}
              {/* {tocItems.length > 2 && <TableOfContents items={tocItems} />} */}

              {/* Article content */}
              <div
                ref={contentRef}
                className="article-body"
                style={readingMode ? { fontSize: "1.1rem", lineHeight: "1.95", letterSpacing: "0.01em" } : undefined}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />

              {/* Tags */}
              {article.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100 mt-6">
                  <span className="text-xs font-bold text-gray-400 self-center mr-1 uppercase tracking-wide">Tags:</span>
                  {article.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/articles?search=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Author card at bottom of article */}
              {article.author && (
                <div className="mt-6 bg-orange-50 rounded-xl p-5 border border-orange-100 flex gap-4">
                  <div className="shrink-0">
                    {article.author.avatar_url ? (
                      <img
                        src={article.author.avatar_url}
                        alt={article.author.author_name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span className="w-14 h-14 rounded-full bg-orange-200 flex items-center justify-center text-xl font-black text-orange-600">
                        {(article.author.author_name || "C")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">Written by</p>
                    <p className="font-black text-gray-900 text-sm mb-1">{article.author.author_name}</p>
                    {article.author.bio && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{article.author.bio}</p>}
                    <div className="flex gap-3">
                      {article.author.social_links?.linkedin && (
                        <a href={article.author.social_links.linkedin} target="_blank" rel="nofollow noopener noreferrer" className="text-[11px] font-bold text-blue-500 hover:underline">LinkedIn</a>
                      )}
                      {article.author.social_links?.twitter && (
                        <a href={article.author.social_links.twitter} target="_blank" rel="nofollow noopener noreferrer" className="text-[11px] font-bold text-sky-500 hover:underline">Twitter</a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* ══════ RIGHT SIDEBAR ══════ */}
            <aside className={`space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto ${readingMode ? "hidden" : ""}`} style={{ scrollbarWidth: "none" }}>

              {/* About the Author */}
              {/* {article.author && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">About the Author</p>
                  <div className="flex flex-col items-center text-center">
                    {article.author.avatar_url ? (
                      <img
                        src={article.author.avatar_url}
                        alt={article.author.author_name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-sm mb-3"
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-black text-orange-500 mb-3">
                        {(article.author.author_name || "C")[0].toUpperCase()}
                      </span>
                    )}
                    <p className="font-black text-gray-900 text-sm mb-2">{article.author.author_name}</p>
                    {article.author.bio && (
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-3">{article.author.bio}</p>
                    )}
                    <div className="flex gap-3 justify-center">
                      {article.author.social_links?.linkedin && (
                        <a href={article.author.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-500 hover:underline">LinkedIn</a>
                      )}
                      {article.author.social_links?.twitter && (
                        <a href={article.author.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-sky-500 hover:underline">Twitter</a>
                      )}
                      {article.author.social_links?.website && (
                        <a href={article.author.social_links.website} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-gray-500 hover:underline">Website</a>
                      )}
                    </div>
                  </div>
                </div>
              )} */}


              {/* Related Articles */}
              {related.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-orange-500">
                      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Related Articles</p>
                  </div>
                  <div>
                    {related.map(a => <RelatedCard key={a._id} article={a} />)}
                  </div>
                  {tree && (
                    <Link to={parentHref} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline">
                      View all {tree.parent.name} →
                    </Link>
                  )}
                </div>
              )}

              {/* Quick Links */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
                <div className="space-y-1">
                  {[
                    { to: "/latest-job-notifications", label: "Latest Govt Jobs" },
                    { to: "/career-guide",             label: "Career Guide" },
                    { to: "/articles",                 label: "All Articles" },
                    { to: "/internship-guide",         label: "Internship Guide" },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors py-1.5 border-b border-gray-50 last:border-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>

      </div>

      {/* ── TTS Player bar (fixed bottom, only in reading mode) ── */}
      {readingMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-800 shadow-2xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">

            {/* Sound wave animation */}
            <div className="flex items-end gap-0.5 shrink-0 h-6">
              {[0.4, 0.75, 1, 0.75, 0.5, 0.9, 0.6].map((h, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full bg-orange-500 transition-all ${ttsState === "playing" ? "animate-pulse" : "opacity-30"}`}
                  style={{
                    height: `${h * 24}px`,
                    animationDelay: `${i * 80}ms`,
                    animationDuration: `${600 + i * 50}ms`,
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                {ttsState === "playing" ? "Reading aloud…" : ttsState === "paused" ? "Paused" : "Ready"}
              </p>
              <p className="text-sm font-bold text-white truncate">{article?.title}</p>
            </div>

            {/* Speed selector */}
            <select
              value={ttsRate}
              onChange={e => {
                const r = parseFloat(e.target.value);
                setTtsRate(r);
                if (ttsState !== "idle") speak(plainText, r);
              }}
              className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500 shrink-0"
            >
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.25}>1.25×</option>
              <option value={1.5}>1.5×</option>
            </select>

            {/* Play / Pause */}
            {ttsState === "playing" ? (
              <button
                onClick={pause}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors shrink-0"
                title="Pause"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={() => ttsState === "paused" ? resume() : speak(plainText, ttsRate)}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors shrink-0"
                title="Play"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            )}

            {/* Stop */}
            <button
              onClick={stop}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors shrink-0"
              title="Stop"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
            </button>

            {/* Exit reading mode */}
            <button
              onClick={() => setReadingMode(false)}
              className="text-xs text-gray-500 hover:text-white transition-colors shrink-0 px-2 py-1 border border-gray-700 rounded-lg hover:border-gray-500"
            >
              Exit
            </button>

          </div>
        </div>
      )}

      {/* ── Article body styles ── */}
      <style>{`
        .article-body h2 {
          font-size: 1.35rem; font-weight: 900; color: #ea580c;
          margin: 2rem 0 0.75rem; padding-bottom: 0.5rem;
          border-bottom: 2px solid #fed7aa; scroll-margin-top: 80px;
        }
        .article-body h3 {
          font-size: 1.1rem; font-weight: 800; color: #ea580c;
          margin: 1.5rem 0 0.5rem; scroll-margin-top: 80px;
        }
        .article-body h4 { font-size: 1rem; font-weight: 700; color: #f97316; margin: 1.25rem 0 0.4rem; }
        .article-body p { color: #374151; line-height: 1.8; margin-bottom: 1rem; font-size: 0.9375rem; }
        .article-body ul, .article-body ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .article-body li { color: #374151; line-height: 1.7; margin-bottom: 0.25rem; font-size: 0.9375rem; }
        .article-body ul li { list-style-type: disc; }
        .article-body ol li { list-style-type: decimal; }
        .article-body a { color: #f97316; text-decoration: none; font-weight: 600; }
        .article-body a:hover { text-decoration: underline; }
        .article-body strong, .article-body b { font-weight: 800; color: #111827; }
        .article-body blockquote {
          border-left: 4px solid #f97316; background: #fff7ed;
          padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 0.75rem 0.75rem 0;
          color: #374151; font-style: italic;
        }
        .article-body table {
          width: 100%; border-collapse: collapse; margin: 1.5rem 0;
          font-size: 0.875rem; overflow-x: auto; display: block;
        }
        .article-body th {
          background: #f97316 !important; color: #ffffff !important; font-weight: 800;
          padding: 0.6rem 0.9rem; text-align: left; white-space: nowrap;
        }
        .article-body td {
          padding: 0.55rem 0.9rem; border-bottom: 1px solid #f3f4f6;
          color: #374151; vertical-align: top;
        }
        .article-body tr:nth-child(even) td { background: #fafafa; }
        .article-body tr:hover td { background: #fff7ed; }
        .article-body img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1rem auto; display: block; }
        .article-body pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; font-size: 0.85rem; margin: 1rem 0; }
        .article-body code { background: #f1f5f9; color: #dc2626; padding: 0.15rem 0.4rem; border-radius: 0.3rem; font-size: 0.85rem; }
        .article-body pre code { background: transparent; color: inherit; padding: 0; }
        .article-body hr { border: none; border-top: 2px solid #f3f4f6; margin: 2rem 0; }
        @media (max-width: 640px) {
          .article-body h2 { font-size: 1.15rem; }
          .article-body h3 { font-size: 1rem; }
          .article-body p, .article-body li { font-size: 0.9rem; }
        }
      `}</style>
    </>
  );
}
