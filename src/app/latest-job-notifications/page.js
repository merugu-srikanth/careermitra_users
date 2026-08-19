import AllJobsClient from "./AllJobsClient";
import { generateCollectionPageSchema } from '@/utils/schemaHelpers';

const PAGE_TITLE = "Latest Government Jobs Notifications 2026 - CareerMitra";
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

export default function Page() {
  const schemas = [
    generateCollectionPageSchema({
      name: "Government Jobs 2026: Latest Govt Jobs Notifications in India | Careermitra",
      description: "Get latest Government Jobs 2026 notifications, Sarkari Naukri updates, exam alerts, results, and recruitment updates across India.",
      url: "https://www.careermitra.in/latest-job-notifications"
    })
  ];
  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <AllJobsClient />
    </>
  );
}
