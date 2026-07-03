/**
 * Schema.org JSON-LD generator helper functions for CareerMitra.
 * All helper functions return clean JS objects that can be serialized.
 */

const BASE_URL = "https://www.careermitra.in";
const DEFAULT_LOGO = `${BASE_URL}/src/assets/NewLogo.png`;

/**
 * Helper to ensure a URL is absolute.
 */
const absoluteUrl = (path) => {
  if (!path) return BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/**
 * Generate Organization Schema.
 */
export function generateOrganizationSchema(customData = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": customData.name || "CareerMitra",
    "url": customData.url || BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": customData.logo || DEFAULT_LOGO,
    },
    "sameAs": customData.sameAs || [
      "https://www.facebook.com/careermitra.in",
      "https://twitter.com/CareerMitraaa",
      "https://www.linkedin.com/company/careermitra"
    ],
    "contactPoint": customData.contactPoint || {
      "@type": "ContactPoint",
      "email": "info@careermitra.in",
      "contactType": "customer service"
    },
    ...customData.extra
  };
}

/**
 * Generate WebSite Schema.
 */
export function generateWebsiteSchema(customData = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": customData.name || "CareerMitra",
    "url": customData.url || BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/government-jobs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    ...customData.extra
  };
}

/**
 * Generate SearchAction Schema.
 */
export function generateSearchActionSchema(customData = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": customData.urlTemplate || `${BASE_URL}/government-jobs?search={search_term_string}`
    },
    "query-input": "required name=search_term_string",
    ...customData.extra
  };
}

/**
 * Generate BreadcrumbList Schema dynamically.
 * @param {Array<{name: string, item: string}>} items - List of breadcrumb links and names.
 */
export function generateBreadcrumbSchema(items = []) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": absoluteUrl(item.item)
    }))
  };
}

/**
 * Generate Course Schema.
 */
export function generateCourseSchema(course = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name || "Software Development Course",
    "description": course.description || "Learn core software skills.",
    "provider": {
      "@type": "Organization",
      "name": course.providerName || "CareerMitra",
      "sameAs": BASE_URL
    },
    "hasCourseInstance": course.lessons ? course.lessons.map(lesson => ({
      "@type": "CourseInstance",
      "courseMode": course.mode || "online",
      "name": lesson.name,
      "description": lesson.description
    })) : undefined,
    "educationalLevel": course.difficulty || "Beginner",
    "inLanguage": course.language || "en",
    ...course.extra
  };
}

/**
 * Generate Article Schema.
 */
export function generateArticleSchema(article = {}) {
  const published = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
  const modified = article.modifiedAt ? new Date(article.modifiedAt).toISOString() : published;

  return {
    "@context": "https://schema.org",
    "@type": article.type || "Article",
    "headline": article.headline || article.title,
    "description": article.description,
    "image": article.image ? [absoluteUrl(article.image)] : [`${BASE_URL}/og-default.png`],
    "datePublished": published,
    "dateModified": modified,
    "author": {
      "@type": article.authorType || "Person",
      "name": article.authorName || "CareerMitra Editorial Team",
      "url": article.authorUrl ? absoluteUrl(article.authorUrl) : undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "CareerMitra",
      "logo": {
        "@type": "ImageObject",
        "url": DEFAULT_LOGO
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl(article.url)
    },
    ...article.extra
  };
}

/**
 * Generate FAQPage Schema.
 * @param {Array<{q: string, a: string}>} faqs - Questions and Answers.
 */
export function generateFAQSchema(faqs = []) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q || faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a || faq.answer
      }
    }))
  };
}

/**
 * Generate HowTo Schema.
 */
export function generateHowToSchema(howto = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howto.name,
    "description": howto.description,
    "step": (howto.steps || []).map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "url": step.url ? absoluteUrl(step.url) : undefined,
      "name": step.name || `Step ${index + 1}`,
      "text": step.text,
      "image": step.image ? absoluteUrl(step.image) : undefined
    })),
    ...howto.extra
  };
}

/**
 * Generate Person Schema.
 */
export function generatePersonSchema(person = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "jobTitle": person.jobTitle,
    "worksFor": person.worksFor ? {
      "@type": "Organization",
      "name": person.worksFor
    } : undefined,
    "sameAs": person.sameAs || [],
    ...person.extra
  };
}

/**
 * Generate SoftwareApplication Schema.
 */
export function generateSoftwareApplicationSchema(app = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "operatingSystem": app.operatingSystem || "All",
    "applicationCategory": app.applicationCategory || "EducationalApplication",
    "offers": app.offers ? generateOfferSchema(app.offers) : undefined,
    ...app.extra
  };
}

/**
 * Generate Product Schema.
 */
export function generateProductSchema(product = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image ? [absoluteUrl(product.image)] : undefined,
    "description": product.description,
    "offers": product.offers ? generateOfferSchema(product.offers) : undefined,
    ...product.extra
  };
}

/**
 * Generate Offer Schema.
 */
export function generateOfferSchema(offer = {}) {
  return {
    "@type": "Offer",
    "price": offer.price || "0.00",
    "priceCurrency": offer.priceCurrency || "INR",
    "availability": offer.availability || "https://schema.org/InStock",
    "url": offer.url ? absoluteUrl(offer.url) : undefined,
    ...offer.extra
  };
}

/**
 * Generate VideoObject Schema.
 */
export function generateVideoObjectSchema(video = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl ? [absoluteUrl(video.thumbnailUrl)] : [],
    "uploadDate": video.uploadDate,
    "contentUrl": video.contentUrl,
    "embedUrl": video.embedUrl,
    ...video.extra
  };
}

/**
 * Generate JobPosting Schema.
 */
export function generateJobPostingSchema(job = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.datePosted ? new Date(job.datePosted).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    "validThrough": job.validThrough ? new Date(job.validThrough).toISOString().split('T')[0] : undefined,
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.companyName || job.org || "CareerMitra",
      "sameAs": BASE_URL,
      "logo": DEFAULT_LOGO
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.locality || job.city || "New Delhi",
        "addressRegion": job.region || job.state || "Delhi",
        "addressCountry": "IN"
      }
    },
    ...job.extra
  };
}

/**
 * Generate EducationalOrganization Schema.
 */
export function generateEducationalOrganizationSchema(org = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": org.name || "CareerMitra Academy",
    "url": org.url || BASE_URL,
    "logo": DEFAULT_LOGO,
    ...org.extra
  };
}

/**
 * Generate CollectionPage Schema.
 */
export function generateCollectionPageSchema(page = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": page.name,
    "description": page.description,
    "url": absoluteUrl(page.url),
    ...page.extra
  };
}

/**
 * Generate ItemList Schema.
 */
export function generateItemListSchema(items = []) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, index) => {
      if (typeof item === 'string') {
        return {
          "@type": "ListItem",
          "position": index + 1,
          "url": absoluteUrl(item)
        };
      }
      return {
        "@type": "ListItem",
        "position": index + 1,
        "url": item.url ? absoluteUrl(item.url) : undefined,
        "name": item.name,
        "item": item.item ? generateArticleSchema(item.item) : undefined
      };
    })
  };
}

/**
 * Generate WebPage Schema.
 */
export function generateWebPageSchema(page = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.name,
    "description": page.description,
    "url": absoluteUrl(page.url),
    ...page.extra
  };
}
