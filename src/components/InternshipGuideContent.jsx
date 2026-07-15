"use client";

import React, { useState } from "react";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaBriefcase,
  FaQuestionCircle,
  FaChevronDown,
  FaUserCheck,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCommentAlt,
  FaStar,
  FaChartLine,
  FaExclamationCircle,
  FaChevronRight
} from "react-icons/fa";

export default function InternshipGuideContent() {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "what-is-internship", title: "What is an Internship?" },
    { id: "why-important", title: "Why it Matters" },
    { id: "types", title: "Types of Internships" },
    { id: "comparisons", title: "Key Comparisons" },
    { id: "how-to-find", title: "How to Find Internships" },
    { id: "gov-opportunities", title: "Government Internships" },
    { id: "prep", title: "Preparation & Success" },
    { id: "faq", title: "FAQs" }
  ];

  const faqs = [
    {
      q: "What is an internship in simple words?",
      a: "An internship is a short-term working experience program that gives industry exposure and practical skills to students and fresh graduates."
    },
    {
      q: "Who can apply for internships?",
      a: "Applications are invited from undergraduate students, postgraduate students, diploma holders, fresh graduates, research scholars and individuals seeking career experience."
    },
    {
      q: "Are internships paid?",
      a: "Internships can be paid or unpaid, depending on the organization, industry and role."
    },
    {
      q: "Can first-year students apply for internships?",
      a: "Sure. Many organisations have internships especially for first and second year students, especially in areas like research, content writing, marketing and technology."
    },
    {
      q: "How can a fresher get an internship without experience?",
      a: "They can show their skills and potential through academic projects, certifications, volunteer activities, extracurriculars and personal projects."
    },
    {
      q: "Are online internships valid for resumes?",
      a: "Yes. Well-known online internships provide good work experience and are normally accepted by employers when they have real responsibilities and learning opportunities."
    },
    {
      q: "Is internship experience important for jobs?",
      a: "Yes. Internships improve employability, develop working skills and show readiness to recruiters in the workplace."
    },
    {
      q: "Can internships lead to permanent jobs?",
      a: "Many organisations provide pre-placement offers and full-time job opportunities to high performing interns after successful completion of internship programs."
    },
    {
      q: "What is the ideal internship duration?",
      a: "Internships typically last anywhere from four weeks to six months, depending on the industry, organization and program structure."
    }
  ];

  return (
    <div className="w-full bg-slate-50/30 py-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sticky Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28 self-start">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaBookOpen size={16} className="text-orange-500" /> Guide Sections
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all group"
                >
                  <span>{section.title}</span>
                  <FaChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <article className="lg:col-span-3 bg-white rounded-3xl border border-orange-100/40 shadow-xl p-6 md:p-10 lg:p-12 space-y-12 text-slate-700 leading-relaxed">
          
          {/* Section 1: Title Banner */}
          <section id="intro" className="relative border-b border-slate-100 pb-8 scroll-mt-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-wider mb-4">
              <FaStar size={14} />
              Comprehensive 2026 Guide
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              The Ultimate Internship Guide for <span className="text-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Students & Grads</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-500 font-medium">
              A degree alone doesn’t often guarantee you a job today. Learn how internships act as the bridge between classrooms and professional expectations.
            </p>
            <div className="mt-6 p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                An internship is the bridge between the classroom and workplace expectations. It provides students and recent graduates practical experience, industry relevant skills, exposure to professional environments and valuable networking opportunities. Internships have now become one of the best ways to get a full-time job in many industries.
              </p>
            </div>
          </section>

          {/* Section 2: What is an Internship & Meaning */}
          <section id="what-is-internship" className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-24">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 uppercase tracking-wide">
                <FaBriefcase size={16} /> Basics
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">
                What is an Internship?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                An internship is a temporary and structured work experience program that gives practical experience to students, recent graduates and early-career professionals in a specific industry or profession. Interns learn and work with experienced professionals on real projects and work activities that provide them with an understanding on how organisations work.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                The primary goal is learning and building skills. The intern’s work is geared toward achieving organisational goals, but the experience is intended to provide professional training, exposure to industry and opportunities for career exploration.
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 uppercase tracking-wide">
                <FaChartLine size={16} /> Value Addition
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">
                Meaning in Career Development
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                An internship is one of the most valuable opportunities a student can get from a career development point of view. It provides individuals with an understanding of how theoretical concepts are applied in practice and familiarises them with workplace culture, professional expectations, and industry-specific challenges.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                It clears the job roles, responsibilities and long term career prospects. Above all, internship experience shows initiative and practical competence, qualities which are highly valued by employers during recruitment.
              </p>
            </div>
          </section>

          {/* Section 3: Why it Matters */}
          <section id="why-important" className="space-y-6 scroll-mt-24">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Why Internships Are Important</h3>
              <p className="text-sm text-slate-500 mt-1">Core benefits that elevate your professional readiness.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  1
                </div>
                <h4 className="font-extrabold text-slate-800 mb-2">Hands-on Experience</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apply classroom learning directly to real business challenges. Develop technical competencies and key industry-specific workflows.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  2
                </div>
                <h4 className="font-extrabold text-slate-800 mb-2">Professional Network</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Interact with managers, mentors, and fellow interns. Build relationships that lead to recommendations, referrals, and long-term mentorship.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  3
                </div>
                <h4 className="font-extrabold text-slate-800 mb-2">FTE Recruitment Pipe</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  MNCs and startups utilize internship programs as a pipeline for talent. Excel in your tasks to turn it into a full-time offer.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Types of Internships */}
          <section id="types" className="space-y-6 scroll-mt-24">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Types of Internships</h3>
              <p className="text-sm text-slate-500 mt-1">Available in different formats to suit diverse schedules and aspirations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Paid Internships", category: "FINANCIAL SUPPORT", desc: "Offer monetary stipend, allowance, or salary. Highly popular in tech, finance, consulting, and startups." },
                { title: "Unpaid Internships", category: "SKILL FOCUS", desc: "Primarily focus on learning, mentorship, and work experience. Ideal for nonprofit sectors, initial training, or research projects." },
                { title: "Virtual & Remote", category: "FLEXIBLE LOCATION", desc: "Work from anywhere online. Saves commute time and allows access to opportunities across India and globally." },
                { title: "Summer Internships", category: "HOLIDAY WORK", desc: "Short term (4-12 weeks) during academic breaks. Perfect for management, pharmacy, and engineering students." },
                { title: "Part-Time Internships", category: "STUDY BALANCE", desc: "Requires 10-30 hours per week. Flexible format allowing students to balance classes, exams, and coursework." },
                { title: "Full-Time Internships", category: "IMMERSIVE ROLE", desc: "Involves 35-40 hours per week, matching normal employee routines. High probability of securing PPOs." }
              ].map((item, index) => (
                <div key={index} className="p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md rounded-2xl space-y-2 transition-all">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100/60 text-orange-700 text-[9px] font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Comparisons */}
          <section id="comparisons" className="space-y-6 scroll-mt-24">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Key Comparisons</h3>
              <p className="text-sm text-slate-500 mt-1">Understanding the structural differences in career development roles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Internship vs Apprenticeship */}
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Internship vs. Apprenticeship</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600">
                        <th className="p-3">Parameter</th>
                        <th className="p-3">Internship</th>
                        <th className="p-3">Apprenticeship</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Objective</td>
                        <td className="p-3">Learning and exposure</td>
                        <td className="p-3">Vocational skill development</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Duration</td>
                        <td className="p-3">Short-term (1-6 months)</td>
                        <td className="p-3">Long-term (1-3 years)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Compensation</td>
                        <td className="p-3">Paid / Unpaid</td>
                        <td className="p-3">Usually paid</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Outcome</td>
                        <td className="p-3">Work experience</td>
                        <td className="p-3">Skill competency license</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Internship vs Job */}
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Internship vs. Job</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600">
                        <th className="p-3">Parameter</th>
                        <th className="p-3">Internship</th>
                        <th className="p-3">Job</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Purpose</td>
                        <td className="p-3">Learning & development</td>
                        <td className="p-3">Employment & productivity</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Duration</td>
                        <td className="p-3">Temporary</td>
                        <td className="p-3">Permanent / Contractual</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Compensation</td>
                        <td className="p-3">Stipend or allowance</td>
                        <td className="p-3">Salary and benefits</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Training</td>
                        <td className="p-3">Extensive guidance</td>
                        <td className="p-3">Limited onboarding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </section>

          {/* Section 6: How to Find */}
          <section id="how-to-find" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-24">
            
            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FaCalendarAlt size={20} className="text-orange-500" /> Application Timeline
              </h3>
              <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600">
                      <th className="p-3">Internship</th>
                      <th className="p-3">Best Apply Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Summer</td>
                      <td className="p-3 text-orange-600">January to March</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Winter</td>
                      <td className="p-3 text-orange-600">September to November</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Government</td>
                      <td className="p-3">Throughout the year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Corporate</td>
                      <td className="p-3">Rolling applications</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to Find */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FaMapMarkerAlt size={20} className="text-orange-500" /> Finding Internships in India
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                There is a rising demand for skilled professionals in various sectors. A lot of students don't know where to look or how to apply effectively. Here are the top ways to start:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-white transition-all">
                  <span className="font-extrabold text-slate-800 block mb-1"> Dedicated Portals</span>
                  Platforms like Internshala, Naukri, LinkedIn, and Unstop offer verified posts with quick filter options.
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-white transition-all">
                  <span className="font-extrabold text-slate-800 block mb-1"> College Placement Cells</span>
                  University career departments share official notifications for training and campus recruitment drives.
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-white transition-all">
                  <span className="font-extrabold text-slate-800 block mb-1"> LinkedIn Networking</span>
                  Connect with recruiters, hiring managers, and alumni to ask for referrals and unadvertised openings.
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-white transition-all">
                  <span className="font-extrabold text-slate-800 block mb-1"> Company Careers Page</span>
                  Check the official websites of companies you like before listings get distributed to third-party boards.
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Government Internships */}
          <section id="gov-opportunities" className="space-y-6 scroll-mt-24">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-3xl p-6 md:p-8 space-y-4 shadow-lg shadow-orange-100">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest">
                Public Sector Internships
              </span>
              <h3 className="text-2xl md:text-3xl font-black">Government Internship Opportunities</h3>
              <p className="text-xs md:text-sm text-orange-50 leading-relaxed">
                Ministries, government agencies, and research institutions provide students with first-hand exposure to public administration, policymaking, and nation-building initiatives. Some programs offer stipends and certificates on successful completion.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-bold text-center">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">NITI Aayog</div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">Ministry of Ext. Affairs</div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">ISRO Space Tech</div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">DRDO Labs</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
              <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm">How to Apply</h4>
                <p>
                  Most programs require an online application. You need to prepare your academic record, a statement of purpose (SOP), and a letter of recommendation (LOR) from your college. Always check the criteria and deadlines carefully.
                </p>
              </div>
              <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-2">
                <h4 className="font-extrabold text-slate-800 text-sm">Other Government Bodies & PSUs</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>CSIR Labs:</strong> Biotechnology, Pharma, and Life Sciences.</li>
                  <li><strong>NHRC:</strong> Human rights, public administration, and law.</li>
                  <li><strong>PSUs:</strong> ONGC, BHEL, NTPC, and IOCL industrial training.</li>
                  <li><strong>CDSCO, ICMR, FSSAI:</strong> Pharmacy, food safety, and medical research.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8: Preparation & Success */}
          <section id="prep" className="space-y-6 scroll-mt-24">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Preparation & Success Tips</h3>
              <p className="text-sm text-slate-500 mt-1">Stand out from the crowd and maximize your learning curve.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-slate-100 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                <div className="p-2 w-fit bg-orange-50 text-orange-600 rounded-xl">
                  <FaUserCheck size={20} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">For Freshers</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Focus on academic projects, certifications, volunteer activities, and personal portfolios to show initiative and capacity.
                </p>
              </div>

              <div className="p-6 border border-slate-100 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                <div className="p-2 w-fit bg-orange-50 text-orange-600 rounded-xl">
                  <FaFileAlt size={20} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">Resume & Cover Letter</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Keep it concise (1 page). Highlight measurable accomplishments in college projects. Tailor your resume to fit each specific role.
                </p>
              </div>

              <div className="p-6 border border-slate-100 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
                <div className="p-2 w-fit bg-orange-50 text-orange-600 rounded-xl">
                  <FaCommentAlt size={20} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">Interview & Skills</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Research the company beforehand. Practice explaining your projects. Highlight key soft skills: communication and critical thinking.
                </p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50/30 border border-red-100 rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-extrabold text-red-800 flex items-center gap-2">
                <FaExclamationCircle size={18} className="text-red-600" /> Common Mistakes to Avoid
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2"> Applying without homework</div>
                <div className="flex items-center gap-2"> Using a generic resume template</div>
                <div className="flex items-center gap-2"> Poor/unprofessional communication</div>
                <div className="flex items-center gap-2"> Missing project deadlines</div>
                <div className="flex items-center gap-2"> Not asking questions or clarifications</div>
                <div className="flex items-center gap-2"> Ignoring constructive feedback</div>
                <div className="flex items-center gap-2"> Not networking with colleagues</div>
                <div className="flex items-center gap-2"> Inactive profile on professional networks</div>
              </div>
            </div>
          </section>

          {/* Section 9: FAQs */}
          <section id="faq" className="space-y-6 scroll-mt-24">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
                <FaQuestionCircle size={24} className="text-orange-500" /> Frequently Asked Questions
              </h3>
              <p className="text-sm text-slate-500 mt-1">Quick answers to common questions about internship processes.</p>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-800 hover:bg-slate-50 transition-all"
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-200 ${
                        activeFAQ === index ? "rotate-180 text-orange-500" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-200 overflow-hidden ${
                      activeFAQ === index ? "max-h-40 border-t border-slate-50 bg-slate-50/50 p-4" : "max-h-0"
                    }`}
                  >
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </article>

      </div>
    </div>
  );
}
