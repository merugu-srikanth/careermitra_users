"use client";

import { useEffect, useState } from "react";
import { CLOSING_WITHIN_OPTIONS, SORT_OPTIONS, countActiveFilters } from "@/utils/jobFilters";

/**
 * Public jobs filter bar (under the hero). State lives in the tabs above the
 * search, so it isn't repeated here. Options + counts come from
 * GET /api/jobs/filters (passed in as `options`); only values that have open
 * jobs are listed. Inline on desktop; a slide-in drawer on mobile.
 */

const LABELS = {
  state: "State",
  district: "District",
  qualificationLevel: "Qualification",
  qualificationStream: "Stream",
  jobCategory: "Job Category",
  sector: "Sector",
  language: "Language",
  experienceLevel: "Experience",
  employmentNature: "Employment",
  age: "Age",
  closingWithin: "Deadline",
};

const SELECT =
  "w-full h-11 text-sm border border-gray-200 bg-gray-50 rounded-xl px-3 text-gray-800 cursor-pointer " +
  "focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 hover:border-orange-300 transition-colors";

function FieldLabel({ children }) {
  return <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{children}</span>;
}

/** Only options that have jobs (count > 0), plus the current value if it came from a link. */
function OptionSelect({ name, value, options = [], onChange }) {
  const list = options.filter((o) => o.count > 0 || o.value === value);
  if (value && !list.some((o) => o.value === value)) list.push({ value, count: 0 });
  return (
    <label className="block min-w-0">
      <FieldLabel>{LABELS[name]}</FieldLabel>
      <select value={value} onChange={(e) => onChange(name, e.target.value)} className={SELECT}>
        <option value="">All</option>
        {list.map((o) => (
          <option key={o.value} value={o.value}>{o.count ? `${o.value} (${o.count})` : o.value}</option>
        ))}
      </select>
    </label>
  );
}

/** "All open | Closing in 7 days | Closing in 30 days" */
function ClosingSegment({ value, onChange, fullWidth }) {
  return (
    <div className="min-w-0">
      <FieldLabel>Deadline</FieldLabel>
      <div className={`h-11 flex items-center gap-1 bg-gray-100 p-1 rounded-xl ${fullWidth ? "w-full" : "w-fit"}`}>
        {CLOSING_WITHIN_OPTIONS.map((o) => (
          <button key={o.value || "all"} type="button" onClick={() => onChange(o.value)}
            className={`h-full flex-1 px-3.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${value === o.value
              ? "bg-white shadow-sm text-orange-600"
              : "text-gray-500 hover:text-orange-500"}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortSelect({ sort, onSortChange }) {
  return (
    <label className="block min-w-0">
      <FieldLabel>Sort by</FieldLabel>
      <select value={sort} onChange={(e) => onSortChange(e.target.value)} className={SELECT}>
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function ActiveChips({ filters, onChange, onClear }) {
  const chips = Object.keys(LABELS)
    .filter((key) => filters[key] !== "" && filters[key] !== undefined)
    .map((key) => ({
      key,
      text: key === "age" ? `Age ${filters.age}`
        : key === "closingWithin" ? CLOSING_WITHIN_OPTIONS.find((o) => o.value === filters.closingWithin)?.label
        : filters[key],
    }));
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button key={c.key} type="button" onClick={() => onChange(c.key, "")}
          className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-orange-100"
          aria-label={`Remove ${LABELS[c.key]} filter`}>
          {c.text} <span aria-hidden className="text-orange-400">×</span>
        </button>
      ))}
      <button type="button" onClick={onClear} className="text-xs font-bold text-gray-500 hover:text-orange-600 px-1">Clear all</button>
    </div>
  );
}

export default function JobFilterPanel({ filters, sort, options = {}, onChange, onSortChange, onClear, resultCount }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const active = countActiveFilters(filters);

  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = original; window.removeEventListener("keydown", onKey); };
  }, [drawerOpen]);

  // A deadline window reads best soonest-first; going back to "All open" restores latest.
  const changeClosing = (value) => {
    onChange("closingWithin", value);
    if (value && sort === "latest") onSortChange("deadline");
    if (!value && sort === "deadline") onSortChange("latest");
  };

  return (
    <div className="mb-6 space-y-3">
      {/* Mobile: button + drawer */}
      <div className="md:hidden flex items-center gap-2">
        <button type="button" onClick={() => setDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm">
          Filters & sort{active > 0 && <span className="bg-orange-500 text-white text-[11px] rounded-full px-2 py-0.5">{active}</span>}
        </button>
      </div>
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Job filters">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-black text-gray-800">Filters & sort</p>
              <button type="button" onClick={() => setDrawerOpen(false)} className="text-gray-400 text-2xl leading-none px-2" aria-label="Close filters">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <ClosingSegment value={filters.closingWithin} onChange={changeClosing} fullWidth />
              <OptionSelect name="sector" value={filters.sector} options={options.sector} onChange={onChange} />
              <OptionSelect name="language" value={filters.language} options={options.language} onChange={onChange} />
              <SortSelect sort={sort} onSortChange={onSortChange} />
            </div>
            <div className="flex gap-2 p-4 border-t border-gray-100">
              <button type="button" onClick={onClear} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600">Clear all</button>
              <button type="button" onClick={() => setDrawerOpen(false)} className="flex-[2] py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold">
                Show {resultCount ?? ""} jobs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: one aligned row */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
        <div className="flex items-end gap-4">
          <ClosingSegment value={filters.closingWithin} onChange={changeClosing} />
          <div className="flex-1 grid grid-cols-3 gap-4 min-w-0">
            <OptionSelect name="sector" value={filters.sector} options={options.sector} onChange={onChange} />
            <OptionSelect name="language" value={filters.language} options={options.language} onChange={onChange} />
            <SortSelect sort={sort} onSortChange={onSortChange} />
          </div>
        </div>
      </div>

      <ActiveChips filters={filters} onChange={onChange} onClear={onClear} />
    </div>
  );
}
