import { cache } from "react";
import ArticleList from "@/components/Articles/ArticleList";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// cache() dedupes this fetch — generateMetadata and Page both call it for
// the same request, and React's per-request cache collapses them into one.
const getFilterData = cache(async () => {
  try {
    const filterRes = await fetch("https://careermitra.in/api/blogs/filters");
    const filterJson = await filterRes.json();
    const d = filterJson.data || filterJson;
    return { parents: d.parents || [], children: d.children || [] };
  } catch (e) {
    console.error("Error fetching category filters on server:", e);
    return { parents: [], children: [] };
  }
});

export async function generateMetadata({ params }) {
  const { parentSlug } = await params;
  if (!parentSlug || parentSlug.includes(".")) {
    return {
      title: "Career Mitra",
    };
  }
  const { parents } = await getFilterData();
  const name = parents.find(p => toSlug(p.name, p.slug) === parentSlug)?.name || null;
  if (!name) {
    return {
      title: "Government Jobs - Career Mitra",
    };
  }

  const title = `${name} 2026: Latest Notifications & Updates - Career Mitra`;
  const desc = `Apply for the latest ${name} notifications in 2026. Find direct recruitment updates, guidelines, exam patterns and syllabi on Career Mitra.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://careermitra.in/${parentSlug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://careermitra.in/${parentSlug}`,
      images: [{ url: "https://careermitra.in/default_og_image.png" }],
    },
  };
}

import NotFoundPage from "@/components/NotFoundPage";

async function getArticlesForParent(parentId) {
  if (!parentId) return [];
  try {
    const res = await fetch(`https://careermitra.in/api/blogs?parent_category_id=${parentId}`);
    const json = await res.json();
    const d = json.data || json;
    return d.articles || [];
  } catch (e) {
    console.error("Error fetching category articles on server:", e);
    return [];
  }
}

export default async function Page({ params }) {
  const { parentSlug } = await params;
  if (!parentSlug || parentSlug.includes(".")) {
    return <NotFoundPage />;
  }
  const initialFilterData = await getFilterData();
  const parent = initialFilterData.parents.find(p => toSlug(p.name, p.slug) === parentSlug);
  const initialArticles = await getArticlesForParent(parent?.id);
  return (
    <ArticleList
      key={parentSlug}
      initialFilterData={initialFilterData}
      initialArticles={initialArticles}
    />
  );
}
