import AllJobsClient from "./AllJobsClient";
import { generateCollectionPageSchema } from '@/utils/schemaHelpers';
import { INTERNAL_API_BASE_URL, JOBS_LIST_DEFAULT_QUERY, buildJobsListUrl } from '@/utils/api';
import { mapUnifiedJob } from '@/utils/jobMapper';

const PAGE_TITLE = "Latest Government Jobs Notifications 2026 - Careermitra";
const PAGE_DESCRIPTION =
  "Find the latest government jobs 2026, govt job notifications, vacancies and recruitment updates in India. Get daily updates on SSC, UPSC, Railway, Banking, Defence and State Govt Jobs.";
const PAGE_KEYWORDS =
  "latest government jobs Notifications, latest govt jobs Notifications 2026, government job notifications 2026, latest government job notifications, govt jobs 2026, government vacancies 2026";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: PAGE_KEYWORDS,
  alternates: {
    canonical: "https://careermitra.in/latest-job-notifications",
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://careermitra.in/latest-job-notifications",
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
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

// Fetches exactly the default listing view (page 1, no filters) so
// AllJobsClient's first paint has real rows instead of a loading skeleton.
// Uses the internal origin — this runs on the server, so it must reach the
// Express service directly rather than round-tripping out through the public
// domain and back into the same VPS.
async function getInitialJobs() {
  try {
    const url = buildJobsListUrl(INTERNAL_API_BASE_URL, JOBS_LIST_DEFAULT_QUERY);
    const res = await fetch(url, { next: { revalidate: 300 } });
    const json = await res.json();
    if (!json.success) {
      console.error("getInitialJobs: API responded without success", json?.message);
      return { jobs: [], totalItems: 0, error: json?.message || "Failed to load jobs" };
    }
    const jobs = (json.data?.jobs || []).map(mapUnifiedJob);
    const totalItems = json.data?.pagination?.total ?? jobs.length;
    return { jobs, totalItems, error: null };
  } catch (err) {
    console.error("getInitialJobs: server-side fetch failed", err);
    // Swallow the error — AllJobsClient falls back to its existing client-side
    // fetch + loading/error UI when initialError is set, so the route still
    // serves a working page instead of a 500.
    return { jobs: [], totalItems: 0, error: "Failed to load jobs" };
  }
}

export default async function Page() {
  const schemas = [
    generateCollectionPageSchema({
      name: "Government Jobs 2026: Latest Govt Jobs Notifications in India | Careermitra",
      description: "Get latest Government Jobs 2026 notifications, Sarkari Naukri updates, exam alerts, results, and recruitment updates across India.",
      url: "https://www.careermitra.in/latest-job-notifications"
    })
  ];
  const { jobs: initialJobs, totalItems: initialTotalItems, error: initialError } = await getInitialJobs();
  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <AllJobsClient
        initialJobs={initialJobs}
        initialTotalItems={initialTotalItems}
        initialError={initialError}
      />
    </>
  );
}
