import ContactSectionClient from "./ContactSectionClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Contact Us - Career Mitra",
  description: "Contact Career Mitra for personalized Govt Jobs notifications, career guidance, support, feedback, and job-related assistance.",
  keywords: "Contact Us, Contact Career Mitra, Govt Jobs Support, Career Guidance Support, Sarkari Naukri Help, Free Job Alerts, Government Jobs India, Career Counselling, Employment Support",
  alternates: {
    canonical: "https://careermitra.in/contact-us",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Contact Us - Career Mitra",
      description: "Contact Career Mitra for personalized Govt Jobs notifications, career guidance, support, feedback, and job-related assistance.",
      url: "https://careermitra.in/contact-us"
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
      <ContactSectionClient />
    </>
  );
}
