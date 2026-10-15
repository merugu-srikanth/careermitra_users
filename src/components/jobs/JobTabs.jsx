"use client";

import { useEffect, useState } from "react";
import { PUBLIC_API_BASE_URL, buildJobsListUrl } from "@/utils/api";

/**
 * All Jobs / Freshers / Experienced / Contract — above the results. The tabs
 * are exclusive with each other and combine with every other filter (state,
 * category, sector, …). Each count is the number of jobs the tab would show
 * with the current filters, read from the list API (limit=1 → pagination.total).
 */

const NO_TYPE = { experienceLevel: "", employmentNature: "" };
export const JOB_TABS = [
  { id: "all", label: "All Jobs", patch: NO_TYPE },
  { id: "freshers", label: "Freshers", patch: { experienceLevel: "Freshers", employmentNature: "" } },
  { id: "experienced", label: "Experienced", patch: { experienceLevel: "Experienced", employmentNature: "" } },
  { id: "contract", label: "Contract", patch: { experienceLevel: "", employmentNature: "Contract" } },
];

function activeTab(filters) {
  const tab = JOB_TABS.find((t) => t.patch.experienceLevel === filters.experienceLevel && t.patch.employmentNature === filters.employmentNature);
  return tab?.id ?? null; // another combination (e.g. picked in the filters)
}

function useTabCounts(jobType, filters, categoryId) {
  const [counts, setCounts] = useState({});
  const key = JSON.stringify([jobType, filters, categoryId]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(JOB_TABS.map(async (tab) => {
      const url = buildJobsListUrl(PUBLIC_API_BASE_URL, { page: 1, limit: 1, jobType, categoryId, filters: { ...filters, ...tab.patch } });
      const json = await fetch(url, { signal: controller.signal }).then((r) => r.json());
      return [tab.id, json?.success ? json.data?.pagination?.total ?? 0 : null];
    }))
      .then((pairs) => setCounts(Object.fromEntries(pairs)))
      .catch(() => {}); // aborted / offline — keep the old counts
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key stands for the inputs
  }, [key]);

  return counts;
}

export default function JobTabs({ jobType = "jobs", filters, categoryId = "", onPatch }) {
  const counts = useTabCounts(jobType, filters, categoryId);
  const current = activeTab(filters);

  return (
    <div className="grid grid-cols-4 sm:inline-flex gap-1 bg-white border border-gray-200/80 rounded-xl p-1 shadow-sm" role="tablist" aria-label="Job type">
      {JOB_TABS.map(({ id, label, patch }) => {
        const active = current === id;
        return (
          <button key={id} type="button" role="tab" aria-selected={active} onClick={() => onPatch(patch)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 rounded-lg px-1 py-1.5 sm:h-9 sm:py-0 sm:px-4 transition-colors ${active
              ? "bg-orange-500 text-white"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"}`}>
            <span className="text-xs sm:text-[13px] font-semibold leading-tight whitespace-nowrap">{label}</span>
            <span className={`text-[11px] font-semibold leading-none rounded-full px-1.5 py-0.5 ${active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
              {counts[id] ?? "–"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
