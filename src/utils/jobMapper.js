import { toISTDateKey, getDaysLeft, getApplicationStatus } from "./istDate";

/**
 * Maps an API job (camelCase: title, jobSource, jobType, postedDate, deadline,
 * applyLink, noOfPosts, ageRequirement { min, max, text }, …) to the shape the
 * listing / home / search components use. Old snake_case keys are still read
 * as a fallback.
 *
 * Plain module (no "use client") so Server Components (app/page.js,
 * latest-job-notifications/page.js) and client components share one mapper.
 */

export const pickFirst = (obj, keys, fallback = "") => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
};

/** "18-44" text, else "18–44" / "18+" / "Up to 35"; also reads the old `age` string. */
/** Experience Years is free text; a bare number like "2" reads as "2 years". */
export function formatExperienceYears(value) {
  const text = String(value ?? "").trim();
  return /^\d+(\.\d+)?$/.test(text) ? `${text} ${text === "1" ? "year" : "years"}` : text;
}

export function formatAge(j) {
  const a = j?.ageRequirement;
  if (a && typeof a === "object") {
    if (a.text) return a.text;
    if (a.min != null && a.max != null) return `${a.min}–${a.max}`;
    if (a.min != null) return `${a.min}+`;
    if (a.max != null) return `Up to ${a.max}`;
    return "";
  }
  return typeof a === "string" ? a : j?.age || "";
}

/** includeRaw: false keeps Server Component props small (the home page doesn't need the raw job). */
export const mapUnifiedJob = (j, { includeRaw = true } = {}) => {
  const postedRaw = pickFirst(j, ["postedDate", "posted_date"]);
  const deadlineRaw = pickFirst(j, ["deadline", "applicationDeadline", "application_deadline"]);
  const daysLeft = j?.daysLeft !== undefined ? j.daysLeft : getDaysLeft(deadlineRaw);
  const location = [j?.jobLocation, j?.district, j?.state].filter(Boolean).join(", ");

  return {
    ...(includeRaw ? { raw: j } : {}),
    id: pickFirst(j, ["_id", "id"]),
    jobSourceId: pickFirst(j, ["jobSourceId", "job_source_id"]),
    sourceName: pickFirst(j, ["jobSource", "source_name", "sourceName"]),
    categoryId: String(pickFirst(j, ["categoryId", "category_id"], "")),
    categoryName: pickFirst(j, ["categoryName", "category_name"]),
    title: pickFirst(j, ["title"]),
    category: pickFirst(j, ["categoryName", "category_name"], "General"),
    jobType: pickFirst(j, ["jobType", "job_type"], "jobs"),
    org: pickFirst(j, ["jobSource", "source_name", "sourceName"]),
    noOfPosts: pickFirst(j, ["noOfPosts", "numberOfPosts", "no_of_posts"]),
    age: formatAge(j),
    ageMin: j?.ageRequirement?.min ?? null,
    ageMax: j?.ageRequirement?.max ?? null,
    qualifications: pickFirst(j, ["qualifications"]),
    qualificationLevel: pickFirst(j, ["qualificationLevel"]),
    qualificationStream: pickFirst(j, ["qualificationStream"]),
    sector: pickFirst(j, ["sector"]),
    jobCategory: pickFirst(j, ["jobCategory"]),
    employmentNature: pickFirst(j, ["employmentNature"]),
    experienceLevel: pickFirst(j, ["experienceLevel"]),
    experienceYears: formatExperienceYears(pickFirst(j, ["experienceYears"])),
    language: pickFirst(j, ["language"]),
    state: pickFirst(j, ["state"]),
    district: pickFirst(j, ["district"]),
    applyLink: pickFirst(j, ["applyLink", "apply_link"]),
    notificationUrl: pickFirst(j, ["notificationUrl", "notificationURL", "notification_url"]),
    description: pickFirst(j, ["description"]),
    remark: pickFirst(j, ["remark"]),
    note: pickFirst(j, ["note"]),
    imageUrl: pickFirst(j, ["imageUrl"]),
    postedDateRaw: postedRaw,
    lastDateRaw: deadlineRaw,
    // "YYYY-MM-DD" of the IST day — safe to compare / format, never shifted.
    postedDate: toISTDateKey(postedRaw),
    lastDate: toISTDateKey(deadlineRaw),
    daysLeft,
    applicationStatus: j?.applicationStatus || getApplicationStatus(deadlineRaw),
    status: pickFirst(j, ["status"]),
    createdAt: pickFirst(j, ["createdAt"]),
    updatedAt: pickFirst(j, ["updatedAt"]),
    location: location || pickFirst(j, ["location"], "All India"),
  };
};
