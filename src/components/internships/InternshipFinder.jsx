"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Code2, Briefcase, IndianRupee, Clock, MapPin, CalendarDays, ArrowDownUp, GitBranch, Laptop, Eye, Loader2 } from "lucide-react";
import InternshipCard from "./InternshipCard";
import InternshipTable from "./InternshipTable";
import { InternshipTableSkeleton, InternshipCardSkeleton } from "@/components/skeletons/Skeletons";
import FilterDropdown from "@/components/jobs/FilterDropdown";
import {
  ListingShell, ListingHeader, ListingSearch, CountTabs, Segment, ViewToggle, MiniPager, Pagination, FilterPills,
  SidebarCard, SideField, ResetButton, MobileFilterBar, MobileFilterSheet,
} from "@/components/listing/ListingKit";
import { API_BASE_URL } from "@/utils/api";
import { generateTableSchema } from "@/utils/schemaHelpers";
import {
  EDUCATION_OPTIONS, BRANCH_OPTIONS, SKILL_OPTIONS, WORK_MODE_OPTIONS, INTERNSHIP_TYPE_OPTIONS, STIPEND_OPTIONS, DURATION_OPTIONS,
  DEADLINE_OPTIONS, SORT_OPTIONS, EMPTY_FINDER_FILTERS, readInternship, filterInternships, sortInternships, locationOptions,
  activeFilterChips, removeFilter,
} from "@/utils/internshipFinder";

/**
 * /internships — jobs-page layout: filters on the left (sidebar / phone sheet),
 * header with search, count tabs, results table or cards with pages.
 * Every internship is loaded once and filtered in the browser, so filters
 * combine freely and respond instantly. Active ones first, expired last.
 */

const API = `${API_BASE_URL}/internships`;
const PAGE = 20;
const VIEW_KEY = "cm_internship_view";

// Tabs over the results; each shows how many internships it would list with the current filters.
const TABS = [
  { id: "all", label: "All Internships", test: () => true },
  { id: "paid", label: "Paid", test: (r) => r.paid },
  { id: "wfh", label: "Work From Home", test: (r) => r.workModes.has("Work From Home") },
  { id: "government", label: "Government", test: (r) => r.government },
  { id: "it", label: "IT / Software", test: (r) => r.it },
  { id: "expired", label: "Expired", test: (r) => r.expired },
];

const DEADLINE_SEGMENT = [
  { value: "", label: "All", title: "All internships" },
  { value: "7", label: "7 days", title: "Closing in 7 days" },
  { value: "30", label: "30 days", title: "Closing in 30 days" },
];

// ── Loading ───────────────────────────────────────────────────────────────────

async function fetchAllPages(params) {
  const url = (page) => `${API}?${new URLSearchParams({ ...params, page, limit: 100, sort: "newest" })}`;
  const first = await fetch(url(1)).then((r) => r.json());
  if (!first?.success) throw new Error(first?.message || "Failed to load internships");
  let items = first.data?.internships ?? [];
  const pages = first.data?.pagination?.totalPages ?? 1;
  // A few requests at a time so the API isn't flooded.
  for (let start = 2; start <= pages; start += 6) {
    const batch = [];
    for (let p = start; p < start + 6 && p <= pages; p++) batch.push(fetch(url(p)).then((r) => r.json()).catch(() => null));
    for (const res of await Promise.all(batch)) if (res?.success) items = items.concat(res.data?.internships ?? []);
  }
  return items;
}

const mergeById = (...lists) => {
  const seen = new Map();
  for (const list of lists) for (const item of list) if (item?.id && !seen.has(item.id)) seen.set(item.id, item);
  return [...seen.values()];
};

// ── Filter fields (sidebar + phone sheet) ─────────────────────────────────────

const opts = (list, allLabel = "All") => [{ value: "", label: allLabel }, ...list.map((o) => (typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value }))];
const join = (list) => list.join(",");
const split = (v) => String(v || "").split(",").filter(Boolean);
const multiLabel = (allLabel) => (v) => { const l = split(v); return !l.length ? allLabel : l.length <= 2 ? l.join(", ") : `${l.slice(0, 2).join(", ")} +${l.length - 2}`; };

