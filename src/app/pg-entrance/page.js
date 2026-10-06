import PgEntranceClient from "./PgEntranceClient";
import PgEntranceGuide from "./PgEntranceGuide";
import { generateWebPageSchema, generateBreadcrumbSchema } from "@/utils/schemaHelpers";
import { INTERNAL_API_BASE_URL } from "@/utils/api";

export const metadata = {
  title: "PG Entrance Exams 2026 - National & Telangana | Career Mitra",
  description: "PG entrance exams 2026 in one place: GATE, IIT JAM, CAT, CUET-PG and Telangana TG CPGET, TG PGECET, TG ICET & TG PGLCET, with dates and apply links.",
  keywords: "PG Entrance Exams 2026, GATE 2027, IIT JAM 2027, CAT 2026, CUET PG, TG CPGET, TG PGECET, TG ICET, TG PGLCET, National Level PG Entrance Exams, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/pg-entrance",
  },
  openGraph: {
    title: "PG Entrance Exams 2026 - National & Telangana | Career Mitra",
    description: "PG entrance exams 2026 in one place: GATE, IIT JAM, CAT, CUET-PG and Telangana TG CPGET, TG PGECET, TG ICET & TG PGLCET, with dates and apply links.",
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
    title: "PG Entrance Exams 2026 - National & Telangana | Career Mitra",
    description: "PG entrance exams 2026 in one place: GATE, IIT JAM, CAT, CUET-PG and Telangana TG CPGET, TG PGECET, TG ICET & TG PGLCET, with dates and apply links.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

async function getInitialPgEntrances() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/pg-entrance?limit=50`, {
      next: { revalidate: 120 },
    });
    const json = await res.json();
    if (json.success && json.data) {
      return {
        items: json.data.items || [],
        pagination: json.data.pagination || null,
      };
    }
    return { items: [], pagination: null };
  } catch (err) {
    console.error("Failed to prefetch PG entrance data on server:", err);
    return { items: [], pagination: null };
  }
}

export default async function PgEntrancePage() {
  const data = await getInitialPgEntrances();

  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "PG Entrance Exams", item: "/pg-entrance" },
    ]),
    generateWebPageSchema({
      name: "PG Entrance Exams 2026 - National & Telangana | Career Mitra",
      description: "PG entrance exams 2026 in one place: GATE, IIT JAM, CAT, CUET-PG and Telangana TG CPGET, TG PGECET, TG ICET & TG PGLCET, with dates and apply links.",
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
      <PgEntranceClient
        initialExams={data.items}
        initialPagination={data.pagination}
        guide={<PgEntranceGuide />}
      />
    </>
  );
}
