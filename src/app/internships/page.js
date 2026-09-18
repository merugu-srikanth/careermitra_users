import { Suspense } from "react";
import InternshipsClient from "./InternshipsClient";
import {
  generateWebPageSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateOrganizationSchema,
  generateWebsiteSchema
} from '@/utils/schemaHelpers';
import { INTERNAL_API_BASE_URL } from '@/utils/api';

export const metadata = {
  title: "Internships & SkillUps 2026, Apply for Verified Opportunities - Career Mitra",
  description: "Search and apply for verified internship opportunities and accredited skill up programs across India. Find virtual, paid, government internships, and vocational certifications.",
  keywords: "Internships 2026, SkillUps, Virtual Internships, Paid Internships, Government Internships, Swayam Courses, Vocational Skills, Career Mitra",
  alternates: {
    canonical: "https://careermitra.in/internships",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Internships & SkillUps 2026, Apply for Verified Opportunities - Career Mitra",
    description: "Search and apply for verified internship opportunities and accredited skill up programs across India. Find virtual, paid, government internships, and vocational certifications.",
    url: "https://careermitra.in/internships",
    siteName: "Career Mitra",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Career Mitra - Internships & SkillUps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internships & SkillUps 2026, Apply for Verified Opportunities - Career Mitra",
    description: "Search and apply for verified internship opportunities and accredited skill up programs across India. Find virtual, paid, government internships, and vocational certifications.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

const generateSlug = (title) => {
  return title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
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

async function getInitialSkillups() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/jobs?job_type=skillup&page=1&limit=20&sort=newest`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success && json.data?.jobs) {
      return {
        skillups: json.data.jobs || [],
        pagination: json.data.pagination || { total: json.data.jobs.length, totalPages: 1 },
      };
    }
    return { skillups: [], pagination: { total: 0, totalPages: 1 } };
  } catch (err) {
    console.error("getInitialSkillups server error:", err);
    return { skillups: [], pagination: { total: 0, totalPages: 1 } };
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
  const [initialData, initialSkillupsData, initialFilters] = await Promise.all([
    getInitialInternships(),
    getInitialSkillups(),
    getInitialFilters(),
  ]);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Internships / SkillUps", item: "/internships" },
  ];

  const faqs = [
    {
      q: "What types of internships are available on Career Mitra?",
      a: "Career Mitra lists virtual, paid, full-time, and government internships across various domains like Information Technology, Finance, Engineering, Healthcare, and Marketing."
    },
    {
      q: "How can I apply for an internship or SkillUp program?",
      a: "Browse the listings, click on 'View Details' to check eligibility criteria and stipends, and click 'Apply' to proceed directly to the official organization application portal."
    },
    {
      q: "Are SkillUp courses accredited and recognized?",
      a: "Yes, SkillUps featured on Career Mitra are offered by verified institutions, government programs (like SWAYAM and Ministry of Education), and recognized educational bodies."
    },
    {
      q: "Do I get a certificate upon completing internships or SkillUps?",
      a: "Most participating organizations and SkillUp providers offer verified completion certificates upon fulfilling the program requirements."
    }
  ];

  const itemListItems = (initialData.internships || []).slice(0, 15).map((item) => ({
    name: item.internship_title,
    url: `https://careermitra.in/internships/${generateSlug(item.internship_title)}`,
    item: {
      title: item.internship_title,
      description: `Apply for ${item.internship_title} at ${item.company_name || 'Verified Company'}. Location: ${item.location || 'India'}, Stipend: ${item.stipend_category || 'Not Disclosed'}.`,
      publishedAt: item.created_at || new Date().toISOString(),
      url: `https://careermitra.in/internships/${generateSlug(item.internship_title)}`,
      authorName: item.company_name || "Career Mitra"
    }
  }));

  const schemas = [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateBreadcrumbSchema(breadcrumbs),
    generateCollectionPageSchema({
      name: "Internships & SkillUps 2026 - Career Mitra",
      description: "Search and apply for verified internship opportunities and accredited skill up programs across India.",
      url: "/internships"
    }),
    generateItemListSchema(itemListItems),
    generateFAQSchema(faqs),
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
      <Suspense fallback={null}>
        <InternshipsClient
          initialInternships={initialData.internships}
          initialPagination={initialData.pagination}
          initialSkillups={initialSkillupsData.skillups}
          initialSkillupsPagination={initialSkillupsData.pagination}
          initialFilters={initialFilters}
          initialError={initialData.error}
        />
      </Suspense>
    </>
  );
}