function InternshipFields({ filters, update, locations, sort, setSort }) {
  const multi = (key, Icon, label, options, allLabel) => (
    <SideField Icon={Icon} label={label} highlight={filters[key].length > 0}>
      <FilterDropdown ariaLabel={label} value={join(filters[key])} onChange={(v) => update({ [key]: split(v) })}
        options={opts(options, allLabel)} multi multiLabel={multiLabel(allLabel)} highlight clearable />
    </SideField>
  );
  const single = (key, Icon, label, options, allLabel = "All") => (
    <SideField Icon={Icon} label={label} highlight={Boolean(filters[key])}>
      <FilterDropdown ariaLabel={label} value={filters[key]} onChange={(v) => update({ [key]: v })}
        options={opts(options, allLabel)} highlight clearable />
    </SideField>
  );
  return (
    <>
      {single("location", MapPin, "Location", locations.map((o) => o.value), "All locations")}
      {multi("education", BookOpen, "Education", EDUCATION_OPTIONS, "All education")}
      {multi("skills", Code2, "Domain / Skills", SKILL_OPTIONS, "All domains")}
      {multi("branches", GitBranch, "Branch", BRANCH_OPTIONS, "All branches")}
      {single("type", Briefcase, "Internship Type", INTERNSHIP_TYPE_OPTIONS, "All types")}
      {multi("workModes", Laptop, "Work Mode", WORK_MODE_OPTIONS, "All modes")}
      {single("stipend", IndianRupee, "Stipend", STIPEND_OPTIONS)}
      {single("duration", Clock, "Duration", DURATION_OPTIONS)}
      {single("deadline", CalendarDays, "Deadline", DEADLINE_OPTIONS.filter((o) => o.value))}
      <SideField Icon={Eye} label="Status" highlight={!filters.showExpired}>
        <FilterDropdown ariaLabel="Status" value={filters.showExpired ? "all" : "active"} onChange={(v) => update({ showExpired: v !== "active" })}
          options={[{ value: "all", label: "All (active first)" }, { value: "active", label: "Active only" }]} />
      </SideField>
      <SideField Icon={ArrowDownUp} label="Sort by">
        <FilterDropdown ariaLabel="Sort by" value={sort} onChange={setSort} options={SORT_OPTIONS} />
      </SideField>
    </>
  );
}

// ── Finder ────────────────────────────────────────────────────────────────────

