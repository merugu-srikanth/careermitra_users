"use client";

import { useState } from "react";
import Link from "next/link";

const InlineLink = ({ href, children }) => (
  <Link href={href} className="text-blue-600 font-semibold hover:underline">
    {children}
  </Link>
);

const ChevDownIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SECTIONS = [
  {
    heading: "Latest Government Job Notifications 2026",
    level: 2,
    paragraphs: [
      <>
        Career Mitra is India's most trusted platform for government jobs & career guidance. It was founded by a retired Additional Commissioner of State GST, Government of Telangana, with a team having 30+ years of actual experience in the government domain, and not just guessing about what the students require. There are thousands of job postings every year. It covers not only major examinations such as SSC, UPSC and Railway but also small openings in Defense, PSUs, universities and research organizations. All in one website, <InlineLink href="/">Career Mitra</InlineLink>. The job opening can be searched on the basis of qualifications, interests or even sectors. Career Mitra offers latest information regarding Government Jobs, Sarkari Naukri, examination, results and career guidance. Every job listing gives complete details, such as number of vacancies, qualification, age limit, location and last date of application.
      </>,
    ],
  },
  {
    heading: "Daily & Fast Government Job Updates on CareerMitra",
    level: 3,
    paragraphs: [
      <>
        <InlineLink href="/government-jobs">Government jobs</InlineLink> do not run on a set calendar. A new post could open at any time. A deadline could shift. Exam dates can change. Career Mitra keeps a track of these changes on a daily basis, so that you need not visit 10 websites on your own. Career Mitra job alert works around you. Once you register you will get job suggestions based on your education and profile. You are provided with daily updates and matches curated for you, not a random list that everyone else sees. And this is why checking often pays off, even more if you are targeting more than one exam.
      </>,
    ],
  },
  {
    heading: "Types of Government Jobs Available",
    level: 3,
    paragraphs: [
      "Career Mitra has all types of government jobs. You do not have to bet it all on one exam. Pick the path that fits the career you want.",
    ],
    list: {
      ordered: true,
      items: [
        <>
          <InlineLink href="/ssc-jobs">SSC Jobs</InlineLink>: Get SSC CGL, SSC CHSL, SSC MTS, SSC GD, SSC CPO, SSC JE, SSC Stenographer and other SSC jobs.
        </>,
        <>
          <InlineLink href="/upsc-jobs">UPSC Jobs</InlineLink>: Discover Civil Services, NDA, CDS, CAPF, Engineering Services and other UPSC exams.
        </>,
        <>
          <InlineLink href="/railway-jobs">Railway Jobs</InlineLink>: Check RRB NTPC, Group D, ALP, Technician, JE, RPF and others.
        </>,
        <>
          <InlineLink href="/bank-jobs">Banking Jobs</InlineLink>: Career Mitra has a separate section for Bank Jobs covering IBPS, SBI and other public sector bank jobs like PO, Clerk, Specialist Officer and apprentice posts.
        </>,
        <>
          <InlineLink href="/defence-jobs">Defence Jobs</InlineLink> : Get posts in Army, Navy, Air Force and other Defence units.
        </>,
        <>
          Police Jobs: Get information about Central and State Police jobs like Constable and Sub Inspector.
        </>,
        <>
          <strong>Teaching Jobs:</strong> Find teaching vacancies in schools, colleges, universities and education boards.
        </>,
        <>
          <InlineLink href="/psu-jobs">PSU Jobs</InlineLink>: Know about technical, engineering and management posts in PSUs along with GATE rules, age criteria and selection process.
        </>,
        <>
          <strong>Healthcare & Medical Jobs:</strong> See posts for doctors, nurses, chemists and lab and medical staff.
        </>,
        <>
          <InlineLink href="/state-government-jobs">State Govt Jobs</InlineLink>: Find State PSC & state department jobs like state specific jobs such as recruitment in Telangana.
        </>,
        <>
          <InlineLink href="/central-government-jobs">Central Government Jobs</InlineLink>: Find job vacancies from ministries and departments of Central Government.
        </>,
        <>
          <strong>Court & Judiciary Jobs:</strong> Find government jobs in law and court.
        </>,
        <>
          <strong>University & Research Jobs:</strong> Find teaching and research vacancies including JRF at universities.
        </>,
        <>
          <strong>Other government department jobs:</strong> Find jobs from other government bodies which may not always hit the headlines but are recruiting every year.
        </>,
      ],
    },
  },
  {
    heading: "Government Jobs Based on Educational Qualification",
    level: 3,
    paragraphs: [
      "Career Mitra categorises jobs according to your educational qualifications so that you will not waste your time on job posts for which you are not eligible. It has a good Career Guidance section with an advisor with 26+ years of experience in guiding students and clear guides on choosing jobs based on your marks and goals. Search by 10th Pass, 12th Pass, ITI, Diploma, Graduate, Postgraduate, Engineering or other Professional Qualification. Students of 10th and 12th can look for jobs in Railway, Police, Defence and departmental jobs. Graduates have more options and can apply for SSC, UPSC, Banking, Railroad and State PSC posts. Engineers and postgraduates can apply for technical, PSU and research jobs related to their field of study. Career Mitra also answers common doubts, like whether final year students can apply, whether distance education degrees count, what papers you need, and how age limits work.",
    ],
  },
  {
    heading: "Central Government and State Government Jobs",
    level: 3,
    paragraphs: [
      "Career Mitra shows both Central and State Government jobs in one place. This allows you to search by sector and your preferred location. Jobs in the central government are in SSC, UPSC, Railroads, Defence and central ministries. State jobs are from State PSC's, state departments. The rules don't always apply the same to both. Certain State jobs require proof of domicile or local language. Most Central jobs are open to any Indian who is eligible regardless of the state you belong to. If you are looking for state-based posts or central posts, Career Mitra has both so you can search as per your convenient location.",
    ],
  },
  {
    heading: "Government Jobs by Recruitment Organization",
    level: 3,
    paragraphs: [
      "In case you already have an idea of the exam you will be giving, it is recommended you narrow your search based on the organization administering the exams. Career Mitra allows you to follow major recruiters, in addition to listing positions from minor departments that you might have missed otherwise.",
      "Some of the positions listed are those for SSC Recruitment – CGL, CHSL, MTS, GD, CPO and others; UPSC Recruitment – Civil Services, NDA, CDS, CAPF; and Railway Recruitment – NTPC, Group D, ALP, Technician, JE, RPF. It also has information about other organizations like Banking, State PSC, Defence, PSU, University, Research, and various other central and state organizations.",
      "Among some of the most popular pages in Career Mitra are pages related to the following: Telangana Jobs, SBI Jobs, HAL Jobs, Coal India Jobs, Bank of Baroda Jobs, Karnataka Jobs, DRDO Jobs, Punjab Jobs, Himachal Pradesh Jobs and Bank of India Jobs. This is another simple way of locating jobs.",
    ],
  },
  {
    heading: "How to Find the Right Government Job on CareerMitra",
    level: 3,
    paragraphs: [
      "Career Mitra is designed to simplify and personalize your career search process. Begin with the qualification of yours. After that, filter it out according to the job, body, or location. With the creation of your profile, Career Mitra would help you get jobs matching your qualification and experience.",
    ],
    list: {
      ordered: true,
      items: [
        <>
          <strong>Search By Educational Qualification:</strong> Jobs according to your 10th, 12th, ITI, diploma, degree or PG qualification.
        </>,
        <>
          <strong>Search By Job Category:</strong> See SSC, UPSC, Railway, Banking, Defense, Teaching, PSU and much more.
        </>,
        <>
          <strong>See Eligibility Criteria:</strong> See age, educational qualification, experience, domicile and category criteria.
        </>,
        <>
          <strong>See Number of Vacancies and Job Location:</strong> See the number of vacancies and job location.
        </>,
        <>
          <strong>See Application Opening and Closing Date:</strong> Ensure that the period is still on.
        </>,
        <>
          <strong>See Full Recruitment Notice:</strong> See application fee, documents required and process of selection.
        </>,
        <>
          <strong>Apply by Using Application Portal:</strong> Use Career Mitra to know about the job, apply from the official site.
        </>,
      ],
    },
  },
  {
    heading: "Why Login or Subscribe to CareerMitra?",
    level: 3,
    paragraphs: [
      <>
        Career Mitra is personalized for individual career choices and does not have a universal list of jobs. Signing up with Career Mitra is simple and free and, in fact, one can use their QR code on the mobile phone to <InlineLink href="/register">sign up</InlineLink> without entering any data manually. Post registration, the alert mechanism of the website uses your educational background and personal profile to provide job recommendations for you. With the account created, job search becomes more efficient as one is constantly informed about relevant jobs from the government sectors monitored by Career Mitra. Additionally, you will receive career guidance and internship information, which makes Career Mitra far more than just a job search website.
      </>,
      "Career Counselling offered by Career Mitra is done based on the experience of three retired senior members in their own respective field of expertise. This group consists of an IAS Retired Member, an IFS Retired Member who was formerly the Chairman of National Biodiversity Authority, and a retired member of Telangana Public Service Commission (TGPSC). The experience that these retired members have in public administration, environmental governance, and government recruitment enhances the value of Career Guidance provided by Career Mitra.",
      "Get personalized latest Govt Jobs notifications, Sarkari Naukri updates, exam alerts, results, and career guidance at Career Mitra.",
    ],
  },
  {
    heading: "Never Miss Government Job Application Deadlines",
    level: 3,
    paragraphs: [
      <>
        A promising opportunity may go by unnoticed if you miss the final deadline. This is certainly a tough way to give up on an opportunity. The <InlineLink href="/register">Career Mitra notifications</InlineLink> will make sure that you don't miss out on any post or its deadlines. Nonetheless, maintain a personal list of deadlines yourself and do not depend entirely on the last date. Be wary of the upcoming posts as well. Apply a few days prior to the application deadline. This will allow you sufficient time to rectify any problems.
      </>,
    ],
  },
  {
    heading: "Government Job Search Tips for Aspirants",
    level: 3,
    paragraphs: [
      "Job hunting is not just about applying for all vacancies you come across. Career Mitra can assist you in finding jobs; however, checking eligibility will help you filter out the right ones for you. Some of the topics covered in the Career Guidance module of Career Mitra are OTR Registration, Age Limits, Eligible Documents, etc.",
    ],
    list: {
      ordered: true,
      items: [
        <>
          <strong>Check Notification Periodically:</strong> Make Career Mitra an integral part of your everyday life.
        </>,
        <>
          <strong>Select Relevant Jobs According to Your Qualifications:</strong> Look for jobs you qualify for.
        </>,
        <>
          <strong>Match Your Qualification With The Eligibility Criteria:</strong> Compare age, qualifications, experience and other eligibility criteria.
        </>,
        <>
          <strong>Prepare Necessary Documents In Advance:</strong> Have your certificates, marksheets, identity proof, photograph, and signature prepared.
        </>,
        <>
          <strong>Check Official Notification Thoroughly:</strong> Don't take short forwards or messages for granted.
        </>,
        <>
          <strong>Don't Depend Solely On Informal Sources:</strong> Get facts from the official authority.
        </>,
        <>
          <strong>Prepare For Various Categories Of Recruitment:</strong> Don't concentrate only on one examination. You will end up missing many opportunities.
        </>,
      ],
    },
  },
];

