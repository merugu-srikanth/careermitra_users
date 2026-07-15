const fs = require("fs");
const path = require("path");

async function fetchSitemap() {
  try {
    const response = await fetch("https://careermitra.in/api/sitemap.xml");
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }
    const xml = await response.text();
    
    fs.writeFileSync(path.resolve("public/sitemap.xml"), xml);
    console.log("Successfully fetched and saved sitemap.xml to public/ folder!");
  } catch (error) {
    console.error("Failed to fetch sitemap:", error);
  }
}

fetchSitemap();
