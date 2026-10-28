"use client";

import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  FaSearch, FaTimes, FaNewspaper, FaGraduationCap, FaBriefcase,
  FaLightbulb, FaUniversity, FaArrowRight, FaClock,
} from "react-icons/fa";
import { PUBLIC_API_BASE_URL } from "@/utils/api";
import { useBlogs } from "@/context/BlogContext";

// Header "Global Search". Each keystroke (debounced) asks the live backend
// search APIs for the top matches, so results are always current and nothing
// big is downloaded up front. Articles are the exception: the site already
// holds every article in BlogContext, so they are matched in the browser
// (the blogs API returns full article bodies — ~1 MB per search).
const PER_SECTION = 5;
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;
const RECENT_KEY = "cm_recent_searches";

const POPULAR = ["SSC", "Railway", "Bank", "Police", "Telangana", "Andhra Pradesh", "Teacher", "Internship"];

const QUICK_LINKS = [
  { label: "Latest Govt Jobs", url: "/latest-job-notifications", icon: FaBriefcase },
  { label: "Internships", url: "/internships", icon: FaGraduationCap },
  { label: "SkillUps", url: "/internships?tab=skillups", icon: FaLightbulb },
  { label: "PG Entrance", url: "/pg-entrance", icon: FaUniversity },
];

const titleSlug = (title) =>
  title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "";

const buildBlogUrl = (blog, categoryTree) => {
  const primary = blog?.categories?.[0];
  if (!primary || !categoryTree?.length) return `/${blog.slug}`;
  for (const parent of categoryTree) {
    if (parent.id === primary._id) return `/${parent.slug}/${blog.slug}`;
    const child = parent.children?.find((c) => c.id === primary._id);
    if (child) return `/${parent.slug}/${child.slug}/${blog.slug}`;
  }
  return `/${blog.slug}`;
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const isPast = (value) => {
  if (!value) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now() - 24 * 60 * 60 * 1000;
};

// One entry per section: which API to call and how to turn its rows into results.
const SECTIONS = [
  {
    key: "jobs",
    label: "Government Jobs",
    icon: FaBriefcase,
    color: "text-orange-600 bg-orange-50",
    url: (q) => `${PUBLIC_API_BASE_URL}/jobs?jobType=jobs&search=${encodeURIComponent(q)}&limit=${PER_SECTION}`,
    rows: (d) => d?.jobs || [],
    total: (d) => d?.pagination?.total,
    viewAll: (q) => `/latest-job-notifications?q=${encodeURIComponent(q)}`,
    map: (j) => ({
      key: `job-${j._id}`,
      title: j.title,
      subtitle: [j.jobSource, j.state || j.sector].filter(Boolean).join(" · "),
      meta: j.deadline ? `${isPast(j.deadline) ? "Closed" : "Last date"}: ${formatDate(j.deadline)}` : "",
      closed: isPast(j.deadline),
      deadline: Boolean(j.deadline),
      url: `/latest-job-notifications?q=${encodeURIComponent(j.title)}`,
    }),
  },
  {
    key: "blogs",
    label: "Articles",
    icon: FaNewspaper,
    color: "text-sky-600 bg-sky-50",
    local: true, // matched from BlogContext, see blogResults below
    viewAll: null,
    map: (b, ctx) => ({
      key: `blog-${b._id}`,
      title: b.title,
      subtitle: b.categories?.[0]?.name || "Article",
      meta: formatDate(b.published_at),
      url: buildBlogUrl(b, ctx.categoryTree),
    }),
  },
  {
    key: "internships",
    label: "Internships",
    icon: FaGraduationCap,
    color: "text-emerald-600 bg-emerald-50",
    url: (q) => `${PUBLIC_API_BASE_URL}/internships?search=${encodeURIComponent(q)}&limit=${PER_SECTION}`,
    rows: (d) => d?.internships || [],
    total: (d) => d?.pagination?.total,
    viewAll: () => "/internships",
    map: (i) => ({
      key: `internship-${i.id}`,
      title: i.internship_title,
      subtitle: [i.company_name, i.location || i.state].filter(Boolean).join(" · "),
      meta: [i.stipend, i.last_date_to_apply ? `Apply by ${formatDate(i.last_date_to_apply)}` : ""].filter(Boolean).join(" · "),
      closed: isPast(i.last_date_to_apply),
      deadline: Boolean(i.last_date_to_apply),
      url: `/internships/${titleSlug(i.internship_title)}?id=${i.id}`,
    }),
  },
  {
    key: "skillups",
    label: "SkillUps",
    icon: FaLightbulb,
    color: "text-violet-600 bg-violet-50",
    url: (q) => `${PUBLIC_API_BASE_URL}/jobs/skillup?search=${encodeURIComponent(q)}&limit=${PER_SECTION}`,
    rows: (d) => d?.jobs || [],
    total: (d) => d?.pagination?.total,
    viewAll: () => "/internships?tab=skillups",
    map: (s) => ({
      key: `skillup-${s._id}`,
      title: s.title,
      subtitle: [s.platform || s.jobSource, s.categoryName].filter(Boolean).join(" · "),
      meta: s.courseStatus || "",
      url: "/internships?tab=skillups",
    }),
  },
  {
    key: "pg",
    label: "PG Entrance",
    icon: FaUniversity,
    color: "text-rose-600 bg-rose-50",
    url: (q) => `${PUBLIC_API_BASE_URL}/pg-entrance?search=${encodeURIComponent(q)}&limit=${PER_SECTION}`,
    rows: (d) => d?.items || [],
    total: (d) => d?.pagination?.total,
    viewAll: (q) => `/pg-entrance?q=${encodeURIComponent(q)}`,
    map: (p, ctx) => ({
      key: `pg-${p.id}`,
      title: p.fullName || p.name,
      subtitle: [p.stream, p.university].filter(Boolean).join(" · "),
      meta: p.examDate ? `Exam: ${p.examDate}` : "",
      url: `/pg-entrance?q=${encodeURIComponent(ctx.query)}`,
    }),
  },
];

const readRecent = () => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(list) ? list.slice(0, 5) : [];
  } catch {
    return [];
  }
};

