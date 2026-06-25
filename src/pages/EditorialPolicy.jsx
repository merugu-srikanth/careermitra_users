import { FaBookOpen, FaBullseye, FaListOl, FaLink, FaRobot, FaHandshake, FaAd, FaWrench, FaEnvelope, FaUserCheck, FaClipboardCheck, FaHistory, FaGavel } from "react-icons/fa";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

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

export default function EditorialPolicy() {
  return (
    <>
      <SEO
        title="Editorial Policy — Careermitra"
        description="Read the Editorial Policy for CareerMitra, operated by Sootradhara Venture Pvt Ltd. Learn about our content principles, verification process, and ethics."
      />

      <div className="min-h-screen bg-gray-50/50 pt-20">

        {/* Hero */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 mb-6">
              <FaBookOpen size={12} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Editorial</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Editorial Policy</h1>
            <p className="text-gray-500 text-base max-w-2xl mx-auto">
              At CareerMitra, we are committed to publishing accurate, reliable, transparent, and user-focused content related to jobs, internships, apprenticeships, admissions, scholarships, examinations, career opportunities and other educational-related information.
            </p>
            <p className="mt-4 text-xs text-gray-400 font-semibold">Last Updated: June 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-6">

          <p className="text-sm text-gray-600 text-center italic mb-6">
            CareerMitra is owned and operated by Sootradhara Venture Pvt Ltd.
          </p>

          {/* Our Mission */}
          <Section icon={FaBullseye} title="Our Mission" accent="blue">
            <p>Our mission is to provide students, job seekers, fresh graduates, and professionals with timely, accurate, and easy-to-understand information that helps them make informed career decisions.</p>
            <p>We strive to simplify complex recruitment notifications, educational updates, and career-related announcements so that users can quickly understand eligibility criteria, application processes, important dates, and other essential details.</p>
          </Section>

          {/* Editorial Principles */}
          <Section icon={FaUserCheck} title="Editorial Principles" accent="purple">
            <p>Our content is guided by the following principles:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {[
                { title: "Accuracy", desc: "We make every effort to verify information before publication using official and reliable sources." },
                { title: "Transparency", desc: "We clearly identify sources wherever possible and provide links to official notifications and websites when available." },
                { title: "Independence", desc: "Our editorial decisions are made independently and are not influenced by advertisers, sponsors, affiliate partners, or external organizations." },
                { title: "User-Centric Approach", desc: "We create content with the goal of helping users understand opportunities, requirements, and procedures in a clear and practical manner." },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl border border-purple-100 bg-purple-50/50 p-3">
                  <p className="text-xs font-black text-purple-700 mb-1">{title}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3">
              <strong>Timeliness:</strong> We regularly update our content to reflect changes in recruitment notifications, examination schedules, admissions, and other important developments.
            </p>
          </Section>

          {/* Sources of Information */}
          <Section icon={FaLink} title="Sources of Information" accent="orange">
            <p>The information published on CareerMitra is gathered from publicly available and credible sources, including:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>Official Government Websites</li>
              <li>Public Sector Organizations</li>
              <li>Recruitment Boards</li>
              <li>Universities and Educational Institutions</li>
              <li>Employment News Publications</li>
              <li>Official Press Releases</li>
              <li>Corporate Career Portals</li>
              <li>Regulatory Authorities</li>
              <li>Official Notifications and Advertisements</li>
            </ul>
            <p className="mt-3 font-semibold">Whenever possible, we encourage users to verify details through the official source before making decisions or submitting applications.</p>
          </Section>

          {/* Content Creation Process */}
          <Section icon={FaListOl} title="Content Creation Process" accent="orange">
            <p>Our editorial team follows a structured process before publishing content:</p>
            <div className="space-y-3 mt-3">
              {[
                { step: "Step 1: Research", desc: "We collect information from official announcements, notifications, websites, and trusted public sources." },
                { step: "Step 2: Verification", desc: "Important details such as eligibility criteria, age limits, vacancies, selection processes, application dates, and official links are reviewed for accuracy." },
                { step: "Step 3: Content Preparation", desc: "Information is rewritten in a clear, reader-friendly format to improve accessibility and understanding." },
                { step: "Step 4: Editorial Review", desc: "Content undergoes internal review before publication to identify potential inaccuracies, formatting issues, or missing information." },
                { step: "Step 5: Publication and Monitoring", desc: "Published content is monitored for updates, corrections, and changes announced by the concerned authorities." },
              ].map(({ step, desc }) => (
                <div key={step} className="border-l-4 border-orange-500 pl-3">
                  <p className="text-xs font-bold text-gray-900">{step}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Content Updates */}
          <Section icon={FaHistory} title="Content Updates" accent="green">
            <p>Recruitment notifications, admission announcements, examination schedules, application fees, age limit, scholarship and other details may change after publication.</p>
            <p className="mt-2"><strong>When new information becomes available, our team may:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Update application dates</li>
              <li>Revise eligibility requirements</li>
              <li>Add new official notifications</li>
              <li>Correct outdated information</li>
              <li>Modify content to reflect official changes</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500 font-semibold">The latest version of the article is always considered the most current version.</p>
          </Section>

          {/* AI-Assisted Content */}
          <Section icon={FaRobot} title="AI-Assisted Content" accent="purple">
            <p>CareerMitra may use AI-assisted tools to support content research, formatting, content structuring, grammar improvement, and editorial workflows.</p>
            <p className="mt-2"><strong>However:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>All content is reviewed by human editors before publication.</li>
              <li>AI-generated content is not published without editorial oversight.</li>
              <li>Editorial responsibility remains with CareerMitra's content team.</li>
            </ul>
            <p className="mt-2">We prioritize accuracy, relevance, and user value regardless of the tools used during content creation.</p>
          </Section>

          {/* Editorial Independence */}
          <Section icon={FaHandshake} title="Editorial Independence" accent="orange">
            <p>CareerMitra maintains complete editorial independence.</p>
            <p className="mt-2"><strong>Advertisers, sponsors, affiliate partners, and external organizations do not influence:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-xs text-gray-600">
              <li>Article topics</li>
              <li>Content recommendations</li>
              <li>Editorial opinions</li>
              <li>Recruitment coverage</li>
              <li>Rankings or listings</li>
            </ul>
            <p className="mt-3 font-semibold">Our primary responsibility is to our readers.</p>
          </Section>

          {/* Sponsored Content and Advertising */}
          <Section icon={FaAd} title="Sponsored Content and Advertising" accent="blue">
            <p>We may display advertisements through Google AdSense and other advertising networks.</p>
            <p>Sponsored content, promotional content, or paid collaborations, if published, will be clearly identified to ensure transparency.</p>
            <p>Advertising relationships do not affect our editorial standards or content decisions.</p>
          </Section>

          {/* Corrections Policy */}
          <Section icon={FaWrench} title="Corrections Policy" accent="red">
            <p>Despite our best efforts, errors may occasionally occur.</p>
            <p className="mt-2"><strong>When inaccuracies are identified, we may:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Correct factual errors</li>
              <li>Update outdated information</li>
              <li>Revise misleading statements</li>
              <li>Clarify ambiguous content</li>
            </ul>
            <p className="mt-3">We encourage readers to report any inaccuracies through our contact page.</p>
          </Section>

          {/* User Feedback */}
          <Section icon={FaClipboardCheck} title="User Feedback" accent="green">
            <p>We value feedback from our readers. Suggestions, corrections, and concerns help us improve the quality and accuracy of our content.</p>
            <p className="mt-2"><strong>Users may contact us regarding:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Content corrections</li>
              <li>Missing information</li>
              <li>Technical issues</li>
              <li>Editorial concerns</li>
              <li>Suggestions for improvement</li>
            </ul>
          </Section>

          {/* Content Ownership */}
          <Section icon={FaClipboardCheck} title="Content Ownership" accent="blue">
            <p>Unless otherwise stated, all original content published on CareerMitra, including text, graphics, and website materials, is protected by applicable copyright and intellectual property laws.</p>
            <p className="font-semibold text-red-600">Unauthorized copying, reproduction, or republication of content without permission is prohibited.</p>
          </Section>

          {/* No Guarantee of Outcomes */}
          <Section icon={FaExclamationTriangle} title="No Guarantee of Outcomes" accent="red">
            <p>While we strive to provide accurate and useful information, CareerMitra cannot guarantee:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Employment opportunities</li>
              <li>Examination success</li>
              <li>Admission approvals</li>
              <li>Scholarship awards</li>
              <li>Recruitment outcomes</li>
            </ul>
            <p className="mt-3 font-semibold">Users should independently verify information through official sources before making decisions.</p>
          </Section>

          {/* Editorial Commitment Alert */}
          <div className="rounded-2xl border border-blue-300 bg-blue-50 p-6">
            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <FaBookOpen /> Editorial Commitment
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              At CareerMitra, we are committed to maintaining high editorial standards, publishing trustworthy information, and helping our readers make informed educational and career decisions through accurate, transparent, and responsible content.
            </p>
          </div>

          {/* Contact card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-center">
            <FaEnvelope size={28} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Contact Us</h3>
            <p className="text-sm text-gray-500 mb-4">For editorial inquiries, corrections, feedback, or content-related concerns, please contact:</p>
            <div className="text-xs text-gray-600 space-y-1 mb-4 font-medium">
              <p className="font-bold text-gray-900 text-sm">Sootradhara Venture Pvt Ltd</p>
              <p>7th Floor, 806, Vasavi MPM Mall,</p>
              <p>Ameerpet, Hyderabad, Telangana – 500016, India</p>
              <p>Email: <a href="mailto:info@careermitra.in" className="text-blue-600 hover:underline">info@careermitra.in</a></p>
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
