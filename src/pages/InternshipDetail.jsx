import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  Calendar,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  DollarSign,
  Award,
  ArrowLeft,
  ChevronDown,
  Info,
  CheckCircle,
  HelpCircle,
  FileText
} from "lucide-react";

const BASE_URL = "https://careermitra.in/api/internships";

export default function InternshipDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/${id}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to load internship details.");
        }
      } catch (err) {
        console.error("Error fetching internship detail:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center py-12">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading internship details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 p-6 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Error Loading Details</h2>
          <p className="text-sm text-slate-500 mt-2">{error || "Internship not found."}</p>
          <Link
            to="/internships"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-100"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  // Value substitutions
  const title = data.internship_title || "Internship";
  const company = data.company_name || "Company";
  const location = data.location || `${data.district_city || ""}, ${data.state || ""}`.trim().replace(/^,\s*/, "") || "India";
  const category = data.domain_sector || "Professional";
  const type = data.internship_type || "Virtual Internship";
  const openings = data.openings || "Not Disclosed";
  const duration = data.duration || "4-12 Weeks";
  const stipend = data.stipend_category === "Paid" ? data.stipend : "Unpaid";
  const stipendType = data.stipend_category || "Unpaid";
  const applyLink = data.apply_link ? (data.apply_link.startsWith("http") ? data.apply_link : `https://${data.apply_link}`) : null;

  // SEO details
  const seoTitle = `${title} Internship at ${company} in ${location} 2026 | Career Mitra`;
  const seoDescription = `Apply for the ${title} Internship at ${company} in ${location}. Work mode: ${type}, Duration: ${duration}, Stipend: ${stipend}. Find eligibility and details here.`;
  const seoKeywords = `${title} Internship, ${company} Internship, Internship in ${location}, ${category} Internship, Career Mitra`;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-16 px-4 md:px-8 font-sans">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        url={`https://careermitra.in/internships/${data.id}`}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          to="/internships"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Internships
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-orange-100/50 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50/50 rounded-bl-[120px] -z-0 pointer-events-none" />
          
          <div className="p-6 md:p-10 relative z-10 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                {type}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-base md:text-lg font-semibold text-slate-600 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                {company}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Location</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Stipend</span>
                <span className="text-xs font-bold text-orange-600 flex items-center gap-1 mt-1">
                  <DollarSign className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{stipend}</span>
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Duration</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{duration}</span>
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Openings</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{openings} Positions</span>
                </span>
              </div>
            </div>

            {/* Apply Button */}
            {applyLink ? (
              <div className="pt-2">
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-100 transition-opacity"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No direct apply link provided. Refer to organization contacts.</p>
            )}
          </div>
        </div>

        {/* Article-Style Content */}
        <div className="bg-white rounded-3xl border border-orange-100/50 shadow-xl p-6 md:p-10 lg:p-12 space-y-10 leading-relaxed text-slate-700">
          
          {/* Section: About Internship */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              About {title} Internship 2026:
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Are you a student, fresh graduate or aspiring professional looking for {title} Internship in {location} then this is a great opportunity for all the candidates to get practical experience in the {category} industry. Students will be able to convert their academic knowledge to real-world situations, work on projects related to their course of study and develop career-ready skills that can help boost their future careers. Internships are a good starting point for candidates who are looking forward to improve their professional knowledge, gain practical experience and familiarise themselves with industry standards. Selected candidates for {title} Internship will gain valuable experience by working on real time projects and working alongside experienced professionals to develop their technical, analytical, communication and problem solving skills.
            </p>
            <p className="text-sm md:text-base text-slate-600">
              The type of internship will vary from organization to organization – paid or unpaid, remote, hybrid, or on-site. Interested and eligible candidates can apply through the official application portal before the last date with the requisite qualifications. The {category} industry, is the best industry of the time and the {title} Internship in {location} is a great opportunity for all the students, fresh graduates and aspiring professionals to get practical experience in {category} industry.
            </p>
          </section>

          {/* Section: Highlights Table */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {title} Internship 2026 Highlights:
            </h2>
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm max-w-xl">
              <table className="w-full text-left text-xs border-collapse">
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-800 w-1/2">Internship Name</td>
                    <td className="p-3.5">{title}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800">Organization Name</td>
                    <td className="p-3.5">{company}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-800">Work Mode</td>
                    <td className="p-3.5">{type}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800">Location</td>
                    <td className="p-3.5">{location}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-800">Internship Category</td>
                    <td className="p-3.5">{category}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800">Total No. of Openings</td>
                    <td className="p-3.5">{openings}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-800">Duration</td>
                    <td className="p-3.5">{duration}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800">Stipend</td>
                    <td className="p-3.5">{stipend}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-800">Stipend type</td>
                    <td className="p-3.5">{stipendType}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800">Application Mode</td>
                    <td className="p-3.5">Online</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Why Apply */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Why Apply for {title} Internship?
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              The {title} Internship provides practical experience, professional networking and career-oriented learning experiences to the interns. Internships are a good bridge to transition from academic education to the needs of the workplace.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Advantages of Internship:</h4>
              <ul className="space-y-2 text-xs md:text-sm font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Gain hands-on industry experience.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Gain experience of professional workflows and tools.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Improve technical and soft skills.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Create a more compelling resume and portfolio.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Better employment opportunities.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Work closely or collaborate with experienced professionals.
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Eligibility */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Eligibility Criteria for {title} Internship
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Candidates meeting the eligibility required that are specified by {company} can apply for the {title} Internship. This internship requirements may be open for candidates who are pursuing graduation, post-graduation or diploma courses or for freshers and professionals who want to upskill themselves.
            </p>
          </section>

          {/* Section: Internship Opportunities in Location */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Internship Opportunities in {location}
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              The number of internship opportunities in {location} is increasing in various sectors like technology, engineering, management, healthcare, finance, marketing and research. Internships in {location} offer students and graduates valuable work experience and a chance to prepare for future career opportunities.
            </p>
          </section>

          {/* Section: Skills you can learn */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Skills You Can Learn During {title} Internship
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Depending on the role and responsibilities of the internship, candidates can learn skills like technical skills related to the domain, teamwork and communication, Project planning and execution, Research and analytical thinking, Professional standards and workplace practices, Critical thinking skills and decision-making.
            </p>
          </section>

          {/* Section: Career Benefits */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Career Benefits of Completing an Internship
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Internships provide candidates with hands-on experience, build confidence, establish industry contacts, and boost employability. Also, an internship adds to the profile of the candidate and future job prospects.
            </p>
          </section>

          {/* Section: How to Apply */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              How to Apply for {title} Internship 2026?
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Candidates who are eligible and interested are recommended to go through the internship details, eligibility, duration, stipend and how to apply instructions thoroughly before the late date of application. The application can be submitted through the official internship portal before the last date.
            </p>
          </section>

          {/* FAQ Accordion Section */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-500" /> Frequently Asked Questions (FAQs)
            </h2>
            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {[
                {
                  q: `What is ${title} Internship?`,
                  a: `The ${title} Internship is a professional training program that is designed to help students and graduates with professional skills and relevant skills.`
                },
                {
                  q: "Who can apply for this internship?",
                  a: "Eligible students, fresh graduates, diploma holders and others meeting the criteria laid down by the organization are invited to apply."
                },
                {
                  q: "Is this internship paid or unpaid?",
                  a: "The details of stipend are mentioned in the internship Highlights section. The candidates are requested to refer the official internship details for complete information."
                },
                {
                  q: "What is the duration of the internship?",
                  a: `The duration of the internship is ${duration}.`
                },
                {
                  q: "How many openings are available?",
                  a: `Interested candidates apply for ${openings} Internship Vacancies.`
                },
                {
                  q: "Where is the internship?",
                  a: `Internship is at ${location}.`
                },
                {
                  q: "How to apply for internship?",
                  a: "Candidates have to apply online through the official internship application portal."
                },
                {
                  q: "Do internships help in getting jobs?",
                  a: "Yes, internships offer a great opportunity for candidates to get practical experience, develop their skills, build professional connections and improve their chances of future employment."
                },
                {
                  q: "Are freshers allowed to apply for these internships?",
                  a: "Yes, most of the internship programs are aimed at students, recent graduates, and candidates who want to get some exposure to the industry."
                },
                {
                  q: "Will I receive a certificate after completing the internship?",
                  a: "Organisation where internship is undertaken is subject to issuance of certificates. Candidates are requested to verify the official internship details."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        activeFAQ === index ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </button>
                  {activeFAQ === index && (
                    <div className="p-4 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section: Disclaimer */}
          <section className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-slate-500 space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 shrink-0" /> Disclaimer
            </h4>
            <p className="leading-relaxed">
              The internship information listed on this page is for informational purposes only and is based on publicly available internship postings. Candidates are advised to check all the details like eligibility criteria, last date, stipend details and application process from the official notification of internship before applying.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
