import { FaShieldAlt, FaExclamationTriangle, FaBan, FaGavel, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const Section = ({ icon: Icon, title, children, accent = "orange" }) => {
  const colors = {
    orange: { border: "border-orange-400/30", icon: "bg-orange-500/10 text-orange-400", bar: "from-orange-500 to-amber-400" },
    red:    { border: "border-red-400/30",    icon: "bg-red-500/10 text-red-400",    bar: "from-red-500 to-orange-400" },
    blue:   { border: "border-blue-400/30",   icon: "bg-blue-500/10 text-blue-400",   bar: "from-blue-500 to-cyan-400" },
    green:  { border: "border-green-400/30",  icon: "bg-green-500/10 text-green-400",  bar: "from-green-500 to-emerald-400" },
  };
  const c = colors[accent];
  return (
    <div className={`rounded-2xl border ${c.border} bg-white p-6 shadow-sm`}>
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
  return (
    <>
      <SEO
        title="Terms of Service — CareerMitra"
        description="Read the Terms of Service for CareerMitra. Learn about acceptable use, disclaimers, and your responsibilities as a user of our platform."
      />

      <div className="min-h-screen bg-white pt-20">

        {/* Hero */}
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 mb-6">
              <FaGavel size={12} className="text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Please read these terms carefully before using CareerMitra. By accessing our platform, you agree to these terms.
            </p>
            <p className="mt-4 text-xs text-gray-400">Last updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <Section icon={FaShieldAlt} title="Acceptance of Terms" accent="orange">
            <p>By accessing or using CareerMitra ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
            <p>These terms apply to all visitors, users, and registered members of CareerMitra. We may update these terms periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.</p>
          </Section>

          <Section icon={FaGavel} title="Use of the Platform" accent="blue">
            <p>CareerMitra provides information about government job opportunities, career guidance, internship updates, and related educational content for aspirants across India.</p>
            <ul className="list-none space-y-2 mt-2">
              {[
                "You must be at least 16 years of age to register.",
                "You are responsible for maintaining the confidentiality of your account credentials.",
                "You agree not to share false or misleading information during registration.",
                "One person may register only one account.",
                "You agree to use the platform solely for lawful, personal, and non-commercial purposes.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={FaExclamationTriangle} title="Disclaimer of Accuracy" accent="orange">
            <p>All job listings, exam dates, vacancies, and notifications displayed on CareerMitra are sourced from official government portals and publicly available information.</p>
            <p>We strive to keep information accurate and up to date; however, <strong className="text-gray-800">CareerMitra does not guarantee the accuracy, completeness, or timeliness</strong> of any job listing or notification. Always verify directly with the official recruiting organisation before applying.</p>
            <p>CareerMitra is not responsible for any loss or missed opportunities arising from reliance on information provided on this platform.</p>
          </Section>

          <Section icon={FaBan} title="Prohibited Activities" accent="red">
            <p>Users are strictly prohibited from:</p>
            <ul className="list-none space-y-2 mt-2">
              {[
                "Attempting to hack, scrape, or reverse-engineer any part of the platform.",
                "Using automated bots, scrapers, or crawlers to extract data.",
                "Posting spam, misleading, or offensive content.",
                "Impersonating another user, organisation, or CareerMitra staff.",
                "Attempting to gain unauthorised access to other users' accounts.",
                "Using the platform to distribute malware or conduct phishing attacks.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {t}
                </li>
              ))}
            </ul>
            <p>Violation of these prohibitions may result in immediate account termination and legal action.</p>
          </Section>

          <Section icon={FaShieldAlt} title="Intellectual Property" accent="green">
            <p>All content on CareerMitra — including text, graphics, logos, icons, and code — is the property of CareerMitra or its content suppliers and is protected under Indian intellectual property laws.</p>
            <p>You may not reproduce, distribute, modify, or create derivative works from any content without explicit written permission from CareerMitra.</p>
          </Section>

          <Section icon={FaGavel} title="Limitation of Liability" accent="blue">
            <p>CareerMitra shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to missed job opportunities, data loss, or account-related issues.</p>
            <p>Our total liability to you for any claim arising from use of the platform shall not exceed the amount paid (if any) by you to CareerMitra in the 12 months preceding the claim.</p>
          </Section>

          <Section icon={FaGavel} title="Governing Law" accent="orange">
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of CareerMitra shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.</p>
          </Section>

          {/* Contact card */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center">
            <FaEnvelope size={28} className="text-orange-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Questions about these Terms?</h3>
            <p className="text-sm text-gray-500 mb-4">Reach out to our team and we'll respond within 48 hours.</p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
            >
              Contact Us
            </Link>
            <p className="mt-4 text-xs text-gray-400">
              Also see our{" "}
              <Link to="/privacy-policy" className="text-orange-500 hover:underline font-semibold">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
