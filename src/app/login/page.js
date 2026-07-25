import LoginClient from "./LoginClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Log In - Career Mitra",
  description: "Log in to Career Mitra to access personalized Govt Jobs notifications, Sarkari Naukri alerts, career guidance, and latest updates.",
  keywords: "Career Mitra Login, Govt Jobs Login, Sarkari Naukri Login, Free Job Alerts, Latest Govt Jobs Notifications, Career Guidance",
  alternates: {
    canonical: "https://careermitra.in/login",
  },
  openGraph: {
    title: "Log In - Career Mitra",
    description: "Log in to Career Mitra to access personalized Govt Jobs notifications, Sarkari Naukri alerts, career guidance, and latest updates.",
    url: "https://careermitra.in/login",
    images: [{ url: "https://careermitra.in/favicon.png" }],
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Login - Career Mitra",
      description: "Log in to Career Mitra to access personalized Govt Jobs notifications, Sarkari Naukri alerts, career guidance, and latest updates.",
      url: "https://careermitra.in/login"
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
      <LoginClient />
    </>
  );
}
