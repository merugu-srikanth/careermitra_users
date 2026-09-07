import HomeClient from "./HomeClient";
import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/schemaHelpers';
import { INTERNAL_API_BASE_URL, buildJobsListUrl } from '@/utils/api';

export const metadata = {
  title: "Personalized Latest Govt Jobs Notifications & Career Guidance in India - Career Mitra",
  description: "Get personalized latest Govt Jobs notifications, Sarkari Naukri updates, exam alerts, results, and expert career guidance at Career Mitra.",
  keywords: "Career Mitra, Latest Govt Jobs Notifications, Sarkari Naukri 2026, Free Job Alert, Career Guidance, Government Jobs India, Latest Job Alerts, Exam Notifications",
  alternates: {
    canonical: "https://careermitra.in/",
  },
  openGraph: {
    title: "Personalized Latest Govt Jobs Notifications & Career Guidance in India - Career Mitra",
    description: "Get personalized latest Govt Jobs notifications, Sarkari Naukri updates, exam alerts, results, and expert career guidance at Career Mitra.",
    url: "https://careermitra.in/",
    type: "website",
    siteName: "Career Mitra",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Career Mitra - India's Job & Career Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personalized Latest Govt Jobs Notifications & Career Guidance in India - Career Mitra",
    description: "Get personalized latest Govt Jobs notifications, Sarkari Naukri updates, exam alerts, results, and expert career guidance at Career Mitra.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

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

const mapUnifiedJob = (j) => {
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

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeBlog = (blog) => ({
  ...blog,
  primaryCategory: blog?.categories?.[0]?.name || blog?.category || "General",
  authorDisplayName: blog?.author?.author_name || blog?.author_name || "Career Mitra",
  authorId: blog?.author?._id || blog?.author_id || blog?.authorId || "",
  authorAvatar: blog?.author?.avatar_url || null,
});

async function getInitialJobs() {
  try {
    const url = buildJobsListUrl(INTERNAL_API_BASE_URL, {
      page: 1,
      limit: 12,
      sort: "newest",
      jobType: "jobs",
    });
    const res = await fetch(url, { next: { revalidate: 300 } });
    const json = await res.json();
    if (json.success && json.data?.jobs) {
      return json.data.jobs.map(mapUnifiedJob);
    }
    return [];
  } catch (err) {
    console.error("getInitialJobs error:", err);
    return [];
  }
}

async function getInitialAnnouncements() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/announcements`, { next: { revalidate: 300 } });
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    return list
      .filter((a) => a.status === "active")
      .map((a) => ({
        id: a.id || a._id || "",
        title: a.title || "Announcement",
        slug: a.slug || "",
        url: a.url || null,
        date: a.date || a.publishedAt || a.created_at || null,
      }));
  } catch (err) {
    console.error("getInitialAnnouncements error:", err);
    return [];
  }
}

async function getInitialSkillups() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/jobs/skillup?page=1&limit=10`, { next: { revalidate: 300 } });
    const json = await res.json();
    if (json.success && json.data?.jobs) {
      return json.data.jobs.map((j) => ({
        id: j._id || j.id,
        title: j.title,
        org: j.source_name || j.sourceName || j.org || "N/A",
        qualifications: j.qualifications || "N/A",
        applyLink: j.apply_link || j.applyLink || null,
        notificationUrl: j.notification_url || j.notificationUrl || null,
        postedDate: j.posted_date || j.postedDate || null,
        deadline: j.application_deadline || j.lastDate || null,
        age: j.age || "N/A",
        posts: j.no_of_posts ?? j.noOfPosts ?? "N/A",
        type: "skillups",
      }));
    }
    return [];
  } catch (err) {
    console.error("getInitialSkillups error:", err);
    return [];
  }
}

const SECTIONS = [
  { name: "Career Guidance", slug: "career-guidance" },
  { name: "Central Government Jobs", slug: "central-government-jobs" },
  { name: "State Government Jobs", slug: "state-government-jobs" },
  { name: "Defence Jobs", slug: "defence-jobs" },
];

async function getInitialBlogs() {
  try {
    const filterRes = await fetch(`${INTERNAL_API_BASE_URL}/blogs/filters`, { next: { revalidate: 300 } });
    const filterJson = await filterRes.json();
    const parents = (filterJson.data || filterJson).parents || [];

    const sections = await Promise.all(
      SECTIONS.map(async (sec) => {
        const parent = parents.find((p) => p.slug === sec.slug || slugify(p.name) === sec.slug);
        if (!parent) return { ...sec, blogs: [] };
        try {
          const res = await fetch(`${INTERNAL_API_BASE_URL}/blogs?parent_category_id=${parent.id}&limit=8`, {
            next: { revalidate: 300 },
          });
          const json = await res.json();
          const articles = (json.data || json).articles || [];
          return { ...sec, blogs: articles.slice(0, 8).map(normalizeBlog) };
        } catch {
          return { ...sec, blogs: [] };
        }
      })
    );
    return sections;
  } catch (err) {
    console.error("getInitialBlogs error:", err);
    return [];
  }
}

export default async function Home() {
  const homeSchemas = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
  ];

  const [initialJobs, initialAnnouncements, initialSkillups, initialBlogSections] = await Promise.all([
    getInitialJobs(),
    getInitialAnnouncements(),
    getInitialSkillups(),
    getInitialBlogs(),
  ]);

  return (
    <>
      {homeSchemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <HomeClient
        initialJobs={initialJobs}
        initialAnnouncements={initialAnnouncements}
        initialSkillups={initialSkillups}
        initialBlogSections={initialBlogSections}
      />
    </>
  );
}