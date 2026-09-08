import EventsPageClient from "./EventsPageClient";
import { generateWebPageSchema, generateOrganizationSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Media & Events - Career Mitra",
  description: "Browse the latest media and events shared by Career Mitra.",
  alternates: {
    canonical: "https://careermitra.in/events",
  },
  openGraph: {
    title: "Media & Events - Career Mitra",
    description: "Browse the latest media and events shared by Career Mitra.",
    url: "https://careermitra.in/events",
    images: [{ url: "https://careermitra.in/default_og_image.png" }],
  },
};

const API_BASE = "https://careermitra.in/api/media";
const DEFAULT_LIMIT = 32;

async function getInitialMedia() {
  try {
    const params = new URLSearchParams({ page: "1", limit: String(DEFAULT_LIMIT), sort: "newest" });
    const res = await fetch(`${API_BASE}?${params.toString()}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Media API responded ${res.status}`);
    const payload = await res.json();
    const data = payload?.data || payload || {};
    return {
      media: Array.isArray(data.media) ? data.media : [],
      totalCount: data.pagination?.total ?? 0,
      totalPages: data.pagination?.totalPages ?? 1,
    };
  } catch {
    return { media: [], totalCount: 0, totalPages: 1 };
  }
}

export default async function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Media & Events | Career Mitra",
      description: "Browse the latest media and events shared by Career Mitra.",
      url: "https://careermitra.in/events"
    }),
    generateOrganizationSchema()
  ];
  const initialData = await getInitialMedia();
  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <EventsPageClient initialData={initialData} />
    </>
  );
}

