"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, X, Flame, Wallet, Home, GraduationCap, Landmark, Code2, MapPin, BookOpen, Briefcase, IndianRupee, Clock,
  SlidersHorizontal, ChevronDown, Check, ArrowUpDown, Trash2, Loader2, LayoutGrid, Table2,
} from "lucide-react";
import InternshipCard from "./InternshipCard";
import InternshipTable from "./InternshipTable";
import { InternshipTableSkeleton, InternshipCardSkeleton } from "@/components/skeletons/Skeletons";
import MoreFiltersPanel from "./MoreFiltersPanel";
import { API_BASE_URL } from "@/utils/api";
import { generateTableSchema } from "@/utils/schemaHelpers";
import {
  EDUCATION_OPTIONS, SKILL_OPTIONS, INTERNSHIP_TYPE_OPTIONS, STIPEND_OPTIONS, DURATION_OPTIONS, SORT_OPTIONS,
  EMPTY_FINDER_FILTERS, readInternship, filterInternships, sortInternships, locationOptions, activeFilterChips,
  removeFilter, toggleIn, nearestState,
} from "@/utils/internshipFinder";

/**
 * /internships — search, quick filters, main filters, "More Filters",
 * applied-filter chips, count, sort and the list. Every open internship is
 * loaded once (a few pages of 100) and filtered in the browser, so filters
 * combine freely and respond instantly. Expired ones load only when asked.
 */

const API = `${API_BASE_URL}/internships`;
const PAGE = 20;
const VIEW_KEY = "cm_internship_view";

// ── Loading ───────────────────────────────────────────────────────────────────

async function fetchAllPages(params, onProgress) {
  const url = (page) => `${API}?${new URLSearchParams({ ...params, page, limit: 100, sort: "newest" })}`;
  const first = await fetch(url(1)).then((r) => r.json());
  if (!first?.success) throw new Error(first?.message || "Failed to load internships");
  let items = first.data?.internships ?? [];
  const pages = first.data?.pagination?.totalPages ?? 1;
  onProgress?.(1, pages);
  // A few requests at a time so the API isn't flooded.
  for (let start = 2; start <= pages; start += 6) {
    const batch = [];
    for (let p = start; p < start + 6 && p <= pages; p++) batch.push(fetch(url(p)).then((r) => r.json()).catch(() => null));
    for (const res of await Promise.all(batch)) if (res?.success) items = items.concat(res.data?.internships ?? []);
    onProgress?.(Math.min(start + 5, pages), pages);
  }
  return items;
}

const mergeById = (...lists) => {
  const seen = new Map();
  for (const list of lists) for (const item of list) if (item?.id && !seen.has(item.id)) seen.set(item.id, item);
  return [...seen.values()];
};

// ── Small pieces ──────────────────────────────────────────────────────────────

/** A filter-bar button with a dropdown menu under it. */
function FilterMenu({ Icon, label, summary, active, children, wide }) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const ref = useRef(null);
  const toggleOpen = () => {
    // Open towards the left when the menu would run off the right edge (right-hand column on phones).
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setAlignRight(rect.left + (wide ? 288 : 240) > window.innerWidth - 8);
    setOpen((v) => !v);
  };
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0">
      <button type="button" onClick={toggleOpen} aria-expanded={open}
        className={`w-full h-14 flex items-center gap-3 rounded-xl border bg-white px-3.5 text-left transition-colors ${open || active
          ? "border-orange-300 ring-2 ring-orange-100" : "border-slate-200 hover:border-orange-200"}`}>
        <Icon className={`w-5 h-5 shrink-0 ${active ? "text-orange-500" : "text-slate-500"}`} />
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-bold text-slate-900 leading-tight">{label}</span>
          <span className={`block text-xs truncate ${active ? "text-orange-600 font-semibold" : "text-slate-500"}`}>{summary}</span>
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute z-40 top-full mt-2 ${alignRight ? "right-0" : "left-0"} ${wide ? "w-72" : "w-60"} max-h-80 overflow-y-auto thin-scrollbar bg-white rounded-xl border border-slate-200 shadow-xl p-1.5`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function MenuItem({ selected, onClick, children, count, multi }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-left ${selected ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
      {multi && (
        <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${selected ? "bg-orange-500 border-orange-500" : "border-slate-300"}`}>
          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {count != null && <span className="text-[11px] text-slate-400">{count}</span>}
      {!multi && selected && <Check className="w-4 h-4 text-orange-500" />}
    </button>
  );
}

const multiSummary = (list) => (!list.length ? "All" : list.length === 1 ? list[0] : `${list.length} selected`);

