import HomeClient from "./HomeClient";
import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/schemaHelpers';

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