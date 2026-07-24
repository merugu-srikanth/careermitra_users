"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaArrowRight, FaLinkedin, FaTwitter, FaEnvelope, FaGraduationCap, FaAward, FaBuilding } from "react-icons/fa";
import Link from "next/link";

import { generateOrganizationSchema } from "@/utils/schemaHelpers";

const founders = [
  {
    name: "Mrs. Anuradha",
    credentials: "M.Sc (AG)",
    role: "Additional Commissioner, State GST\nGovt. of Telangana (Retd.)",
    domain: "Scientific Research & Governance",
    bio: "Post graduate in agricultural sciences with rich experience as an ICAR research scientist and in the GST department of the Government of Telangana. She brings a rare blend of science and governance to guide aspirants.",
    highlights: [
      "Scientific research & governance fusion",
      "Expertise in regulatory institutions",
      "Development-focused departmental insight"
    ],
    avatar: "A",
    gradFrom: "#fb923c",
    gradTo: "#ea580c",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-100",
    accentText: "text-orange-600",
    dotColor: "bg-orange-400",
    tag: "Founder",
    socials: {
      email: "anuradha@careermitra.in"
    }
  },
  {
    name: "Mr. K. Vamsi Krishna",
    credentials: "MBA",
    role: "Public Relations | Digital Strategist\nTech Collaborator",
    domain: "Youth Engagement & Digital Outreach",
    bio: "A dynamic professional who blends strategic communication with digital intelligence. He drives impactful public relations, youth-centric outreach, and technology collaborations across platforms.",
    highlights: [
      "Strategic digital communication",
      "Youth-centric career outreach",
      "Bridges opportunity with ambition"
    ],
    avatar: "V",
    gradFrom: "#4ade80",
    gradTo: "#16a34a",
    accentBg: "bg-green-50",
    accentBorder: "border-green-100",
    accentText: "text-green-600",
    dotColor: "bg-green-400",
    tag: "Co-Founder",
    socials: {
      email: "vamsi@careermitra.in"
    }
  }
];

const teamMembers = [
  {
    name: "Mr. Palla Vijaykumar",
    credentials: "M.COM",
    role: "University college of commerce and Business Management\nUCC & BM (Osmania University)",
    domain: "Academic Leadership & Student Mentoring",
    bio: "A seasoned academic professional with 26+ years of experience in education, student mentoring, and academic leadership. Passionate about guiding students toward academic excellence and career success.",
    highlights: [
      "26+ years of academic leadership and mentoring",
      "Expert in student guidance and career planning",
      "Committed to empowering learners for long-term success"
    ],
    avatar: "P",
    gradFrom: "#60a5fa",
    gradTo: "#2563eb",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    accentText: "text-blue-600",
    dotColor: "bg-blue-400",
    tag: "Academic Advisor",
    socials: {}
  },
  {
    name: "Mr. Merugu Srikanth",
    credentials: "Graduate",
    role: "FULL-STACK DEVELOPER\nSoftware Development & AI Technologies",
    domain: "Full-Stack Dev (Web, Mobile & AI)",
    bio: "A passionate software professional with 5+ years of experience in software development, modern web technologies, and AI-driven applications. Passionate about building innovative, scalable, and user-centric digital solutions.",
    highlights: [
      "5+ Years of software development experience",
      "Expert in modern Web & Mobile development and AI-driven applications.",
      "Passionate about building innovative digital solutions"
    ],
    avatar: "S",
    gradFrom: "#fb923c",
    gradTo: "#ea580c",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-100",
    accentText: "text-orange-600",
    dotColor: "bg-orange-400",
    tag: "Full-Stack Developer",
    socials: {}
  },
  {
    name: "Mr. B. Mani Kumar",
    credentials: "Graduate",
    role: "HR & ADMIN EXECUTIVE\nHuman Resources & Administration",
    domain: "Human Resources & Administration",
    bio: "A dedicated HR and Admin professional committed to supporting organizational growth through effective people management and administrative excellence. Passionate about fostering a positive, productive, and collaborative workplace.",
    highlights: [
      "HR & Administration - Supporting efficient workforce and office operations",
      "Expert in employee coordination, recruitment, and administration",
      "Committed to fostering a productive workplace and organizational success"
    ],
    avatar: "M",
    gradFrom: "#4ade80",
    gradTo: "#16a34a",
    accentBg: "bg-green-50",
    accentBorder: "border-green-100",
    accentText: "text-green-600",
    dotColor: "bg-green-400",
    tag: "HR & Admin",
    socials: {}
  },
  {
    name: "Mr. Sagar Satuluri",
    credentials: "B.Tech",
    role: "CAREER & DIGITAL GROWTH EXPERT\nCareerMitra.in",
    domain: "SEO & Content Strategy",
    bio: "A seasoned SEO and digital growth strategist with 12+ years of experience driving organic traffic. Passionate about connecting students with career opportunities through trusted guidance and verified platform content.",
    highlights: [
      "12+ Years of SEO leadership and digital growth expertise",
      "Expert in Government Jobs, Education SEO, AI Search Optimization & Content Strategy",
      "Committed to empowering students with trusted career guidance, verified opportunities, and a seamless digital learning experience"
    ],
    avatar: "S",
    gradFrom: "#c084fc",
    gradTo: "#9333ea",
    accentBg: "bg-purple-50",
    accentBorder: "border-purple-100",
    accentText: "text-purple-600",
    dotColor: "bg-purple-400",
    tag: "SEO & Growth",
    socials: {}
  }
];