export default function InternshipFinder({ initialInternships = [], switcher = null }) {
  const [openItems, setOpenItems] = useState(() => initialInternships.filter((i) => !i.is_expired));
  const [expiredItems, setExpiredItems] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(true);
  const [loadingExpired, setLoadingExpired] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(EMPTY_FINDER_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("relevant");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [view, setView] = useState("table"); // "table" | "cards" (phones always get cards)
  const listTopRef = useRef(null);

  // Open internships, once.
  useEffect(() => {
    let alive = true;
    fetchAllPages({ expired: "false" })
      .then((items) => { if (alive) setOpenItems((prev) => mergeById(items, prev)); })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoadingOpen(false));
    return () => { alive = false; };
  }, []);

  // Expired ones (listed after the active ones), once.
  const expiredRequested = useRef(false);
  useEffect(() => {
    if (!filters.showExpired || expiredRequested.current) return;
    expiredRequested.current = true;
    setLoadingExpired(true);
    fetchAllPages({ expired: "true" })
      .then((items) => setExpiredItems(items))
      .catch(() => {})
      .finally(() => setLoadingExpired(false));
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
  const filtered = useMemo(() => filterInternships(rows, filters), [rows, filters]);
  const tabCounts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, filtered.filter(t.test).length])), [filtered]);
  const results = useMemo(() => {
    const test = TABS.find((t) => t.id === tab)?.test ?? (() => true);
    return sortInternships(filtered.filter(test), sort);
  }, [filtered, tab, sort]);
  const locations = useMemo(() => locationOptions(rows.filter((r) => filters.showExpired || !r.expired)), [rows, filters.showExpired]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- back to page 1 whenever the result set changes
  useEffect(() => { setPage(1); }, [filters, sort, tab]);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const clearAll = () => { setFilters({ ...EMPTY_FINDER_FILTERS }); setSearchInput(""); setTab("all"); };

  const chips = [
    ...(filters.q ? [{ key: "q", label: `“${filters.q}”`, raw: { key: "q" } }] : []),
    ...activeFilterChips(filters)
      .filter((c) => !["fresher", "government", "it"].includes(c.key))
      .map((c) => ({ key: `${c.key}:${c.value ?? ""}`, label: c.label, raw: c })),
  ];
  const removeChip = ({ raw }) => {
    if (raw.key === "q") { setSearchInput(""); return; }
    setFilters((f) => removeFilter(f, raw));
  };

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE));
  const shown = results.slice((page - 1) * PAGE, page * PAGE);
  const activeCount = useMemo(() => results.filter((r) => !r.expired).length, [results]);
  const loadingFirst = loadingOpen && openItems.length === 0;
  const goTo = (p, scroll = false) => {
    setPage(Math.min(totalPages, Math.max(1, p)));
    if (scroll) listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tableSchema = useMemo(() => {
    const first = results.slice(0, PAGE);
    if (!first.length) return null;
    return generateTableSchema({
      name: "Internship Opportunities",
      description: "Verified internship opportunities across states, sectors, and roles listed on Career Mitra.",
      url: "/internships",
      headers: ["#", "Internship Title", "Company", "Type", "Location", "Stipend", "Duration"],
      rows: first.map(({ item, amount }, idx) => [
        String(idx + 1), item.internship_title || "N/A", item.company_name || "N/A", item.internship_type || "N/A",
        item.location || [item.district_city, item.state].filter(Boolean).join(", ") || "N/A",
        amount > 0 ? (item.stipend || `₹${amount}`) : "Unpaid", item.duration || "N/A",
      ]),
    });
  }, [results]);

  const fields = <InternshipFields filters={filters} update={update} locations={locations} sort={sort} setSort={setSort} />;

  return (
    <ListingShell sidebarLabel="Filter internships" sidebar={
      <SidebarCard title="Filter Internships" onClearAll={clearAll} footer={<ResetButton onClick={clearAll} />}>{fields}</SidebarCard>
    }>
      {tableSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema).replace(/</g, "\\u003c") }} />
      )}

      <ListingHeader
        title="Explore" highlight="Internships"
        subtitle="Verified virtual, paid and government internships to kickstart your career. Updated regularly."
        bar={switcher}
        search={<ListingSearch value={searchInput} onChange={setSearchInput} placeholder="Search company, skill, role or internship…" ariaLabel="Search internships" />}
      />

      {/* Tabs | deadline + view */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap sm:items-center sm:justify-between gap-2 mb-3">
        <CountTabs tabs={TABS.map((t) => ({ ...t, count: loadingFirst ? null : tabCounts[t.id] }))} value={tab} onChange={setTab} ariaLabel="Internship type" />
        <div className="shrink-0 flex items-center justify-end gap-1.5 sm:ml-auto">
          <div className="hidden lg:block">
            <Segment options={DEADLINE_SEGMENT} value={["", "7", "30"].includes(filters.deadline) ? filters.deadline : ""} onChange={(v) => update({ deadline: v })} />
          </div>
          <ViewToggle value={view} onChange={changeView} />
        </div>
      </div>

      <MobileFilterBar chips={chips} onOpen={() => setSheetOpen(true)} onRemove={removeChip} />

      {/* Count | pills | pager */}
      <div ref={listTopRef} className="scroll-mt-28 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
        <p className="shrink-0 text-xs text-gray-500 text-center sm:text-left">
          {loadingFirst ? "Loading internships…" : (
            <>
              Showing <span className="font-bold text-gray-800">{shown.length}</span> of{" "}
              <span className="font-bold text-orange-600">{activeCount.toLocaleString("en-IN")}</span> active internships
              {total > activeCount && <> + {(total - activeCount).toLocaleString("en-IN")} expired</>}
              <span className="text-gray-400"> • Page {page} of {totalPages}</span>
              {(loadingOpen || loadingExpired) && <Loader2 className="inline w-3.5 h-3.5 ml-1.5 animate-spin text-gray-400" aria-label="Loading more" />}
            </>
          )}
        </p>
        <div className="flex items-center justify-center lg:justify-end gap-3 min-w-0">
          <div className="hidden lg:block min-w-0"><FilterPills chips={chips} onRemove={removeChip} onClearAll={clearAll} /></div>
          <MiniPager page={page} total={totalPages} onChange={(p) => goTo(p)} />
        </div>
      </div>

      {/* List */}
      {error && !openItems.length ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">Couldn&apos;t load internships. Please refresh the page.</div>
      ) : loadingFirst ? (
        <>
          {view === "table" && <div className="hidden md:block"><InternshipTableSkeleton /></div>}
          <div className={view === "table" ? "md:hidden" : ""}><InternshipCardSkeleton /></div>
        </>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-base font-bold text-gray-800">No internships match these filters</p>
          <p className="text-sm text-gray-500 mt-1">Try removing a filter or two.</p>
          <button type="button" onClick={clearAll} className="mt-4 h-10 px-5 rounded-xl bg-orange-500 text-white text-sm font-bold">Clear all filters</button>
        </div>
      ) : (
        <>
          {view === "table" && (
            <div className="hidden md:block"><InternshipTable rows={shown} startIndex={(page - 1) * PAGE} /></div>
          )}
          <div className={`space-y-3 ${view === "table" ? "md:hidden" : ""}`}>
            {shown.map((r, idx) => <InternshipCard key={r.item.id} r={r} colorIndex={(page - 1) * PAGE + idx} />)}
          </div>
          <Pagination current={page} total={totalPages} onChange={(p) => goTo(p, true)} />
        </>
      )}

      <MobileFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter Internships" resultCount={total} onReset={clearAll}>
        <SideField Icon={CalendarDays} label="Closing">
          <Segment fullWidth options={DEADLINE_SEGMENT} value={["", "7", "30"].includes(filters.deadline) ? filters.deadline : ""} onChange={(v) => update({ deadline: v })} />
        </SideField>
        {fields}
      </MobileFilterSheet>
    </ListingShell>
  );
}
