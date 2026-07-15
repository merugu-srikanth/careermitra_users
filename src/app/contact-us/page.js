"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin,
  FaWhatsapp, FaArrowRight, FaCheckCircle
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import SEO from '@/components/SEO';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/schemaHelpers';

// ─── FLOATING ICONS DATA ──────────────────────────────────────────────────────
const floatingIcons = [
  { icon: "🎓", top: "81%", left: "4%", delay: 0, size: "text-3xl" },
  { icon: "💼", top: "24%", right: "6%", delay: 1.2, size: "text-2xl" },
  { icon: "📋", top: "34%", left: "2%", delay: 2.4, size: "text-xl" },
  { icon: "🏛️", top: "54%", right: "3%", delay: 0.8, size: "text-3xl" },
  { icon: "📊", top: "70%", left: "5%", delay: 3.1, size: "text-xl" },
  { icon: "🌱", top: "80%", right: "8%", delay: 1.8, size: "text-3xl" },
  { icon: "✅", top: "24%", left: "47%", delay: 4.0, size: "text-lg" },
  { icon: "📝", top: "89%", left: "29%", delay: 2.8, size: "text-2xl" },
  { icon: "🚀", top: "15%", left: "60%", delay: 1.5, size: "text-3xl" },
  { icon: "⭐", top: "60%", left: "44%", delay: 3.5, size: "text-xl" },
];

// ─── CONTACT INFO ─────────────────────────────────────────────────────────────
const contactInfo = [
  {
    icon: <FaEnvelope size={18} />,
    label: "Email Us",
    value: "info@careermitra.in",
    iconBg: "bg-orange-50 border border-orange-200",
    iconColor: "text-orange-500",
    hoverBorder: "hover:border-orange-300",
    hoverBg: "hover:bg-orange-50",
  },
  {
    icon: <FaPhone size={16} />,
    label: "Call Us",
    value: "+91 7794045533",
    iconBg: "bg-green-50 border border-green-200",
    iconColor: "text-green-600",
    hoverBorder: "hover:border-green-300",
    hoverBg: "hover:bg-green-50",
  },
  {
    icon: <FaMapMarkerAlt size={18} />,
    label: "Visit Us",
    value: "Hyderabad, Telangana, India",
    iconBg: "bg-blue-50 border border-blue-200",
    iconColor: "text-blue-500",
    hoverBorder: "hover:border-blue-300",
    hoverBg: "hover:bg-blue-50",
  },
];

// ─── INTEREST TOPICS ──────────────────────────────────────────────────────────
const topics = ["State PSC", "UPSC / IAS", "Banking", "Railways", "Defence", "Other"];
const WHATSAPP_NUMBER = "917794045533";

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const floatAnim = (delay = 0) => ({
  animate: {
    y: [0, -22, 0],
    rotate: [0, 6, -4, 0],
    opacity: [0.06, 0.12, 0.06],
  },
  transition: {
    duration: 7 + delay * 0.4,
    delay,
    repeat: Infinity,
    ease: "easeInOut",
  },
});

// ─── FLOATING BACKGROUND ─────────────────────────────────────────────────────
function FloatingBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingIcons.map((f, i) => (
        <motion.span
          key={i}
          className={`absolute select-none ${f.size}`}
          style={{ top: f.top, left: f.left, right: f.right }}
          animate={floatAnim(f.delay).animate}
          transition={floatAnim(f.delay).transition}
        >
          {f.icon}
        </motion.span>
      ))}
    </div>
  );
}

// ─── CONTACT CARD ─────────────────────────────────────────────────────────────
function ContactCard({ item, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={fadeUp}
      whileHover={{ x: 6, transition: { duration: 0.2 } }}
      className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 cursor-pointer transition-colors duration-200 ${item.hoverBorder} ${item.hoverBg}`}
    >
      <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 ${item.iconColor}`}>
        {item.icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
        <p className="text-sm font-semibold text-gray-800">{item.value}</p>
      </div>
    </motion.button>
  );
}

