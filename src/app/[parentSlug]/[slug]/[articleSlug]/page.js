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
      canonical: `https://careermitra.in/${parentSlug}/${slug}/${articleSlug}`,
    },
    openGraph: {
      title: `${title} - Career Mitra`,
      description: desc,
      url: `https://careermitra.in/${parentSlug}/${slug}/${articleSlug}`,
      images: [{ url: image }],
      type: "article",
    },
  };
}

export default function Page() {
  return <ArticleDetail />;
}
