import ArticleList from "@/components/Articles/ArticleList";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

async function getCategoryName(parentSlug) {
  try {
    const filterRes = await fetch("https://careermitra.in/api/blogs/filters");
    const filterJson = await filterRes.json();
    const d = filterJson.data || filterJson;
    const parents = d.parents || [];
    const parent = parents.find(p => toSlug(p.name, p.slug) === parentSlug);
    if (parent) return parent.name;
  } catch (e) {
    console.error("Error fetching parent category on server:", e);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { parentSlug } = await params;
  const name = await getCategoryName(parentSlug);
  if (!name) {
    return {
      title: "Government Jobs | Career Mitra",
    };
  }

  const title = `${name} 2026: Latest Notifications & Updates | Career Mitra`;
  const desc = `Apply for the latest ${name} notifications in 2026. Find direct recruitment updates, guidelines, exam patterns and syllabi on Career Mitra.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://www.careermitra.in/${parentSlug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://www.careermitra.in/${parentSlug}`,
    },
  };
}

export default function Page() {
  return <ArticleList />;
}
