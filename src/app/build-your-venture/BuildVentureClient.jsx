"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaRocket,
  FaLightbulb,
  FaCheckCircle,
  FaCode,
  FaMobileAlt,
  FaGlobe,
  FaChartLine,
  FaUsers,
  FaGraduationCap,
  FaLaptopCode,
  FaBullhorn,
  FaSearch,
  FaComments,
  FaWhatsapp,
  FaArrowRight,
  FaLayerGroup,
  FaShieldAlt,
  FaCogs,
  FaShareAlt,
  FaChevronDown,
  FaRegPaperPlane,
  FaPaperPlane,
  FaTools,
  FaFire,
  FaCompass,
  FaStar,
} from "react-icons/fa";
import { HiSparkles, HiOutlineLightBulb } from "react-icons/hi";

const WHATSAPP_NUMBER = "917794045533";

// ─── 5-STAGE FRAMEWORK DATA ──────────────────────────────────────────────────
const STAGES = [
  {
    id: 1,
    title: "Idea",
    subtitle: "Define the problem & audience",
    icon: <FaLightbulb className="text-amber-500" size={24} />,
    color: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    summary: "The first stage begins with clarity. The founder defines the core problem to solve and the exact people who will be served.",
    keyPoints: [
      "Define the target audience pain point clearly",
      "Draft early value propositions without over-engineering",
      "Identify potential market demand and immediate use cases",
      "Set early expectations and founding goals"
    ],
    milestone: "Problem Statement & Audience Persona Defined"
  },
  {
    id: 2,
    title: "Validate",
    subtitle: "Test demand before spending",
    icon: <FaSearch className="text-blue-500" size={24} />,
    color: "from-blue-500 to-indigo-500",
    badgeBg: "bg-blue-50 text-blue-600 border-blue-200",
    summary: "The founder tests real demand before spending significant capital. A simple landing page or early customer conversations can validate product interest.",
    keyPoints: [
      "Build a focused validation landing page with email/WhatsApp capture",
      "Conduct 10-20 structured conversations with potential customers",
      "Gather initial feedback and gauge willingness to use or pay",
      "De-risk the core concept before writing heavy code"
    ],
    milestone: "Market Interest & Early Demand Confirmed"
  },
  {
    id: 3,
    title: "Build",
    subtitle: "Website, brand basics & core MVP",
    icon: <FaLaptopCode className="text-orange-500" size={24} />,
    color: "from-orange-500 to-rose-500",
    badgeBg: "bg-orange-50 text-orange-600 border-orange-200",
    summary: "It covers the website, brand basics, and core digital channels. Building an MVP (Minimum Viable Product) that early users can test and experience.",
    keyPoints: [
      "Develop a fast, modern responsive website or web/mobile app",
      "Establish brand identity: logo direction, typography, and cohesive voice",
      "Set up core engagement channels (inquiry forms, WhatsApp integrations)",
      "Ensure fast load times, SEO basics, and clear calls to action"
    ],
    milestone: "Working MVP & Digital Foundation Ready"
  },
  {
    id: 4,
    title: "Launch",
    subtitle: "Go live & reach target audience",
    icon: <FaRocket className="text-emerald-500" size={24} />,
    color: "from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    summary: "The venture goes live and starts reaching its target audience. Early user responses show what works and provide real-world data.",
    keyPoints: [
      "Deploy the platform live to production with security & monitoring",
      "Initiate targeted outreach via social media, communities, and direct networks",
      "Capture initial user activity, inquiries, and conversion feedback",
      "Gather real user reviews and identify immediate friction points"
    ],
    milestone: "Live Public Rollout & Initial User Traction"
  },
  {
    id: 5,
    title: "Grow",
    subtitle: "Review results & scale digital presence",
    icon: <FaChartLine className="text-purple-500" size={24} />,
    color: "from-purple-500 to-indigo-600",
    badgeBg: "bg-purple-50 text-purple-600 border-purple-200",
    summary: "The founder reviews the results, refines the approach, and continuously adapts the digital presence as the business evolves.",
    keyPoints: [
      "Analyze visitor metrics, inquiry rates, and user retention",
      "Iterate on product features based on real customer feedback",
      "Expand SEO, content marketing, and multi-channel outreach",
      "Scale the digital foundation to support new offerings and audiences"
    ],
    milestone: "Sustained Growth & Scalable Digital Expansion"
  },
];

