"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const FAQS = [
  {
    q: "What is Careermitra, and how does it help government job aspirants?",
    a: "Careermitra brings government job notifications, career guidance, exam information, and internship resources together in one place. Create a free profile to start finding listings that suit you.",
  },
  {
    q: "How does Careermitra send personalized job notifications?",
    a: "Once you add your education and other profile details, Careermitra uses them to show government job listings relevant to your background. This helps you focus on suitable listings instead of browsing every notification.",
  },
  {
    q: "How do I find government jobs that match my profile?",
    a: "Browse the job listings or create a profile with your education details to narrow your search. Each listing includes the post, eligibility criteria, and application instructions, helping you check whether you meet the requirements.",
  },
  {
    q: "How often does Careermitra update job notifications?",
    a: "Careermitra adds government recruitment notifications as they become available. A free account lets you receive job alerts based on your profile. Check the listing and official notification for the latest details and application deadlines.",
  },
  {
    q: "What kinds of government jobs are listed on Careermitra?",
    a: "Careermitra lists government jobs from central departments, state governments, banks, railways, and defense organizations. Educational requirements and eligibility criteria vary by post, so review each listing before applying.",
  },
  {
    q: "Can I find both central and state government job notifications?",
    a: "Yes. Careermitra covers both central and state government recruitment. Browse central government jobs or explore state-specific notifications based on where you want to work.",
  },
  {
    q: "Are there government jobs for 10th pass, 12th pass, ITI, diploma, and graduate candidates?",
    a: "Yes. Careermitra lists jobs for 10th pass, 12th pass, ITI, diploma, and graduate candidates. Eligibility varies by post, so check the official notification before applying.",
  },
  {
    q: "Does Careermitra help with exam preparation and eligibility?",
    a: "Careermitra’s career guides explain eligibility criteria, recruitment stages, and different government career paths. Use them to understand what a post requires and what you need to prepare before applying.",
  },
  {
    q: "Are internships and SkillUps available on Careermitra?",
    a: "Yes. Careermitra also lists internships and skill development programs. Students and fresh graduates can explore the available options, check the requirements, and find application details.",
  },
  {
    q: "How do I create a profile on Careermitra?",
    a: "Sign up for a free account and add your education and career details. Careermitra uses your profile to show relevant job listings and alerts. Keep your details up to date as your qualifications change.",
  },
  {
    q: "What are the benefits of using CareerMitra with and without logging in?",
    a: "You can use CareerMitra without logging in. Government job notifications, recruitment updates, and career guidance are open to everyone. If you register and log in, CareerMitra gives you a personal dashboard and sends job alerts that match your profile.",
  },
  {
    q: "Why is it important to complete my CareerMitra profile?",
    a: "A complete profile shows you opportunities that fit your education, qualifications, and career interests. You get government job notifications that matches your qualifications. You can also see updates on PG entrance exams, along with internships and SkillUps that suit your background. Eligible students and recent alumni can find support for building their digital presence and developing startup ideas. Accurate details help CareerMitra pick the right opportunities for you. If your profile is incomplete, you may miss career recommendations made for you.",
  },
  {
    q: "How can I receive personalized job notifications on CareerMitra?",
    a: "Create a free CareerMitra account and fill in your education and other profile details. After that, log in to your dashboard to see jobs that match your qualifications. Keep your profile up to date so the suggestions stay useful.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function FAQItem({ faq, index, activeIndex, setActiveIndex }) {
  const open = activeIndex === index;
  return (
    <div
      className={`bg-white rounded-2xl border transition-colors ${
        open ? "border-orange-200 shadow-md shadow-orange-50" : "border-gray-100"
      }`}
    >
      <button
        type="button"
        onClick={() => setActiveIndex(open ? null : index)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm sm:text-[15px] font-bold text-gray-800">{faq.q}</span>
        <FaChevronDown
          size={14}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180 text-orange-500" : ""
          }`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const half = Math.ceil(FAQS.length / 2);
  const leftFaqs = FAQS.slice(0, half);
  const rightFaqs = FAQS.slice(half);

  return (
    <section style={{ padding: "56px 0 10px", }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-15">
        {/* No scroll-reveal wrapper here: it hid the heading (opacity 0) until
            scrolled into view, so full-page renders showed a blank FAQ header. */}
        <div>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 10px", borderRadius: 9999,
                background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
                border: "1px solid #fed7aa",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>❓</span>
              <span style={{ color: "#c2410c", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Got Questions?
              </span>
            </motion.div>

            <h2
              className="text-3xl md:text-4xl lg:text-[2.1rem] xl:whitespace-nowrap font-black leading-tight tracking-tight mb-4 bg-clip-text text-transparent drop-shadow-sm"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #111827 0%, #111827 34%, #ea580c 40%, #ea580c 58%, #65a30d 64%, #65a30d 100%)",
              }}
            >
              Government Job FAQs: What You Need to Know
            </h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
              className="origin-left h-0.75 rounded-full w-80 mx-auto mb-3"
              style={{
                background: "linear-gradient(90deg, transparent, #fbbf24, #f59e0b, #fbbf24, transparent)",
                boxShadow: "0 0 12px rgba(251,191,36,0.7)",
                height: 3,
                width: 220,
                margin: "14px auto 18px",
                borderRadius: 99,
              }}
            />

            <p style={{ color: "#6b7280", maxWidth: 900, margin: "0 auto", fontSize: 17, fontWeight: 500, lineHeight: 1.7 }}>
              Find answers about job notifications, eligibility, profile-based alerts, and using Careermitra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left column — first half of the questions */}
          <div className="flex flex-col gap-4">
            {leftFaqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            ))}
          </div>
          {/* Right column — second half */}
          <div className="flex flex-col gap-4">
            {rightFaqs.map((faq, i) => {
              const index = i + half;
              return (
                <FAQItem key={index} faq={faq} index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
