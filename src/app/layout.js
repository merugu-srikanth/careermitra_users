import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { JobProvider } from "@/context/JobContext";
import { BlogProvider } from "@/context/BlogContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PWAUpdatePrompt from "@/components/PWAUpdatePrompt";
import SplashLoader from "@/components/SplashLoader";
import FloatingChatSupport from "@/components/FloatingChatSupport";
import FirebaseNotificationHelper from "@/components/FirebaseNotificationHelper";
import { Suspense } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://careermitra.in"),
  title: "Career Mitra - India's Job & Career Portal",
  description: "Government jobs, internships, events and career guidance portal for students and job seekers in India.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Career Mitra",
  },
  openGraph: {
    type: "website",
    siteName: "Career Mitra",
    images: [{ url: "https://careermitra.in/default_og_image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Mitra - India's Job & Career Portal",
    description: "Government jobs, internships, events and career guidance portal for students and job seekers in India.",
    images: ["https://careermitra.in/default_og_image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={poppins.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4115444466556482"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-580RJ53PGL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-580RJ53PGL');
          `}
        </Script>
        <SplashLoader />
        <AuthProvider>
          <JobProvider>
            <BlogProvider>
              <ToastContainer position="top-right" autoClose={5000} />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingChatSupport />
              <FirebaseNotificationHelper />
              <PWAUpdatePrompt />
            </BlogProvider>
          </JobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
