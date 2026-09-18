import { Suspense } from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import InternshipDetail from "./InternshipDetailClient";
import { generateJobPostingSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/utils/schemaHelpers';
import { formatStipend, normalizeDuration, formatDateDDMonYYYY, toTitleCase } from '@/utils/formatters';

const BASE_URL = "https://careermitra.in/api/internships";

const generateSlug = (title) => {
  return title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "";
};

async function getInternshipData(slug) {
  try {
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    let id = isValidObjectId ? slug : null;

    if (!id) {
      const mapPath = path.resolve("public/internships-map.json");
      
      if (!fs.existsSync(mapPath)) {
        try {
          let page = 1;
          let totalPages = 1;
          const tempMap = {};
          do {
            const res = await fetch(`${BASE_URL}?page=${page}&limit=100`);
            const json = await res.json();
            if (json.success && json.data && json.data.internships) {
              for (const item of json.data.internships) {
                if (item.internship_title && item.id) {
                  const s = generateSlug(item.internship_title);
                  tempMap[s] = item.id;
                }
              }
              totalPages = json.data.pagination?.totalPages || 1;
              page++;
            } else {
              break;
            }
          } while (page <= totalPages);
          fs.writeFileSync(mapPath, JSON.stringify(tempMap, null, 2));
        } catch (err) {
          console.error("Failed to auto-generate mapping:", err);
        }
      }

      if (fs.existsSync(mapPath)) {
        const map = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
        id = map[slug];
      }
    }

    if (id) {
      const res = await fetch(`${BASE_URL}/${id}`, { next: { revalidate: 300 } });
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (e) {
    console.error("Error fetching internship detail on server:", e);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getInternshipData(slug);
  
  if (!data) {
    return {
      title: "Internship Expired or Removed - Career Mitra",
      description: "This internship opportunity has closed or has been removed from the platform.",
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    };
  }

  const title = toTitleCase(data.internship_title || "Internship Opportunity");
  const company = data.company_name || "Verified Organization";
  const location = data.location || [data.district_city, data.state].filter(Boolean).join(", ") || "India";
  const type = data.work_mode || data.internship_type || "Virtual Internship";
  const duration = normalizeDuration(data.duration);
  const stipend = formatStipend(data);
  const category = data.category || data.domain_sector || "Professional";

  const pageTitle = `${title} at ${company} in ${location} 2026 - Career Mitra`;
  const desc = `Apply for the ${title} at ${company} in ${location}. Mode: ${type}, Duration: ${duration}, Stipend: ${stipend}. Verified details, eligibility & official application link.`;
  const canonicalUrl = `https://careermitra.in/internships/${generateSlug(data.internship_title) || slug}`;

  return {
    title: pageTitle,
    description: desc,
    keywords: `${title}, ${company} Internship, Internship in ${location}, ${category} Internship, Career Mitra`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: pageTitle,
      description: desc,
      url: canonicalUrl,
      type: "article",
      siteName: "Career Mitra",
      images: [{ url: "https://careermitra.in/default_og_image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: ["https://careermitra.in/default_og_image.png"],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getInternshipData(slug);
  
  // D1: Real 404 / 410 response for removed/non-existent records (No soft-404s in Search Console)
  if (!data) {
    notFound();
  }

  const title = toTitleCase(data.internship_title || "Internship Opportunity");
  const company = data.company_name || "Verified Organization";
  const location = data.location || [data.district_city, data.state].filter(Boolean).join(", ") || "India";
  const type = data.work_mode || data.internship_type || "Virtual Internship";
  const duration = normalizeDuration(data.duration);
  const stipend = formatStipend(data);
  const faqs = data.faq || [];

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Internships / SkillUps", item: "/internships" },
    { name: title, item: `/internships/${generateSlug(data.internship_title) || slug}` },
  ];

  const jobPostingSchema = generateJobPostingSchema({
    title,
    company,
    location,
    type,
    description: data.internship_description || data.about_internship || `${title} at ${company}`,
    publishedAt: data.created_at || new Date().toISOString(),
    stipend,
    duration,
    requirements: data.requirements || data.qualifications || "All Eligible Candidates"
  });

  const schemas = [
    jobPostingSchema,
    generateBreadcrumbSchema(breadcrumbs),
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
        <InternshipDetail initialData={data} />
      </Suspense>
    </>
  );
}
