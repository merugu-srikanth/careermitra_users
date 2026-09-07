import InternshipsClient from "./InternshipsClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';
import { INTERNAL_API_BASE_URL } from '@/utils/api';

export const metadata = {
  title: "Internship Opportunities 2026, Apply for Verified Internships - Career Mitra",
  description: "Search and apply for verified internship opportunities across states, sectors, and roles. Find virtual, paid, and unpaid internships.",
  keywords: "Internships, Virtual Internships, Paid Internships, Government Internships, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/internships",
  },
  openGraph: {
    title: "Internship Opportunities 2026, Apply for Verified Internships - Career Mitra",
    description: "Search and apply for verified internship opportunities across states, sectors, and roles. Find virtual, paid, and unpaid internships.",
    url: "https://careermitra.in/internships",
    images: [{ url: "https://careermitra.in/default_og_image.png" }],
  },
};

async function getInitialInternships() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/internships?page=1&limit=20&sort=newest`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success && json.data) {
      return {
        internships: json.data.internships || [],
        pagination: json.data.pagination || { total: 0, totalPages: 1 },
        error: null,
      };
    }
    return {
      internships: [],
      pagination: { total: 0, totalPages: 1 },
      error: json?.message || "Failed to load internships",
    };
  } catch (err) {
    console.error("getInitialInternships server error:", err);
    return {
      internships: [],
      pagination: { total: 0, totalPages: 1 },
      error: "Failed to load internships",
    };
  }
}

async function getInitialFilters() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/internships/filters`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success && json.data) {
      return {
        internship_types: json.data.internship_types || [],
        domains: json.data.domains || [],
        states: json.data.states || [],
        cities: json.data.cities || [],
        stipend_categories: json.data.stipend_categories || ["Paid", "Unpaid"],
      };
    }
    return null;
  } catch (err) {
    console.error("getInitialFilters server error:", err);
    return null;
  }
}

export default async function Page() {
  const [initialData, initialFilters] = await Promise.all([
    getInitialInternships(),
    getInitialFilters(),
  ]);

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
      <InternshipsClient
        initialInternships={initialData.internships}
        initialPagination={initialData.pagination}
        initialFilters={initialFilters}
        initialError={initialData.error}
      />
    </>
  );
}
