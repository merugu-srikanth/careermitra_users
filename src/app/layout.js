import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { JobProvider } from "@/context/JobContext";
import { BlogProvider } from "@/context/BlogContext";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PWAUpdatePrompt from "@/components/PWAUpdatePrompt";
import { Suspense } from "react";

export const metadata = {
  title: "Career Mitra - India's Job & Career Portal",
  description: "Government jobs, internships, events and career guidance portal for students and job seekers in India.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Career Mitra",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <JobProvider>
            <BlogProvider>
              <ToastContainer position="top-right" autoClose={5000} />
              <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                <Navbar />
              </Suspense>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" /></div>}>
                <main>{children}</main>
              </Suspense>
              <Footer />
              <PWAUpdatePrompt />
            </BlogProvider>
          </JobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
