import { FaShieldAlt, FaExclamationTriangle, FaBan, FaGavel, FaEnvelope, FaBuilding, FaHandshake, FaInfoCircle, FaLink, FaAd, FaPercentage, FaHistory, FaUserLock, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { generateWebPageSchema } from "../utils/schemaHelpers";

const Section = ({ icon: Icon, title, children, accent = "orange" }) => {
  const colors = {
    orange: { border: "border-orange-200", icon: "bg-orange-50 text-orange-600", bar: "from-orange-500 to-amber-400" },
    red:    { border: "border-red-200",    icon: "bg-red-50 text-red-600",    bar: "from-red-500 to-rose-400" },
    blue:   { border: "border-blue-200",   icon: "bg-blue-50 text-blue-600",   bar: "from-blue-500 to-cyan-400" },
    green:  { border: "border-green-200",  icon: "bg-green-50 text-green-600",  bar: "from-green-500 to-emerald-400" },
    purple: { border: "border-purple-200", icon: "bg-purple-50 text-purple-600", bar: "from-purple-500 to-indigo-400" },
  };
  const c = colors[accent] || colors.orange;
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

export default function Disclaimer() {
  const disclaimerSchemas = [
    generateWebPageSchema({
      name: "Disclaimer - Careermitra",
      description: "Read the Disclaimer for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn about information accuracy, links, and job guarantees.",
      url: "https://careermitra.in/disclaimer"
    })
  ];

  return (
    <>
      <SEO
        title="Disclaimer — Careermitra"
        description="Read the Disclaimer for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn about information accuracy, links, and job guarantees."
        url="https://careermitra.in/disclaimer"
        schema={disclaimerSchemas}
      />

      <div className="min-h-screen bg-gray-50/50 pt-20">

        {/* Hero */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 mb-6">
              <FaExclamationTriangle size={12} className="text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Disclaimer</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Welcome to CareerMitra. By accessing and using this website, you acknowledge and agree to the terms of this Disclaimer. If you do not agree with any part of this disclaimer, please discontinue using our website.
            </p>
            <p className="mt-4 text-xs text-gray-400 font-semibold">Last Updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <p className="text-sm text-gray-600 text-center italic mb-6">
            CareerMitra is owned and operated by Sootradhara Venture Pvt Ltd.
          </p>

          {/* General Information */}
          <Section icon={FaInfoCircle} title="General Information" accent="blue">
            <p>The information provided on CareerMitra (<a href="https://www.careermitra.in" className="text-blue-600 hover:underline">https://www.careermitra.in</a>) is published in good faith and for general informational and educational purposes only. Our website primarily provides information related to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Government Job Notifications</li>
              <li>Private Job Opportunities</li>
              <li>Apprenticeships</li>
              <li>Internships</li>
              <li>Admissions</li>
              <li>Scholarships</li>
              <li>Exam Updates</li>
              <li>Results</li>
              <li>Career Guidance</li>
              <li>Educational News and Updates</li>
            </ul>
            <p className="mt-3">While we strive to ensure that the information published is accurate, complete, and up to date, we make no guarantees regarding the completeness, reliability, suitability, or accuracy of any information available on this website.</p>
            <p className="font-semibold text-gray-800">Any action you take based on the information found on CareerMitra is strictly at your own risk.</p>
          </Section>

          {/* No Employment Guarantee */}
          <Section icon={FaHandshake} title="No Employment Guarantee" accent="red">
            <p>CareerMitra is an independent information platform and is not a recruitment agency, government organization, employer, examination authority, or educational institution.</p>
            <p className="mt-2 font-semibold">We do not:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Conduct recruitment processes</li>
              <li>Offer employment opportunities directly</li>
              <li>Guarantee job placements</li>
              <li>Influence hiring decisions</li>
              <li>Process job applications on behalf of employers</li>
            </ul>
            <p className="mt-3">Users are advised to verify all recruitment information through the official websites of the respective organizations before applying.</p>
          </Section>

          {/* Verification of Information */}
          <Section icon={FaClipboardList} title="Verification of Information" accent="orange">
            <p>Although our editorial team makes every effort to verify information before publication, recruitment notifications, eligibility criteria, application dates, examination schedules, vacancy details, salaries, fees and other information may change without prior notice by the respective authorities.</p>
            <p className="mt-2 font-semibold">Applicants should always:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Visit the official website of the recruiting organization</li>
              <li>Read the official notification carefully</li>
              <li>Verify eligibility criteria</li>
              <li>Confirm important dates and application procedures</li>
            </ul>
            <p className="mt-3 font-semibold text-red-600">CareerMitra shall not be held responsible for any loss or inconvenience resulting from reliance on information published on this website.</p>
          </Section>

          {/* External Links Disclaimer */}
          <Section icon={FaLink} title="External Links Disclaimer" accent="blue">
            <p>Our website may contain links to third-party websites, government portals, educational institutions, employers, advertisers, and other external resources.</p>
            <p className="mt-2"><strong>While we aim to provide links to useful and trustworthy sources, we have no control over:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>The content of external websites</li>
              <li>Changes made to those websites</li>
              <li>Their privacy policies</li>
              <li>Their terms of service</li>
              <li>Their accuracy or reliability</li>
            </ul>
            <p className="mt-3">The inclusion of any external link does not imply endorsement or recommendation by CareerMitra.</p>
            <p className="font-semibold">Users access third-party websites at their own discretion and risk.</p>
          </Section>

          {/* Advertisement Disclaimer */}
          <Section icon={FaAd} title="Advertisement Disclaimer" accent="blue">
            <p>CareerMitra may display advertisements through third-party advertising partners, including Google AdSense and other advertising networks.</p>
            <p className="mt-2"><strong>Advertisements displayed on our website:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Do not constitute endorsements by CareerMitra</li>
              <li>Are served automatically by advertising partners</li>
              <li>May be based on user interests and browsing behavior</li>
            </ul>
            <p className="mt-3">We are not responsible for products, services, offers, or claims made by advertisers appearing on our website.</p>
            <p className="font-semibold text-gray-800">Users should independently verify any information before making purchases or engaging with advertised services.</p>
          </Section>

          {/* Affiliate Disclosure */}
          <Section icon={FaPercentage} title="Affiliate Disclosure" accent="green">
            <p>CareerMitra may occasionally participate in affiliate marketing programs.</p>
            <p>This means that some links on our website may be affiliate links, and we may earn a commission if users purchase products or services through those links at no additional cost to them.</p>
            <p className="text-xs text-gray-500">Such affiliate relationships do not influence our editorial content, recommendations, or opinions.</p>
          </Section>

          {/* Educational and Career Guidance Disclaimer */}
          <Section icon={FaHandshake} title="Educational and Career Guidance Disclaimer" accent="orange">
            <p>The career advice, preparation tips, educational guidance, and informational content available on CareerMitra are intended for general informational purposes only.</p>
            <p className="mt-2"><strong>We do not guarantee:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Examination success</li>
              <li>Job selection</li>
              <li>Admission approval</li>
              <li>Scholarship awards</li>
              <li>Career outcomes</li>
              <li>Internships</li>
            </ul>
            <p className="mt-3">Users should make decisions based on their individual circumstances and consult relevant professionals where necessary.</p>
          </Section>

          {/* Content Accuracy */}
          <Section icon={FaHistory} title="Content Accuracy" accent="green">
            <p>Despite our efforts to maintain accurate and updated information, errors, omissions, or outdated content may occasionally occur.</p>
            <p className="mt-2"><strong>CareerMitra reserves the right to:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Modify content at any time</li>
              <li>Update information without notice</li>
              <li>Correct errors or inaccuracies</li>
              <li>Remove content when necessary</li>
            </ul>
            <p className="mt-3">We are not liable for any inaccuracies or omissions.</p>
          </Section>

          {/* Limitation of Liability */}
          <Section icon={FaExclamationTriangle} title="Limitation of Liability" accent="red">
            <p>Under no circumstances shall CareerMitra, Sootradhara Venture Pvt Ltd, its directors, employees, authors, editors, or affiliates be held liable for any direct, indirect, incidental, consequential, or special damages arising from:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Use of this website</li>
              <li>Reliance on information published on this website</li>
              <li>Errors or omissions in content</li>
              <li>Delays or interruptions in website availability</li>
              <li>External website links</li>
              <li>Third-party services or advertisements</li>
            </ul>
            <p className="mt-3 font-bold text-gray-900">Users access and use this website entirely at their own risk.</p>
          </Section>

          {/* Consent */}
          <Section icon={FaShieldAlt} title="Consent" accent="purple">
            <p>By using CareerMitra, you hereby consent to this Disclaimer and agree to its terms.</p>
          </Section>

          {/* Updates to This Disclaimer */}
          <Section icon={FaHistory} title="Updates to This Disclaimer" accent="green">
            <p>We reserve the right to update, amend, or modify this Disclaimer at any time without prior notice.</p>
            <p>Any changes will be posted on this page along with the updated revision date.</p>
            <p className="text-xs text-gray-500 font-semibold">Users are encouraged to review this page periodically.</p>
          </Section>

          {/* Important Note Alert */}
          <div className="rounded-2xl border border-red-300 bg-red-50 p-6">
            <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
              <FaExclamationTriangle /> Important Note
            </h4>
            <p className="text-xs text-red-700 leading-relaxed">
              CareerMitra is an independent career and recruitment information portal and is not affiliated with any government authority, recruitment board, public sector undertaking, university, or examination conducting body unless explicitly stated. Official notifications and websites should always be considered the primary source of information.
            </p>
          </div>

          {/* Contact card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-center">
            <FaEnvelope size={28} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Contact Information</h3>
            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <p className="font-bold text-gray-900">Sootradhara Venture Pvt Ltd</p>
              <p>7th Floor, 806, Vasavi MPM Mall,</p>
              <p>Ameerpet, Hyderabad, Telangana – 500016, India</p>
              <p>Email: <a href="mailto:info@careermitra.in" className="text-blue-600 hover:underline font-semibold">info@careermitra.in</a></p>
              <p>Website: <a href="https://www.careermitra.in" className="text-blue-600 hover:underline">https://www.careermitra.in</a></p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 items-center">
              <Link
                to="/contact-us"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/privacy-policy"
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
