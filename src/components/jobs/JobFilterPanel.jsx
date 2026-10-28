"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Filter, RotateCcw, LayoutGrid, MapPin, BriefcaseBusiness, FileText, Building2, Globe,
  CalendarDays, ArrowDownUp, Search, X, ChevronDown, ChevronRight, ArrowLeft, Map as MapIcon, Check,
} from "lucide-react";
import { ALL_INDIA, CLOSING_WITHIN_OPTIONS, SORT_OPTIONS, countActiveFilters, splitStates, joinStates, toggleState, statesLabel, statesFieldLabel } from "@/utils/jobFilters";
import FilterDropdown from "./FilterDropdown";

/**
 * Public jobs filters.
 *  - JobFilterSidebar: desktop, sticky on the left.
 *  - JobFilterMobileBar + JobFilterSheet: mobile, a "Filters (n)" bar with
 *    chips and a slide-up sheet (with its own state picker).
 * Both edit a draft that applies itself as soon as a filter is picked; every filter combines
 * with the others and with the tabs. Options come from GET /api/jobs/filters
 * (`options`); only values that have jobs are listed, without counts.
 *
 * A draft is { ...filters, category, sort } (category = source category id).
 */

const SELECT =
  "w-full h-8 text-xs border border-gray-200 bg-white rounded-lg pl-2.5 pr-7 text-gray-800 cursor-pointer appearance-none " +
  "focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 hover:border-orange-300 transition-colors";

const CHIP_LABELS = {
  state: "State", district: "District", experienceLevel: "Experience", employmentNature: "Employment",
  jobCategory: "Job Category", sector: "Sector", language: "Language", closingWithin: "Deadline",
};

const valuesOf = (list = [], current) => {
  const values = list.filter((o) => o.count > 0 || o.value === current).map((o) => o.value);
  if (current && !values.includes(current)) values.push(current);
  return values;
};

// "All India" is not listed as a state: the first choice ("All India", value "") already shows every job.
// `current` is the comma-separated selection — picked states stay listed even without open jobs.
const stateValues = (options, current) => {
  const picked = splitStates(current);
  const values = (options.state ?? []).filter((o) => o.count > 0 || picked.includes(o.value)).map((o) => o.value);
  return [...new Set([...values, ...picked])].filter((v) => v !== ALL_INDIA).sort((a, b) => (picked.includes(b) - picked.includes(a)) || a.localeCompare(b));
};

/** A deadline window reads best soonest-first; going back to "All open" restores latest. */
export function changeClosingWithin(value, sort, onChange, onSortChange) {
  onChange("closingWithin", value);
  if (value && sort === "latest") onSortChange("deadline");
  if (!value && sort === "deadline") onSortChange("latest");
}

/** "All open | Closing in 7 days | Closing in 30 days" — the results toolbar (desktop) and above the results (mobile). */
// Short labels for the compact (desktop toolbar) version.
const CLOSING_SHORT = { "": "All open", "7": "7 days", "30": "30 days" };

export function ClosingSegment({ value, onChange, fullWidth, compact = false }) {
  return (
    <div className={`${compact ? "h-8 p-0.5 gap-0.5" : "h-10 p-1 gap-1"} flex items-center bg-gray-100 rounded-xl ${fullWidth ? "w-full" : "w-fit"}`}>
        {CLOSING_WITHIN_OPTIONS.map((o) => (
        <button key={o.value || "all"} type="button" onClick={() => onChange(o.value)}
          title={compact ? o.label : undefined}
          className={`h-full flex-1 ${compact ? "px-2 text-[11px]" : "px-2.5 sm:px-3.5 text-[11px] sm:text-xs"} rounded-lg font-bold whitespace-nowrap transition-all ${value === o.value
            ? "bg-white shadow-sm text-orange-600"
            : "text-gray-500 hover:text-orange-500"}`}>
          {compact ? CLOSING_SHORT[o.value] ?? o.label : o.label}
        </button>
      ))}
    </div>
  );
}

// ── Draft ─────────────────────────────────────────────────────────────────────

/** Draft state that follows the applied filters until the user edits it. */
function useDraft(applied) {
  const appliedKey = JSON.stringify(applied);
  const [draft, setDraft] = useState(applied);
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- reset when the applied filters change elsewhere (tabs, chips, toolbar)
  useEffect(() => { setDraft(applied); }, [appliedKey]);

  const setField = (key, value) => setDraft((d) => {
    const next = { ...d, [key]: value };
    if (key === "state") {
      next.state = joinStates([value]); // several states, comma-separated; "All India" = none = every job
      next.district = "";
      next.includeAllIndia = true; // picked states + nationwide (All India) jobs
    }
    if (key === "closingWithin") {
      if (value && d.sort === "latest") next.sort = "deadline";
      if (!value && d.sort === "deadline") next.sort = "latest";
    }
    return next;
  });
  return [draft, setField, setDraft];
}

