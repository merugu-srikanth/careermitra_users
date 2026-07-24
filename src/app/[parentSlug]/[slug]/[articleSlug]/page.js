import ArticleDetail from "@/components/Articles/ArticleDetail";

async function getArticle(articleSlug) {
  try {
    const res = await fetch(`https://careermitra.in/api/blogs/slug/${articleSlug}`);
    const data = await res.json();
    if (data.success) {
      return data.article || data.data || data;
    }
  } catch (e) {
    console.error("Error fetching article on server:", e);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { parentSlug, slug, articleSlug } = await params;
  const art = await getArticle(articleSlug);
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
      canonical: `https://www.careermitra.in/${parentSlug}/${slug}/${articleSlug}`,
    },
    openGraph: {
      title: `${title} | Career Mitra`,
      description: desc,
      url: `https://www.careermitra.in/${parentSlug}/${slug}/${articleSlug}`,
      images: image ? [{ url: image }] : [],
      type: "article",
    },
  };
}

export default function Page() {
  return <ArticleDetail />;
}
