import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Internship Expired or Removed - Career Mitra",
  description: "This internship opportunity has expired or has been removed from the platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-orange-100 p-8 text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-5 border border-orange-200">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
          Status: Expired / Removed (410)
        </span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Opportunity No Longer Available
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          This internship posting has concluded its application window or has been archived by the organization.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/internships"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Active Internships
          </Link>
          <Link
            href="/internships?tab=skillups"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Explore SkillUps
          </Link>
        </div>
      </div>
    </div>
  );
}
