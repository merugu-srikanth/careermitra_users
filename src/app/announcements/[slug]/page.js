import AnnouncementDetail from "./AnnouncementDetailClient";
import { generateArticleSchema } from '@/utils/schemaHelpers';

const ANNOUNCEMENTS_API = "https://www.careermitra.in/api/announcements";

async function getAnnouncementData(slug) {
  try {
    const listRes = await fetch(ANNOUNCEMENTS_API);
    const listJson = await listRes.json();
    const list = Array.isArray(listJson?.data) ? listJson.data : [];
    const matched = list.find((item) => item.slug === slug || item._id === slug || item.id === slug);
    if (matched) {
      const detailRes = await fetch(`${ANNOUNCEMENTS_API}/${matched.id || matched._id}`);
      const detailJson = await detailRes.json();
      if (detailJson.success) {
        return detailJson.data;
      }
    }
  } catch (e) {
    console.error("Error fetching announcement on server:", e);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getAnnouncementData(slug);
  if (!data) {
    return {
      title: "Announcement | Career Mitra",
    };
  }
  const title = data.title || "Announcement";
  const info = data.info ? data.info.replace(/<[^>]*>/g, '').slice(0, 160) : title;

  return {
    title: `${title} | Career Mitra`,
    description: info,
    alternates: {
      canonical: `https://careermitra.in/announcements/${data.slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getAnnouncementData(slug);
  
  let schemas = [];
  if (data) {
    const articleSchema = generateArticleSchema({
      headline: data.title,
      description: data.info ? data.info.replace(/<[^>]*>/g, '').slice(0, 160) : data.title,
      image: data.image,
      publishedAt: data.publishedAt || data.createdAt,
      modifiedAt: data.updatedAt || data.publishedAt || data.createdAt,
      url: `/announcements/${data.slug}`,
      authorName: "CareerMitra Editorial Team"
    });
    schemas = [articleSchema].filter(Boolean);
  }

  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <AnnouncementDetail initialData={data} />
    </>
  );
}