// ─── WHO CAN GET SUPPORT DATA ────────────────────────────────────────────────
const AUDIENCES = [
  {
    title: "Students & Freshers",
    tag: "Pre / Post Graduation",
    desc: "Students and freshers who want to shape a business idea before or soon after graduation.",
    icon: <FaGraduationCap size={22} className="text-orange-500" />,
    color: "border-orange-200 hover:border-orange-400 bg-orange-50/40",
    badgeColor: "bg-orange-100 text-orange-700"
  },
  {
    title: "Recent Alumni",
    tag: "Within 4 Years of Graduation",
    desc: "Young graduates looking to turn their academic experience and passion into a sustainable venture.",
    icon: <FaUsers size={22} className="text-emerald-600" />,
    color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/40",
    badgeColor: "bg-emerald-100 text-emerald-700"
  },
  {
    title: "Freelancers & Creators",
    tag: "Solo to Agency",
    desc: "Designers, developers, and creators looking to establish a professional digital portfolio and acquire high-ticket clients.",
    icon: <FaLaptopCode size={22} className="text-blue-500" />,
    color: "border-blue-200 hover:border-blue-400 bg-blue-50/40",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    title: "Side Project Builders",
    tag: "Turning Code into Business",
    desc: "Aspiring builders turning a weekend experiment or utility project into a real, market-ready venture.",
    icon: <FaFire size={22} className="text-rose-500" />,
    color: "border-rose-200 hover:border-rose-400 bg-rose-50/40",
    badgeColor: "bg-rose-100 text-rose-700"
  },
  {
    title: "Web & Marketing Founders",
    tag: "Service Offerings",
    desc: "Early founders in web development and digital marketing developing their service packaging and client outreach.",
    icon: <FaBullhorn size={22} className="text-purple-500" />,
    color: "border-purple-200 hover:border-purple-400 bg-purple-50/40",
    badgeColor: "bg-purple-100 text-purple-700"
  },
];

// ─── SERVICES DATA ───────────────────────────────────────────────────────────
const TECH_SERVICES = [
  {
    title: "Startup & Business Websites",
    desc: "Clearly state your offering and establish an authoritative, trustworthy digital presence that converts visitors.",
    features: ["Custom responsive design", "Fast performance & SEO ready", "Clear value propositions", "Lead capture forms"],
    icon: <FaGlobe className="text-orange-500" size={24} />,
    accent: "orange"
  },
  {
    title: "High-Converting Landing Pages",
    desc: "Laser-focused single pages tailored for rapid idea validation, early sign-ups, waitlists, or specific campaigns.",
    features: ["Hero call-to-action", "Lead capture & WhatsApp hooks", "Speed & mobile optimized", "A/B test friendly"],
    icon: <FaLayerGroup className="text-emerald-500" size={24} />,
    accent: "emerald"
  },
  {
    title: "Portfolio Websites",
    desc: "Designed specifically for freelancers, developers, designers, and creators to showcase proof of work and close deals.",
    features: ["Case study showcases", "Interactive project previews", "Testimonial & resume integration", "Direct booking links"],
    icon: <FaLaptopCode className="text-blue-500" size={24} />,
    accent: "blue"
  },
  {
    title: "Web Apps & Mobile MVPs",
    desc: "Turn your core concept into a functional working product (MVP) that early adopters and beta testers can actually use.",
    features: ["Interactive dashboards", "Database & user auth", "Rapid prototype turnaround", "Real-user feedback loops"],
    icon: <FaMobileAlt className="text-purple-500" size={24} />,
    accent: "purple"
  },
  {
    title: "Maintenance & Continuous Updates",
    desc: "Keep your application updated, lightning-fast, and bug-free as your user base and business requirements scale.",
    features: ["Security & backup monitoring", "Speed & performance tuning", "Feature enhancements", "Technical troubleshooting"],
    icon: <FaCogs className="text-amber-500" size={24} />,
    accent: "amber"
  }
];

