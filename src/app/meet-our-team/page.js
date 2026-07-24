import MeetOurTeamClient from "./MeetOurTeamClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Our Team | CareerMitra",
  description: "Meet the core team and visionaries behind CareerMitra — dedicated educators and retired officials working to bridge the career gap for rural youth.",
  
  alternates: {
    canonical: "https://careermitra.in/meet-our-team",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Our Team - Career Mitra",
      description: "Meet the core team and visionaries behind CareerMitra — dedicated educators and retired officials working to bridge the career gap for rural youth.",
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
