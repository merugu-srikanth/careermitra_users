"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import AnimatedSection from "@/components/Animatedsection";

const FAQS = [
  {
    q: "What is Careermitra, and how does it help government job aspirants?",
    a: "Careermitra is a platform built for people looking for government jobs in India. It collects job notifications, career guidance, exam information, and internship resources all in one place. You create a profile, and the platform uses your details to show you jobs that actually fit your background.",
  },
  {
    q: "How does Careermitra send personalized job notifications?",
    a: "When you fill in your education and profile details, Careermitra matches those details against available government job listings. Instead of going through hundreds of notifications yourself, you get to see only the ones relevant to you.",
  },
  {
    q: "How do I find the latest government jobs that suit my profile?",
    a: "Browse the job listings on Careermitra and let your profile do the filtering. Each listing shows you the post details, who can apply and how to apply, so you know what you're getting into before you take the next step.",
  },
  {
    q: "Does Careermitra update job notifications every day?",
    a: "Yes. New government recruitment notifications are added regularly, and job alerts go out to keep you in the loop. Creating a free account means you get updates that are matched to your profile rather than generic ones.",
  },
  {
    q: "What kinds of government jobs are listed on Careermitra?",
    a: "You'll find opportunities from central government departments, state governments, banks, and defence organisations. The listings cover a wide range of posts, departments, and eligibility requirements, so there's something for people at different stages of their careers.",
  },
  {
    q: "Can I find both Central and State Government job notifications here?",
    a: "Yes. Careermitra has separate sections for central and state government jobs. Whether you're looking for opportunities in your own state or across India, you can find relevant notifications in one place.",
  },
  {
    q: "Are there jobs for 10th pass, 12th pass, ITI, Diploma and graduate candidates?",
    a: "Careermitra lists jobs across different educational requirements. That said, every post has its own eligibility criteria, so always read the individual notification carefully before you apply to make sure you qualify.",
  },
  {
    q: "Does Careermitra help with exam preparation and understanding eligibility?",
    a: "Careermitra has career guidance content that explains eligibility requirements, what different recruitment processes look like, and how government career paths generally work. It's useful if you're just starting and trying to figure out where to begin.",
  },
  {
    q: "Are internship & Skill Up's opportunities also available on Careermitra?",
    a: "Yes. Along with job notifications, Careermitra covers internship & Skill Up's options too. The internship section gives students and fresh graduates information on different types of internships, government schemes, and how to go about applying for them.",
  },
  {
    q: "How do I create a profile on Careermitra?",
    a: "Sign up for a free account and enter your education and career details. Once your profile is set up, the platform starts matching you with suitable job notifications and sends you alerts when something relevant comes up.",
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

  const leftFaqs = FAQS.slice(0, 5);
  const rightFaqs = FAQS.slice(5, 10);

  return (
    <section style={{ padding: "56px 0 10px", }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-15">
        <AnimatedSection animation="fade-up">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
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

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-green-600 bg-clip-text text-transparent">
              Frequently Asked Questions
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

            <p style={{ color: "#6b7280", maxWidth: 620, margin: "0 auto", fontSize: 17, fontWeight: 500, lineHeight: 1.7 }}>
              Everything you need to know about finding your next government job on Careermitra.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left column — questions 1-5 */}
          <div className="flex flex-col gap-4">
            {leftFaqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            ))}
          </div>
          {/* Right column — questions 6-10 */}
          <div className="flex flex-col gap-4">
            {rightFaqs.map((faq, i) => {
              const index = i + 5;
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