// ─── MARKETING & AUDIENCE PILLARS ────────────────────────────────────────────
const MARKETING_PILLARS = [
  {
    title: "SEO & Search Visibility",
    desc: "Helps your startup website show up when prospective customers and clients search for related topics and services.",
    icon: <FaSearch className="text-orange-500" size={20} />
  },
  {
    title: "Content Marketing",
    desc: "Build authority and long-term organic traffic using educational blogs, guides, case studies, and useful articles.",
    icon: <FaLightbulb className="text-amber-500" size={20} />
  },
  {
    title: "Social Media Support",
    desc: "Setting up optimized social profiles, planning strategic post schedules, and maintaining a cohesive visual presence.",
    icon: <FaShareAlt className="text-blue-500" size={20} />
  },
  {
    title: "Email & WhatsApp Outreach",
    desc: "Direct, high-conversion communication channels to stay in touch with leads, early subscribers, and inquiries.",
    icon: <FaWhatsapp className="text-emerald-500" size={20} />
  },
  {
    title: "Brand Direction & Tone",
    desc: "Logo design guidance, typography, color palette, and a steady, memorable voice across all digital customer touchpoints.",
    icon: <FaStar className="text-purple-500" size={20} />
  }
];

// ─── FAQS ────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Who is eligible for CareerMitra startup support?",
    a: "Students, freshers, and alumni within four years of graduation are eligible for our technology and digital venture support. Whether you have a tech product, a freelance service, or a creative project, you can get support."
  },
  {
    q: "Do I need a complete business plan to start?",
    a: "No! You do not need an extensive business plan or funding to begin. A clear problem, an early idea, and the dedication to work on it are more than enough to take the first step."
  },
  {
    q: "How does CareerMitra help with website or app development?",
    a: "We provide end-to-end digital development tailored to your venture's stage — from high-converting landing pages and portfolio sites to fully functional Web & Mobile MVPs (Minimum Viable Products)."
  },
  {
    q: "What marketing support do you offer for early-stage ventures?",
    a: "We help new ventures establish a practical digital foundation: SEO optimization, content marketing roadmaps, social media profile setup, brand guidance, and direct WhatsApp/Email inquiry funnels."
  },
  {
    q: "Can I explore both government job preparation and a startup idea?",
    a: "Yes! CareerMitra places career opportunities, guidance, and startup support in one unified ecosystem. Neither path has to wait for the other, allowing young aspirants to explore their full potential."
  }
];