function QuickChip({ Icon, iconCls, active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-medium transition-colors ${active
        ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/30"
        : "bg-white border-slate-200 text-slate-700 hover:border-orange-300"}`}>
      <Icon className={`w-4 h-4 ${active ? "text-white" : iconCls}`} />
      {children}
    </button>
  );
}

// ── Finder ────────────────────────────────────────────────────────────────────

export default function InternshipFinder({ initialInternships = [] }) {
  const [openItems, setOpenItems] = useState(() => initialInternships.filter((i) => !i.is_expired));
  const [expiredItems, setExpiredItems] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(true);
  const [expiredProgress, setExpiredProgress] = useState(null); // null | { done, total } | "done"
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(EMPTY_FINDER_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("relevant");
  const [visible, setVisible] = useState(PAGE);
  const [moreOpen, setMoreOpen] = useState(false);
  const [nearby, setNearby] = useState({ state: "", status: "" }); // status: "" | "locating" | "denied"
  const [view, setView] = useState("table"); // "table" | "cards" (phones always get cards)
  const closeMore = useCallback(() => setMoreOpen(false), []);

  // Open internships, once.
  useEffect(() => {
    let alive = true;
    fetchAllPages({ expired: "false" })
      .then((items) => { if (alive) setOpenItems((prev) => mergeById(items, prev)); })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoadingOpen(false));
    return () => { alive = false; };
  }, []);

  // Expired ones only when asked for (once).
  const expiredRequested = useRef(false);
  useEffect(() => {
    if (!filters.showExpired || expiredRequested.current) return;
    expiredRequested.current = true;
    fetchAllPages({ expired: "true" }, (done, total) => setExpiredProgress({ done, total }))
      .then((items) => setExpiredItems(items))
      .catch(() => {})
      .finally(() => setExpiredProgress("done"));
  }, [filters.showExpired]);

  // Remember the chosen view in this browser.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read after mount so server and first client render match
    try { const v = localStorage.getItem(VIEW_KEY); if (v === "cards" || v === "table") setView(v); } catch { /* private mode */ }
  }, []);
  const changeView = (v) => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch { /* private mode */ }
  };

  // Search follows typing (short pause).
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.q === searchInput.trim() ? f : { ...f, q: searchInput.trim() })), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  const rows = useMemo(() => mergeById(openItems, filters.showExpired ? expiredItems : []).map(readInternship), [openItems, expiredItems, filters.showExpired]);
  const results = useMemo(() => sortInternships(filterInternships(rows, filters), sort), [rows, filters, sort]);
  const locations = useMemo(() => locationOptions(rows.filter((r) => filters.showExpired || !r.expired)), [rows, filters.showExpired]);
  const chips = activeFilterChips(filters);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- back to the first page whenever the result set changes
  useEffect(() => { setVisible(PAGE); }, [filters, sort]);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const clearAll = () => { setFilters({ ...EMPTY_FINDER_FILTERS }); setSearchInput(""); };

  // ── Quick filters ──
  const toggleNearby = () => {
    if (nearby.state && filters.location === nearby.state) { update({ location: "" }); return; }
    if (nearby.state) { update({ location: nearby.state }); return; }
    if (!navigator.geolocation) { setNearby({ state: "", status: "denied" }); return; }
    setNearby({ state: "", status: "locating" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const state = nearestState(coords.latitude, coords.longitude);
        setNearby({ state, status: "" });
        update({ location: state });
      },
      () => setNearby({ state: "", status: "denied" }),
      { timeout: 8000, maximumAge: 600000 },
    );
  };
  const quick = [
    { id: "closing", label: "Closing Soon", Icon: Flame, iconCls: "text-red-500", active: filters.deadline === "7", toggle: () => update({ deadline: filters.deadline === "7" ? "" : "7" }) },
    { id: "paid", label: "Paid", Icon: Wallet, iconCls: "text-amber-500", active: filters.stipend === "paid", toggle: () => update({ stipend: filters.stipend === "paid" ? "" : "paid" }) },
    { id: "wfh", label: "Work From Home", Icon: Home, iconCls: "text-emerald-600", active: filters.workModes.includes("Work From Home"), toggle: () => update({ workModes: toggleIn(filters.workModes, "Work From Home") }) },
    { id: "fresher", label: "Fresher", Icon: GraduationCap, iconCls: "text-blue-600", active: filters.fresher, toggle: () => update({ fresher: !filters.fresher }) },
    { id: "gov", label: "Government", Icon: Landmark, iconCls: "text-blue-700", active: filters.government, toggle: () => update({ government: !filters.government }) },
    { id: "it", label: "IT / Software", Icon: Code2, iconCls: "text-violet-600", active: filters.it, toggle: () => update({ it: !filters.it }) },
    { id: "nearby", label: nearby.status === "locating" ? "Locating…" : nearby.state ? `Nearby · ${nearby.state}` : "Nearby", Icon: MapPin, iconCls: "text-red-500", active: Boolean(nearby.state) && filters.location === nearby.state, toggle: toggleNearby },
  ];

  const tableSchema = useMemo(() => {
    const shown = results.slice(0, PAGE);
    if (!shown.length) return null;
    return generateTableSchema({
      name: "Internship Opportunities",
      description: "Verified internship opportunities across states, sectors, and roles listed on Career Mitra.",
      url: "/internships",
      headers: ["#", "Internship Title", "Company", "Type", "Location", "Stipend", "Duration"],
      rows: shown.map(({ item, amount }, idx) => [
        String(idx + 1), item.internship_title || "N/A", item.company_name || "N/A", item.internship_type || "N/A",
        item.location || [item.district_city, item.state].filter(Boolean).join(", ") || "N/A",
        amount > 0 ? (item.stipend || `₹${amount}`) : "Unpaid", item.duration || "N/A",
      ]),
    });
  }, [results]);

  const loadingFirst = loadingOpen && openItems.length === 0;
  const total = results.length;
  const activeCount = useMemo(() => results.filter((r) => !r.expired).length, [results]);

  return (
    <div className="space-y-4">
      {tableSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema).replace(/</g, "\\u003c") }} />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search company, skill, role or internship…"
          aria-label="Search internships"
          className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-white text-[15px] text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
        />
        {searchInput && (
          <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick filters */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {quick.map(({ id, label, Icon, iconCls, active, toggle }) => (
          <QuickChip key={id} Icon={Icon} iconCls={iconCls} active={active} onClick={toggle}>{label}</QuickChip>
        ))}
      </div>
      {nearby.status === "denied" && (
        <p className="text-xs text-slate-500 -mt-2">Couldn&apos;t get your location — pick a state under <b>Location</b> instead.</p>
      )}

      {/* Main filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2.5">
        <FilterMenu Icon={BookOpen} label="Education" summary={multiSummary(filters.education)} active={filters.education.length > 0}>
          {() => EDUCATION_OPTIONS.map((o) => (
            <MenuItem key={o.value} multi selected={filters.education.includes(o.value)} onClick={() => update({ education: toggleIn(filters.education, o.value) })}>{o.label}</MenuItem>
          ))}
        </FilterMenu>
        <FilterMenu Icon={Code2} label="Domain / Skills" summary={multiSummary(filters.skills)} active={filters.skills.length > 0}>
          {() => SKILL_OPTIONS.map((o) => (
            <MenuItem key={o.value} multi selected={filters.skills.includes(o.value)} onClick={() => update({ skills: toggleIn(filters.skills, o.value) })}>{o.value}</MenuItem>
          ))}
        </FilterMenu>
        <FilterMenu Icon={Briefcase} label="Type" summary={filters.type || "All"} active={Boolean(filters.type)} wide>
          {(close) => ["", ...INTERNSHIP_TYPE_OPTIONS].map((v) => (
            <MenuItem key={v || "all"} selected={filters.type === v} onClick={() => { update({ type: v }); close(); }}>{v || "All types"}</MenuItem>
          ))}
        </FilterMenu>
        <FilterMenu Icon={IndianRupee} label="Stipend" summary={STIPEND_OPTIONS.find((o) => o.value === filters.stipend)?.label || "All"} active={Boolean(filters.stipend)}>
          {(close) => [{ value: "", label: "All" }, ...STIPEND_OPTIONS].map((o) => (
            <MenuItem key={o.value || "all"} selected={filters.stipend === o.value} onClick={() => { update({ stipend: o.value }); close(); }}>{o.label}</MenuItem>
          ))}
        </FilterMenu>
        <FilterMenu Icon={Clock} label="Duration" summary={DURATION_OPTIONS.find((o) => o.value === filters.duration)?.label || "All"} active={Boolean(filters.duration)}>
          {(close) => [{ value: "", label: "All" }, ...DURATION_OPTIONS].map((o) => (
            <MenuItem key={o.value || "all"} selected={filters.duration === o.value} onClick={() => { update({ duration: o.value }); close(); }}>{o.label}</MenuItem>
          ))}
        </FilterMenu>
        <FilterMenu Icon={MapPin} label="Location" summary={filters.location || "All"} active={Boolean(filters.location)} wide>
          {(close) => [{ value: "" }, ...locations].map((o) => (
            <MenuItem key={o.value || "all"} selected={filters.location === o.value} count={o.count}
              onClick={() => { update({ location: o.value }); close(); }}>{o.value || "All locations"}</MenuItem>
          ))}
        </FilterMenu>
        <button type="button" onClick={() => setMoreOpen(true)}
          className="h-14 col-span-2 md:col-span-1 inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-sm font-bold hover:bg-orange-100 transition-colors">
          <SlidersHorizontal className="w-4 h-4" /> More Filters
          {chips.length > 0 && <span className="bg-orange-500 text-white text-[11px] rounded-full px-1.5 py-px">{chips.length}</span>}
        </button>
      </div>

      {/* Applied filters */}
      {(chips.length > 0 || filters.q) && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-orange-50/60 border border-orange-100 px-4 py-3">
          <span className="text-sm font-bold text-slate-800 mr-1">Active Filters:</span>
          {filters.q && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-orange-200 px-2.5 py-1 text-[13px] text-slate-700">
              “{filters.q}”
              <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search" className="text-slate-400 hover:text-orange-600"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {chips.map((c) => (
            <span key={`${c.key}-${c.value ?? ""}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-orange-200 px-2.5 py-1 text-[13px] text-slate-700">
              {c.label}
              <button type="button" onClick={() => setFilters((f) => removeFilter(f, c))} aria-label={`Remove ${c.label}`} className="text-slate-400 hover:text-orange-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button type="button" onClick={clearAll} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
            Clear All <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Count + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-lg sm:text-xl text-slate-800">
          {/* The big number is the active (open) internships; expired ones are listed after them. */}
          <span className="font-black text-2xl sm:text-3xl text-orange-600">{loadingFirst ? "…" : activeCount.toLocaleString("en-IN")}</span>{" "}
          <span className="font-bold">active internship{activeCount === 1 ? "" : "s"}</span>
          {loadingOpen && !loadingFirst && <Loader2 className="inline w-4 h-4 ml-2 animate-spin text-slate-400" aria-label="Loading more" />}
          {!loadingFirst && total > activeCount && (
            <span className="block sm:inline sm:ml-2 text-xs font-semibold text-slate-500">
              + {(total - activeCount).toLocaleString("en-IN")} expired · {total.toLocaleString("en-IN")} total
            </span>
          )}
        </p>
        <div className="flex items-center gap-2.5">
        <div className="hidden md:inline-flex items-center rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="View">
          {[{ v: "table", label: "Table", Icon: Table2 }, { v: "cards", label: "Cards", Icon: LayoutGrid }].map(({ v, label, Icon }) => (
            <button key={v} type="button" onClick={() => changeView(v)} aria-pressed={view === v}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-bold transition-colors ${view === v ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:text-orange-600"}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="font-semibold text-slate-600">Sort by:</span>
          <span className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="h-11 pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-orange-400">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </span>
        </label>
        </div>
      </div>

      {filters.showExpired && expiredProgress && expiredProgress !== "done" && (
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading expired internships… {expiredProgress.done}/{expiredProgress.total}
        </p>
      )}

      {/* List */}
      {error && !openItems.length ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">Couldn&apos;t load internships. Please refresh the page.</div>
      ) : loadingFirst ? (
        <>
          {view === "table" && <div className="hidden md:block"><InternshipTableSkeleton /></div>}
          <div className={view === "table" ? "md:hidden" : ""}><InternshipCardSkeleton /></div>
        </>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-base font-bold text-slate-800">No internships match these filters</p>
          <p className="text-sm text-slate-500 mt-1">Try removing a filter or two.</p>
          <button type="button" onClick={clearAll} className="mt-4 h-10 px-5 rounded-xl bg-orange-500 text-white text-sm font-bold">Clear all filters</button>
        </div>
      ) : (
        <div className="space-y-3">
          {view === "table" && (
            <div className="hidden md:block">
              <InternshipTable rows={results.slice(0, visible)} />
            </div>
          )}
          <div className={`space-y-3 ${view === "table" ? "md:hidden" : ""}`}>
            {results.slice(0, visible).map((r, idx) => (
              <InternshipCard key={r.item.id} r={r} colorIndex={idx} />
            ))}
          </div>
          {visible < total && (
            <div className="text-center pt-2">
              <button type="button" onClick={() => setVisible((v) => v + PAGE)}
                className="h-11 px-8 rounded-xl border border-orange-200 bg-white text-orange-700 text-sm font-bold hover:bg-orange-50">
                Show more ({(total - visible).toLocaleString("en-IN")} left)
              </button>
            </div>
          )}
        </div>
      )}

      <MoreFiltersPanel open={moreOpen} filters={filters} onApply={setFilters} onClose={closeMore} />
    </div>
  );
}
