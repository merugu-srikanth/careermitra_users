"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar, FaLeaf, FaUsers, FaLightbulb, FaHandshake,
  FaShieldAlt, FaGlobe, FaArrowRight, FaQuoteLeft,
  FaMedal, FaChartLine, FaBullseye
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";

import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/schemaHelpers';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "30+", label: "Years Experience", icon: <FaMedal size={18} />, color: "text-orange-500", bg: "bg-orange-50 border-orange-100" },
  { value: "500+", label: "Students Guided", icon: <FaUsers size={18} />, color: "text-green-600", bg: "bg-green-50 border-green-100" },
  { value: "Pan", label: "India Reach", icon: <FaGlobe size={18} />, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
  { value: "100%", label: "Trusted Guidance", icon: <FaShieldAlt size={18} />, color: "text-purple-500", bg: "bg-purple-50 border-purple-100" },
];

const pillars = [
  { icon: <FaLeaf size={20} />, title: "Sustainable Careers", desc: "We focus on stable, fulfilling government roles rather than high-stress corporate paths that lead to burnout.", color: "orange" },
  { icon: <FaUsers size={20} />, title: "Inclusive Access", desc: "Bridging the gap for students from Tier-2 cities and rural areas who face socio-economic or academic barriers.", color: "green" },
  { icon: <FaLightbulb size={20} />, title: "Informed Decisions", desc: "Accurate, verified, and timely guidance so every aspirant can make the right career choices with confidence.", color: "amber" },
  { icon: <FaHandshake size={20} />, title: "Community Trust", desc: "Built on decades of public service and governance, our credibility comes from lived experience.", color: "blue" },
  { icon: <FaChartLine size={20} />, title: "Growth Mindset", desc: "We not only share opportunities — we help you build the skills and mindset to succeed in them.", color: "purple" },
  { icon: <FaBullseye size={20} />, title: "Goal-Oriented", desc: "Every interaction is designed around your specific goals, background, and aspirations — not a generic template.", color: "rose" },
];

const founders = [
  {
    name: "Mrs. Anuradha",
    credentials: "M.Sc (AG)",
    role: "Additional Commissioner, State GST\nGovt. of Telangana (Retd.)",
    domain: "Scientific Research & Governance",
    bio: "Post graduate in agricultural sciences with rich experience as an ICAR research scientist and in the GST department of the Government of Telangana. She brings a rare blend of science and governance.",
    highlights: ["Scientific research & governance fusion", "Expertise in regulatory institutions", "Development-focused departmental insight"],
    avatar: "A",
    gradFrom: "from-orange-400",
    gradTo: "to-orange-600",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-100",
    accentText: "text-orange-600",
    dotColor: "bg-orange-400",
    tag: "Founder",
  },
  {
    name: "Mr. K. Vamsi Krishna",
    credentials: "MBA",
    role: "Public Relations | Digital Strategist\nTech Collaborator",
    domain: "Youth Engagement & Digital Outreach",
    bio: "A dynamic  professional who blends strategic communication with digital intelligence. He drives impactful public relations and youth-centric outreach across platforms.",
    highlights: ["Strategic digital communication", "Youth-centric career outreach", "Bridges opportunity with ambition"],
    avatar: "V",
    gradFrom: "from-green-400",
    gradTo: "to-green-600",
    accentBg: "bg-green-50",
    accentBorder: "border-green-100",
    accentText: "text-green-600",
    dotColor: "bg-green-400",
    tag: "Co-Founder",
  },
];

