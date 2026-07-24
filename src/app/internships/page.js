import InternshipsClient from "./InternshipsClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Internship Opportunities 2026, Apply for Verified Internships | Career Mitra",
  description: "Search and apply for verified internship opportunities across states, sectors, and roles. Find virtual, paid, and unpaid internships.",
  keywords: "Internships, Virtual Internships, Paid Internships, Government Internships, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/internships",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Internship Opportunities 2026 - Career Mitra",
      description: "Search and apply for verified internship opportunities across states, sectors, and roles. Find virtual, paid, and unpaid internships.",
      url: "https://careermitra.in/internships"
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
      <InternshipsClient />
    </>
  );
}
