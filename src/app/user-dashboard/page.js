import DashboardClient from "./DashboardClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Student Dashboard | Career Mitra",
  description: "Access your personalized dashboard to explore govt jobs, internships, and career resources tailored for students. Stay updated with the latest opportunities and manage your profile effectively.",
  keywords: "student dashboard, govt jobs for students, internships for students, career resources, personalized job recommendations, profile management, career guidance",
  alternates: {
    canonical: "https://www.careermitra.in/user-dashboard",
  },
};

export default function UserDashboard() {
  const schema = generateWebPageSchema({
    name: "Student Dashboard - Career Mitra",
    description: "Access your personalized dashboard to explore govt jobs, internships, and career resources tailored for students. Stay updated with the latest opportunities and manage your profile effectively.",
    url: "https://www.careermitra.in/user-dashboard"
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DashboardClient />
    </>
  );
}
