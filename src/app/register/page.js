import RegisterClient from "./RegisterClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Register — Career Mitra | Get Latest Govt Jobs Alerts",
  description: "Create your account on Career Mitra to get latest Govt Jobs notifications, Sarkari Naukri alerts, and expert career guidance.",
  keywords: "Career Mitra Register, Govt Jobs Registration, Sarkari Naukri Register, Free Job Alerts",
  alternates: {
    canonical: "https://careermitra.in/register",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Register - Career Mitra",
      description: "Create your account on Career Mitra to get latest Govt Jobs notifications, Sarkari Naukri alerts, and expert career guidance.",
      url: "https://careermitra.in/register"
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
      <RegisterClient />
    </>
  );
}
