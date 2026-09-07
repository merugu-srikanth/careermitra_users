import BlogList from "./BlogListClient";
import { generateCollectionPageSchema, generateOrganizationSchema, generateFAQSchema } from '@/utils/schemaHelpers';
import { INTERNAL_API_BASE_URL } from '@/utils/api';

export const metadata = {
  title: "Articles, Govt Jobs, Career Guides & More - Career Mitra",
  description: "Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra.",
  keywords: "govt jobs 2026, career guide, exam tips, sarkari naukri, government jobs",
  alternates: {
    canonical: "https://careermitra.in/government-jobs",
  },
  openGraph: {
    type: "website",
    title: "Articles, Govt Jobs, Career Guides & More - Career Mitra",
    description: "Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra.",
    url: "https://www.careermitra.in/government-jobs",
    images: [{ url: "https://careermitra.in/default_og_image.png" }],
  },
};

const getPrimaryCategory = (blog) =>
  blog?.categories?.[0]?.name || blog?.category || 'General';

const getAuthorName = (blog) =>
  blog?.author?.author_name || blog?.author_name || 'Career Mitra';

const getAuthorId = (blog) =>
  blog?.author?._id || blog?.author_id || blog?.authorId || '';

const normalizeBlog = (blog) => ({
  ...blog,
  primaryCategory: getPrimaryCategory(blog),
  authorDisplayName: getAuthorName(blog),
  authorId: getAuthorId(blog),
  authorAvatar: blog?.author?.avatar_url || null,
});

async function getInitialBlogs() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/blogs?page=1&limit=40`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    const d = data?.data || data;
    const allBlogs = (d?.articles || []).map(normalizeBlog);
    return {
      blogs: allBlogs,
      total: d?.pagination?.total || allBlogs.length,
      error: null,
    };
  } catch (err) {
    console.error("getInitialBlogs server fetch failed:", err);
    return { blogs: [], total: 0, error: "Failed to load articles" };
  }
}

export default async function GovernmentJobsPage() {
  const schema = generateCollectionPageSchema({
    name: "Government Jobs | Career Mitra — Govt Jobs, Career Guides & More",
    description: "Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra.",
    url: "https://www.careermitra.in/government-jobs"
  });

  const orgSchema = generateOrganizationSchema();

  const faqSchema = generateFAQSchema([
    {
      q: "Which government jobs can a 10th-pass candidate apply for in 2026?",
      a: "SSC MTS, SSC GD Constable, and Railway Group D accept Class 10 as the minimum qualification."
    },
    {
      q: "What is the general age limit for central government jobs?",
      a: "Most posts set the upper limit between 27 and 32 years for unreserved candidates, with relaxation for reserved categories."
    },
    {
      q: "How can candidates track railway recruitment updates?",
      a: "Railway notices are released CEN-wise, so following the RRB website for the relevant zone is the reliable approach."
    },
    {
      q: "Is there an application fee for government exams?",
      a: "Most recruiting bodies charge a fee for general and OBC candidates, with waivers commonly available for SC, ST, women, and persons with disabilities."
    },
    {
      q: "What is the typical selection process for bank jobs?",
      a: "Banking recruitment generally follows a Preliminary exam, Mains exam and an Interview or Group Exercise for officer-level posts."
    }
  ]);

  const { blogs: initialBlogs, total: initialTotal, error: initialError } = await getInitialBlogs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlogList
        initialBlogs={initialBlogs}
        initialTotal={initialTotal}
        initialError={initialError}
      />
    </>
  );
}


