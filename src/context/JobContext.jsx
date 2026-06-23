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

      // Fetch first page with limit=100
      const firstPageRes = await fetch("https://careermitra.in/api/jobs?page=1&limit=100&sort=newest");
      const firstPageData = await firstPageRes.json();

      if (!firstPageData.success) {
        setError(firstPageData.message || "Failed to load jobs");
        setLoading(false);
        return;
      }

      let fetchedJobs = firstPageData?.data?.jobs || [];
      const totalPages = firstPageData?.data?.pagination?.totalPages || 1;

      // If there are more pages, fetch them in parallel
      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(
            fetch(`https://careermitra.in/api/jobs?page=${p}&limit=100&sort=newest`)
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  return data?.data?.jobs || [];
                }
                console.warn(`Failed to fetch page ${p} in JobContext:`, data.message);
                return [];
              })
              .catch((err) => {
                console.error(`Error fetching page ${p} in JobContext:`, err);
                return [];
              })
          );
        }
        const remainingPagesJobs = await Promise.all(promises);
        remainingPagesJobs.forEach((pageJobs) => {
          fetchedJobs = fetchedJobs.concat(pageJobs);
        });
      }

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
