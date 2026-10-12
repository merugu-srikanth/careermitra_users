"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { PUBLIC_API_BASE_URL, buildJobsListingUrl } from "@/utils/api";
import { mapUnifiedJob } from "@/utils/jobMapper";

const JobContext = createContext(null);

// Shared with the Server Components — see utils/jobMapper.js.
export { mapUnifiedJob };

export function JobProvider({ children }) {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const types = ["jobs", "internship", "skillup"];
      let fetchedJobs = [];

      await Promise.all(
        types.map(async (type) => {
          try {
            const res = await fetch(buildJobsListingUrl(PUBLIC_API_BASE_URL, type, { page: 1, limit: 100, sort: "newest" }));
            const data = await res.json();
            if (data.success && data.data?.jobs) {
              fetchedJobs = fetchedJobs.concat(data.data.jobs);
            }
          } catch (err) {
            console.error(`Failed to fetch ${type} in JobContext:`, err);
          }
        })
      );

      // "both" records are listed under jobs AND internship — keep one copy.
      const seen = new Set();
      const unique = fetchedJobs.filter((j) => {
        const id = String(j?._id ?? j?.id ?? "");
        if (!id) return true;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      const mapped = unique.map(mapUnifiedJob);
      setAllJobs(mapped);
    } catch (err) {
      console.error("Failed to fetch jobs in JobContext:", err);
      setError("Unable to connect to the jobs database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ allJobs, loading, error, refreshJobs: fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
}
