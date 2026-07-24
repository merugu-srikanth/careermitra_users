import UserprofilefillingpageClient from "./UserprofilefillingpageClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "User Profile Filling | Career Mitra",
  description: "Complete your user profile to get personalized job alerts and access exclusive career resources.",
  keywords: "user profile, job alerts, career resources, personalized dashboard",
  alternates: {
    canonical: "https://www.careermitra.in/user-profile-filling",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "User Profile Filling - Career Mitra",
      description: "Complete your user profile to get personalized job alerts and access exclusive career resources.",
      url: "https://www.careermitra.in/user-profile-filling"
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
      <UserprofilefillingpageClient />
    </>
  );
}
