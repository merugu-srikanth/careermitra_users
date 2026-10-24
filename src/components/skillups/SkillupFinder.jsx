"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Layers, Building2, ArrowDownUp, Eye, ExternalLink, AlertCircle, Check, Rocket } from "lucide-react";
import FilterDropdown from "@/components/jobs/FilterDropdown";
import { SkillupCardsSkeleton, SkillupTableSkeleton } from "@/components/skeletons/Skeletons";
import {
  ListingShell, ListingHeader, ListingSearch, CountTabs, ViewToggle, MiniPager, Pagination, FilterPills,
  SidebarCard, SideField, ResetButton, MobileFilterBar, MobileFilterSheet, ScrollArrows, TH, TD, THEAD,
} from "@/components/listing/ListingKit";
import { formatISTDateNumeric } from "@/utils/istDate";

/**
 * SkillUps tab of /internships — same layout as the jobs page: filters on the
 * left, header with search, status tabs with counts, table or cards with pages.
 * `items` are already mapped (see mapDynamicSkillUp in InternshipsClient).
 */

const PAGE = 20;
const VIEW_KEY = "cm_skillup_view";
const fmtDate = (v) => (v ? formatISTDateNumeric(v) || v : "-");
const normalizeLink = (link) => (!link ? null : link.startsWith("http") ? link : `https://${link}`);

const STATUS_TABS = [
  { id: "all", label: "All SkillUps", test: () => true },
  { id: "active", label: "Active", test: (s) => !s.isExpired },
  { id: "expired", label: "Expired", test: (s) => s.isExpired },
];
const SORTS = [
  { value: "newest", label: "Latest posted" },
  { value: "deadline", label: "Deadline (soonest)" },
  { value: "title", label: "Title (A–Z)" },
];
const time = (v) => { const t = v ? new Date(v).getTime() : NaN; return Number.isNaN(t) ? null : t; };
const EMPTY = { category: "", org: "" };

function StatusBadge({ expired }) {
  return expired ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
      <AlertCircle className="w-3 h-3" /> Expired
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Check className="w-3 h-3" /> Active
    </span>
  );
}

