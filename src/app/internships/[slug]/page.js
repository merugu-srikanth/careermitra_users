import fs from 'fs';
import path from 'path';
import InternshipDetail from "./InternshipDetailClient";
import { generateJobPostingSchema, generateFAQSchema } from '@/utils/schemaHelpers';

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
      
      // Auto-generate map in dev mode if missing
      if (!fs.existsSync(mapPath)) {
        console.log("internships-map.json not found, rebuilding on the fly...");
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
      const res = await fetch(`${BASE_URL}/${id}`);
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
      title: "Internship - Career Mitra",
    };
  }
  const title = data.internship_title || "";
  const company = data.company_name || "";
  const location = data.location || "";
  const type = data.work_mode || "";
  const duration = data.duration || "";
  const stipend = data.stipend || "";
  const category = data.category || "";

  const pageTitle = `${title} Internship at ${company} in ${location} 2026 - Career Mitra`;
  const desc = `Apply for the ${title} Internship at ${company} in ${location}. Work mode: ${type}, Duration: ${duration}, Stipend: ${stipend}. Find eligibility and details here.`;

  const canonicalUrl = `https://careermitra.in/internships/${generateSlug(title) || slug}`;

  return {
    title: pageTitle,
    description: desc,
    keywords: `${title} Internship, ${company} Internship, Internship in ${location}, ${category} Internship, Career Mitra`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: desc,
      url: canonicalUrl,
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
