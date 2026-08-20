const fs = require("fs");
const path = require("path");

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const generateSlug = (title) => {
  return title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
};

function buildArticleUrl(article) {
  const tree = article.categoryTree?.[0];
  if (!tree) return `/${article.slug}`;
  const parentSlug = toSlug(tree.parent?.name, tree.parent?.slug);
  const child = tree.children?.find(c => c.id === article.primary_category?._id);
  if (child) {
    const childSlug = toSlug(child.name, child.slug);
    return `/${parentSlug}/${childSlug}/${article.slug}`;
  }
  return `/${parentSlug}/${article.slug}`;
}

async function buildSitemap() {
  try {
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const currentDate = new Date().toISOString();

    // 1. Static Pages
    console.log("Adding static pages...");
    const staticUrls = [
      "https://careermitra.in/",
      "https://careermitra.in/latest-job-notifications",
      "https://careermitra.in/government-jobs",
      "https://careermitra.in/internship-guide",
      // "https://careermitra.in/career-guide",
      "https://careermitra.in/events",
      "https://careermitra.in/about-us",
      "https://careermitra.in/contact-us",
      "https://careermitra.in/privacy-policy",
      "https://careermitra.in/terms-of-service",
      "https://careermitra.in/disclaimer",
      "https://careermitra.in/editorial-policy",
      "https://careermitra.in/correction-policy",
    ];

    for (const url of staticUrls) {
      sitemapXml += `  <url>\n`;
      sitemapXml += `    <loc>${url}</loc>\n`;
      sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemapXml += `  </url>\n`;
    }

    // 2. Fetch Categories (Filters)
    console.log("Fetching categories...");
    try {
      const filterRes = await fetch("https://careermitra.in/api/blogs/filters");
      if (filterRes.ok) {
        const filterJson = await filterRes.json();
        const d = filterJson.data || filterJson;
        const parents = d.parents || [];
        const children = d.children || [];

        for (const p of parents) {
          const parentSlug = toSlug(p.name, p.slug);
          sitemapXml += `  <url>\n`;
          sitemapXml += `    <loc>https://careermitra.in/${parentSlug}</loc>\n`;
          sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
          sitemapXml += `  </url>\n`;
        }

        for (const c of children) {
          const parent = parents.find(p => p.id === c.parent_id);
          if (parent) {
            const parentSlug = toSlug(parent.name, parent.slug);
            const childSlug = toSlug(c.name, c.slug);
            sitemapXml += `  <url>\n`;
            sitemapXml += `    <loc>https://careermitra.in/${parentSlug}/${childSlug}</loc>\n`;
            sitemapXml += `    <lastmod>${currentDate}</lastmod>\n`;
            sitemapXml += `  </url>\n`;
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch/add categories to sitemap:", err);
    }

    // 3. Fetch Articles/Blogs using pagination
    console.log("Fetching all articles/blogs...");
    let blogPage = 1;
    let blogTotalPages = 1;
    let allBlogs = [];

    do {
      const url = `https://careermitra.in/api/blogs?page=${blogPage}&limit=100`;
      console.log(`Requesting page ${blogPage} of blogs...`);
      const blogResponse = await fetch(url);
      
      if (blogResponse.ok) {
        const blogJson = await blogResponse.json();
        if (blogJson.success && blogJson.data && blogJson.data.articles) {
          const pageBlogs = blogJson.data.articles;
          allBlogs = allBlogs.concat(pageBlogs);
          blogTotalPages = blogJson.data.pagination?.totalPages || 1;
          console.log(`Fetched ${pageBlogs.length} blogs from page ${blogPage}. Total so far: ${allBlogs.length}`);
          blogPage++;
        } else {
          break;
        }
      } else {
        console.warn(`Could not fetch blogs page ${blogPage}. Status: ${blogResponse.status}`);
        break;
      }
    } while (blogPage <= blogTotalPages);

    for (const blog of allBlogs) {
      if (blog.slug) {
        const urlPath = buildArticleUrl(blog);
        const rawDate = blog.updated_at || blog.created_at || blog.published_at || currentDate;
        let dateStr;
        try {
          dateStr = new Date(rawDate).toISOString();
        } catch (e) {
          dateStr = currentDate;
        }

        sitemapXml += `  <url>\n`;
        sitemapXml += `    <loc>https://careermitra.in${urlPath}</loc>\n`;
        sitemapXml += `    <lastmod>${dateStr}</lastmod>\n`;
        sitemapXml += `  </url>\n`;
      }
    }

    // 4. Fetch Internships using pagination
    console.log("Fetching all internships...");
    let internPage = 1;
    let internTotalPages = 1;
    let allInternships = [];
    const internshipsMap = {};

    do {
      const url = `https://careermitra.in/api/internships?page=${internPage}&limit=100`;
      console.log(`Requesting page ${internPage} of internships...`);
      const internResponse = await fetch(url);
      
      if (internResponse.ok) {
        const internJson = await internResponse.json();
        if (internJson.success && internJson.data && internJson.data.internships) {
          const pageInternships = internJson.data.internships;
          allInternships = allInternships.concat(pageInternships);
          
          for (const item of pageInternships) {
            if (item.internship_title && item.id) {
              const slug = generateSlug(item.internship_title);
              internshipsMap[slug] = item.id;
            }
          }

          internTotalPages = internJson.data.pagination?.totalPages || 1;
          console.log(`Fetched ${pageInternships.length} internships from page ${internPage}. Total so far: ${allInternships.length}`);
          internPage++;
        } else {
          break;
        }
      } else {
        console.warn(`Could not fetch internships page ${internPage}. Status: ${internResponse.status}`);
        break;
      }
    } while (internPage <= internTotalPages);

    for (const item of allInternships) {
      if (item.internship_title) {
        const slug = generateSlug(item.internship_title);
        const rawDate = item.updated_at || item.created_at || currentDate;
        let dateStr;
        try {
          dateStr = new Date(rawDate).toISOString();
        } catch (e) {
          dateStr = currentDate;
        }

        sitemapXml += `  <url>\n`;
        sitemapXml += `    <loc>https://careermitra.in/internships/${slug}</loc>\n`;
        sitemapXml += `    <lastmod>${dateStr}</lastmod>\n`;
        sitemapXml += `  </url>\n`;
      }
    }

    sitemapXml += `</urlset>\n`;

    // Save sitemap
    console.log("Writing public/sitemap.xml...");
    fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemapXml);

    // Save mapping file
    console.log("Saving internships slug-to-ID mapping...");
    fs.writeFileSync(path.resolve("public/internships-map.json"), JSON.stringify(internshipsMap, null, 2));

    console.log("Sitemap generation completed successfully!");
  } catch (error) {
    console.error("Failed to build sitemap:", error);
  }
}

buildSitemap();
