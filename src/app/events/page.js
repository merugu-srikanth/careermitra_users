import EventsPageClient from "./EventsPageClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

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

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Media & Events | Career Mitra",
      description: "Browse the latest media and events shared by Career Mitra.",
      url: "https://careermitra.in/events"
    })
  ];
  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <EventsPageClient />
    </>
  );
}
