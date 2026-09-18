"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import SEO from '@/components/SEO';
import { generateJobPostingSchema, generateFAQSchema } from '@/utils/schemaHelpers';
import InternshipGuideContent from "@/components/InternshipGuideContent";
import { formatStipend, formatStipendDisplay, normalizeDuration, formatDateDDMonYYYY, toTitleCase, isItemExpired } from "@/utils/formatters";
import {
  Calendar,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  IndianRupee,
  Award,
  ArrowLeft,
  ChevronDown,
  Info,
  CheckCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from "lucide-react";

const BASE_URL = "https://careermitra.in/api/internships";

const generateSlug = (title) => {
  return title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
};

const normalizeLink = (link) => {
  if (!link) return null;
  return link.startsWith("http") ? link : `https://${link}`;
};

const InternshipDetailSkeleton = () => (
  <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 px-4 md:px-8 font-sans animate-pulse">
    <div className="w-full mx-auto space-y-8">
      <div className="h-9 w-36 bg-white rounded-xl border border-slate-100 shadow-sm" />

      <div className="bg-white rounded-3xl border border-orange-100/50 shadow-xl p-6 md:p-10 space-y-6">
        <div className="space-y-3">
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
          <div className="h-10 w-3/4 bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-100">
          {[...Array(12)].map((_, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2">
              <div className="h-2.5 w-12 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function InternshipDetail({ initialData = null }) {
  const params = useParams();
  const { slug } = params;
  const searchParams = useSearchParams();
  const idFromState = searchParams.get("id");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    if (initialData) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
        let id = idFromState || (isValidObjectId ? slug : null);

        if (!id && slug) {
          try {
            const mapRes = await fetch("/internships-map.json");
            if (mapRes.ok) {
              const map = await mapRes.json();
              id = map[slug];
            }
          } catch (err) {
            console.error("Error reading sitemap mapping on client:", err);
          }
        }

        if (id) {
          const res = await fetch(`${BASE_URL}/${id}`);
          const json = await res.json();
          if (json.success && json.data) {
            setData(json.data);
            return;
          }
        }

        setError("Internship no longer available.");
      } catch (err) {
        console.error("Error fetching internship details:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug, idFromState, initialData]);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (loading) {
    return <InternshipDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-orange-100 p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-5 border border-orange-200">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
            Status: Expired / Removed
          </span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Opportunity Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">{error || "This internship listing has concluded its application process or has been archived."}</p>
          <Link href="/internships"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Internships
          </Link>
        </div>
      </div>
    );
  }

  // Unified Normalized Values
  const title = toTitleCase(data.internship_title || "Internship Opportunity");
  const company = data.company_name || "Verified Organization";
  const location = data.location || [data.district_city, data.state].filter(Boolean).join(", ") || "India";
  const category = data.domain_sector || data.category || "Professional";
  const type = data.internship_type || data.work_mode || "Virtual Internship";
  const openings = data.openings || "Not Disclosed";
  const duration = normalizeDuration(data.duration);
  const formattedStipend = formatStipend(data);
  const stipendType = data.stipend_category || (formattedStipend === "Unpaid" ? "Unpaid" : "Paid");
  const applyLink = normalizeLink(data.apply_link);
  const notificationUrl = normalizeLink(data.notification_url || data.notificationUrl);
  const startDate = data.start_date || "Immediately";
  const postedDate = formatDateDDMonYYYY(data.posted_date || data.created_at);
  const rawDeadline = data.deadline || data.last_date_to_apply || data.application_deadline;
  const deadline = formatDateDDMonYYYY(rawDeadline);
  const isExpired = isItemExpired(rawDeadline) || data.is_expired || data.expiry_status === "expired";
  const lastVerifiedDate = formatDateDDMonYYYY(data.updated_at || data.updatedAt || data.created_at || new Date());

  // Structured FAQs
  const faqs = [
    {
      q: `What is the ${title} opportunity?`,
      a: `The ${title} is a verified training and work-exposure program offered by ${company} in ${location}. Candidates gain practical industry skills and mentorship.`
    },
    {
      q: "Who is eligible to apply for this internship?",
      a: `${data.qualifications || data.requirements || "Students, diploma holders, and graduates meeting the educational criteria established by the organization are eligible to apply."}`
    },
    {
      q: "What is the stipend and compensation for this role?",
      a: `The stipend for this position is ${formattedStipend} (${stipendType}). Please refer to the official notification for additional allowance details.`
    },
    {
      q: "What is the duration of the internship?",
      a: `The program duration is ${duration}.`
    },
    {
      q: "How do I apply for this position?",
      a: "Click on the 'Official Apply Online' button below to navigate directly to the organization's official application portal before the application deadline."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 px-4 md:px-12 font-sans">
      <div className="w-full mx-auto space-y-8">

        {/* Back Link */}
        <Link href="/internships"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Internships / SkillUps
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-orange-100 shadow-xl overflow-hidden relative">
          <div className="p-6 md:p-10 relative z-10 space-y-6">
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                  {type}
                </span>
                {isExpired ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    Application Closed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Applications Open
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-base md:text-lg font-bold text-slate-600 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                {company}
              </p>
            </div>

            {/* Dynamic Grid of Info Keys */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-100">
              {[
                { label: "Work Mode", value: type, icon: Briefcase },
                { label: "Location", value: location, icon: MapPin },
                { label: "Stipend", value: formattedStipend, icon: IndianRupee, highlightColor: "text-orange-600 font-black" },
                { label: "Stipend Type", value: stipendType, icon: IndianRupee },
                { label: "Duration", value: duration, icon: Clock },
                { label: "Openings", value: openings, icon: Briefcase },
                { label: "Category", value: category, icon: Award },
                { label: "Start Date", value: startDate, icon: Calendar },
                { label: "Posted Date", value: postedDate, icon: Calendar },
                { label: "Application Deadline", value: deadline, icon: Calendar, highlightColor: isExpired ? "text-rose-600 font-bold" : "text-slate-800" },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                    <span className={`text-xs font-bold flex items-center gap-1.5 mt-1 ${item.highlightColor || 'text-slate-800'}`}>
                      <IconComponent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.value}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── D5: EDITORIAL VERIFICATION & SOURCE CITATIONS ── */}
            <div className="bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-slate-50 p-5 rounded-2xl border border-orange-100/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Editorial Verification & Sources
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span><strong>Curated by:</strong> Career Mitra Editorial Desk</span>
                  <span>•</span>
                  <span><strong>Fact-Checked by:</strong> Verification Desk</span>
                  <span>•</span>
                  <span><strong>Last Verified:</strong> {lastVerifiedDate}</span>
                </div>
              </div>

              {/* Action Buttons: Official Notification & Official Apply (D5) */}
              <div className="flex flex-wrap items-center gap-3">
                {notificationUrl && (
                  <a
                    href={notificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>Official Notification</span>
                  </a>
                )}

                {isExpired ? (
                  <span
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
                    title="Application deadline has passed"
                  >
                    Application Closed
                  </span>
                ) : applyLink ? (
                  <a
                    href={applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <span>Official Apply Online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>
            </div>

          </div>
        </div>

        {/* Content Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description / Overview */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <span>Internship Overview</span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {data.internship_description || data.about_internship || `Apply for the ${title} at ${company}. This role offers industry-standard hands-on training and mentorship in ${location}.`}
              </p>
            </div>

            {/* Eligibility & Qualifications */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-orange-600" />
                <span>Eligibility & Qualifications</span>
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {data.qualifications || data.requirements || "Candidates pursuing or having completed relevant degrees/diplomas are encouraged to review the official notification for branch-specific guidelines."}
              </p>
            </div>

            {/* Responsibilities */}
            {data.responsibilities && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <span>Key Responsibilities</span>
                </h2>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {data.responsibilities}
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-orange-600" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {faq.q}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Summary Card */}
            <div className="bg-white rounded-3xl border border-orange-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
                Key Opportunity Highlights
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Stipend:</span>
                  <span className="font-extrabold text-orange-600">{formattedStipend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Duration:</span>
                  <span className="font-bold text-slate-800">{duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Deadline:</span>
                  <span className={`font-bold ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                    {deadline}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase">Location:</span>
                  <span className="font-bold text-slate-800 text-right max-w-[160px] truncate">{location}</span>
                </div>
              </div>

              {!isExpired && applyLink && (
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-md mt-2 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Disclaimer Card */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5 text-xs text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 mb-1">Disclaimer</p>
              Information on this page is compiled from publicly released official notifications. Candidates must verify criteria on the official portal before applying.
            </div>

          </div>

        </div>

        {/* Guide Content */}
        <div className="mt-16">
          <InternshipGuideContent />
        </div>

      </div>
    </div>
  );
}
