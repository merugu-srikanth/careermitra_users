import HomeClient from "./HomeClient";
import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Career Mitra: Personalized Latest Govt Jobs Notifications & Career Guidance in India",
  description: "Get personalized latest Govt Jobs notifications, Sarkari Naukri updates, exam alerts, results, and expert career guidance at Career Mitra.",
  keywords: "Career Mitra, Latest Govt Jobs Notifications, Sarkari Naukri 2026, Free Job Alert, Career Guidance, Government Jobs India, Latest Job Alerts, Exam Notifications",
  alternates: {
    canonical: "https://careermitra.in/",
  },
};

export default function Home() {
  const homeSchemas = [
    generateOrganizationSchema(),
    generateWebsiteSchema()
  ];

  return (
    <>
      {homeSchemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <HomeClient />
    </>
  );
}