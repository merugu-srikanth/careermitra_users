import AllJobsClient from "./AllJobsClient";
import { generateCollectionPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Government Jobs 2026: Latest Govt Jobs Notifications in India | Careermitra",
  description: "Get latest Government Jobs 2026 notifications, Sarkari Naukri updates, exam alerts, results, and recruitment updates across India.",
  keywords: "government jobs 2026, latest govt jobs notifications, sarkari naukri 2026, free job alerts, govt job updates, central govt jobs, state govt jobs, latest recruitment notifications",
  alternates: {
    canonical: "https://www.careermitra.in/latest-job-notifications",
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