// ─── SUCCESS STATE ────────────────────────────────────────────────────────────
function SuccessState({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-10 rounded-3xl bg-linear-to-br from-orange-50 to-green-50 border border-green-200 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-5"
      >
        <FaCheckCircle className="text-white" size={30} />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-xl font-extrabold text-gray-900 mb-2"
      >
        Message Sent!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-sm text-gray-500 leading-relaxed"
      >
        Thank you, <span className="font-bold text-gray-800">{name}</span>!<br />
        Our team will reach out within{" "}
        <span className="text-orange-500 font-semibold">24 hours</span>.<br />
        <span className="text-green-600 font-semibold">Career Mitra</span> is here to guide your journey.
      </motion.p>
    </motion.div>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [activeTopic, setActiveTopic] = useState("State PSC");
  const [otherTopic, setOtherTopic] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const selectedTopic = activeTopic === "Other" ? (otherTopic.trim() || "Other") : activeTopic;

  const openWhatsApp = (source = "Contact Form") => {
    const text = [
      `Hi Career Mitra Team,`,
      "",
      `Source: ${source}`,
      `Name: ${form.name || "-"}`,
      `Email: ${form.email || "-"}`,
      `Phone: ${form.phone || "-"}`,
      `Interested In: ${selectedTopic}`,
      `Message: ${form.message || "-"}`,
    ].join("\n");

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message || (activeTopic === "Other" && !otherTopic.trim())) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }

    openWhatsApp("Contact Form");
    setSent(true);
  };

  const contactSchemas = [
    generateOrganizationSchema(),
    generateWebPageSchema({
      name: "Contact Us - Career Mitra",
      description: "Contact Career Mitra for personalized Govt Jobs notifications, career guidance, support, feedback, and job-related assistance.",
      url: "https://careermitra.in/contact-us"
    })
  ];

  return (
    <>
      <SEO
        title="Contact Us - Career Mitra"
        description="Contact Career Mitra for personalized Govt Jobs notifications, career guidance, support, feedback, and job-related assistance."
        keywords="Contact Us, Contact Career Mitra, Govt Jobs Support, Career Guidance Support, Sarkari Naukri Help, Free Job Alerts, Government Jobs India, Career Counselling, Employment Support"
        url="https://careermitra.in/contact-us"
        schema={contactSchemas}
      />

      <section
        id="contact"
        className="relative bg-white py-24 px-6 overflow-hidden"
      >
        <FloatingBg />

      {/* subtle top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-300 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold uppercase tracking-widest mb-5">
            <motion.span
              className="w-2 h-2 rounded-full bg-orange-500"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            We'd love to hear from you
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            Start Your{" "}
            <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Government
            </span>{" "}
            Career{" "}
            <span className="bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Journey
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Our team of retired senior officials and digital experts are ready to guide you toward the right opportunity.
          </motion.p>
        </motion.div>

        {/* ── GRID ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: INFO ── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideLeft}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-linear-to-b from-orange-500 to-green-500 inline-block" />
              Get In Touch
            </h3>

            <motion.div
              className="space-y-3 mb-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {contactInfo.map((item, i) => (
                <ContactCard key={i} item={item} onClick={() => openWhatsApp(item.label)} />
              ))}
            </motion.div>

            {/* divider */}
            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-6" />

            {/* promise box */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-linear-to-br from-orange-50 to-green-50 border border-orange-100 flex items-start gap-3 mb-6"
            >
              <span className="text-2xl">⚡</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                We respond within{" "}
                <span className="font-bold text-orange-600">24 hours</span>.
                Personalized guidance from experienced government officials — not bots.
              </p>
            </motion.div>

            {/* socials */}
            <div className="flex gap-3">
              {[
                { Icon: FaLinkedin, color: "hover:text-blue-600  hover:border-blue-300" },
                { Icon: FaXTwitter, color: "hover:text-gray-900  hover:border-gray-400" },
                { Icon: FaWhatsapp, color: "hover:text-green-600 hover:border-green-300", onClick: () => openWhatsApp("WhatsApp Icon") },
              ].map(({ Icon, color, onClick }, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={onClick}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 transition-colors duration-200 ${color}`}
                >
                  <Icon size={17} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: FORM ── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideRight}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <SuccessState key="success" name={form.name} />
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100"
                >
                  <p className="text-base font-bold text-gray-900 mb-1">Send us a message</p>
                  <p className="text-sm text-gray-400 mb-6">Tell us your aspirations — we'll show you the path.</p>

                  {/* name + email row */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { name: "name", placeholder: "Full Name", type: "text" },
                      { name: "email", placeholder: "Email Address", type: "email" },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                          {f.placeholder}
                        </label>
                        <input
                          type={f.type}
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                        />
                      </div>
                    ))}
                  </div>

                  {/* phone */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"                    
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                    />
                  </div>

                  {/* interest topics */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      I'm Interested In
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <motion.button
                          key={t}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setActiveTopic(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${activeTopic === t
                              ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                              : "bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                            }`}
                        >
                          {t}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {activeTopic === "Other" && (
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                        Please Specify
                      </label>
                      <input
                        type="text"
                        value={otherTopic}
                        onChange={(e) => setOtherTopic(e.target.value)}
                        placeholder="Type your interest here..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* message */}
                  <div className="mb-5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Share your background, aspirations, or questions..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200 resize-none"
                    />
                    <p className="text-right text-xs text-gray-300 mt-1">
                      {form.message.length} / 300
                    </p>
                  </div>

                  {/* error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-red-500 font-medium mb-3 text-center"
                      >
                        Please fill in Name, Email, Message, and Other topic (if selected).
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* submit */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    className="w-full py-4 rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-shadow duration-300"
                  >
                    Send Message
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight size={14} />
                    </motion.span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      </section>
    </>
  );
}