const teamMembers = [
  {
    name: "Mr. Palla Vijaykumar",
    credentials: "M.COM",
    role: "University college of commerce and Business Management\nUCC & BM (Osmania University)",
    domain: "Academic Leadership & Student Mentoring",
    bio: "A seasoned academic professional with 26+ years of experience in education, student mentoring, and academic leadership. Passionate about guiding students toward academic excellence and career success.",
    highlights: [
      "20+ years of academic leadership and mentoring",
      "Expert in student guidance and career planning",
      "Committed to empowering learners for long-term success"
    ],
    avatar: "P",
    gradFrom: "from-blue-400",
    gradTo: "to-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    accentText: "text-blue-600",
    dotColor: "bg-blue-400",
    tag: "Academic Advisor",
  },
  {
    name: "Mr. Merugu Srikanth",
    credentials: "Graduate",
    role: "FULL-STACK DEVELOPER\nSoftware Development & AI Technologies",
    domain: "Full-Stack Dev (Web, Mobile & AI)",
    bio: "A passionate software professional with 5+ years of experience in software development, modern web technologies, and AI-driven applications. Passionate about building innovative, scalable, and user-centric digital solutions.",
    highlights: [
      "🟠 5+ Years of software development experience",
      "🟢 Expert in modern Web & Mobile development and AI-driven applications.",
      "🟢 Passionate about building innovative digital solutions"
    ],
    avatar: "S",
    gradFrom: "from-orange-400",
    gradTo: "to-orange-600",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-100",
    accentText: "text-orange-600",
    dotColor: "bg-orange-400",
    tag: "Developer",
  },
  {
    name: "Mr. B. Mani Kumar",
    credentials: "Graduate",
    role: "HR & ADMIN EXECUTIVE\nHuman Resources & Administration",
    domain: "Human Resources & Administration",
    bio: "A dedicated HR and Admin professional committed to supporting organizational growth through effective people management and administrative excellence. Passionate about fostering a positive, productive, and collaborative workplace.",
    highlights: [
      "🟠 HR & Administration - Supporting efficient workforce and office operations",
      "🟢 Expert in employee coordination, recruitment, and administration",
      "🟢 Committed to fostering a productive workplace and organizational success"
    ],
    avatar: "M",
    gradFrom: "from-green-400",
    gradTo: "to-green-600",
    accentBg: "bg-green-50",
    accentBorder: "border-green-100",
    accentText: "text-green-600",
    dotColor: "bg-green-400",
    tag: "HR & Admin",
  },
  {
    name: "Mr. Sagar Satuluri",
    credentials: "B.Tech",
    role: "CAREER & DIGITAL GROWTH EXPERT\nCareermitra.in",
    domain: "SEO & Content Strategy",
    bio: "A seasoned SEO and digital growth strategist with 12+ years of experience driving organic traffic. Passionate about connecting students with career opportunities through trusted guidance and verified platform content.",
    highlights: [
      "🟠 12+ Years of SEO leadership and digital growth expertise",
      "🟢 Expert in Government Jobs, Education SEO, AI Search Optimization & Content Strategy",
      "🟢 Committed to empowering students with trusted career guidance, verified opportunities, and a seamless digital learning experience"
    ],
    avatar: "S",
    gradFrom: "from-purple-400",
    gradTo: "to-purple-600",
    accentBg: "bg-purple-50",
    accentBorder: "border-purple-100",
    accentText: "text-purple-600",
    dotColor: "bg-purple-400",
    tag: "SEO & Growth",
  }
];

const timeline = [
  { year: "2022", title: "The Idea", desc: "Retired officials recognize the gap — thousands of rural youth missing out on government career opportunities.", icon: "💡" },
  { year: "2023", title: "Planning Phase", desc: "Team assembled, research conducted across Tier-2 cities in Telangana to understand the real challenges aspirants face.", icon: "📋" },
  { year: "2025", title: "Growing Strong", desc: "Expanded network to multiple districts, added technical consultants and regional coordinators across Telangana.", icon: "🌱" },
    { year: "2026", title: "Platform Launch", desc: "Career Mitra officially launched with SMS & email outreach, serving its first batch of 100+ aspirants.", icon: "🚀" },
  { year: "2026+", title: "Pan-India Vision", desc: "Scaling to serve aspirants across every state in India with a full digital platform and mentorship network.", icon: "🇮🇳" },
  
];

