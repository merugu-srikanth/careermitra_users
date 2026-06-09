import { FaShieldAlt, FaDatabase, FaUserLock, FaCookieBite, FaEnvelope, FaGavel } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const Section = ({ icon: Icon, title, children, accent = "orange" }) => {
  const colors = {
    orange: { border: "border-orange-400/30", icon: "bg-orange-500/10 text-orange-400", bar: "from-orange-500 to-amber-400" },
    blue:   { border: "border-blue-400/30",   icon: "bg-blue-500/10 text-blue-400",   bar: "from-blue-500 to-cyan-400" },
    green:  { border: "border-green-400/30",  icon: "bg-green-500/10 text-green-400",  bar: "from-green-500 to-emerald-400" },
    purple: { border: "border-purple-400/30", icon: "bg-purple-500/10 text-purple-400", bar: "from-purple-500 to-indigo-400" },
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

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy — CareerMitra"
        description="Learn how CareerMitra collects, uses, and protects your personal data. We are committed to safeguarding your privacy."
      />

      <div className="min-h-screen pt-20 bg-white">

        {/* Hero */}
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 mb-6">
              <FaShieldAlt size={12} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Privacy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we keep it safe.
            </p>
            <p className="mt-4 text-xs text-gray-400">Last updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <Section icon={FaDatabase} title="Information We Collect" accent="blue">
            <p>We collect only the information necessary to provide you a personalised job-discovery experience:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {[
                { label: "Account Info", desc: "Name, email address, mobile number, and password (hashed)." },
                { label: "Profile Data", desc: "Qualifications, job interests, age, and location preferences." },
                { label: "Usage Data", desc: "Pages visited, jobs viewed, search queries, and session duration." },
                { label: "Device Info", desc: "Browser type, device type, OS, and IP address for security." },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                  <p className="text-xs font-black text-blue-700 mb-1">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={FaUserLock} title="How We Use Your Information" accent="orange">
            <p>The data we collect is used exclusively to improve your experience on CareerMitra:</p>
            <ul className="list-none space-y-2 mt-2">
              {[
                "To create and manage your user account.",
                "To send personalised government job alerts relevant to your profile.",
                "To improve platform features, job recommendations, and search accuracy.",
                "To send important service notifications (OTP, password reset, alerts).",
                "To detect and prevent fraudulent or unauthorised account activity.",
                "To comply with applicable legal obligations.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-2">We do <strong className="text-gray-600">not</strong> sell, rent, or trade your personal information to third parties.</p>
          </Section>

          <Section icon={FaShieldAlt} title="Data Security" accent="green">
            <p>We implement industry-standard security measures to protect your personal data:</p>
            <ul className="list-none space-y-2 mt-2">
              {[
                "Passwords are hashed and never stored in plain text.",
                "All data transmission is encrypted using HTTPS/TLS.",
                "Authentication tokens (JWT) are stored securely and expire automatically.",
                "Access to user data is restricted to authorised personnel only.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  {t}
                </li>
              ))}
            </ul>
            <p>While we take all reasonable precautions, no internet transmission is 100% secure. We encourage you to use a strong, unique password for your account.</p>
          </Section>

          <Section icon={FaCookieBite} title="Cookies & Local Storage" accent="purple">
            <p>CareerMitra uses browser localStorage (not traditional cookies) to store your authentication token and session preferences. This allows you to stay logged in across page refreshes.</p>
            <p>We may also use analytics tools that place cookies to measure platform usage and improve performance. These do not contain personally identifiable information.</p>
            <p>You can clear localStorage or cookies at any time via your browser settings, which will log you out of your account.</p>
          </Section>

          <Section icon={FaGavel} title="Your Rights" accent="blue">
            <p>As a CareerMitra user, you have the right to:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {[
                { label: "Access", desc: "Request a copy of the personal data we hold about you." },
                { label: "Correction", desc: "Update or correct inaccurate personal information via your profile." },
                { label: "Deletion", desc: "Request deletion of your account and associated data." },
                { label: "Portability", desc: "Receive your data in a structured, machine-readable format." },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                  <p className="text-xs font-black text-blue-700 mb-1">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">To exercise any of these rights, contact us through the <Link to="/contact-us" className="text-blue-500 hover:underline font-semibold">Contact page</Link>.</p>
          </Section>

          <Section icon={FaUserLock} title="Third-Party Links" accent="orange">
            <p>CareerMitra links to official government job portals, notification PDFs, and application portals. These external sites have their own privacy policies, and we are not responsible for their content or data practices.</p>
            <p>We recommend reviewing the privacy policy of any third-party site you visit from our platform.</p>
          </Section>

          <Section icon={FaGavel} title="Changes to This Policy" accent="green">
            <p>We may update this Privacy Policy from time to time. When we do, the "Last updated" date at the top of this page will be revised.</p>
            <p>Significant changes will be communicated via a notice on the platform or via email. Continued use of CareerMitra after changes are posted constitutes your acceptance of the revised policy.</p>
          </Section>

          {/* Contact card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
            <FaEnvelope size={28} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Privacy concerns?</h3>
            <p className="text-sm text-gray-500 mb-4">We take privacy seriously. Reach out and we'll get back to you within 48 hours.</p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <p className="mt-4 text-xs text-gray-400">
              Also see our{" "}
              <Link to="/terms-of-service" className="text-blue-500 hover:underline font-semibold">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
