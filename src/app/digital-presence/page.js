import DigitalPresenceClient from "./DigitalPresenceClient";
import { generateOrganizationSchema, generateWebPageSchema, generateFAQSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Digital Presence & Startup Support - CareerMitra | Web & App Development",
  description: "Launch your digital presence with confidence. CareerMitra offers website development, mobile apps, CRM solutions, and digital marketing tailored to your needs.",
  keywords: "Digital Presence, CareerMitra Digital Presence, Web Development, Mobile App MVP, Digital Marketing, Startup Support, Build Venture",
  alternates: {
    canonical: "https://careermitra.in/digital-presence",
  },
  openGraph: {
    title: "Launch Your Digital Presence with Confidence - CareerMitra",
    description: "Technology, digital foundation, and launch support for early-stage founders, students, and businesses.",
    url: "https://careermitra.in/digital-presence",
    type: "website",
    siteName: "Career Mitra",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Digital Presence - CareerMitra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Presence - CareerMitra",
    description: "Affordable website development, CRM solutions, and digital marketing services.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

const startupFaqs = [
  {
    q: "Who is eligible for CareerMitra digital presence & startup support?",
    a: "Students, freshers, business owners, and alumni who graduated within the last four years are eligible for our technology and digital services."
  },
  {
    q: "Do I need a complete business plan to start?",
    a: "No. A complete business plan is not required to begin. A clear problem statement, an early idea, and the dedication to work on it are enough for the first step."
  },
  {
    q: "What digital services does CareerMitra provide?",
    a: "We offer end-to-end web development, high-converting landing pages, portfolio sites, mobile apps, MVP builds, SEO optimization, social media support, and digital marketing strategies."
  },
  {
    q: "How does the 5-Stage Idea to Launch framework work?",
    a: "Our structured framework guides founders through 5 stages: 1. Idea (Problem definition), 2. Validate (Market demand testing), 3. Build (MVP & brand basics), 4. Launch (Live audience rollout), and 5. Grow (Refine & scale digital presence)."
  }
];

export default function Page() {
  const schemas = [
    generateOrganizationSchema(),
    generateWebPageSchema({
      name: "Digital Presence - CareerMitra",
      description: "Affordable website development, CRM solutions, and digital marketing services.",
      url: "https://careermitra.in/digital-presence"
    }),
    generateFAQSchema(startupFaqs)
  ].filter(Boolean);

  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <DigitalPresenceClient />
    </>
  );
}
