"use client";

import { useEffect, useState } from "react";
import { PUBLIC_API_BASE_URL } from "@/utils/api";
import { filtersToApiParams } from "@/utils/jobFilters";

/**
 * Filter options + counts from GET /api/jobs/filters (Approved, open jobs),
 * e.g. { state: [{ value: "Telangana", count: 12 }, ...], sector: [...] }.
 * District options follow the chosen state, stream options the chosen level;
 * sector / language / category counts follow every other active filter.
 * Shared by the quick-filter chips and the filter panel (one request).
 * On failure `options` stays {} so the UI simply hides the empty sections.
 */
export default function useJobFilterOptions(jobType, filters) {
  const [result, setResult] = useState({ options: {}, loaded: false });
  const query = new URLSearchParams({ jobType, ...filtersToApiParams(filters) }).toString();

  useEffect(() => {
    const params = query;
    let alive = true;
    fetch(`${PUBLIC_API_BASE_URL}/jobs/filters?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        setResult({ options: json?.success ? json.data?.options ?? {} : {}, loaded: true });
      })
      .catch(() => { if (alive) setResult((prev) => ({ ...prev, loaded: true })); });
    return () => { alive = false; };
  }, [query]);

  return result;
}
