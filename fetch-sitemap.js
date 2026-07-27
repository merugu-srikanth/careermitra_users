const fs = require("fs");
const path = require("path");

const generateSlug = (title) => {
  return title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
};

async function fetchSitemap() {
  try {
    // 1. Fetch main sitemap
    console.log("Fetching base sitemap from API...");
    const response = await fetch("https://www.careermitra.in/api/sitemap.xml");
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }
    let xml = await response.text();

    // 2. Fetch internships using pagination
    console.log("Fetching all internships...");
    let page = 1;
    let totalPages = 1;
    let allInternships = [];

    do {
      const url = `https://careermitra.in/api/internships?page=${page}&limit=100`;
      console.log(`Requesting page ${page} of internships...`);
      const internResponse = await fetch(url);
      
      if (internResponse.ok) {
        const internJson = await internResponse.json();
        if (internJson.success && internJson.data && internJson.data.internships) {
          const pageInternships = internJson.data.internships;
          allInternships = allInternships.concat(pageInternships);
          totalPages = internJson.data.pagination?.totalPages || 1;
          console.log(`Fetched ${pageInternships.length} internships from page ${page}. Total so far: ${allInternships.length}`);
          page++;
        } else {
          console.warn(`Success is false or data/internships missing on page ${page}:`, internJson);
          break;
        }
      } else {
        console.warn(`Could not fetch internships page ${page}. Status: ${internResponse.status} ${internResponse.statusText}`);
        break;
      }
    } while (page <= totalPages);

    if (allInternships.length > 0) {
      console.log(`Generating sitemap entries for ${allInternships.length} internships...`);
      let internshipUrlsXml = "";
      for (const item of allInternships) {
        if (item.internship_title) {
          const slug = generateSlug(item.internship_title);
          const rawDate = item.updated_at || item.created_at || new Date().toISOString();
          let dateStr;
          try {
            dateStr = new Date(rawDate).toISOString();
          } catch (e) {
            dateStr = new Date().toISOString();
          }

          internshipUrlsXml += `  <url>\n`;
          internshipUrlsXml += `    <loc>https://careermitra.in/internships/${slug}</loc>\n`;
          internshipUrlsXml += `    <lastmod>${dateStr}</lastmod>\n`;
          internshipUrlsXml += `  </url>\n`;
        }
      }

      const urlsetIndex = xml.lastIndexOf("</urlset>");
      if (urlsetIndex !== -1) {
        xml = xml.substring(0, urlsetIndex) + internshipUrlsXml + xml.substring(urlsetIndex);
      }
    }

    fs.writeFileSync(path.resolve("public/sitemap.xml"), xml);
    console.log("Successfully fetched, appended internships, and saved sitemap.xml to public/ folder!");
  } catch (error) {
    console.error("Failed to fetch sitemap:", error);
  }
}

fetchSitemap();