const floatingIcons = [
  { icon: "🎓", top: "20%",  left: "3%",  delay: 0,   size: "text-3xl" },
  { icon: "🏛️", top: "22%", right: "5%", delay: 1.3, size: "text-2xl" },
  { icon: "📚", top: "30%", left: "1%",  delay: 2.1, size: "text-2xl" },
  { icon: "💼", top: "48%", right: "2%", delay: 0.7, size: "text-3xl" },
  { icon: "🌱", top: "65%", left: "4%",  delay: 3.0, size: "text-xl"  },
  { icon: "⭐", top: "78%", right: "6%", delay: 1.9, size: "text-2xl" },
  { icon: "🎯", top: "22%", left: "46%", delay: 4.2, size: "text-xl"  },
  { icon: "🤝", top: "88%", left: "28%", delay: 2.6, size: "text-2xl" },
  { icon: "📊", top: "14%",  left: "58%", delay: 1.1, size: "text-2xl" },
  { icon: "🏅", top: "55%", left: "42%", delay: 3.4, size: "text-xl"  },
];

const pillarColors = {
  orange: { bg: "bg-orange-50", border: "border-orange-100", icon: "bg-orange-100 text-orange-600", hover: "hover:border-orange-300 hover:bg-orange-50/80" },
  green:  { bg: "bg-green-50",  border: "border-green-100",  icon: "bg-green-100 text-green-600",  hover: "hover:border-green-300 hover:bg-green-50/80"  },
  amber:  { bg: "bg-amber-50",  border: "border-amber-100",  icon: "bg-amber-100 text-amber-600",  hover: "hover:border-amber-300 hover:bg-amber-50/80"  },
  blue:   { bg: "bg-blue-50",   border: "border-blue-100",   icon: "bg-blue-100 text-blue-600",    hover: "hover:border-blue-300 hover:bg-blue-50/80"    },
  purple: { bg: "bg-purple-50", border: "border-purple-100", icon: "bg-purple-100 text-purple-600",hover: "hover:border-purple-300 hover:bg-purple-50/80" },
  rose:   { bg: "bg-rose-50",   border: "border-rose-100",   icon: "bg-rose-100 text-rose-600",    hover: "hover:border-rose-300 hover:bg-rose-50/80"    },
};

