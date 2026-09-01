"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaTimes, FaNewspaper, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { useBlogs } from "@/context/BlogContext";

const INTERNSHIPS_URL = "https://www.careermitra.in/api/internships";
const JOBS_URL = "https://www.careermitra.in/api/jobs";

const generateSlug = (title) =>
  title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "";

const scoreAndFilter = (list, words, getFields) =>
  list
    .map((item) => {
      const haystack = getFields(item).filter(Boolean).join(" ").toLowerCase();
      const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

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

export default function GlobalSearchModal({ open, onClose, categoryTree }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const { blogs } = useBlogs();

  const [query, setQuery] = useState("");
  const [allInternships, setAllInternships] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [internshipsLoaded, setInternshipsLoaded] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefetch internships + jobs (once) as soon as the search is opened, so
  // results feel instant once the user starts typing. Blogs are already
  // available site-wide via BlogProvider (dynamic — new posts show up
  // automatically the next time that context refetches).
  useEffect(() => {
    if (!open || (internshipsLoaded && jobsLoaded)) return;

    const fetchAllPages = async (baseUrl, extractItems) => {
      const first = await fetch(`${baseUrl}&page=1`);
      const firstJson = await first.json();
      if (!firstJson.success) return [];
      let items = extractItems(firstJson);
      const totalPages = firstJson.data?.pagination?.totalPages || 1;
      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(fetch(`${baseUrl}&page=${p}`).then((r) => r.json()));
        }
        const results = await Promise.all(promises);
        results.forEach((r) => {
          if (r.success) items = items.concat(extractItems(r));
        });
      }
      return items;
    };

    setLoading(true);
    Promise.all([
      internshipsLoaded
        ? Promise.resolve(null)
        : fetchAllPages(`${INTERNSHIPS_URL}?limit=100&sort=newest`, (j) => j.data?.internships || []),
      jobsLoaded
        ? Promise.resolve(null)
        : fetchAllPages(`${JOBS_URL}?limit=100&sort=newest&job_type=jobs`, (j) => j.data?.jobs || []),
    ])
      .then(([internships, jobs]) => {
        if (internships) {
          setAllInternships(internships);
          setInternshipsLoaded(true);
        }
        if (jobs) {
          setAllJobs(jobs);
          setJobsLoaded(true);
        }
      })
      .catch((err) => console.error("Global search prefetch failed:", err))
      .finally(() => setLoading(false));
  }, [open, internshipsLoaded, jobsLoaded]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const trimmed = query.trim();
  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);

  const blogResults = useMemo(() => {
    if (!words.length) return [];
    return scoreAndFilter(blogs, words, (b) => [b.title, b.short_description, ...(b.categories || []).map((c) => c.name)])
      .slice(0, 5)
      .map(({ item }) => ({
        key: `blog-${item._id}`,
        title: item.title,
        subtitle: item.categories?.[0]?.name || "Article",
        url: buildBlogUrl(item, categoryTree),
      }));
  }, [words, blogs, categoryTree]);

  const internshipResults = useMemo(() => {
    if (!words.length) return [];
    return scoreAndFilter(allInternships, words, (i) => [i.internship_title, i.company_name, i.domain_sector, i.location, i.state])
      .slice(0, 5)
      .map(({ item }) => ({
        key: `internship-${item.id}`,
        title: item.internship_title,
        subtitle: item.company_name,
        url: `/internships/${generateSlug(item.internship_title)}`,
      }));
  }, [words, allInternships]);

  const jobResults = useMemo(() => {
    if (!words.length) return [];
    return scoreAndFilter(allJobs, words, (j) => [j.title, j.source_name, j.category_name, j.qualifications])
      .slice(0, 5)
      .map(({ item }) => ({
        key: `job-${item._id}`,
        title: item.title,
        subtitle: item.source_name,
        url: `/latest-job-notifications?q=${encodeURIComponent(item.title)}`,
      }));
  }, [words, allJobs]);

  const hasAnyResults = blogResults.length + internshipResults.length + jobResults.length > 0;
  const isPrefetching = loading && !(internshipsLoaded && jobsLoaded);

  const goTo = (url) => {
    router.push(url);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-20 sm:pt-28">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[75vh] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <FaSearch className="text-orange-400 shrink-0" size={16} />
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, internships, articles..."
            className="flex-1 min-w-0 text-base text-slate-700 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0"
            aria-label="Close search"
          >
            <FaTimes size={12} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {!trimmed ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">
              Start typing to search across jobs, internships and articles.
            </div>
          ) : isPrefetching ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">Searching...</div>
          ) : !hasAnyResults ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">No results for "{trimmed}"</div>
          ) : (
            <div className="py-2">
              {blogResults.length > 0 && (
                <ResultSection icon={<FaNewspaper size={11} />} label="Articles" results={blogResults} onSelect={goTo} />
              )}
              {internshipResults.length > 0 && (
                <ResultSection icon={<FaGraduationCap size={11} />} label="Internships" results={internshipResults} onSelect={goTo} />
              )}
              {jobResults.length > 0 && (
                <ResultSection icon={<FaBriefcase size={11} />} label="Government Jobs" results={jobResults} onSelect={goTo} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultSection({ icon, label, results, onSelect }) {
  return (
    <div className="px-2 py-1.5">
      <p className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
        {icon} {label}
      </p>
      {results.map((r) => (
        <button
          key={r.key}
          type="button"
          onClick={() => onSelect(r.url)}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
        >
          <p className="text-sm font-bold text-slate-800 truncate">{r.title}</p>
          {r.subtitle && <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>}
        </button>
      ))}
    </div>
  );
}
