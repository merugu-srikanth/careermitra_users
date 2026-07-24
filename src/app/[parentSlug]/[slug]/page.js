import TwoSegmentResolver from "@/components/Articles/TwoSegmentResolver";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

async function getRouteTypeAndData(parentSlug, slug) {
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
}

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
        canonical: `https://www.careermitra.in/${parentSlug}/${slug}`,
      },
      openGraph: {
        title,
        description: desc,
        url: `https://www.careermitra.in/${parentSlug}/${slug}`,
      },
    };
  }

  const art = result.data;
  if (!art) {
    return {
      title: "Articles | Career Mitra",
    };
  }

  const title = art.meta_title || art.title || "Article";
  const desc = art.meta_description || art.short_description || "";
  const image = art.featured_image || "";

  return {
    title: `${title} | Career Mitra`,
    description: desc,
    alternates: {
      canonical: `https://www.careermitra.in/${parentSlug}/${slug}`,
    },
    openGraph: {
      title: `${title} | Career Mitra`,
      description: desc,
      url: `https://www.careermitra.in/${parentSlug}/${slug}`,
      images: image ? [{ url: image }] : [],
      type: "article",
    },
  };
}

export default function Page() {
  return <TwoSegmentResolver />;
}
