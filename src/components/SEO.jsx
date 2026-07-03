import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { generateBreadcrumbSchema } from "../utils/schemaHelpers";

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
  schema = null, // Can be a single schema object or an array of schema objects
}) {
  const location = useLocation();

  const safeTitle       = title       || "CareerMitra";
  const safeDescription = description || "Government Jobs & Career Platform for India";
  const safeImage       = image       || "https://www.careermitra.in/og-default.png";
  const safeImageAlt    = imageAlt    || safeTitle;

  // Determine actual absolute URL if not explicitly provided
  const absoluteCurrentUrl = url || `https://www.careermitra.in${location.pathname}${location.search}`;

  // Assemble dynamic breadcrumbs if not custom provided
  let autoBreadcrumbSchema = null;
  const pathSegments = location.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    const breadcrumbItems = [{ name: "Home", item: "/" }];
    let accumulatedPath = "";
    pathSegments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      // Clean up segment name for display (e.g. government-jobs -> Government Jobs)
      const cleanName = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbItems.push({
        name: cleanName,
        item: accumulatedPath
      });
    });
    autoBreadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  }

  // Normalize schemas: filter out nulls/falsy values
  const inputSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  let mergedSchemas = [...inputSchemas];

  // If there isn't a BreadcrumbList in the user-provided schemas, add the auto-generated one
  const hasBreadcrumb = mergedSchemas.some(
    s => s && (s["@type"] === "BreadcrumbList" || s["@type"] === "http://schema.org/BreadcrumbList")
  );
  if (!hasBreadcrumb && autoBreadcrumbSchema) {
    mergedSchemas.push(autoBreadcrumbSchema);
  }

  // Deduplicate schemas by @type (keeping the last one if duplicates occur, or merging where relevant)
  const dedupedMap = new Map();
  mergedSchemas.forEach(s => {
    if (s && s["@type"]) {
      dedupedMap.set(s["@type"], s);
    }
  });
  const finalSchemas = Array.from(dedupedMap.values());

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={absoluteCurrentUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image"       content={safeImage} />
      <meta property="og:image:alt"   content={safeImageAlt} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url"         content={absoluteCurrentUrl} />
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
      {finalSchemas.map((sch, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(sch)}
        </script>
      ))}
    </Helmet>
  );
}

