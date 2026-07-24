import AboutPageClient from "./AboutPageClient";
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "About Us - Career Mitra",
  description: "Learn about Career Mitra, your trusted platform for personalized Govt Jobs notifications, Sarkari Naukri updates, and career guidance.",
  keywords: "About Us, About Career Mitra, Govt Jobs Notifications, Career Guidance Platform",
  alternates: {
    canonical: "https://careermitra.in/about-us",
  },
};

export default function Page() {
  const schemas = [
    generateOrganizationSchema(),
    generateWebPageSchema({
      name: "About Us - Career Mitra",
      description: "Learn about Career Mitra, your trusted platform for personalized Govt Jobs notifications, Sarkari Naukri updates, and career guidance.",
      url: "https://careermitra.in/about-us"
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
      <AboutPageClient />
    </>
  );
}
