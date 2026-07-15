"use client";

import { createContext, useContext, useState, useEffect } from "react";

const JobContext = createContext(null);

const pickFirst = (obj, keys, fallback = "") => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
};

const toDateOnly = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.split("T")[0] || "";
};

export const mapUnifiedJob = (j) => {
  const postedRaw = pickFirst(j, ["postedDate", "posted_date"]);
  const deadlineRaw = pickFirst(j, ["applicationDeadline", "application_deadline"]);

  return {
    raw: j,
    id: pickFirst(j, ["_id", "id"]),
    jobSourceId: pickFirst(j, ["job_source_id", "jobSourceId"]),
    sourceName: pickFirst(j, ["source_name", "sourceName", "jobSource"]),
    categoryId: String(pickFirst(j, ["category_id", "categoryId"], "")),
    categoryName: pickFirst(j, ["category_name", "categoryName"]),
    title: pickFirst(j, ["title"]),
    category: pickFirst(j, ["category_name", "categoryName"], "General"),
    jobType: pickFirst(j, ["job_type", "jobType"], "jobs"),
    org: pickFirst(j, ["jobSource", "source_name", "sourceName"]),
    noOfPosts: pickFirst(j, ["numberOfPosts", "no_of_posts"]),
    age: pickFirst(j, ["ageRequirement", "age"]),
    qualifications: pickFirst(j, ["qualifications"]),
    applyLink: pickFirst(j, ["applyLink", "apply_link"]),
    notificationUrl: pickFirst(j, ["notificationUrl", "notificationURL", "notification_url"]),
    postedDateRaw: postedRaw,
    lastDateRaw: deadlineRaw,
    postedDate: toDateOnly(postedRaw),
    lastDate: toDateOnly(deadlineRaw),
    status: pickFirst(j, ["status"]),
    createdAt: pickFirst(j, ["createdAt"]),
    updatedAt: pickFirst(j, ["updatedAt"]),
    location: pickFirst(j, ["location"], "All India"),
  };
};

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
            const res = await fetch(`https://careermitra.in/api/jobs?page=1&limit=100&sort=newest&job_type=${type}`);
            const data = await res.json();
            if (data.success && data.data?.jobs) {
              fetchedJobs = fetchedJobs.concat(data.data.jobs);
            }
          } catch (err) {
            console.error(`Failed to fetch ${type} in JobContext:`, err);
          }
        })
      );

      const mapped = fetchedJobs.map(mapUnifiedJob);
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