/**
 * Filters apply as soon as they are picked (no "Apply" click needed). A short
 * pause lets several quick picks (e.g. ticking 3 states) go out as one request.
 */
function useLiveApply(draft, applied, onApply) {
  const draftKey = JSON.stringify(draft);
  const appliedKey = JSON.stringify(applied);
  useEffect(() => {
    if (draftKey === appliedKey) return;
    const t = setTimeout(() => onApply(JSON.parse(draftKey)), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keys stand for draft / applied
  }, [draftKey, appliedKey]);
}

const draftCount = (draft) => countActiveFilters(draft) + (draft.category ? 1 : 0);

// ── Fields ────────────────────────────────────────────────────────────────────

function FieldRow({ Icon, label, highlight, children }) {
  return (
    <div className={highlight ? "-mx-1.5 px-1.5 py-1.5 rounded-lg bg-orange-50/70 ring-1 ring-orange-200" : ""}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
        <Icon size={13} strokeWidth={2} className={highlight ? "text-orange-500" : "text-gray-400"} />
        {label}
      </p>
      {children}
    </div>
  );
}

const toOptions = (values, allLabel = "All") => [{ value: "", label: allLabel }, ...values.map((v) => ({ value: v, label: v }))];

function OptionField({ Icon, label, name, draft, setField, options }) {
  return (
    <FieldRow Icon={Icon} label={label}>
      <FilterDropdown ariaLabel={label} value={draft[name]} onChange={(v) => setField(name, v)}
        options={toOptions(valuesOf(options[name], draft[name]))} />
    </FieldRow>
  );
}

/** State (one or more, checkboxes): highlighted when picked, with a clear button. Desktop = dropdown; mobile = opens the state picker. */
function StateField({ draft, setField, options, onOpenPicker }) {
  const picked = Boolean(draft.state);
  return (
    <FieldRow Icon={MapPin} label="State" highlight={picked}>
      {onOpenPicker ? (
        <div className="relative">
          <button type="button" onClick={onOpenPicker}
            className={`${SELECT} text-left ${picked ? "border-orange-300 font-medium" : "text-gray-500"}`}>
            {statesFieldLabel(draft.state)}
          </button>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      ) : (
        <FilterDropdown id="job-filter-state" ariaLabel="State" value={draft.state} onChange={(v) => setField("state", v)}
          options={toOptions(stateValues(options, draft.state), ALL_INDIA)} highlight clearable multi allAlwaysOn multiLabel={statesFieldLabel} />
      )}
    </FieldRow>
  );
}

function FilterFields({ draft, setField, options, categories, appliedState, onOpenStatePicker }) {
  // Districts are known for the applied state(s) only.
  const showDistrict = draft.state && draft.state === appliedState && options.district?.some((o) => o.count > 0);
  return (
    <div className="space-y-2.5">
      <FieldRow Icon={LayoutGrid} label="Category">
        <FilterDropdown ariaLabel="Category" value={draft.category} onChange={(v) => setField("category", v)}
          options={[{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
      </FieldRow>
      <StateField draft={draft} setField={setField} options={options} onOpenPicker={onOpenStatePicker} />
      {showDistrict && <OptionField Icon={MapIcon} label="District" name="district" {...{ draft, setField, options }} />}
      <OptionField Icon={BriefcaseBusiness} label="Experience" name="experienceLevel" {...{ draft, setField, options }} />
      <OptionField Icon={FileText} label="Employment Type" name="employmentNature" {...{ draft, setField, options }} />
      {/* Job Category — hidden for now
      <OptionField Icon={Layers} label="Job Category" name="jobCategory" {...{ draft, setField, options }} />
      */}
      <OptionField Icon={Building2} label="Sector" name="sector" {...{ draft, setField, options }} />
      <OptionField Icon={Globe} label="Language" name="language" {...{ draft, setField, options }} />
      {/* Qualification / Stream / Age — hidden for now */}
      <FieldRow Icon={CalendarDays} label="Deadline">
        <FilterDropdown ariaLabel="Deadline" value={draft.closingWithin} onChange={(v) => setField("closingWithin", v)}
          options={CLOSING_WITHIN_OPTIONS.map((o) => ({ value: o.value, label: o.value ? o.label : "All" }))} />
      </FieldRow>
      <FieldRow Icon={ArrowDownUp} label="Sort by">
        <FilterDropdown ariaLabel="Sort by" value={draft.sort} onChange={(v) => setField("sort", v)} options={SORT_OPTIONS} />
      </FieldRow>
    </div>
  );
}

/** Filters apply as they are picked; the main button only closes the mobile sheet ("Show results"). */
function FooterButtons({ draft, onReset, onDone }) {
  const n = draftCount(draft);
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onReset}
        className={`h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 text-xs font-semibold transition-colors ${onDone ? "" : "flex-1"}`}>
        <RotateCcw size={12} /> Reset filters
      </button>
      {onDone && (
        <button type="button" onClick={onDone}
          className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">
          <Search size={13} /> Show results{n > 0 ? ` (${n} filter${n > 1 ? "s" : ""})` : ""}
        </button>
      )}
    </div>
  );
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────

/**
 * @param applied   { ...filters, category, sort }
 * @param onApply   (draft) => void
 * @param onReset   back to the default view (Telangana)
 * @param onClearAll every filter off (all states)
 */
export default function JobFilterSidebar({ applied, options = {}, categories = [], onApply, onReset, onClearAll }) {
  const [draft, setField] = useDraft(applied);
  useLiveApply(draft, applied, onApply);
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm flex flex-col max-h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100">
        <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
          <Filter size={14} className="text-orange-500" /> Filter Jobs
        </p>
        <button type="button" onClick={onClearAll} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-orange-600">
          <RotateCcw size={12} /> Clear All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pl-3.5 pr-2.5 py-3 mr-1 thin-scrollbar">
        <FilterFields draft={draft} setField={setField} options={options} categories={categories} appliedState={applied.state} />
      </div>
      <div className="px-3.5 py-2.5 border-t border-gray-100">
        <FooterButtons draft={draft} onReset={onReset} />
      </div>
    </div>
  );
}

// ── Mobile ────────────────────────────────────────────────────────────────────

function activeChips(applied, categories) {
  // One chip per picked state (key "state:<name>" → × removes just that state).
  const stateChips = splitStates(applied.state).map((s) => ({ key: `state:${s}`, text: s, isState: true }));
  if (stateChips.length) stateChips.push({ key: "allIndia", text: ALL_INDIA, isState: true, fixed: true });
  const chips = Object.keys(CHIP_LABELS)
    .filter((key) => key !== "state" && applied[key])
    .map((key) => ({
      key,
      text: key === "closingWithin" ? CLOSING_WITHIN_OPTIONS.find((o) => o.value === applied.closingWithin)?.label : applied[key],
    }));
  const category = categories.find((c) => c.id === applied.category)?.name;
  if (category) chips.unshift({ key: "category", text: category });
  return [...stateChips, ...chips];
}

/** Desktop: the applied filters as small pills — × removes one. */
export function ActiveFilterPills({ applied, categories = [], onRemove, onClearAll }) {
  const chips = activeChips(applied, categories);
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {chips.map((c) => (
        <span key={c.key} className={`inline-flex items-center gap-1 rounded-full border pl-2.5 pr-1.5 py-0.5 text-xs font-medium ${c.isState
          ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-gray-200 text-gray-700"}`}>
          {c.text}
          {c.fixed ? <span className="w-1" /> : (
            <button type="button" onClick={() => onRemove(c.key)} aria-label={`Remove ${c.text}`}
              className="p-0.5 rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-100">
              <X size={11} />
            </button>
          )}
        </span>
      ))}
      {chips.filter((c) => !c.fixed).length > 1 && (
        <button type="button" onClick={onClearAll} className="text-xs font-semibold text-gray-500 hover:text-orange-600 px-1">Clear all</button>
      )}
    </div>
  );
}

/** "Filters (n) | Telangana × | Freshers × | >" — opens the sheet; × removes that filter. */
export function JobFilterMobileBar({ applied, categories = [], onOpen, onRemove }) {
  const chips = activeChips(applied, categories);
  return (
    <div className="flex items-center gap-2 bg-white border border-orange-300 rounded-2xl pl-3 pr-1.5 py-1.5 shadow-sm">
      <button type="button" onClick={onOpen} className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 py-1.5">
        <Filter size={16} /> Filters ({chips.filter((c) => !c.fixed).length})
      </button>
      <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {chips.map((c) => (
          <span key={c.key} className={`shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold ${c.isState
            ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
            {c.text}
            {!c.fixed && (
              <button type="button" onClick={() => onRemove(c.key)} aria-label={`Remove ${c.text}`} className="opacity-80 hover:opacity-100">
                <X size={13} />
              </button>
            )}
          </span>
        ))}
      </div>
      <button type="button" onClick={onOpen} aria-label="Open filters" className="shrink-0 p-1.5 text-orange-500">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

/**
 * Slide-up sheet. `view` = "filters" | "state" (state picker) | null (closed).
 * The state picker applies straight away ("Change state").
 */
export function JobFilterSheet({ view, onView, applied, options = {}, categories = [], onApply, onReset }) {
  const [draft, setField] = useDraft(applied);
  useLiveApply(draft, applied, onApply);
  const [query, setQuery] = useState("");
  const [cameFromFilters, setCameFromFilters] = useState(false);
  const open = Boolean(view);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onView(null);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = original; window.removeEventListener("keydown", onKey); };
  }, [open, onView]);

  const states = useMemo(() => {
    const q = query.trim().toLowerCase();
    // The applied states first (as on arrival: Telangana), then the rest A-Z.
    const first = splitStates(applied.state);
    const list = stateValues(options, draft.state).filter((v) => !first.includes(v));
    return [...first, ...list].filter((v) => !q || v.toLowerCase().includes(q));
  }, [options, draft.state, applied.state, query]);

  if (!open) return null;
  const close = () => { onView(null); setQuery(""); setCameFromFilters(false); };
  const done = () => { onApply(draft); close(); };

  return (
    <div className="lg:hidden fixed inset-0 z-90" role="dialog" aria-modal="true" aria-label="Filter jobs">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-3xl shadow-2xl flex flex-col">
        <div className="mx-auto mt-2.5 mb-1 h-1.5 w-12 rounded-full bg-gray-200" aria-hidden />

        {view === "state" ? (
          <>
            <div className="flex items-center gap-2 px-4 py-3">
              {cameFromFilters && (
                <button type="button" onClick={() => onView("filters")} className="p-1 -ml-1 text-gray-700" aria-label="Back to filters"><ArrowLeft size={20} /></button>
              )}
              <p className="flex-1 font-black text-gray-900 text-lg">Select States</p>
              <button type="button" onClick={close} className="p-1 text-gray-500" aria-label="Close"><X size={22} /></button>
            </div>
            <div className="px-4 pb-2">
              <label className="flex items-center gap-2 h-11 px-3 border border-gray-200 rounded-xl focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
                <Search size={17} className="text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search state..." className="flex-1 min-w-0 text-sm focus:outline-none" />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-2">
              {[...(!query.trim() || ALL_INDIA.toLowerCase().includes(query.trim().toLowerCase()) ? [""] : []), ...states].map((v) => {
                const active = v ? splitStates(draft.state).includes(v) : true; // All India jobs are always shown
                return (
                  <button key={v || "all"} type="button" onClick={() => setField("state", v ? toggleState(draft.state, v) : "")}
                    role="checkbox" aria-checked={active}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm text-left transition-colors ${active
                      ? "bg-orange-50 ring-1 ring-orange-300 font-semibold text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}>
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${active ? "border-orange-500 bg-orange-500" : "border-gray-300"}`}>
                      {active && <Check size={11} strokeWidth={3} className="text-white" />}
                    </span>
                    {v || ALL_INDIA}
                  </button>
                );
              })}
              {states.length === 0 && query && !ALL_INDIA.toLowerCase().includes(query.trim().toLowerCase()) && <p className="text-sm text-gray-400 text-center py-6">No state matches “{query}”.</p>}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button type="button" onClick={() => (cameFromFilters ? onView("filters") : done())}
                className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold">
                {cameFromFilters ? "Done" : "Show results"}{splitStates(draft.state).length > 1 ? ` (${splitStates(draft.state).length} states)` : ""}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3">
              <p className="flex items-center gap-2 font-black text-gray-900 text-lg"><Filter size={20} /> Filter Jobs</p>
              <button type="button" onClick={close} className="p-1 text-gray-500" aria-label="Close filters"><X size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-3">
              <FilterFields draft={draft} setField={setField} options={options} categories={categories} appliedState={applied.state}
                onOpenStatePicker={() => { setCameFromFilters(true); onView("state"); }} />
            </div>
            <div className="p-4 border-t border-gray-100">
              <FooterButtons draft={draft} onDone={done} onReset={() => { onReset(); close(); }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
