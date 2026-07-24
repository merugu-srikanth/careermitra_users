import VerifyOtpClient from "./VerifyOtpClient";
import { generateWebPageSchema } from '@/utils/schemaHelpers';

export const metadata = {
  title: "Verify OTP — Career Mitra",
  description: "Verify your email address to complete registration on Career Mitra.",
  keywords: "Career Mitra Verify, OTP Verification",
  alternates: {
    canonical: "https://careermitra.in/verify-otp",
  },
};

export default function VerifyOtp() {
  const schema = generateWebPageSchema({
    name: "Verify OTP - Career Mitra",
    description: "Verify your email address to complete registration on Career Mitra.",
    url: "https://careermitra.in/verify-otp"
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <VerifyOtpClient />
    </>
  );
}
