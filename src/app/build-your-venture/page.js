import BuildVentureClient from "./BuildVentureClient";
import { generateOrganizationSchema, generateWebPageSchema, generateFAQSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Build Your Own Venture - CareerMitra | Startup, Web & App Development Support",
  description: "Turn your business idea into a practical venture. CareerMitra offers web & app development, digital marketing, MVP building, and launch guidance for students, freshers, and alumni.",
  keywords: "Build Venture, CareerMitra Startup Support, Student Startup, Web Development, Mobile App MVP, Digital Marketing, Freshers Startup, Alumni Entrepreneurship",
  alternates: {
    canonical: "https://careermitra.in/build-your-venture",
  },
  openGraph: {
    title: "Find Your Opportunity, or Build One - CareerMitra Startup Support",
    description: "Technology, digital foundation, and launch support for early-stage founders, students, and alumni within 4 years of graduation.",
    url: "https://careermitra.in/build-your-venture",
    type: "website",
    siteName: "Career Mitra",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Build Your Own Venture - CareerMitra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Own Venture - CareerMitra",
    description: "Web & App development, MVP creation, and digital marketing support for young founders.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

const startupFaqs = [
  {
    q: "Who is eligible for CareerMitra startup support?",
    a: "Students, freshers, and alumni who graduated within the last four years are eligible for our startup and venture support services."
  },
  {
    q: "Do I need a complete business plan to start?",
    a: "No. A complete business plan is not required to begin. A clear problem statement, an early idea, and the dedication to work on it are enough for the first step."
  },
  {
    q: "What digital services does CareerMitra provide for new ventures?",
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
      name: "Build Your Own Venture - CareerMitra",
      description: "Technology, digital foundation, and launch guidance for early-stage ventures.",
      url: "https://careermitra.in/build-your-venture"
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
      <BuildVentureClient />
    </>
  );
}
