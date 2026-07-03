import { FaShieldAlt, FaExclamationTriangle, FaBan, FaGavel, FaEnvelope, FaBuilding, FaHandshake, FaInfoCircle, FaCopyright, FaLink, FaAd, FaPercentage, FaHistory, FaGlobe } from "react-icons/fa";
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

export default function TermsOfService() {
  const termsSchemas = [
    generateWebPageSchema({
      name: "Terms and Conditions - Careermitra",
      description: "Read the Terms and Conditions for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn about user responsibilities, guidelines, and disclaimers.",
      url: "https://careermitra.in/terms-of-service"
    })
  ];

  return (
    <>
      <SEO
        title="Terms and Conditions — Careermitra"
        description="Read the Terms and Conditions for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn about user responsibilities, guidelines, and disclaimers."
        url="https://careermitra.in/terms-of-service"
        schema={termsSchemas}
      />

      <div className="min-h-screen bg-gray-50/50 pt-20">

        {/* Hero */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 mb-6">
              <FaGavel size={12} className="text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Welcome to CareerMitra. These Terms & Conditions govern your use of our website, <a href="https://www.careermitra.in" className="text-orange-600 hover:underline">https://www.careermitra.in</a> ("Website"). By accessing or using CareerMitra, you agree to comply with and be bound by these Terms & Conditions.
            </p>
            <p className="mt-4 text-xs text-gray-400 font-semibold">Last Updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <p className="text-sm text-gray-600 text-center italic mb-6">
            If you do not agree with any part of these terms, please discontinue the use of our Website.<br />
            CareerMitra is owned and operated by Sootradhara Venture Pvt Ltd.
          </p>

          {/* 1. Acceptance of Terms */}
          <Section icon={FaShieldAlt} title="1. Acceptance of Terms" accent="orange">
            <p>By accessing, browsing, or using CareerMitra, you acknowledge that you have read, understood, and agreed to these Terms & Conditions, along with our Privacy Policy and Disclaimer.</p>
            <p>These terms apply to all visitors, users, subscribers, and anyone accessing the Website.</p>
          </Section>

          {/* 2. About CareerMitra */}
          <Section icon={FaInfoCircle} title="2. About CareerMitra" accent="blue">
            <p>CareerMitra is an online platform that provides information related to:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Government Job Notifications</li>
              <li>Private Job Opportunities</li>
              <li>Apprenticeships</li>
              <li>Internships</li>
              <li>Scholarships</li>
              <li>Admissions</li>
              <li>Exam Notifications</li>
              <li>Results</li>
              <li>Career Guidance</li>
              <li>Educational Updates</li>
            </ul>
            <p className="mt-2">The information provided on the Website is intended solely for informational and educational purposes.</p>
          </Section>

          {/* 3. No Recruitment or Employment Relationship */}
          <Section icon={FaHandshake} title="3. No Recruitment or Employment Relationship" accent="red">
            <p>CareerMitra is not:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>A recruitment agency</li>
              <li>A government organization</li>
              <li>A hiring company</li>
              <li>An employment provider</li>
              <li>An examination authority</li>
            </ul>
            <p className="mt-2">We do not conduct recruitment processes, accept job applications on behalf of employers, guarantee employment, or influence recruitment decisions.</p>
            <p className="font-semibold text-gray-800">Users are solely responsible for verifying information through official sources before applying for any opportunity.</p>
          </Section>

          {/* 4. Use of Website */}
          <Section icon={FaBan} title="4. Use of Website" accent="red">
            <p>You agree to use the Website only for lawful purposes.</p>
            <p className="mt-2"><strong>You must not:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Interfere with website operations</li>
              <li>Upload malicious software, viruses, or harmful code</li>
              <li>Use automated tools to scrape, copy, or extract data without permission</li>
              <li>Engage in activities that may harm the Website or its users</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">We reserve the right to restrict or terminate access to users who violate these terms.</p>
          </Section>

          {/* 5. Intellectual Property Rights */}
          <Section icon={FaCopyright} title="5. Intellectual Property Rights" accent="green">
            <p>Unless otherwise stated, all content available on CareerMitra, including:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 pl-2">
              {["Articles", "Text", "Graphics", "Logos", "Website Design", "Images", "Layouts", "Branding Elements"].map((item) => (
                <div key={item} className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center text-xs font-semibold text-gray-700">
                  {item}
                </div>
              ))}
            </div>
            <p>is the property of CareerMitra or its respective content owners and is protected by applicable copyright, trademark, and intellectual property laws.</p>
            
            <div className="mt-3">
              <p className="font-bold text-gray-900">You may:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600 pl-2">
                <li>Read and share content for personal, non-commercial use</li>
                <li>Link to our articles with proper attribution</li>
              </ul>
            </div>

            <div className="mt-2">
              <p className="font-bold text-gray-900">You may not:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600 pl-2">
                <li>Republish our content without permission</li>
                <li>Copy entire articles</li>
                <li>Sell or distribute our content commercially</li>
                <li>Reproduce content on other websites without authorization</li>
              </ul>
            </div>
          </Section>

          {/* 6. Content Accuracy */}
          <Section icon={FaExclamationTriangle} title="6. Content Accuracy" accent="orange">
            <p>We strive to provide accurate and updated information. However, we do not guarantee that all information published on the Website is complete, current, or error-free.</p>
            <p>Recruitment notifications, eligibility criteria, application dates, vacancy details, examination schedules and other related information may change at the discretion of the respective organizations.</p>
            <p className="font-semibold text-gray-800">Users should always verify information through official sources before taking any action.</p>
          </Section>

          {/* 7. User-Generated Content */}
          <Section icon={FaInfoCircle} title="7. User-Generated Content" accent="blue">
            <p>If users submit comments, feedback, suggestions, or other content, they agree that:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>The content does not violate any law</li>
              <li>The content is not defamatory, offensive, or misleading</li>
              <li>The content does not infringe third-party rights</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">CareerMitra reserves the right to review, edit, or remove user-generated content at its sole discretion.</p>
          </Section>

          {/* 8. Third-Party Links */}
          <Section icon={FaLink} title="8. Third-Party Links" accent="orange">
            <p>Our Website may contain links to third-party websites, including:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Government recruitment portals</li>
              <li>Educational institutions</li>
              <li>Employers</li>
              <li>Examination authorities</li>
              <li>Advertisers</li>
            </ul>
            <p className="mt-2">These links are provided for convenience and informational purposes only.</p>
            <p>We do not control or endorse the content, policies, or practices of third-party websites and are not responsible for their content or services.</p>
            <p className="italic text-xs text-gray-500">Users access external websites at their own risk.</p>
          </Section>

          {/* 9. Advertisements and Sponsored Content */}
          <Section icon={FaAd} title="9. Advertisements and Sponsored Content" accent="blue">
            <p>CareerMitra may display advertisements from third-party advertising partners, including Google AdSense and other advertising networks.</p>
            <p><strong>Advertisements displayed on our Website:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Do not imply endorsement by CareerMitra</li>
              <li>Are served by third-party advertising providers</li>
              <li>May be personalized based on user preferences and browsing behavior</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">We are not responsible for the products, services, or claims made by advertisers.</p>
          </Section>

          {/* 10. Affiliate Disclosure */}
          <Section icon={FaPercentage} title="10. Affiliate Disclosure" accent="green">
            <p>Some pages may contain affiliate links.</p>
            <p>If users purchase products or services through affiliate links, CareerMitra may receive a commission at no additional cost to the user.</p>
            <p className="text-xs text-gray-500">Affiliate partnerships do not influence our editorial decisions, recommendations, or content accuracy.</p>
          </Section>

          {/* 11. Limitation of Liability */}
          <Section icon={FaExclamationTriangle} title="11. Limitation of Liability" accent="red">
            <p>To the maximum extent permitted by law, CareerMitra, Sootradhara Venture Pvt Ltd, its directors, employees, authors, and affiliates shall not be liable for:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Any direct or indirect losses</li>
              <li>Business interruptions</li>
              <li>Data loss</li>
              <li>Financial losses</li>
              <li>Errors or omissions in content</li>
              <li>Reliance on information published on the Website</li>
              <li>Third-party websites or services</li>
            </ul>
            <p className="mt-2 font-bold text-gray-900">Your use of the Website is entirely at your own risk.</p>
          </Section>

          {/* 12. Privacy */}
          <Section icon={FaShieldAlt} title="12. Privacy" accent="purple">
            <p>Your use of CareerMitra is also governed by our <Link to="/privacy-policy" className="text-purple-600 hover:underline font-semibold">Privacy Policy</Link>.</p>
            <p>By using the Website, you consent to the collection and use of information as described in our Privacy Policy.</p>
          </Section>

          {/* 13. Changes to Terms & Conditions */}
          <Section icon={FaHistory} title="13. Changes to Terms & Conditions" accent="green">
            <p>We reserve the right to modify, update, or replace these Terms & Conditions at any time without prior notice.</p>
            <p>Any updates will be published on this page with a revised effective date.</p>
            <p className="text-xs text-gray-500 font-semibold">Continued use of the Website after updates constitutes acceptance of the revised Terms & Conditions.</p>
          </Section>

          {/* 14. Governing Law */}
          <Section icon={FaGlobe} title="14. Governing Law" accent="blue">
            <p>These Terms & Conditions shall be governed and interpreted in accordance with the laws of India.</p>
            <p>Any disputes arising from the use of this Website shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana, India.</p>
          </Section>

          {/* 15. Contact Us */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-6 text-center">
            <FaEnvelope size={28} className="text-orange-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">15. Contact Us</h3>
            <p className="text-sm text-gray-500 mb-4">If you have any questions regarding these Terms & Conditions, please contact us:</p>
            
            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <p className="font-bold text-gray-900">Sootradhara Venture Pvt Ltd</p>
              <p>7th Floor, 806, Vasavi MPM Mall,</p>
              <p>Ameerpet, Hyderabad, Telangana – 500016, India</p>
              <p>Email: <a href="mailto:info@careermitra.in" className="text-orange-600 hover:underline">info@careermitra.in</a></p>
              <p>Website: <a href="https://www.careermitra.in" className="text-orange-600 hover:underline">https://www.careermitra.in</a></p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 items-center">
              <Link
                to="/contact-us"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
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
