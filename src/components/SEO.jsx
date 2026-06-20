import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  keywords,
  image,
  imageAlt,
  url,
  type = "website",
  publishedAt,
  modifiedAt,
  authorName,
  tags = [],
  section,
}) {
  const safeTitle       = title       || "CareerMitra";
  const safeDescription = description || "Government Jobs & Career Platform for India";
  const safeImage       = image       || "https://www.careermitra.in/og-default.png";
  const safeImageAlt    = imageAlt    || safeTitle;

  const jsonLd = type === "article" ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": safeTitle,
    "description": safeDescription,
    "image": safeImage,
    "url": url,
    "datePublished": publishedAt,
    "dateModified": modifiedAt || publishedAt,
    "author": {
      "@type": "Person",
      "name": authorName || "CareerMitra",
    },
    "publisher": {
      "@type": "Organization",
      "name": "CareerMitra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.careermitra.in/logo192.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
  }) : null;

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {url && <link rel="canonical" href={url} />}

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image"       content={safeImage} />
      <meta property="og:image:alt"   content={safeImageAlt} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      {url && <meta property="og:url"  content={url} />}
      <meta property="og:site_name"   content="CareerMitra" />
      <meta property="og:locale"      content="en_IN" />

      {/* ── Article OG ── */}
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === "article" && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      {type === "article" && authorName && (
        <meta property="article:author" content={authorName} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@CareerMitraaa" />
      <meta name="twitter:title"       content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image"       content={safeImage} />
      <meta name="twitter:image:alt"   content={safeImageAlt} />
      {authorName && (
        <meta name="twitter:creator" content={authorName} />
      )}

      {/* ── JSON-LD Structured Data ── */}
      {jsonLd && (
        <script type="application/ld+json">{jsonLd}</script>
      )}
    </Helmet>
  );
}
