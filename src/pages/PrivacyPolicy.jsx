import { FaShieldAlt, FaDatabase, FaUserLock, FaCookieBite, FaEnvelope, FaGavel, FaAd, FaLink, FaChild, FaExclamationTriangle, FaHistory, FaBuilding, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const Section = ({ icon: Icon, title, children, accent = "blue" }) => {
  const colors = {
    orange: { border: "border-orange-200", icon: "bg-orange-50 text-orange-600", bar: "from-orange-500 to-amber-400" },
    blue:   { border: "border-blue-200",   icon: "bg-blue-50 text-blue-600",   bar: "from-blue-500 to-cyan-400" },
    green:  { border: "border-green-200",  icon: "bg-green-50 text-green-600",  bar: "from-green-500 to-emerald-400" },
    purple: { border: "border-purple-200", icon: "bg-purple-50 text-purple-600", bar: "from-purple-500 to-indigo-400" },
    red:    { border: "border-red-200",    icon: "bg-red-50 text-red-600",    bar: "from-red-500 to-rose-400" },
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

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy — Careermitra"
        description="Welcome to CareerMitra privacy policy. Learn how Sootradhara Venture Pvt Ltd protects and handles your personal information securely and responsibly."
      />

      <div className="min-h-screen pt-20 bg-gray-50/50">

        {/* Hero */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 mb-6">
              <FaShieldAlt size={12} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Privacy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              Welcome to CareerMitra. CareerMitra is owned and operated by Sootradhara Venture Pvt Ltd. We are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly.
            </p>
            <p className="mt-4 text-xs text-gray-400 font-semibold">Last Updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <p className="text-sm text-gray-600 text-center italic mb-6">
            By using our website, you agree to the terms outlined in this Privacy Policy.
          </p>

          {/* Company Information */}
          <Section icon={FaBuilding} title="Company Information" accent="blue">
            <p className="font-semibold text-gray-800">Company Name: Sootradhara Venture Pvt Ltd</p>
            <p className="mt-2">
              <strong>Registered Address:</strong><br />
              7th Floor, 806, Vasavi MPM Mall,<br />
              Ameerpet, Hyderabad, Telangana – 500016, India
            </p>
            <p className="mt-2">
              <strong>Website:</strong> <a href="https://CareerMitra.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CareerMitra.in</a>
            </p>
          </Section>

          {/* Information We Collect */}
          <Section icon={FaDatabase} title="Information We Collect" accent="purple">
            <p>We may collect the following types of information:</p>
            
            <div className="mt-4 space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-sm font-bold text-gray-950 mb-2">Personal Information</h4>
                <p className="mb-2 text-xs text-gray-500">When you contact us, subscribe to newsletters, submit forms, or apply through job-related links, we may collect:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Educational Details</li>
                  <li>Resume or CV (if voluntarily submitted)</li>
                  <li>Any information you provide through contact forms</li>
                </ul>
              </div>

              <div className="border-l-4 border-indigo-400 pl-4 mt-3">
                <h4 className="text-sm font-bold text-gray-950 mb-2">Non-Personal Information</h4>
                <p className="mb-2 text-xs text-gray-500">We may automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>IP Address</li>
                  <li>Browser Type</li>
                  <li>Device Information</li>
                  <li>Operating System</li>
                  <li>Referring Website</li>
                  <li>Pages Visited</li>
                  <li>Time Spent on Website</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* How We Use Your Information */}
          <Section icon={FaUserLock} title="How We Use Your Information" accent="orange">
            <p>We use collected information to:</p>
            <ul className="list-none space-y-2 mt-2">
              {[
                "Provide job, internship, and career-related information",
                "Improve website performance and user experience",
                "Respond to inquiries and support requests",
                "Send newsletters and updates (with user consent)",
                "Analyze website traffic and visitor behavior",
                "Prevent fraud, abuse, and unauthorized activities",
                "Comply with legal obligations"
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Cookies Policy */}
          <Section icon={FaCookieBite} title="Cookies Policy" accent="purple">
            <p>CareerMitra uses cookies and similar technologies to improve user experience.</p>
            <p className="mt-2"><strong>Cookies help us:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Remember user preferences</li>
              <li>Analyze website traffic</li>
              <li>Improve content performance</li>
              <li>Deliver relevant advertisements</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Users can disable cookies through their browser settings. However, some website features may not function properly if cookies are disabled.
            </p>
          </Section>

          {/* Google AdSense and Advertising */}
          <Section icon={FaAd} title="Google AdSense and Advertising" accent="blue">
            <p>We use third-party advertising services, including Google AdSense, to display advertisements on our website.</p>
            <p>Google may use cookies, including the DoubleClick Cookie, to serve ads based on users' previous visits to our website and other websites.</p>
            
            <p className="mt-3"><strong>Google's advertising partners may collect:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Device information</li>
              <li>Browsing behavior</li>
              <li>Approximate location information</li>
              <li>Advertisement interaction data</li>
            </ul>

            <p className="mt-3">
              Users may opt out of personalized advertising by visiting:{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                Google Ads Settings
              </a>
            </p>
            <p className="text-xs text-gray-500">
              For more information about how Google uses data, visit:{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google Privacy & Terms
              </a>
            </p>
          </Section>

          {/* Third-Party Links */}
          <Section icon={FaLink} title="Third-Party Links" accent="orange">
            <p>CareerMitra may contain links to external websites, government recruitment portals, educational institutions, employers, and other third-party resources.</p>
            <p className="mt-3"><strong>We are not responsible for:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1 pl-2">
              <li>Content on external websites</li>
              <li>Privacy practices of third-party websites</li>
              <li>Accuracy of information provided by external sources</li>
            </ul>
            <p className="mt-2 italic text-xs text-gray-500">
              Users should review the privacy policies of those websites before sharing personal information.
            </p>
          </Section>

          {/* Data Security */}
          <Section icon={FaShieldAlt} title="Data Security" accent="green">
            <p>We implement reasonable security measures to protect your personal information from:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Unauthorized access</li>
              <li>Alteration</li>
              <li>Disclosure</li>
              <li>Misuse</li>
              <li>Loss or destruction</li>
            </ul>
            <p className="mt-3">
              While we strive to protect your data, no method of internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          {/* Children's Privacy */}
          <Section icon={FaChild} title="Children's Privacy" accent="purple">
            <p>CareerMitra does not knowingly collect personal information from children under the age of 13 years.</p>
            <p>If a parent or guardian believes that a child has provided personal information, please contact us immediately, and we will remove such information promptly.</p>
          </Section>

          {/* Email Communications */}
          <Section icon={FaEnvelope} title="Email Communications" accent="blue">
            <p>If you subscribe to our newsletter or updates, we may send:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Job Alerts</li>
              <li>Recruitment Notifications</li>
              <li>Internship Opportunities</li>
              <li>Career Guidance Updates</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              You can unsubscribe at any time using the unsubscribe link included in our emails.
            </p>
          </Section>

          {/* Your Rights */}
          <Section icon={FaClipboardList} title="Your Rights" accent="orange">
            <p>Depending on applicable laws, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Object to certain data processing activities</li>
            </ul>
            <p className="mt-3">To exercise these rights, please contact us.</p>
          </Section>

          {/* Disclaimer */}
          <Section icon={FaExclamationTriangle} title="Disclaimer" accent="red">
            <p>
              CareerMitra provides information related to government jobs, private jobs, internships, admissions, career opportunities, and educational updates. While we make every effort to provide accurate and timely information, we do not guarantee the completeness, accuracy, or reliability of any information published on this website.
            </p>
            <p className="mt-2 font-semibold">
              Users are advised to verify information through official sources before making decisions.
            </p>
          </Section>

          {/* Changes to This Privacy Policy */}
          <Section icon={FaHistory} title="Changes to This Privacy Policy" accent="green">
            <p>We reserve the right to update or modify this Privacy Policy at any time.</p>
            <p>Changes will be posted on this page along with the updated effective date. Continued use of the website after modifications constitutes acceptance of the updated Privacy Policy.</p>
          </Section>

          {/* Contact card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-center">
            <FaEnvelope size={28} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Contact Us</h3>
            <p className="text-sm text-gray-500 mb-4">If you have any questions regarding this Privacy Policy, please contact us:</p>
            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <p className="font-bold text-gray-900">Sootradhara Venture Pvt Ltd</p>
              <p>7th Floor, 806, Vasavi MPM Mall,</p>
              <p>Ameerpet, Hyderabad, Telangana – 500016, India</p>
              <p>Email: <a href="mailto:info@careermitra.in" className="text-blue-600 hover:underline">info@careermitra.in</a></p>
              <p>Website: <a href="https://careermitra.in" className="text-blue-600 hover:underline">https://careermitra.in</a></p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 items-center">
              <Link
                to="/contact-us"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/terms-of-service"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