// Motion configuration constants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const floatingBubbles = [
  { top: "15%", left: "8%", delay: 0, size: "h-24 w-24 bg-orange-500/10" },
  { bottom: "25%", right: "12%", delay: 1.5, size: "h-32 w-32 bg-green-500/10" },
  { top: "45%", left: "48%", delay: 3.2, size: "h-20 w-20 bg-amber-500/10" },
  { bottom: "10%", left: "15%", delay: 2.1, size: "h-28 w-28 bg-emerald-500/10" }
];

function TeamCard({ member, variants }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      variants={variants}
      className="group relative h-[420px] w-full cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform"
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Tag resting on top of the border */}
        <div 
          className={`absolute -top-3.5 left-8 z-20 px-4 py-1 rounded-full text-xs font-bold shadow-sm border ${member.accentBg} ${member.accentBorder} ${member.accentText}`}
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(2px)"
          }}
        >
          {member.tag}
        </div>

        {/* Back Tag resting on top of the border */}
        <div 
          className={`absolute -top-3.5 left-8 z-20 px-4 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-700 bg-slate-800 text-white/90`}
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(2px)"
          }}
        >
          {member.tag}
        </div>

        {/* FRONT SIDE */}
        <div
          className={`absolute inset-0 bg-white rounded-3xl border ${member.accentBorder} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden", 
            transform: "rotateY(0deg) translateZ(1px)"
          }}
        >
          <div className="p-7 pt-8 flex-1 flex flex-col justify-between">
            <div>
              {/* Header without avatar for full visibility */}
              <div className="mb-5">
                <h3 className="font-black text-slate-800 text-lg md:text-xl leading-tight">{member.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${member.accentText} bg-opacity-70 ${member.accentBg} px-2 py-0.5 rounded-md`}>
                    {member.credentials}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{member.domain}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <FaBuilding className="shrink-0" size={11} /> Role & Experience
                  </p>
                  <p className="text-sm font-bold text-slate-700 leading-snug whitespace-pre-line">
                    {member.role}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <FaAward className="shrink-0 text-amber-500" size={11} /> Key Contributions
                  </p>
                  <ul className="space-y-2">
                    {member.highlights.map((highlight, j) => {
                      const firstChar = highlight.charAt(0);
                      const isEmoji = ["🟠", "🟢"].includes(firstChar);
                      const displayHighlight = isEmoji ? highlight.substring(1).trim() : highlight;
                      const customDot = isEmoji ? firstChar : null;
                      return (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-600 leading-tight">
                          {customDot ? (
                            <span className="text-xs shrink-0 mt-0.5">{customDot}</span>
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${member.dotColor || 'bg-amber-400'} mt-1.5 shrink-0`} />
                          )}
                          <span>{displayHighlight}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Hint to flip */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>View Bio & Description</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <FaArrowRight size={10} />
              </motion.span>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={`absolute inset-0 bg-slate-900 text-white rounded-3xl border ${member.accentBorder} overflow-hidden shadow-2xl flex flex-col justify-between`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)"
          }}
        >
          <div className="p-7 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-black text-white text-base md:text-lg leading-tight">{member.name}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${member.accentText}`}>{member.tag}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  💼 Description & Bio
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                {member.socials?.email && (
                  <a
                    href={`mailto:${member.socials.email}`}
                    title="Contact Email"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
                  >
                    <FaEnvelope size={14} />
                  </a>
                )}
              </div>
              <Link
                href="/contact-us"
                onClick={(e) => e.stopPropagation()}
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${member.accentText} hover:underline`}
              >
                Get in Touch <FaArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MeetOurTeam() {
  const schema = generateOrganizationSchema();

  return (
    <>

      <main className="relative min-h-screen bg-slate-50/50 pt-24 pb-20 overflow-hidden">
        {/* Floating background decorative bubbles */}
        {floatingBubbles.map((bubble, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl pointer-events-none ${bubble.size}`}
            style={{ top: bubble.top, left: bubble.left, bottom: bubble.bottom, right: bubble.right }}
            animate={{
              y: [0, -24, 24, 0],
              x: [0, 15, -15, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        <div className="w-full px-4 md:px-15 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 mb-4"
            >
              <FaUsers size={14} className="shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Meet the Founders</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4"
            >
              The Minds Behind{" "}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent">
                CareerMitra
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Seasoned professionals and digital innovators uniting government department experience with technology to empower next-generation aspirants across India.
            </motion.p>
          </div>

          {/* Founders Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20"
          >
            {founders.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="group relative h-full"
              >
                <div className={`absolute -top-3.5 left-8 z-10 px-4 py-1 rounded-full text-xs font-bold shadow-sm border ${member.accentBg} ${member.accentBorder} ${member.accentText}`}>
                  {member.tag}
                </div>

                <div className={`h-full bg-white rounded-3xl border ${member.accentBorder} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}>
                  <div className="h-2 w-full" style={{ backgroundImage: `linear-gradient(to right, ${member.gradFrom}, ${member.gradTo})` }} />

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4.5 mb-6">
                        <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shrink-0`} style={{ backgroundImage: `linear-gradient(to bottom right, ${member.gradFrom}, ${member.gradTo})` }}>
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-xl leading-snug">{member.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${member.accentText} bg-opacity-70 ${member.accentBg} px-2.5 py-0.5 rounded-md`}>
                              {member.credentials}
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">{member.domain}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <FaBuilding className="shrink-0" size={11} /> Professional Experience
                          </p>
                          <p className="text-sm font-semibold text-slate-700 leading-snug whitespace-pre-line">
                            {member.role}
                          </p>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <p className="text-sm text-slate-500 leading-relaxed">
                          {member.bio}
                        </p>

                        <div className="h-px bg-slate-100" />

                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <FaAward className="shrink-0" size={11} /> Key Contributions
                          </p>
                          <ul className="space-y-2">
                            {member.highlights.map((highlight, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-xs text-slate-600">
                                <span className={`w-1.5 h-1.5 rounded-full ${member.dotColor} mt-1.5 shrink-0`} />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-2">
                        {member.socials?.email && (
                          <a
                            href={`mailto:${member.socials.email}`}
                            title="Contact Email"
                            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-orange-500 hover:border-orange-100 flex items-center justify-center transition-all"
                          >
                            <FaEnvelope size={14} />
                          </a>
                        )}
                      </div>
                      <Link
                        href="/contact-us"
                        className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${member.accentText} hover:underline`}
                      >
                        Get in Touch <FaArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Members Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4"
            >
              <FaUsers size={14} className="shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Meet the Core Team</span>
            </motion.div>
          </div>

          {/* Team Members Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full mb-16"
          >
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} variants={itemVariants} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-3.5 px-6 py-4.5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <span className="text-2xl">🌱</span>
              <p className="text-sm text-slate-600 text-left leading-relaxed">
                <span className="font-bold text-slate-800">Growing Team</span> — We are actively building our network across India by adding subject matter experts, retired advisors, and technology consultants.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
