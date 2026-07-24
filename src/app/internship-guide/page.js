import InternshipGuideClient from "./InternshipGuideClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Internship Guide 2026, Internship Tips, Opportunities, Career Guidance | Career Mitra",
  description: "Explore internship opportunities, career guidance, resume tips, and internship preparation advice to kickstart your career journey.",
  keywords: "Internship Guide 2026, Internship Opportunities, Internship Tips, Career Guidance, Internship Preparation, Resume Tips, Student Internships India, Fresher Career Advice, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/internship-guide",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Internship Guide 2026 - Career Mitra",
      description: "Explore internship opportunities, career guidance, resume tips, and internship preparation advice to kickstart your career journey.",
      url: "https://careermitra.in/internship-guide"
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
      <InternshipGuideClient />
    </>
  );
}