export default function BuildVentureClient() {
  const [activeStage, setActiveStage] = useState(1);
  const [faqOpen, setFaqOpen] = useState(null);

  // Form State for Idea Submission
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    status: "Student / Fresher",
    ideaStage: "Early Concept",
    ideaDetails: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please enter your name and contact number.");
      return;
    }

    // Build prefilled WhatsApp message
    const msg = `*🚀 New Startup Idea Consultation Request*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email || "Not provided"}\n*Status:* ${formData.status}\n*Stage:* ${formData.ideaStage}\n*Idea Summary:* ${formData.ideaDetails || "Discuss directly"}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    setSubmitted(true);
    window.open(waUrl, "_blank");
  };

  const directWhatsAppConsultation = () => {
    const msg = encodeURIComponent("Hi CareerMitra Team, I would like to discuss my startup idea / digital development support.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const currentStageData = STAGES.find((s) => s.id === activeStage) || STAGES[0];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-orange-500/20 selection:text-orange-900 pb-20">
      
      {/* ─── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-25 pb-20 md:pt-20 md:pb-28 border-b border-orange-100 bg-linear-to-b from-orange-50/70 via-white to-[#fafafa]">
        {/* Decorative background glow circles */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-linear-to-tr from-orange-300/30 via-amber-200/25 to-emerald-300/20 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 bg-orange-200/25 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute bottom-0 -left-20 w-72 h-72 bg-emerald-200/20 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Pill */}
          <div className="flex justify-center mb-5">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs sm:text-sm font-semibold shadow-xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <HiSparkles className="text-orange-600" />
              <span>CareerMitra Startup & Innovation Support</span>
            </motion.div>
          </div>

          {/* Main Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Find Your Opportunity, <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-orange-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                or Build One.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
              What comes after graduation? It could be a government job, an internship, higher studies, or <strong className="text-slate-900 font-semibold">an idea worth building</strong>. CareerMitra brings these paths together for students, freshers, and young alumni — making the next step easier to find, plan, and launch.
            </p>

            {/* Eligibility Tag */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium">
              <FaGraduationCap className="text-emerald-600" size={16} />
              <span>Available for students & alumni within <strong>4 years</strong> of graduation</span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={directWhatsAppConsultation}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaWhatsapp size={19} className="text-white" />
                <span>Discuss Your Startup Idea</span>
                <FaArrowRight size={13} />
              </button>

              <a
                href="#roadmap"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200 shadow-xs hover:border-orange-200 hover:text-orange-600 transition-all"
              >
                <FaRocket className="text-orange-500" size={15} />
                <span>5-Stage Roadmap</span>
              </a>
            </div>
          </motion.div>

          {/* Quick Snapshot Features */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { title: "Web & App Dev", desc: "MVPs, landing pages & apps", icon: <FaCode className="text-orange-500" /> },
              { title: "Digital Marketing", desc: "SEO, social & outreach", icon: <FaBullhorn className="text-emerald-600" /> },
              { title: "5-Stage Framework", desc: "From idea to scalable launch", icon: <FaCompass className="text-blue-500" /> },
              { title: "Dual Ecosystem", desc: "Careers & Startups in 1 place", icon: <FaLayerGroup className="text-purple-500" /> },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-200 transition-all text-center sm:text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 mx-auto sm:mx-0">
                  {card.icon}
                </div>
                <h2 className="text-sm font-bold text-slate-800">{card.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY / BUILD YOUR OWN VENTURE ───────────────────────────── */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl">
          {/* Subtle Accent Glows */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -top-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4 border border-orange-500/30">
                <FaRocket size={12} />
                <span>Build Your Own Venture</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                A business idea needs more than a concept. <br />
                <span className="text-orange-400">It needs a solid digital base.</span>
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                CareerMitra helps early-stage founders turn promising ideas into practical ventures through technology and digital support. The goal is to give new ventures the tools to get established online and start reaching their first customers.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-700/60">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheckCircle size={13} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Practical Digital Tech</h3>
                    <p className="text-xs text-slate-400">Fast websites, landing pages & MVP development.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheckCircle size={13} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Targeted Audience Reach</h3>
                    <p className="text-xs text-slate-400">SEO, brand presence & customer discovery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <HiOutlineLightBulb className="text-amber-400" size={20} />
                <span>No Heavy Business Plan Needed</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A complete business plan is not needed to begin. A clear problem, an early idea, and the will to work on it are enough for a good first step.
              </p>
              
              <div className="mt-5 p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-orange-300">Ready to discuss your vision?</p>
                  <p className="text-[11px] text-slate-400">1:1 Consultation with our digital tech team</p>
                </div>
                <button
                  onClick={directWhatsAppConsultation}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shrink-0 transition"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHO CAN GET STARTUP SUPPORT? ─────────────────────────────────── */}
      <section className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide uppercase mb-3">
            <FaUsers size={12} />
            <span>Eligibility & Audience</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Who Can Get Startup Support?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            CareerMitra supports students and freshers who want to shape a business idea before or soon after graduation. Alumni who graduated within the last four years can join as well.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUDIENCES.map((aud, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-2xl border ${aud.color} transition-all duration-200 shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center">
                    {aud.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${aud.badgeColor}`}>
                    {aud.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{aud.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{aud.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <FaCheckCircle className="text-emerald-500" size={13} />
                <span>Direct Digital Guidance</span>
              </div>
            </motion.div>
          ))}

          {/* Special Callout Card */}
          <div className="p-6 rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
              <HiSparkles size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Have a Unique Vision?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Whether it is e-commerce, education, local services, or software — let's build your prototype together.
            </p>
            <button
              onClick={directWhatsAppConsultation}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition shadow-xs"
            >
              Talk to Our Team
            </button>
          </div>
        </div>
      </section>

      {/* ─── 5-STAGE ROADMAP: FROM IDEA TO LAUNCH ──────────────────────────── */}
      <section id="roadmap" className="py-16 md:py-24 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
              <FaCompass size={12} />
              <span>Structured Framework</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From Idea to Launch
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              For many young founders, the hard part starts after the idea arrives. The website, the brand, and the first audience all need attention. CareerMitra guides early ventures through five stages.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
            {STAGES.map((stage) => {
              const isSelected = stage.id === activeStage;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative ${
                    isSelected
                      ? "bg-orange-50 border-orange-400 shadow-md ring-2 ring-orange-400/20"
                      : "bg-slate-50/80 border-slate-200 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isSelected ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-700"}`}>
                      0{stage.id}
                    </span>
                    <div className="shrink-0">{stage.icon}</div>
                  </div>
                  <h3 className={`text-sm font-bold truncate ${isSelected ? "text-orange-950" : "text-slate-800"}`}>
                    {stage.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{stage.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Stage Details Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStageData.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-linear-to-br from-slate-50 to-orange-50/30 border border-orange-200/80 rounded-3xl p-6 sm:p-10 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-orange-200 shadow-xs flex items-center justify-center">
                      {currentStageData.icon}
                    </div>
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${currentStageData.badgeBg}`}>
                        Stage 0{currentStageData.id} of 05
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        Stage {currentStageData.id}: {currentStageData.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    {currentStageData.summary}
                  </p>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Focus & Action Items:</h4>
                    {currentStageData.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                        <FaCheckCircle className="text-orange-500 mt-0.5 shrink-0" size={14} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Stage Deliverable</h4>
                    <p className="text-sm font-bold text-slate-900">{currentStageData.milestone}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Our engineering and growth team helps you execute and cross this milestone cleanly.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-md">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <FaRocket size={15} />
                      <span>Need help with {currentStageData.title}?</span>
                    </h4>
                    <p className="text-xs text-orange-100 mt-1 leading-relaxed">
                      Consult with CareerMitra mentors to fast-track your {currentStageData.title.toLowerCase()} process today.
                    </p>
                    <button
                      onClick={directWhatsAppConsultation}
                      className="mt-4 w-full py-2.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-bold text-xs transition shadow-xs"
                    >
                      Get Stage Guidance on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── BUILD YOUR WEBSITE OR APP ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide uppercase mb-3">
            <FaCode size={12} />
            <span>Digital Product Offerings</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Build Your Website or App
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            CareerMitra supports both web and app development. The goal is a website or app that fits the idea, the audience, and the stage the business has reached.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_SERVICES.map((srv, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                  {srv.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">{srv.desc}</p>
                
                <ul className="space-y-2 border-t border-slate-100 pt-4">
                  {srv.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-600">Tailored for Startups</span>
                <button
                  onClick={directWhatsAppConsultation}
                  className="text-xs font-bold text-slate-700 hover:text-orange-600 flex items-center gap-1 transition"
                >
                  <span>Inquire</span>
                  <FaArrowRight size={10} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* MVP Card Highlight */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white border border-slate-700 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-400">
                <FaRocket size={22} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Web Apps & Mobile MVPs</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                An MVP is an early version that real users can test. Their feedback shows what to improve before the full build.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                <p>✔️ Faster time to market</p>
                <p>✔️ Real user validation</p>
                <p>✔️ Post-launch maintenance</p>
              </div>
            </div>

            <button
              onClick={directWhatsAppConsultation}
              className="mt-6 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
            >
              Build Your MVP With Us
            </button>
          </div>
        </div>
      </section>

      {/* ─── REACH THE RIGHT AUDIENCE ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-linear-to-b from-[#fafafa] via-orange-50/20 to-white border-y border-orange-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
              <FaBullhorn size={12} />
              <span>Digital Marketing & Growth</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Reach the Right Audience
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A strong website is only the start. The next step is reaching the right people. CareerMitra helps new ventures plan simple marketing around their goals and audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKETING_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-orange-200 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}

            <div className="p-6 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Practical Digital Foundation</span>
                <h3 className="text-base font-bold mt-1 mb-2">A Foundation That Evolves</h3>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  As the venture grows, the foundation can be updated to match new offerings and audiences without rebuilding from scratch.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/40 text-xs font-semibold text-emerald-100">
                ✨ Clear presence + Simple user signups
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ONE PLATFORM FOR CAREERS AND STARTUPS ─────────────────────────── */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-orange-500 via-amber-500 to-emerald-600 rounded-3xl p-1 shadow-lg">
          <div className="bg-white rounded-[22px] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-3">
                  <FaLayerGroup size={12} />
                  <span>Integrated Ecosystem</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  One Platform for Careers & Startups
                </h2>
                <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  CareerMitra places career opportunities, guidance, and startup support in one ecosystem. It serves students, freshers, and recent alumni. <strong className="text-slate-900">Neither path has to wait for the other.</strong>
                </p>
                <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
                  The focus stays on the early stage of a career or a venture. At that point, reliable information, practical guidance, and digital support make planning the next step easier. Government opportunities and startup support sit side by side.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/government-jobs"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <span>Govt Job Alerts</span>
                    <FaArrowRight size={10} />
                  </Link>
                  <Link
                    href="/internships"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <span>Internships / SkillUps</span>
                    <FaArrowRight size={10} />
                  </Link>
                  <Link
                    href="/pg-entrance"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <span>PG Entrance Updates</span>
                    <FaArrowRight size={10} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FaStar className="text-amber-500" />
                  <span>The Dual Pathway Advantage</span>
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/60 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
                    <p className="text-xs text-slate-600"><strong>Career Path:</strong> Verified government jobs, internships, PG entrance alerts & mentors.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/60 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
                    <p className="text-xs text-slate-600"><strong>Venture Path:</strong> Web & app development, digital marketing & launch guidance.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/60 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
                    <p className="text-xs text-slate-600"><strong>Zero Wait:</strong> Build your skills or business while exploring career opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE CONSULTATION & IDEA SUBMISSION FORM ──────────────── */}
      <section id="consultation" className="py-16 md:py-24 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide uppercase mb-3">
              <FaPaperPlane size={11} />
              <span>Direct Discussion</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Discuss Your Startup Idea
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Share a few details below to explore opportunities or jump straight into a direct WhatsApp conversation with our tech team.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Sent Successfully!</h3>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  Thank you! WhatsApp has opened with your inquiry details. Our team will review your idea and guide you through the next steps.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Submit Another Idea
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    >
                      <option>Student / Fresher</option>
                      <option>Alumni (Graduated within 4 years)</option>
                      <option>Freelancer / Creator</option>
                      <option>Side Project Builder</option>
                      <option>Early Stage Founder</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">What Stage is Your Idea In?</label>
                  <select
                    name="ideaStage"
                    value={formData.ideaStage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  >
                    <option>1. Idea (Just starting / defining problem)</option>
                    <option>2. Validate (Need landing page or customer testing)</option>
                    <option>3. Build (Need website, mobile app or MVP)</option>
                    <option>4. Launch (Ready to go live & market)</option>
                    <option>5. Grow (Scaling existing digital presence)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Brief Summary of Your Idea / Service</label>
                  <textarea
                    name="ideaDetails"
                    rows={3}
                    value={formData.ideaDetails}
                    onChange={handleInputChange}
                    placeholder="Tell us what problem you want to solve, what website/app you need, or what audience you want to reach..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    🔒 Direct one-on-one confidentiality guaranteed.
                  </p>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                  >
                    <FaWhatsapp size={18} />
                    <span>Send & Connect on WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (FAQS) ────────────────────────────── */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide uppercase mb-3">
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-800 hover:text-orange-600 transition"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown
                    size={14}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-500" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ────────────────────────────────────────────── */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl border border-orange-500/20">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 blur-3xl rounded-full" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-4 border border-orange-500/30">
              <FaRocket size={12} />
              <span>Take the Next Step</span>
            </span>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Turn Your Idea Into Reality?
            </h2>
            
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              A student may be preparing for an exam, exploring internships, or developing a startup idea. In each case, CareerMitra offers clearer information and practical support for the next move.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={directWhatsAppConsultation}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02]"
              >
                <FaWhatsapp size={19} />
                <span>Contact CareerMitra Team</span>
              </button>

              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition"
              >
                <span>Visit Contact Page</span>
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
