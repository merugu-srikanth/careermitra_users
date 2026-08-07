import MeetOurTeamClient from "./MeetOurTeamClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Our Team - Career Mitra",
  description: "Meet the core team and visionaries behind Careermitra — dedicated educators and retired officials working to bridge the career gap for rural youth.",
  alternates: {
    canonical: "https://careermitra.in/meet-our-team",
  },
  openGraph: {
    title: "Our Team - Career Mitra",
    description: "Meet the core team and visionaries behind Careermitra — dedicated educators and retired officials working to bridge the career gap for rural youth.",
    url: "https://careermitra.in/meet-our-team",
    type: "website",
    siteName: "Career Mitra",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Our Team - Career Mitra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team - Career Mitra",
    description: "Meet the core team and visionaries behind Careermitra — dedicated educators and retired officials working to bridge the career gap for rural youth.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Our Team - Career Mitra",
      description: "Meet the core team and visionaries behind Careermitra — dedicated educators and retired officials working to bridge the career gap for rural youth.",
      url: "https://careermitra.in/meet-our-team"
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
      <MeetOurTeamClient />
    </>
  );
}
