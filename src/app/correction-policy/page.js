import { FaWrench, FaShieldAlt, FaHistory, FaListOl, FaClipboardCheck, FaLink, FaTrashAlt, FaEnvelope, FaCheckCircle, FaInfoCircle, FaGavel, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

import { generateWebPageSchema } from '@/utils/schemaHelpers';
export const metadata = {
  title: "Correction Policy — Careermitra",
  description: "Read the Correction Policy for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn how we handle and update errors in our publications.",
  
  alternates: {
    canonical: "https://careermitra.in/correction-policy",
  },
};


const Section = ({ icon: Icon, title, children, accent = "blue" }) => {
  const colors = {
    orange: { border: "border-orange-200", icon: "bg-orange-50 text-orange-600", bar: "from-orange-500 to-amber-400" },
    red:    { border: "border-red-200",    icon: "bg-red-50 text-red-600",    bar: "from-red-500 to-rose-400" },
    blue:   { border: "border-blue-200",   icon: "bg-blue-50 text-blue-600",   bar: "from-blue-500 to-cyan-400" },
    green:  { border: "border-green-200",  icon: "bg-green-50 text-green-600",  bar: "from-green-500 to-emerald-400" },
    purple: { border: "border-purple-200", icon: "bg-purple-50 text-purple-600", bar: "from-purple-500 to-indigo-400" },
  };
  const c = colors[accent] || colors.blue;
  return (
    <div className={`rounded-2xl border ${c.border} bg-white p-6 shadow-xs`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${c.icon}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className={`h-0.5 w-8 rounded-full bg-linear-to-r ${c.bar} mb-1`} />
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
};

export default function CorrectionPolicy() {
  const correctionSchemas = [
    generateWebPageSchema({
      name: "Correction Policy - Careermitra",
      description: "Read the Correction Policy for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn how we handle and update errors in our publications.",
      url: "https://careermitra.in/correction-policy"
    })
  ];

  return (
    <>
      {correctionSchemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <div className="min-h-screen bg-gray-50/50 pt-20">

        {/* Hero */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 mb-6">
              <FaWrench size={12} className="text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Correction</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Correction Policy</h1>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              At CareerMitra, we are committed to providing accurate, reliable, and up-to-date information about jobs, internships, apprenticeships, admissions, scholarships, examinations, and career opportunities.
            </p>
            <p className="mt-4 text-xs text-gray-400 font-semibold">Last Updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <p className="text-sm text-gray-600 text-center italic mb-6">
            Despite our best efforts, errors may occasionally occur. When inaccuracies are identified, we take appropriate steps to review, correct, and update the information as quickly as possible.<br />
            CareerMitra is owned and operated by Sootradhara Venture Pvt Ltd.
          </p>

          {/* Our Commitment to Accuracy */}
          <Section icon={FaCheckCircle} title="Our Commitment to Accuracy" accent="blue">
            <p>We strive to ensure that all content published on CareerMitra is:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Accurate</li>
              <li>Relevant</li>
              <li>Timely</li>
              <li>Clear and understandable</li>
              <li>Based on credible and official sources</li>
            </ul>
            <p className="mt-3">Our editorial team reviews information before publication; however, recruitment notifications, examination schedules, eligibility criteria, application deadlines, and other details may change after publication due to updates from official authorities.</p>
          </Section>

          {/* How Corrections Are Handled */}
          <Section icon={FaListOl} title="How Corrections Are Handled" accent="orange">
            <p>When an error is identified, our editorial team follows a structured review process:</p>
            <div className="space-y-4 mt-3 pl-2">
              <div className="border-l-4 border-orange-500 pl-3">
                <p className="font-bold text-gray-900">1. Review of Reported Information</p>
                <p className="text-xs text-gray-600">We verify the reported issue against official sources and available documentation.</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-3">
                <p className="font-bold text-gray-900">2. Evaluation</p>
                <p className="text-xs text-gray-600">The editorial team assesses whether the content contains:</p>
                <ul className="list-disc list-inside text-xs text-gray-500 mt-1 pl-2">
                  <li>Factual inaccuracies</li>
                  <li>Outdated information</li>
                  <li>Incorrect dates</li>
                  <li>Incorrect eligibility details</li>
                  <li>Broken or incorrect links</li>
                  <li>Typographical errors that affect meaning</li>
                </ul>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3">
                <p className="font-bold text-gray-900">3. Correction</p>
                <p className="text-xs text-gray-600">If an error is confirmed, the content will be updated as soon as reasonably possible.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="font-bold text-gray-900">4. Transparency</p>
                <p className="text-xs text-gray-600">Significant corrections may be reflected within the article to ensure readers have access to the most accurate information available.</p>
              </div>
            </div>
          </Section>

          {/* Types of Corrections */}
          <Section icon={FaInfoCircle} title="Types of Corrections" accent="purple">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Factual Corrections</h4>
                <p className="mt-1">Corrections involving inaccurate information such as vacancy numbers, eligibility criteria, age limits, application dates, examination schedules, official website links, and selection procedures. These corrections are prioritized and updated promptly.</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Content Updates</h4>
                <p className="mt-1">Some content may require updates due to changes announced by official organizations after publication.</p>
                <p className="text-xs text-gray-500 mt-1">Examples include: Extended application deadlines, revised vacancy details, updated examination dates, changes in recruitment processes, or new official notifications. Such updates are made to ensure information remains current and useful.</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Minor Edits</h4>
                <p className="mt-1">Minor changes may be made without formal notice, including grammar/spelling corrections, formatting improvements, improved readability, and non-substantive content refinements. These edits do not affect the meaning or accuracy of the information.</p>
              </div>
            </div>
          </Section>

          {/* Reader Feedback and Error Reporting */}
          <Section icon={FaClipboardCheck} title="Reader Feedback and Error Reporting" accent="green">
            <p>We encourage readers to help us maintain content accuracy by reporting potential errors.</p>
            <p className="mt-2 font-semibold">You may contact us if you identify:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
              <li>Incorrect information</li>
              <li>Outdated content</li>
              <li>Broken links</li>
              <li>Missing updates</li>
              <li>Misleading statements</li>
              <li>Technical issues affecting content</li>
            </ul>
            <p className="mt-3">All reported concerns are reviewed by our editorial team.</p>
          </Section>

          {/* Sources Verification */}
          <Section icon={FaLink} title="Sources Verification" accent="blue">
            <p>Before making corrections, we verify information using reliable sources, including:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Official Government Websites</li>
              <li>Recruitment Boards</li>
              <li>Public Sector Organizations</li>
              <li>Universities and Educational Institutions</li>
              <li>Official Notifications</li>
              <li>Press Releases</li>
              <li>Corporate Career Portals</li>
              <li>Regulatory Authorities</li>
            </ul>
            <p className="mt-3 font-semibold">Official sources are always given priority during the correction process.</p>
          </Section>

          {/* Content Removal Policy */}
          <Section icon={FaTrashAlt} title="Content Removal Policy" accent="red">
            <p>In certain circumstances, CareerMitra may remove or substantially revise content when:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Information becomes obsolete</li>
              <li>Content is found to be inaccurate</li>
              <li>Legal requirements necessitate removal</li>
              <li>Official authorities withdraw information</li>
              <li>Published content no longer serves readers effectively</li>
            </ul>
          </Section>

          {/* Editorial Responsibility */}
          <Section icon={FaShieldAlt} title="Editorial Responsibility" accent="orange">
            <p>All correction decisions are made independently by the CareerMitra editorial team.</p>
            <p>Advertisers, sponsors, affiliate partners, and third parties do not influence correction decisions or editorial updates.</p>
            <p className="font-semibold text-gray-800">Our primary responsibility is to provide readers with accurate and trustworthy information.</p>
          </Section>

          {/* Limitation of Liability Disclaimer */}
          <Section icon={FaExclamationTriangle} title="Limitation of Liability" accent="red">
            <p>While we make every effort to maintain accurate information, CareerMitra cannot guarantee that all content will always remain current due to the dynamic nature of the content related to recruitment, admissions, examinations, and other educational announcements.</p>
            <p className="mt-2 font-semibold">Users are strongly encouraged to verify information through official sources before making decisions or submitting applications.</p>
          </Section>

          {/* Our Editorial Promise Alert */}
          <div className="rounded-2xl border border-blue-300 bg-blue-50 p-6">
            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <FaWrench /> Our Editorial Promise
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              CareerMitra is committed to maintaining the highest standards of editorial accuracy, transparency, and accountability. We value reader trust and continuously work to ensure that our content remains accurate, updated, and beneficial for students, job seekers, and professionals.
            </p>
          </div>

          {/* Contact card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-center">
            <FaEnvelope size={28} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Contact Us for Corrections</h3>
            <p className="text-sm text-gray-500 mb-4">If you would like to report an error or request a correction, please contact us:</p>
            <div className="text-xs text-gray-600 space-y-1 mb-4 font-medium">
              <p className="font-bold text-gray-900 text-sm">Sootradhara Venture Pvt Ltd</p>
              <p>7th Floor, 806, Vasavi MPM Mall,</p>
              <p>Ameerpet, Hyderabad, Telangana – 500016, India</p>
              <p>Email: <a href="mailto:info@careermitra.in" className="text-blue-600 hover:underline">info@careermitra.in</a></p>
              <p>Website: <a href="https://www.careermitra.in" className="text-blue-600 hover:underline">https://www.careermitra.in</a></p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 items-center">
              <Link href="/contact-us"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link href="/privacy-policy"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
