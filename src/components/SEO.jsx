"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
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
  schema = null,
}) {
  const pathname = usePathname();

  const safeTitle       = title       || "CareerMitra";
  const safeDescription = description || "Government Jobs & Career Platform for India";
  const safeImage       = image       || "https://www.careermitra.in/og-default.png";
  const safeImageAlt    = imageAlt    || safeTitle;

  useEffect(() => {
    // Update Title
    document.title = safeTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = safeDescription;

    // Keywords
    if (keywords) {
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.name = "keywords";
        document.head.appendChild(metaKey);
      }
      metaKey.content = keywords;
    }

    // Canonical link
    const searchString = typeof window !== "undefined" ? window.location.search : "";
    const absoluteCurrentUrl = url || `https://www.careermitra.in${pathname}${searchString}`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = absoluteCurrentUrl;

    // Clean up dynamic schemas previously added
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"].dynamic-seo-schema');
    schemaScripts.forEach(s => s.remove());

    // Assemble dynamic breadcrumbs if not custom provided
    let autoBreadcrumbSchema = null;
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const breadcrumbItems = [{ name: "Home", item: "/" }];
      let accumulatedPath = "";
      pathSegments.forEach((segment) => {
        accumulatedPath += `/${segment}`;
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

    // Deduplicate schemas by @type
    const dedupedMap = new Map();
    mergedSchemas.forEach(s => {
      if (s && s["@type"]) {
        dedupedMap.set(s["@type"], s);
      }
    });
    const finalSchemas = Array.from(dedupedMap.values());

    // Append new scripts to head
    finalSchemas.forEach(sch => {
      const script = document.createElement('script');
      script.type = "application/ld+json";
      script.className = "dynamic-seo-schema";
      script.text = JSON.stringify(sch);
      document.head.appendChild(script);
    });

  }, [safeTitle, safeDescription, keywords, url, pathname, schema]);

  return null;
}