const FAQS = [
  {
    q: "Where do I get the latest government job notifications?",
    a: "They can be found at Career Mitra for SSC, UPSC, Railways, Banking, Defense, Central and State Government Jobs and many more.",
  },
  {
    q: "How often will CareerMitra update government job notifications?",
    a: "Career Mitra keeps on updating the jobs frequently and sends daily updates and matches jobs relevant to your profile.",
  },
  {
    q: "What are the government jobs available for 10th pass students?",
    a: "There are various Railways, Police, Defense and other Department jobs available for 10th pass students at Career Mitra.",
  },
  {
    q: "What are the government jobs available for 12th pass?",
    a: "Career Mitra assists 12th pass students in finding SSC, Railway, Police, Clerical and many other types of jobs available.",
  },
  {
    q: "What government jobs are available for graduates?",
    a: "There are SSC, UPSC, Banking, Railways, State PSC, Defense, PSUs and many other Government jobs available for Graduates.",
  },
  {
    q: "Does Career Mitra provide information on Central and State Government jobs?",
    a: "Yes. Career Mitra provides information on Central and State Government jobs, Defense, Banking, Railway and many more.",
  },
  {
    q: "How can I avoid missing government job deadlines?",
    a: "It is essential to check Career Mitra regularly and also enable Job Alerts. Keep a track of upcoming deadlines and apply before the deadline rather than applying on the last date.",
  },
  {
    q: "Is it important to verify the official notification before applying to any Government Job?",
    a: "Yes, it is important. Career Mitra will assist you in finding and understanding a job, but official notification remains final regarding rules, deadlines, fees and selection procedure.",
  },
];

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-4 hover:bg-orange-50/40 transition-colors duration-150"
      >
        <span className="text-sm sm:text-base font-bold text-gray-800">{q}</span>
        <span className="text-orange-500">
          <ChevDownIcon open={open} />
        </span>
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 -mt-1">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function JobsSeoArticle() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <article className="mt-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 md:p-12">
      {/* ── Content Sections ── */}
      <div className="space-y-10">
        {SECTIONS.map((section, i) => {
          const HeadingTag = section.level === 2 ? "h2" : "h3";
          return (
            <section key={i}>
              <HeadingTag
                className={
                  section.level === 2
                    ? "text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight"
                    : "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight"
                }
              >
                {section.heading}
              </HeadingTag>

              {section.paragraphs.map((p, pi) => (
                <p key={pi} className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}

              {section.list && (
                <ol className="mt-4 space-y-2.5 list-decimal list-outside pl-5 marker:text-orange-500 marker:font-bold">
                  {section.list.items.map((item, li) => (
                    <li key={li} className="text-sm sm:text-base text-gray-600 leading-relaxed pl-1">
                      {item}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}

        {/* ── FAQs ── */}
        <section>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight">FAQs</h3>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem
                key={i}
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq((cur) => (cur === i ? -1 : i))}
              />
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="rounded-2xl bg-linear-to-br from-orange-50 to-green-50/40 border border-orange-100 p-5 sm:p-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            Final CareerMitra CTA
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
            At Career Mitra, you can find government jobs, Sarkari Naukri updates, and career guidance under one roof and hence make your search easy. Find jobs from SSC, UPSC, Railways, Banking, Defence, Police, Teaching, PSUs, Healthcare, Central Government, State Government, Court, Judiciary, University, Research, and other departments.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
            Moreover, Career Mitra not only provides you with job alerts but also has job alerts, exam updates, results, career guidance, and internships for you. Internship is a section for students and freshers while Career Guidance is a section that provides practical information regarding guidelines, preparation and employment opportunities from a team of experts with 30+ years of experience in the government sector, trusted by 500+ students across India.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            At Career Mitra, receive personalized alerts of latest Govt Jobs, Sarkari Naukri updates, exam alerts, results, and career guidance. Create your profile for free, and get searched on the basis of your knowledge and requirement. Stay updated about job opportunities throughout 2026.
          </p>
        </section>
      </div>
    </article>
  );
}
