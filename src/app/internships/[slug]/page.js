import InternshipDetail from "./InternshipDetailClient";
import { generateJobPostingSchema, generateFAQSchema } from '@/utils/schemaHelpers';

const BASE_URL = "https://careermitra.in/api/internships";

async function getInternshipData(slug) {
  const generateSlug = (title) => {
    return title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "";
  };

  const getCleanSearchTerm = (slug) => {
    if (!slug) return "";
    const stopWords = new Set(["and", "or", "for", "in", "at", "of", "with", "the", "a", "an", "internship", "internships"]);
    return slug
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 1 && !stopWords.has(word))
      .join(" ");
  };

  try {
    const normalizedSlug = generateSlug(slug);
    const searchTerm = getCleanSearchTerm(slug);
    let matched = null;

    if (searchTerm) {
      const listRes = await fetch(`${BASE_URL}?search=${encodeURIComponent(searchTerm)}&limit=100`);
      const listJson = await listRes.json();
      if (listJson.success && listJson.data && listJson.data.internships) {
        matched = listJson.data.internships.find(
          (item) => generateSlug(item.internship_title) === normalizedSlug || item.id === slug
        );
      }
    }

    if (!matched && slug) {
      const rawSearchTerm = decodeURIComponent(slug).replace(/-/g, " ");
      const listRes = await fetch(`${BASE_URL}?search=${encodeURIComponent(rawSearchTerm)}&limit=100`);
      const listJson = await listRes.json();
      if (listJson.success && listJson.data && listJson.data.internships) {
        matched = listJson.data.internships.find(
          (item) => generateSlug(item.internship_title) === normalizedSlug || item.id === slug
        );
      }
    }

    if (matched) {
      const detailRes = await fetch(`${BASE_URL}/${matched.id}`);
      const detailJson = await detailRes.json();
      if (detailJson.success) {
        return detailJson.data;
      }
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    if (slug && isValidObjectId) {
      const res = await fetch(`${BASE_URL}/${slug}`);
      const json = await res.json();
      if (json.success) {
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
      title: "Internship | Career Mitra",
    };
  }
  const title = data.internship_title || "";
  const company = data.company_name || "";
  const location = data.location || "";
  const type = data.work_mode || "";
  const duration = data.duration || "";
  const stipend = data.stipend || "";
  const category = data.category || "";

  return {
    title: `${title} Internship at ${company} in ${location} 2026 | Career Mitra`,
    description: `Apply for the ${title} Internship at ${company} in ${location}. Work mode: ${type}, Duration: ${duration}, Stipend: ${stipend}. Find eligibility and details here.`,
    keywords: `${title} Internship, ${company} Internship, Internship in ${location}, ${category} Internship, Career Mitra`,
    alternates: {
      canonical: `https://careermitra.in/internships/${data.id}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getInternshipData(slug);
  
  let schemas = [];
  if (data) {
    const title = data.internship_title || "";
    const company = data.company_name || "";
    const location = data.location || "";
    const type = data.work_mode || "";
    const duration = data.duration || "";
    const stipend = data.stipend || "";
    const category = data.category || "";
    const faqs = data.faq || [];

    const jobPostingSchema = generateJobPostingSchema({
      title,
      company,
      location,
      type,
      description: data.description || "",
      publishedAt: data.created_at || new Date().toISOString(),
      stipend,
      duration,
      requirements: data.requirements || ""
    });

    const faqSchema = generateFAQSchema(faqs);
    schemas = [jobPostingSchema, faqSchema].filter(Boolean);
  }

  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <InternshipDetail initialData={data} />
    </>
  );
}
