import { cache } from "react";
import TwoSegmentResolver from "@/components/Articles/TwoSegmentResolver";
import ArticleDetail from "@/components/Articles/ArticleDetail";
import NotFoundPage from "@/components/NotFoundPage";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// cache() dedupes this fetch — generateMetadata and Page both call it for
// the same request, and React's per-request cache collapses them into one.
const getRouteTypeAndData = cache(async (parentSlug, slug) => {
  try {
    // 1. Check if it's a category
    const filterRes = await fetch("https://careermitra.in/api/blogs/filters");
    const filterJson = await filterRes.json();
    const d = filterJson.data || filterJson;
    const parents = d.parents || [];
    const children = d.children || [];

    const parent = parents.find(p => toSlug(p.name, p.slug) === parentSlug);
    if (parent) {
      const child = children.find(c => c.parent_id === parent.id && toSlug(c.name, c.slug) === slug);
      if (child) {
        return { type: "category", name: child.name, parentName: parent.name };
      }
    }

    // 2. Otherwise check if it's an article
    const artRes = await fetch(`https://careermitra.in/api/blogs/slug/${slug}`);
    const artJson = await artRes.json();
    if (artJson.success) {
      return { type: "article", data: artJson.article || artJson.data || artJson };
    }
  } catch (e) {
    console.error("Error resolving two-segment route metadata:", e);
  }
  return { type: "article", data: null };
});

export async function generateMetadata({ params }) {
  const { parentSlug, slug } = await params;
  const result = await getRouteTypeAndData(parentSlug, slug);

  if (result.type === "category") {
    const title = `${result.name} Jobs 2026 - Career Mitra`;
    const desc = `Find latest ${result.name} recruitment notifications, exam dates, eligibility and guidelines under ${result.parentName} on Career Mitra.`;
    return {
      title,
      description: desc,
      alternates: {
        canonical: `https://careermitra.in/${parentSlug}/${slug}`,
      },
      openGraph: {
        title,
        description: desc,
        url: `https://careermitra.in/${parentSlug}/${slug}`,
        images: [{ url: "https://careermitra.in/default_og_image.png" }],
      },
    };
  }

  const art = result.data;
  if (!art) {
    return {
      title: "Government Jobs",
    };
  }

  const title = art.meta_title || art.title || "Article";
  const desc = art.meta_description || art.short_description || "";
  let image = art.featured_image || "";
  if (!image || image.startsWith("data:image")) {
    image = "https://careermitra.in/default_og_image.png";
  }

  return {
    title: `${title} - Career Mitra`,
    description: desc,
    alternates: {
      canonical: `https://careermitra.in/${parentSlug}/${slug}`,
    },
    openGraph: {
      title: `${title} - Career Mitra`,
      description: desc,
      url: `https://careermitra.in/${parentSlug}/${slug}`,
      images: [{ url: image }],
      type: "article",
    },
  };
}

export default async function Page({ params }) {
  const { parentSlug, slug } = await params;
  if (!parentSlug || parentSlug.includes(".") || !slug || slug.includes(".")) {
    return <NotFoundPage />;
  }

  // Server already knows whether this is an article (and has its full data)
  // from the generateMetadata call above — render it directly so the first
  // HTML response has the real content, instead of handing an empty shell
  // to TwoSegmentResolver to figure out client-side.
  const result = await getRouteTypeAndData(parentSlug, slug);
  if (result.type === "article" && result.data) {
    return <ArticleDetail key={slug} initialArticle={result.data} />;
  }

  // Category page, or the server-side article lookup failed — fall back to
  // the existing client-side resolver (unchanged behavior).
  return <TwoSegmentResolver />;
}
