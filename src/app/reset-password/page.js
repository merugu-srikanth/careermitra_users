import ResetPasswordClient from "./ResetPasswordClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Reset Password — Career Mitra",
  description: "Reset your account password on Career Mitra.",
  keywords: "Career Mitra Reset Password, Reset Password",
  alternates: {
    canonical: "https://careermitra.in/reset-password",
  },
};

export default function Page() {
  const schemas = [
    generateWebPageSchema({
      name: "Reset Password - Career Mitra",
      description: "Reset your account password on Career Mitra.",
      url: "https://careermitra.in/reset-password"
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
      <ResetPasswordClient />
    </>
  );
}
