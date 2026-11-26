import ExamImageCompressorClient from "./ExamImageCompressorClient";
import CompressorContent from "./CompressorContent";
import { PAGE_URL, PAGE_TITLE, PAGE_DESCRIPTION, FAQS, STEPS } from "./content";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema,
  generateHowToSchema,
  generateFAQSchema,
} from "@/utils/schemaHelpers";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords:
    "exam photo compressor, signature compressor, resize photo to 20kb, resize photo to 50kb, compress image to 100kb, SSC photo size, UPSC photo signature size, IBPS photo signature, RRB photo size, NEET photo size, JEE photo size, government job application photo",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    siteName: "Career Mitra",
    images: [
      {
        url: "https://careermitra.in/default_og_image.png",
        width: 1200,
        height: 630,
        alt: "Career Mitra Exam Photo & Signature Compressor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({ name: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL }),
    generateBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Exam Image Compressor", item: "/tools/exam-image-compressor" },
    ]),
    generateSoftwareApplicationSchema({
      name: "Career Mitra Exam Image Compressor",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (web browser)",
      offers: { price: "0.00", priceCurrency: "INR", url: "/tools/exam-image-compressor" },
      extra: { url: PAGE_URL, description: PAGE_DESCRIPTION },
    }),
    generateHowToSchema({
      name: "How to compress a photo or signature for a government job application",
      description:
        "Prepare a photo or signature to the size, dimensions and format an exam form asks for.",
      steps: STEPS.map((text) => ({ text })),
    }),
    generateFAQSchema(FAQS),
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
      <div className="min-h-screen bg-white text-slate-800 pt-24 sm:pt-28 overflow-x-hidden">
        <ExamImageCompressorClient />
        <CompressorContent />
      </div>
    </>
  );
}