// ─── FLOATING BG ─────────────────────────────────────────────────────────────
function FloatingBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingIcons.map((f, i) => (
        <motion.span
          key={i}
          className={`absolute select-none ${f.size}`}
          style={{ top: f.top, left: f.left, right: f.right }}
          animate={{ y: [0, -24, 0], rotate: [0, 5, -4, 0], opacity: [0.05, 0.11, 0.05] }}
          transition={{ duration: 7 + f.delay * 0.5, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {f.icon}
        </motion.span>
      ))}
    </div>
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────
function SectionLabel({ text, color = "orange" }) {
  const colors = {
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    green:  "bg-green-50  border-green-200  text-green-600",
  };
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-widest mb-4 ${colors[color]}`}>
      <motion.span
        className={`w-2 h-2 rounded-full ${color === "orange" ? "bg-orange-500" : "bg-green-500"}`}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {text}
    </div>
  );
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="relative bg-white pt-24 pb-20 px-4 md:px-15 overflow-hidden">
      <FloatingBg />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

      {/* big faded bg text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[clamp(80px,18vw,200px)] font-black text-gray-100 leading-none tracking-tighter">MITRA</span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <SectionLabel text="Our Story" color="orange" />

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
          Awareness Ignites,
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Guidance {" "}</span>{" "}
          <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Inspires</span>
        </h1>

        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          Career Mitra was born from a simple belief that every young aspirant in India, <br />  regardless of their background or location, deserves access to the same quality career guidance that was once reserved for the privileged few.
        </p>

        {/* quote card */}
        <div className="inline-block bg-gradient-to-br from-orange-50 to-green-50 border border-orange-100 rounded-3xl px-8 py-6 max-w-2xl shadow-lg shadow-orange-50 hover:-translate-y-1 transition-transform duration-300">
          <FaQuoteLeft className="text-orange-300 mb-3 mx-auto" size={28} />
          <p className="text-gray-700 font-medium text-base md:text-lg italic leading-relaxed">
            "We spent 30 + years serving the government. Now we serve the youth to shape their future."
          </p>
          <p className="text-orange-500 font-semibold text-sm mt-3">— Founding Team, Career Mitra</p>
        </div>
      </div>
    </section>
  );
}

// ─── STATS STRIP ─────────────────────────────────────────────────────────────
function StatsStrip() {
  return (
    <section className="relative bg-gray-50 border-y border-gray-100 py-10 px-4 md:px-15 overflow-hidden">
      <div className="w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl bg-white border ${s.bg} shadow-sm hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 cursor-default`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} border flex items-center justify-center ${s.color}`}>
              {s.icon}
            </div>
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── VISION SECTION ──────────────────────────────────────────────────────────
function VisionSection() {
  return (
    <section className="relative bg-white py-4 px-4 md:px-15 overflow-hidden">
      <div className="w-full mx-auto">
        <div className="text-center mb-16">
          <SectionLabel text="What We Believe" color="green" />
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Our Core{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Vision</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            In a world obsessed with corporate careers, we champion the dignity and stability of public service.
          </p>
        </div>

        {/* two column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="relative">
              {/* decorative card behind */}
              <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl bg-orange-100 border border-orange-200" />
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200">
                <HiSparkles size={32} className="mb-4 opacity-80" />
                <h3 className="text-2xl font-black mb-4 leading-tight">The Gap We're Filling</h3>
                <p className="text-orange-100 leading-relaxed text-sm">
                  Today's focus on corporate jobs and campus placements leaves behind millions of students  especially those from Tier-2 cities and rural areas for whom such paths are either inaccessible or misaligned with their real aspirations.
                </p>
                <div className="mt-6 pt-6 border-t border-orange-400">
                  <p className="text-orange-100 text-sm leading-relaxed">
                    Career Mitra aims to introduce and support <span className="text-white font-bold">alternative, more sustainable</span> career options, especially in the public service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { title: "Government & Allied Sectors", desc: "PSC, UPSC, Banking, Railways, Defence and more — stable careers that offer purpose alongside income.", icon: "🏛️" },
              { title: "Tier-2 & Rural Focus", desc: "We specifically reach out to aspirants from smaller cities and villages who lack access to quality guidance.", icon: "🗺️" },
              { title: "Beyond Campus Placements", desc: "For students who don't fit the corporate mold we provide a genuine, respected alternative path.", icon: "🎯" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50 hover:translate-x-1.5 transition-all duration-200"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* pillars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => {
            const c = pillarColors[p.color];
            return (
              <div
                key={i}
                className={`group p-5 rounded-2xl bg-white border ${c.border} ${c.hover} hover:-translate-y-1.5 transition-all duration-300 cursor-default shadow-sm`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {p.icon}
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">{p.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── TEAM SECTION ────────────────────────────────────────────────────────────
function TeamSection() {
  return (
    <section className="relative bg-gray-50 border-y border-gray-100 py-24 px-4 md:px-15 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
      </div>

      <div className="w-full mx-auto">
        <div className="text-center mb-16">
          <SectionLabel text="The Humans Behind It" color="orange" />
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Seasoned professionals who turned decades of experience into a mission to serve youth.
          </p>
        </div>

        {/* Founders */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          {founders.map((m, i) => (
            <div
              key={i}
              className="group relative"
            >
              <div className={`absolute -top-3 left-6 z-10 px-3 py-1 rounded-full text-xs font-bold ${m.accentBg} ${m.accentBorder} border ${m.accentText}`}>
                {m.tag}
              </div>

              <div className={`bg-white rounded-3xl border ${m.accentBorder} overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-400 h-full flex flex-col`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${m.gradFrom} ${m.gradTo}`} />

                <div className="p-7 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradFrom} ${m.gradTo} flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0`}>
                        {m.avatar}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight">{m.name}</h3>
                        <span className={`text-xs font-semibold ${m.accentText} bg-opacity-50 ${m.accentBg} px-2 py-0.5 rounded-full`}>{m.credentials}</span>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{m.domain}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 whitespace-pre-line">{m.role}</p>

                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{m.bio}</p>
                  </div>

                  <ul className="space-y-2 mt-auto">
                    {m.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-xs text-gray-500"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.dotColor} mt-1.5 flex-shrink-0`} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full mx-auto">
          {teamMembers.map((m, i) => (
            <div
              key={i}
              className="group relative"
            >
              <div className={`absolute -top-3 left-6 z-10 px-3 py-1 rounded-full text-xs font-bold ${m.accentBg} ${m.accentBorder} border ${m.accentText}`}>
                {m.tag}
              </div>

              <div className={`bg-white rounded-3xl border ${m.accentBorder} overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-400 h-full flex flex-col`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${m.gradFrom} ${m.gradTo}`} />

                <div className="p-7 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.gradFrom} ${m.gradTo} flex items-center justify-center text-white font-black text-xl shadow-md flex-shrink-0`}>
                        {m.avatar}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-gray-900 text-lg leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{m.name}</h3>
                        <span className={`text-xs font-semibold ${m.accentText} bg-opacity-50 ${m.accentBg} px-2 py-0.5 rounded-full`}>{m.credentials}</span>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{m.domain}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 whitespace-pre-line">{m.role}</p>

                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{m.bio}</p>
                  </div>

                  <ul className="space-y-2 mt-auto">
                    {m.highlights.map((h, j) => {
                      const firstChar = h.charAt(0);
                      const isEmoji = ["🟠", "🟢"].includes(firstChar);
                      const displayHighlight = isEmoji ? h.substring(1).trim() : h;
                      const customDot = isEmoji ? firstChar : null;
                      return (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-xs text-gray-500"
                        >
                          {customDot ? (
                            <span className="text-xs flex-shrink-0 mt-0.5">{customDot}</span>
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${m.dotColor} mt-1.5 flex-shrink-0`} />
                          )}
                          {displayHighlight}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 md:px-15 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-2xl">🌐</span>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">Growing team</span> — adding subject experts, technical consultants & regional coordinators across India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TIMELINE SECTION ────────────────────────────────────────────────────────
function TimelineSection() {
  return (
    <section className="relative bg-white py-24 px-4 md:px-15 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel text="How We Got Here" color="orange" />
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Journey</span>
          </h2>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-200 via-green-200 to-transparent md:-translate-x-px" />

          <div className="space-y-10">
            {timeline.map((t, i) => (
              <div
                key={i}
                className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* dot */}
                <div
                  className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-2xl bg-white border-2 border-orange-200 flex items-center justify-center text-2xl shadow-md z-10 flex-shrink-0"
                  style={{ top: "0px" }}
                >
                  {t.icon}
                </div>

                {/* content card */}
                <div className={`ml-20 md:ml-0 md:w-5/12 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12 md:ml-auto"}`}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-100 hover:-translate-y-1 transition-all duration-300">
                    <span className={`text-xs font-black uppercase tracking-widest ${i % 2 === 0 ? "text-orange-500" : "text-green-600"}`}>{t.year}</span>
                    <h4 className="font-bold text-gray-900 text-base mt-1 mb-2">{t.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ─────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="relative  bg-gray-50 border-t border-gray-100 py-24 px-4 md:px-15 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
      </div>

      <div className="w-full mx-auto text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-3xl bg-orange-100 blur-xl scale-110 opacity-60" />
          <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl shadow-orange-200">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-4"
            >🤝</motion.div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              From Aspirations to Achievements... {" "}  <br />
              <span className="text-orange-200 text-3xl italic"> Begin Your Journey Today</span>
            </h2>
            <p className="text-orange-100 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Join hundreds of aspirants who found their path with <span className="text-green-800 font-bold  italic"> "Career Mitra" </span>. Your future in  <span className="text-green-800 font-bold italic"> " public service" </span> starts with a single conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact-us" 
                className="flex items-center justify-center gap-2 px-12 py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
              >
                Get in Touch
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <FaArrowRight size={13} />
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          Based in <span className="font-semibold text-gray-600">Telangana , Andhra Pradesh , Maharashtra, Karnataka</span> · Serving aspirants{" "}
          <span className="font-semibold text-green-600">Pan-India</span>
        </p>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  const aboutSchemas = [
    generateOrganizationSchema(),
    generateWebPageSchema({
      name: "About Us - Career Mitra",
      description: "Learn about Career Mitra, your trusted platform for personalized Govt Jobs notifications, Sarkari Naukri updates, and career guidance.",
      url: "https://careermitra.in/about-us"
    })
  ];

  return (
    <div className=" relative min-h-screen bg-white font-sans antialiased">

      {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      <AboutHero />
      <StatsStrip />
      <VisionSection />
      {/* <TeamSection /> */}
      <TimelineSection />
      <CTASection />
    </div>
  );
}