const saveRecent = (q) => {
  try {
    const list = [q, ...readRecent().filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — ignore */
  }
};

// Bold the typed words inside a result title.
function Highlight({ text, words }) {
  if (!text || !words.length) return text || "";
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = String(text).split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return parts.map((part, i) =>
    words.some((w) => w.toLowerCase() === part.toLowerCase())
      ? <mark key={i} className="bg-transparent font-black text-orange-600">{part}</mark>
      : <span key={i}>{part}</span>
  );
}

const noopSubscribe = () => () => {};

export default function GlobalSearchModal({ open, onClose, categoryTree }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const portalReady = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState({}); // { [sectionKey]: { items, total } }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState([]);

  const trimmed = query.trim();
  const words = useMemo(
    () => debounced.toLowerCase().split(/\s+/).filter(Boolean),
    [debounced]
  );

  // Reset on open / close.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecent(readRecent());
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    setQuery("");
    setDebounced("");
    setResults({});
    setError(false);
  }, [open]);

  // Lock page scroll + Escape to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Debounce typing.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [trimmed]);

  // Ask every section's API in parallel; cancel the previous round on new input.
  useEffect(() => {
    if (!open || debounced.length < MIN_CHARS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults({});
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setActive(0);

    const remote = SECTIONS.filter((s) => !s.local);
    Promise.allSettled(
      remote.map((s) =>
        fetch(s.url(debounced), { signal: controller.signal })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
          .then((json) => {
            const data = json?.data;
            return {
              key: s.key,
              items: s.rows(data).slice(0, PER_SECTION).map((row) => s.map(row, { categoryTree, query: debounced })),
              total: s.total(data),
            };
          })
      )
    ).then((settled) => {
      if (controller.signal.aborted) return;
      const next = {};
      let failures = 0;
      settled.forEach((r) => {
        if (r.status === "fulfilled") next[r.value.key] = r.value;
        else failures += 1;
      });
      setResults(next);
      setError(failures === remote.length);
      setLoading(false);
    });

    return () => controller.abort();
  }, [open, debounced, categoryTree]);

  // Articles: score each by how many typed words it contains.
  const { blogs } = useBlogs();
  const blogResults = useMemo(() => {
    if (debounced.length < MIN_CHARS || !blogs?.length) return null;
    const blogSection = SECTIONS.find((s) => s.key === "blogs");
    const matches = blogs
      .map((b) => {
        const title = (b.title || "").toLowerCase();
        const rest = [b.short_description, ...(b.categories || []).map((c) => c.name)].filter(Boolean).join(" ").toLowerCase();
        // A title hit counts more than a description hit.
        const score = words.reduce((acc, w) => acc + (title.includes(w) ? 3 : rest.includes(w) ? 1 : 0), 0);
        return { b, score, allWords: words.every((w) => title.includes(w) || rest.includes(w)) };
      })
      .filter((m) => m.score > 0 && (words.length === 1 || m.allWords))
      .sort((a, b) => b.score - a.score);
    return {
      key: "blogs",
      items: matches.slice(0, PER_SECTION).map(({ b }) => blogSection.map(b, { categoryTree, query: debounced })),
      total: matches.length,
    };
  }, [blogs, words, debounced, categoryTree]);

  const allResults = blogResults ? { ...results, blogs: blogResults } : results;

  // Each section remembers where its rows start in the flat keyboard list.
  const visibleSections = SECTIONS
    .map((s) => ({ ...s, data: allResults[s.key] }))
    .filter((s) => s.data?.items?.length)
    .reduce((acc, s) => {
      const prev = acc[acc.length - 1];
      const offset = prev ? prev.offset + prev.data.items.length : 0;
      return [...acc, { ...s, offset }];
    }, []);

  // Flat list for keyboard navigation.
  const flat = useMemo(
    () => visibleSections.flatMap((s) => s.data.items),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, blogResults]
  );

  const goTo = (url) => {
    if (debounced.length >= MIN_CHARS) saveRecent(debounced);
    router.push(url);
    onClose();
  };

  const runSearch = (text) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const onInputKeyDown = (e) => {
    if (!flat.length) {
      if (e.key === "Enter" && trimmed.length >= MIN_CHARS) {
        goTo(`/latest-job-notifications?q=${encodeURIComponent(trimmed)}`);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) goTo(item.url);
    }
  };

  // Keep the highlighted row in view.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open || !portalReady) return null;

  const waiting = trimmed.length >= MIN_CHARS && (loading || trimmed !== debounced);
  const showEmpty = trimmed.length < MIN_CHARS;

  return createPortal(
    <div
      className="fixed inset-0 flex items-start justify-center px-3 pt-16 sm:px-4 sm:pt-24"
      style={{ zIndex: 2147483000 }}
      role="dialog"
      aria-modal="true"
      aria-label="Search Careermitra"
    >
      <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl">
        {/* Search box */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <FaSearch className="shrink-0 text-orange-500" size={17} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search jobs, internships, SkillUps, PG exams, articles…"
            className="min-w-0 flex-1 bg-transparent text-base text-slate-800 placeholder-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search"
          />
          {query && (
            <button
              type="button"
              onClick={() => runSearch("")}
              className="shrink-0 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            aria-label="Close search"
          >
            <FaTimes size={12} />
          </button>
        </div>

        {/* Thin progress bar while searching */}
        <div className="h-0.5 w-full overflow-hidden bg-transparent">
          {waiting && <div className="h-full w-1/3 animate-[gs-bar_1s_ease-in-out_infinite] bg-orange-400" />}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto">
          {showEmpty ? (
            <div className="space-y-6 px-5 py-5">
              {recent.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <FaClock size={10} /> Recent searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} type="button" onClick={() => runSearch(r)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700">
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((p) => (
                    <button key={p} type="button" onClick={() => runSearch(p)}
                      className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">Browse</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_LINKS.map(({ label, url, icon: Icon }) => (
                    <button key={url} type="button" onClick={() => goTo(url)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50">
                      <Icon className="text-orange-500" size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : waiting && !visibleSections.length ? (
            <div className="space-y-3 px-5 py-5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded bg-slate-100" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error && !visibleSections.length ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Search is not reachable right now. Please check your connection and try again.
            </div>
          ) : !visibleSections.length ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-semibold text-slate-700">No results for “{debounced}”</p>
              <p className="mt-1 text-xs text-slate-400">Try a shorter word, like an exam name, state or department.</p>
            </div>
          ) : (
            <div className="py-2">
              {visibleSections.map((s) => {
                const Icon = s.icon;
                const total = s.data.total;
                const viewAllUrl = s.viewAll?.(debounced);
                return (
                  <div key={s.key} className="px-2 py-1.5">
                    <div className="flex items-center justify-between px-3 py-1">
                      <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <Icon size={11} /> {s.label}
                        {typeof total === "number" && <span className="font-semibold normal-case tracking-normal text-slate-300">· {total}</span>}
                      </p>
                      {viewAllUrl && (
                        <button type="button" onClick={() => goTo(viewAllUrl)}
                          className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700">
                          View all <FaArrowRight size={9} />
                        </button>
                      )}
                    </div>
                    {s.data.items.map((r, i) => {
                      const idx = s.offset + i;
                      const isActive = idx === active;
                      return (
                        <button
                          key={r.key}
                          type="button"
                          data-index={idx}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => goTo(r.url)}
                          className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${isActive ? "bg-orange-50" : "hover:bg-orange-50"}`}
                        >
                          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.color}`}>
                            <Icon size={13} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-sm font-bold text-slate-800">
                              <Highlight text={r.title} words={words} />
                            </span>
                            {r.subtitle && <span className="block truncate text-xs text-slate-500">{r.subtitle}</span>}
                            {r.meta && (
                              <span className={`mt-0.5 block truncate text-[11px] font-semibold ${r.closed ? "text-red-500" : r.deadline ? "text-emerald-600" : "text-slate-400"}`}>
                                {r.meta}
                              </span>
                            )}
                          </span>
                          {isActive && <FaArrowRight className="mt-2 shrink-0 text-orange-400" size={11} />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="hidden items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400 sm:flex">
          <span><kbd className="rounded border bg-white px-1">↑</kbd> <kbd className="rounded border bg-white px-1">↓</kbd> to move · <kbd className="rounded border bg-white px-1">Enter</kbd> to open</span>
          <span><kbd className="rounded border bg-white px-1">Esc</kbd> to close</span>
        </div>
      </div>

      <style>{`@keyframes gs-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
    </div>,
    document.body
  );
}
