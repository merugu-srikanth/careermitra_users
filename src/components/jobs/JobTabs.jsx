"use client";

import { useState } from "react";
import { LayoutGrid, Sprout, BriefcaseBusiness, FileText, MapPin, Globe, ChevronDown, Check, X } from "lucide-react";

/**
 * Tabs above the jobs search bar: All / Freshers / Experienced / Contract,
 * plus a "State-wise" tab that opens the list of states that have open jobs.
 * The first four are exclusive (they set experienceLevel / employmentNature);
 * the state choice combines with any of them.
 * Counts come from GET /api/jobs/filters (`options`).
 */

const countOf = (list = [], value) => list.find((o) => o.value === value)?.count ?? 0;

const TABS = [
  { id: "all", label: "All Jobs", Icon: LayoutGrid, patch: { experienceLevel: "", employmentNature: "" } },
  { id: "freshers", label: "Freshers", Icon: Sprout, patch: { experienceLevel: "Freshers", employmentNature: "" } },
  { id: "experienced", label: "Experienced", Icon: BriefcaseBusiness, patch: { experienceLevel: "Experienced", employmentNature: "" } },
  { id: "contract", label: "Contract", Icon: FileText, patch: { experienceLevel: "", employmentNature: "Contract" } },
];

function activeTab(filters) {
  if (filters.employmentNature === "Contract" && !filters.experienceLevel) return "contract";
  if (filters.experienceLevel === "Freshers" && !filters.employmentNature) return "freshers";
  if (filters.experienceLevel === "Experienced" && !filters.employmentNature) return "experienced";
  if (!filters.experienceLevel && !filters.employmentNature) return "all";
  return null; // some other combination (e.g. from a shared link)
}

function tabCount(id, options) {
  const both = countOf(options.experienceLevel, "Freshers & Experienced");
  if (id === "all") return countOf(options.applicationStatus, "open");
  if (id === "freshers") return countOf(options.experienceLevel, "Freshers") + both;
  if (id === "experienced") return countOf(options.experienceLevel, "Experienced") + both;
  if (id === "contract") return countOf(options.employmentNature, "Contract");
  return 0;
}

const TAB_BASE =
  "shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 whitespace-nowrap";

export default function JobTabs({ options = {}, filters, onPatch }) {
  const [statesOpen, setStatesOpen] = useState(false);
  const current = activeTab(filters);
  const states = (options.state ?? [])
    .filter((o) => o.count > 0 || o.value === filters.state)
    .sort((a, b) => (a.value === "All India" ? -1 : b.value === "All India" ? 1 : a.value.localeCompare(b.value)));
  const stateChosen = filters.state && filters.state !== "All India";

  const pickState = (value) => {
    onPatch({ state: filters.state === value ? "" : value, district: "" });
    setStatesOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto mb-5">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar bg-white/80 backdrop-blur-sm border border-white rounded-2xl p-1.5 shadow-lg shadow-orange-900/5"
        role="tablist" aria-label="Job type">
        {TABS.map(({ id, label, Icon, patch }) => {
          const active = current === id;
          const count = tabCount(id, options);
          return (
            <button key={id} type="button" role="tab" aria-selected={active} onClick={() => onPatch(patch)}
              className={`${TAB_BASE} ${active ? "bg-orange-500 text-white shadow-md shadow-orange-500/30" : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"}`}>
              <Icon size={16} />
              {label}
              {count > 0 && (
                <span className={`text-[11px] rounded-full px-1.5 ${active ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>{count}</span>
              )}
            </button>
          );
        })}

        <span className="w-px my-2 bg-gray-200 shrink-0" aria-hidden />

        <button type="button" onClick={() => setStatesOpen((v) => !v)} aria-expanded={statesOpen}
          className={`${TAB_BASE} ml-auto ${filters.state
            ? "bg-orange-50 text-orange-700 ring-1 ring-orange-300"
            : statesOpen ? "bg-gray-100 text-gray-800" : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"}`}>
          <MapPin size={16} />
          {filters.state || "State-wise"}
          <ChevronDown size={15} className={`transition-transform ${statesOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {statesOpen && (
        <div className="mt-3 text-left bg-white rounded-2xl shadow-xl border border-orange-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">Jobs by state</p>
            <div className="flex items-center gap-1">
              {filters.state && (
                <button type="button" onClick={() => pickState(filters.state)} className="text-xs font-semibold text-orange-600 hover:text-orange-700 px-2 py-1">
                  Clear state
                </button>
              )}
              <button type="button" onClick={() => setStatesOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100" aria-label="Close states">
                <X size={18} />
              </button>
            </div>
          </div>

          {states.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No state-wise jobs right now.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-72 overflow-y-auto">
              {states.map((o) => {
                const active = filters.state === o.value;
                const Icon = active ? Check : o.value === "All India" ? Globe : MapPin;
                return (
                  <button key={o.value} type="button" onClick={() => pickState(o.value)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-left transition-colors ${
                      active ? "bg-orange-500 text-white font-semibold" : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"}`}>
                    <Icon size={14} className={active ? "" : "text-gray-400"} />
                    <span className="flex-1 truncate">{o.value}</span>
                    <span className={`text-[11px] ${active ? "text-white/80" : "text-gray-400"}`}>{o.count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {stateChosen && (
            <label className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-[13px] text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={filters.includeAllIndia}
                onChange={(e) => onPatch({ includeAllIndia: e.target.checked })} className="w-4 h-4 accent-orange-500" />
              Also show All-India jobs
            </label>
          )}
        </div>
      )}
    </div>
  );
}
