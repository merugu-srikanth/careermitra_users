import CareerGuideClient from "./CareerGuideClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Career Guidance, Job Preparation Tips 2026 | Career Mitra",
  description: "Explore career guidance, job preparation tips, interview advice, and personalized Govt Jobs updates to build a successful career.",
  keywords: "Career Guidance, Career Guide 2026, Job Preparation Tips, Govt Jobs Preparation, Interview Tips, Career Counselling, Sarkari Naukri Guidance, Career Advice India, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/career-guide",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Career Guidance, Job Preparation Tips 2026 | Career Mitra",
      description: "Explore career guidance, job preparation tips, interview advice, and personalized Govt Jobs updates to build a successful career.",
      url: "https://careermitra.in/career-guide"
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
      <CareerGuideClient />
    </>
  );
}