export default function SkillupFinder({ items = [], loading, error, onRetry, switcher, onSelect, onSwitchToInternships }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY);
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("table");
  const [sheetOpen, setSheetOpen] = useState(false);
  const listTopRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read after mount so server and first client render match
    try { const v = localStorage.getItem(VIEW_KEY); if (v === "cards" || v === "table") setView(v); } catch { /* private mode */ }
  }, []);
  const changeView = (v) => { setView(v); try { localStorage.setItem(VIEW_KEY, v); } catch { /* private mode */ } };

  const categories = useMemo(() => [...new Set(items.map((s) => s.category).filter(Boolean))].sort(), [items]);
  const orgs = useMemo(() => [...new Set(items.map((s) => s.org).filter(Boolean))].sort(), [items]);

  const filtered = useMemo(() => {
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return items.filter((s) => {
      if (filters.category && s.category !== filters.category) return false;
      if (filters.org && s.org !== filters.org) return false;
      if (!words.length) return true;
      const hay = [s.title, s.org, s.category, s.qualifications].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, filters, search]);
  const tabCounts = useMemo(() => Object.fromEntries(STATUS_TABS.map((t) => [t.id, filtered.filter(t.test).length])), [filtered]);
  const results = useMemo(() => {
    const list = filtered.filter(STATUS_TABS.find((t) => t.id === tab).test);
    const openFirst = (a, b) => Number(a.isExpired) - Number(b.isExpired);
    if (sort === "title") return list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "deadline") return list.sort((a, b) => openFirst(a, b) || (time(a.deadline) ?? 9e15) - (time(b.deadline) ?? 9e15));
    return list.sort((a, b) => openFirst(a, b) || (time(b.postedDate) ?? 0) - (time(a.postedDate) ?? 0));
  }, [filtered, tab, sort]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- back to page 1 whenever the result set changes
  useEffect(() => { setPage(1); }, [filters, search, tab, sort]);

  const clearAll = () => { setFilters(EMPTY); setSearch(""); setTab("all"); };
  const chips = [
    ...(search.trim() ? [{ key: "q", label: `“${search.trim()}”` }] : []),
    ...(filters.category ? [{ key: "category", label: filters.category }] : []),
    ...(filters.org ? [{ key: "org", label: filters.org }] : []),
  ];
  const removeChip = (c) => (c.key === "q" ? setSearch("") : setFilters((f) => ({ ...f, [c.key]: "" })));

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE));
  const shown = results.slice((page - 1) * PAGE, page * PAGE);
  const goTo = (p, scroll = false) => {
    setPage(Math.min(totalPages, Math.max(1, p)));
    if (scroll) listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const firstLoad = loading && items.length === 0;

  const fields = (
    <>
      <SideField Icon={Layers} label="Category" highlight={Boolean(filters.category)}>
        <FilterDropdown ariaLabel="Category" value={filters.category} onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
          options={[{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c, label: c }))]} highlight clearable />
      </SideField>
      <SideField Icon={Building2} label="Provider / Source" highlight={Boolean(filters.org)}>
        <FilterDropdown ariaLabel="Provider" value={filters.org} onChange={(v) => setFilters((f) => ({ ...f, org: v }))}
          options={[{ value: "", label: "All Providers" }, ...orgs.map((o) => ({ value: o, label: o }))]} highlight clearable />
      </SideField>
      <SideField Icon={ArrowDownUp} label="Sort by">
        <FilterDropdown ariaLabel="Sort by" value={sort} onChange={setSort} options={SORTS} />
      </SideField>
    </>
  );

  return (
    <ListingShell sidebarLabel="Filter SkillUps" sidebar={
      <SidebarCard title="Filter SkillUps" onClearAll={clearAll} footer={<ResetButton onClick={clearAll} />}>{fields}</SidebarCard>
    }>
      <ListingHeader
        title="Explore" highlight="SkillUps"
        subtitle="Accredited skill development programs, certifications and government upskilling courses."
        bar={switcher}
        search={<ListingSearch value={search} onChange={setSearch} placeholder="Search course, skill or provider (e.g. Yoga, Computing, Poultry)…" ariaLabel="Search SkillUps" />}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <CountTabs tabs={STATUS_TABS.map((t) => ({ ...t, count: firstLoad ? null : tabCounts[t.id] }))} value={tab} onChange={setTab} ariaLabel="Status" />
        <div className="shrink-0 flex items-center justify-end gap-1.5 sm:ml-auto">
          <ViewToggle value={view} onChange={changeView} />
        </div>
      </div>

      <MobileFilterBar chips={chips} onOpen={() => setSheetOpen(true)} onRemove={removeChip} />

      <div ref={listTopRef} className="scroll-mt-28 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
        <p className="shrink-0 text-xs text-gray-500 text-center sm:text-left">
          {firstLoad ? "Loading SkillUps…" : (
            <>
              Showing <span className="font-bold text-gray-800">{shown.length}</span> of{" "}
              <span className="font-bold text-gray-800">{total}</span> SkillUps
              <span className="text-gray-400"> • Page {page} of {totalPages}</span>
            </>
          )}
        </p>
        <div className="flex items-center justify-center lg:justify-end gap-3 min-w-0">
          <div className="hidden lg:block min-w-0"><FilterPills chips={chips} onRemove={removeChip} onClearAll={clearAll} /></div>
          <MiniPager page={page} total={totalPages} onChange={(p) => goTo(p)} />
        </div>
      </div>

      {firstLoad ? (
        view === "table" ? <><div className="hidden md:block"><SkillupTableSkeleton /></div><div className="md:hidden"><SkillupCardsSkeleton /></div></> : <SkillupCardsSkeleton />
      ) : error && items.length === 0 ? (
        <div className="bg-red-50/50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          <p className="font-bold">{error}</p>
          <button type="button" onClick={onRetry} className="mt-3 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold">Retry loading SkillUps</button>
        </div>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-base font-bold text-gray-800">No SkillUps found</p>
          <p className="text-sm text-gray-500 mt-1">{search ? `No courses matching “${search}”. Try another keyword.` : "Try removing a filter or two."}</p>
          <button type="button" onClick={clearAll} className="mt-4 h-10 px-5 rounded-xl bg-orange-500 text-white text-sm font-bold">Clear all filters</button>
        </div>
      ) : (
        <>
          {view === "table" && (
            <div className="hidden md:block">
              <ScrollArrows deps={[shown]}>
                <table className="w-full min-w-[820px] table-fixed">
                  <thead className={THEAD}>
                    <tr>
                      <th scope="col" className={`${TH} w-12`}>S No</th>
                      <th scope="col" className={`${TH} w-[30%]`}>SkillUp Title</th>
                      <th scope="col" className={`${TH} w-[15%]`}>Provider</th>
                      <th scope="col" className={`${TH} w-[13%]`}>Category</th>
                      <th scope="col" className={`${TH} w-[16%]`}>Eligibility</th>
                      <th scope="col" className={`${TH} w-[11%]`}>Deadline</th>
                      <th scope="col" className={`${TH} w-[13%] text-center`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {shown.map((s, idx) => (
                      <tr key={s.id} onClick={() => onSelect(s)} className={`group cursor-pointer hover:bg-orange-50/30 transition-colors ${s.isExpired ? "opacity-75" : ""}`}>
                        <td className={`${TD} text-sm text-gray-400 font-mono`}>{(page - 1) * PAGE + idx + 1}</td>
                        <td className={TD}>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">{s.title}</p>
                          <p className="text-xs text-gray-400 mt-1">Posted: {fmtDate(s.postedDate)}</p>
                        </td>
                        <td className={TD}><span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-100 text-orange-800 line-clamp-2">{s.org}</span></td>
                        <td className={`${TD} text-[13px] text-gray-700`}><span className="line-clamp-2">{s.category}</span></td>
                        <td className={`${TD} text-[13px] text-gray-600`}><span className="line-clamp-3" title={s.qualifications}>{s.qualifications}</span></td>
                        <td className={TD}>
                          <span className={`block text-[13px] font-bold ${s.isExpired ? "text-gray-500" : "text-gray-800"}`}>{s.enrollmentEndText || fmtDate(s.deadline)}</span>
                          <span className="mt-1 inline-block"><StatusBadge expired={s.isExpired} /></span>
                        </td>
                        <td className={TD}>
                          <div className="flex flex-col gap-1.5">
                            <button type="button" onClick={(e) => { e.stopPropagation(); onSelect(s); }}
                              className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 rounded-md transition-colors">
                              View Details
                            </button>
                            {s.applyLink && !s.isExpired ? (
                              <a href={normalizeLink(s.applyLink)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                                className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded-md transition-colors">
                                Apply
                              </a>
                            ) : s.isExpired ? <span className="w-full text-center bg-gray-100 text-gray-400 text-xs font-bold py-1.5 rounded-md">Closed</span> : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArrows>
            </div>
          )}
          <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 ${view === "table" ? "md:hidden" : ""}`}>
            {shown.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-200/80 hover:border-orange-300 shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group">
                <div className="h-1 w-full bg-linear-to-r from-orange-500 via-amber-400 to-green-500" />
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 truncate">{s.org}</span>
                    <StatusBadge expired={s.isExpired} />
                  </div>
                  <button type="button" onClick={() => onSelect(s)} className="text-left text-sm font-bold text-gray-900 group-hover:text-orange-600 leading-snug line-clamp-2">{s.title}</button>
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mt-1.5"><Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="truncate">{s.category}</span></p>
                  <div className="mt-3 bg-gray-50 rounded-xl p-2.5 border border-gray-100 space-y-1 text-xs">
                    <div className="flex justify-between gap-2"><span className="text-[10px] uppercase font-bold text-gray-400">Eligibility</span><span className="font-semibold text-gray-700 truncate" title={s.qualifications}>{s.qualifications}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-[10px] uppercase font-bold text-gray-400">Deadline</span><span className="font-semibold text-gray-700">{s.enrollmentEndText || fmtDate(s.deadline)}</span></div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                  <button type="button" onClick={() => onSelect(s)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100">
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                  {s.applyLink && !s.isExpired && (
                    <a href={normalizeLink(s.applyLink)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white">
                      Apply <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination current={page} total={totalPages} onChange={(p) => goTo(p, true)} />
        </>
      )}

      {/* Bottom callout */}
      <div className="mt-12 bg-linear-to-r from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-3">
          <Rocket className="w-3.5 h-3.5 text-amber-300" /> Government &amp; Accredited Upskilling Programs
        </div>
        <h2 className="text-xl sm:text-3xl font-black mb-2">Elevate Your Professional Credentials</h2>
        <p className="text-white/90 text-sm max-w-3xl mb-5">Access accredited vocational certifications, technology programs, and government-backed courses from SWAYAM, NPTEL, and the Ministry of Education.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => { clearAll(); listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            className="px-5 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-extrabold">View All SkillUps</button>
          <button type="button" onClick={onSwitchToInternships}
            className="px-5 py-2.5 bg-orange-700/50 hover:bg-orange-700 border border-white/30 rounded-xl text-sm font-extrabold">Switch to Internships</button>
        </div>
      </div>

      <MobileFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter SkillUps" resultCount={total} onReset={clearAll}>
        {fields}
      </MobileFilterSheet>
    </ListingShell>
  );
}
