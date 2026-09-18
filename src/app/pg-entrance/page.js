import PgEntranceClient from "./PgEntranceClient";
import { generateWebPageSchema } from "@/utils/schemaHelpers";

export const metadata = {
  title: "PG Entrance Exams 2026 - Pan India, Telangana, AP & Institute Entrances | Career Mitra",
  description: "Find complete PG entrance exam lists: Pan-India (GATE, CUET-PG, JAM, CAT, MAT, XAT, NIPER), Telangana (TS PGECET, TS ICET, CPGET), AP (AP PGECET, AP ICET, APPGCET), and Institutes (CFTRI, TIFR, ISI). Access notifications and apply links.",
  keywords: "PG Entrance Exams 2026, GATE, CUET-PG, TS PGECET, AP PGECET, CFTRI Food Tech, JAM, CAT, MAT, XAT, NIPER JEE, ISI, TIFR, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/pg-entrance",
  },
  openGraph: {
    title: "PG Entrance Exams 2026 - Pan India, Telangana, AP & Institute Entrances | Career Mitra",
    description: "Explore all PG entrance exams after graduation. Check exam lists, streams, universities, notifications, and direct apply links.",
    url: "https://careermitra.in/pg-entrance",
    type: "website",
    siteName: "Career Mitra",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Career Mitra - PG Entrance Exams Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PG Entrance Exams 2026 - Career Mitra",
    description: "Find comprehensive information about PG entrance exams, notifications, and application portals.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

export default function PgEntrancePage() {
  const schemas = [
    generateWebPageSchema({
      name: "PG Entrance Exams 2026 - Career Mitra",
      description: "Find complete information about PG entrance exams in India including Pan India, Telangana, Andhra Pradesh, and premier institutes like CFTRI, TIFR, ISI.",
      url: "https://careermitra.in/pg-entrance"
    })
  ].filter(Boolean);

  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <PgEntranceClient />
    </>
  );
}
