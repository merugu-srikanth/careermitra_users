"use client";

import { useEffect, useState } from "react";
import { PUBLIC_API_BASE_URL } from "@/utils/api";
import { APPLICATION_STATUS_OPTIONS, SORT_OPTIONS, countActiveFilters } from "@/utils/jobFilters";

/**
 * Public jobs filter panel. Options + counts come from GET /api/jobs/filters
 * (Approved, open jobs), e.g. "Telangana (12)". District options follow the
 * chosen state and stream options follow the chosen qualification level.
 * Inline on desktop; a slide-in drawer on mobile.
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
  applicationStatus: "Status",
};

const SELECT =
  "w-full text-sm border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-gray-700 cursor-pointer " +
  "focus:outline-none focus:ring-2 focus:ring-orange-300 hover:border-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function useFilterOptions(jobType, state, qualificationLevel) {
  const [options, setOptions] = useState({});
  useEffect(() => {
    const params = new URLSearchParams({ jobType });
    if (state) params.set("state", state);
    if (qualificationLevel) params.set("qualificationLevel", qualificationLevel);
    let alive = true;
    fetch(`${PUBLIC_API_BASE_URL}/jobs/filters?${params}`)
      .then((r) => r.json())
      .then((json) => { if (alive && json?.success) setOptions(json.data?.options ?? {}); })
      .catch(() => {});
    return () => { alive = false; };
  }, [jobType, state, qualificationLevel]);
  return options;
}

function OptionSelect({ name, value, options = [], onChange, placeholder, disabled }) {
  const list = value && !options.some((o) => o.value === value) ? [...options, { value, count: null }] : options;
  return (
    <label className="block">
      <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{LABELS[name]}</span>
      <select value={value} onChange={(e) => onChange(name, e.target.value)} disabled={disabled} className={SELECT}>
        <option value="">{placeholder ?? `All`}</option>
        {list.map((o) => (
          <option key={o.value} value={o.value}>
            {o.count === null || o.count === undefined ? o.value : `${o.value} (${o.count})`}
          </option>
        ))}
      </select>
    </label>
  );
}

function Fields({ filters, sort, options, onChange, onSortChange }) {
  const stateChosen = filters.state && filters.state !== "All India";
  return (
    <>
      <OptionSelect name="state" value={filters.state} options={options.state} onChange={onChange} />
      {/* <OptionSelect name="district" value={filters.district} options={options.district} onChange={onChange}
        disabled={!stateChosen} placeholder={stateChosen ? "All districts" : "Pick a state first"} />
      <OptionSelect name="qualificationLevel" value={filters.qualificationLevel} options={options.qualificationLevel} onChange={onChange} />
      <OptionSelect name="qualificationStream" value={filters.qualificationStream} options={options.qualificationStream} onChange={onChange}
        disabled={!filters.qualificationLevel || !(options.qualificationStream?.length || filters.qualificationStream)}
        placeholder={filters.qualificationLevel ? "All streams" : "Pick a qualification first"} /> */}
      {/* <OptionSelect name="jobCategory" value={filters.jobCategory} options={options.jobCategory} onChange={onChange} /> */}
      <OptionSelect name="sector" value={filters.sector} options={options.sector} onChange={onChange} />
      <OptionSelect name="language" value={filters.language} options={options.language} onChange={onChange} />
      {/* <label className="block">
        <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Your age</span>
        <input type="number" inputMode="numeric" min="14" max="70" value={filters.age}
          onChange={(e) => onChange("age", e.target.value.replace(/\D/g, "").slice(0, 3))}
          placeholder="e.g. 24" className={SELECT + " cursor-text"} />
      </label> */}
      <label className="block">
        <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Application status</span>
        <select value={filters.applicationStatus} onChange={(e) => onChange("applicationStatus", e.target.value)} className={SELECT}>
          {APPLICATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Sort by</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)} className={SELECT}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      {stateChosen && (
        <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2 lg:col-span-1 self-end pb-2.5 cursor-pointer">
          <input type="checkbox" checked={filters.includeAllIndia} onChange={(e) => onChange("includeAllIndia", e.target.checked)}
            className="w-4 h-4 accent-orange-500" />
          Include All-India jobs
        </label>
      )}
    </>
  );
}

function ActiveChips({ filters, onChange }) {
  const chips = Object.keys(LABELS)
    .filter((key) => filters[key] !== "" && filters[key] !== undefined)
    .map((key) => ({
      key,
      text: key === "age" ? `Age ${filters.age}`
        : key === "applicationStatus" ? APPLICATION_STATUS_OPTIONS.find((o) => o.value === filters.applicationStatus)?.label
        : filters[key],
    }));
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button key={c.key} type="button" onClick={() => onChange(c.key, "")}
          className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-orange-100"
          aria-label={`Remove ${LABELS[c.key]} filter`}>
          {c.text} <span aria-hidden className="text-orange-400">×</span>
        </button>
      ))}
    </div>
  );
}

export default function JobFilterPanel({ filters, sort, onChange, onSortChange, onClear, jobType = "jobs", resultCount }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const options = useFilterOptions(jobType, filters.state === "All India" ? "" : filters.state, filters.qualificationLevel);
  const active = countActiveFilters(filters);

  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = original; window.removeEventListener("keydown", onKey); };
  }, [drawerOpen]);

  const fieldProps = { filters, sort, options, onChange, onSortChange };

  return (
    <div className="mb-6 space-y-3">
      {/* Mobile: button + drawer */}
      <div className="md:hidden flex items-center gap-2">
        <button type="button" onClick={() => setDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm">
          Filters & sort{active > 0 && <span className="bg-orange-500 text-white text-[11px] rounded-full px-2 py-0.5">{active}</span>}
        </button>
        {active > 0 && (
          <button type="button" onClick={onClear} className="px-3 py-2.5 text-sm font-bold text-orange-600">Clear all</button>
        )}
      </div>
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Job filters">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-black text-gray-800">Filters & sort</p>
              <button type="button" onClick={() => setDrawerOpen(false)} className="text-gray-400 text-2xl leading-none px-2" aria-label="Close filters">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4"><Fields {...fieldProps} /></div>
            <div className="flex gap-2 p-4 border-t border-gray-100">
              <button type="button" onClick={onClear} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600">Clear all</button>
              <button type="button" onClick={() => setDrawerOpen(false)} className="flex-[2] py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold">
                Show {resultCount ?? ""} jobs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: inline grid */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-800">Filter jobs</p>
          {active > 0 && <button type="button" onClick={onClear} className="text-sm font-bold text-orange-600 hover:text-orange-700">Clear all</button>}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3"><Fields {...fieldProps} /></div>
      </div>

      <ActiveChips filters={filters} onChange={onChange} />
    </div>
  );
}
