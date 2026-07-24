import BlogList from "./BlogListClient";
import { generateCollectionPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Articles | Career Mitra — Govt Jobs, Career Guides & More",
  description: "Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra.",
  keywords: "govt jobs 2026, career guide, exam tips, sarkari naukri, government jobs",
  alternates: {
    canonical: "https://www.careermitra.in/government-jobs",
  },
  openGraph: {
    type: "website",
    images: [{ url: "https://www.careermitra.in/og-articles.png" }],
  },
};

export default function GovernmentJobsPage() {
  const schema = generateCollectionPageSchema({
    name: "Articles | Career Mitra — Govt Jobs, Career Guides & More",
    description: "Latest govt jobs 2026, career guides, exam tips, and more from Career Mitra.",
    url: "https://www.careermitra.in/government-jobs"
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogList />
    </>
  );
}
