"use client";

import Link from "next/link";
import AnimatedSection from '@/components/Animatedsection';
import CareerHomeJobs from '@/components/CareerHomeJobs';
import { motion } from "framer-motion";
import InternshipTable from "@/components/InternshipTable";
import HeroFinalPage from '@/components/HeroFinalPage';
import HomeBlogs from "@/components/HomeBlogs/HomeBlogs";

const ArrowRightIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const states = [
  "Goa", "Delhi", "Sikkim", "Assam", "Bihar", "Punjab", "Odisha", "Telangana", "Andhra Pradesh",
  "Kerala", "Gujarat", "Haryana", "Tripura", "Manipur", "Mizoram", "Nagaland", "Karnataka",
  "Jharkhand", "Meghalaya", "Rajasthan", "Tamil Nadu", "West Bengal", "Uttarakhand",
  "Uttar Pradesh", "Madhya Pradesh", "Himachal Pradesh", "Arunachal Pradesh", "Chhattisgarh", "Maharashtra",
];

const stateRows = Array.from({ length: 4 }, (_, rowIndex) =>
  states.filter((_, index) => index % 4 === rowIndex)
);

const categories = [
  { name: "10th Pass Jobs", slug: "10th-pass" },
  { name: "12th Pass Jobs", slug: "12th-pass" },
  { name: "Degree Jobs", slug: "degree" },
  { name: "Engineering Jobs", slug: "engineering" },
  { name: "Bank Jobs", slug: "bank" },
  { name: "Defence Jobs", slug: "defence" },
];

const topJobCategories = [
  "SSC Jobs 2026",
  "Bank Jobs 2026",
  "Railway Jobs 2026",
  "Defence Jobs 2026",
  "Police Jobs 2026",
];

export default function HomeClient() {
  return (
    <div className="py-20" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      <HeroFinalPage />

      <HomeBlogs />
      
      <CareerHomeJobs />

      {/* InternshipTable Jobs */}
      <section id="internship" style={{ padding: "50px 0 56px", background: "#fafaf9", position: "relative", overflow: "hidden" }}>

        {/* Decorative background blobs */}
        <div style={{
          position: "absolute", top: -120, right: -120, width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80, width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: "0px 20px" }}>
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 48 }}>

              {/* Eyebrow badge */}
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
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ color: "#c2410c", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Latest Updated
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-green-600 bg-clip-text text-transparent">
                  Internship & Skill Up Opportunities
              </h2>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.4, duration: 0.9, ease: "easeOut" }}
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
                Recently announced Internship opportunities across various sectors in India.
              </p>
            </div>
          </AnimatedSection>

          <InternshipTable />
        </div>
      </section>

      {/* States Grid (Temporarily Commented Out)
      <section style={{ padding: "80px 0 96px", background: "#ffffff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <span className="inline-block px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                State-wise Selection
              </span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900, color: "#111827", marginBottom: 15, letterSpacing: "-1px" }}>
                Find Govt Jobs by <span style={{ color: "#22c55e" }}>State / UT</span>
              </h2>
              <p style={{ color: "#6b7280", maxWidth: 600, margin: "0 auto", fontSize: 16 }}>
                Explore tailored state government recruitment opportunities across all Indian states and Union Territories.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, overflow: "hidden", padding: "10px 0" }}>
            {stateRows.map((row, rIdx) => {
              const speed = 35 + rIdx * 5;
              const direction = rIdx % 2 === 0 ? "left" : "right";
              return (
                <div key={rIdx} className="relative w-full overflow-hidden select-none flex">
                  <motion.div
                    className="flex shrink-0 gap-4 min-w-full justify-around"
                    animate={{ x: direction === "left" ? [0, "-100%"] : ["-100%", 0] }}
                    transition={{ ease: "linear", duration: speed, repeat: Infinity }}
                  >
                    {[...row, ...row].map((state, sIdx) => (
                      <Link
                        key={sIdx}
                        href={`/government-jobs?state=${encodeURIComponent(state)}`}
                        className="px-6 py-3.5 bg-orange-50/30 hover:bg-orange-50/70 border border-orange-100 hover:border-orange-300 rounded-2xl text-sm font-bold text-gray-800 transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer shrink-0"
                      >
                        📍 {state}
                      </Link>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      */}

      {/* Grid of Categories (Temporarily Commented Out)
      <section style={{ padding: "96px 0", background: "#fcfaf8", borderTop: "1px solid #f1f5f9" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                Job Categories
              </span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900, color: "#111827", marginBottom: 15, letterSpacing: "-1px" }}>
                Govt Jobs by <span style={{ color: "#f97316" }}>Qualifications</span>
              </h2>
              <p style={{ color: "#6b7280", maxWidth: 600, margin: "0 auto", fontSize: 16 }}>
                Filter government jobs based on your educational background and career path.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {categories.map((cat, idx) => (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 0.1}>
                <Link
                  href={`/government-jobs?category=${encodeURIComponent(cat.slug)}`}
                  className="bg-white p-8 rounded-3xl border border-orange-100/50 hover:border-orange-300 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl cursor-pointer min-h-48 relative overflow-hidden"
                >
                  <div style={{
                    position: "absolute", top: 0, right: 0, width: 90, height: 90,
                    background: "radial-gradient(circle at top right, rgba(249,115,22,0.06), transparent 70%)",
                    borderRadius: "0 0 0 100%",
                  }} />

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <span className="text-xl">🎓</span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>{cat.name}</h3>
                    <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
                      Explore all notifications matching {cat.name} qualifications.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-6 text-sm font-bold text-orange-600 group-hover:translate-x-1.5 transition-transform">
                    Explore Jobs <ArrowRightIcon />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Popular Recruiters (Temporarily Commented Out)
      <section style={{ padding: "96px 0", background: "#ffffff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                Top Recruiters
              </span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900, color: "#111827", marginBottom: 15, letterSpacing: "-1px" }}>
                Popular govt <span style={{ color: "#d97706" }}>Recruiters</span>
              </h2>
              <p style={{ color: "#6b7280", maxWidth: 600, margin: "0 auto", fontSize: 16 }}>
                Direct access to notifications from major government organizations and departments.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {topJobCategories.map((name, idx) => (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 0.08}>
                <Link
                  href={`/government-jobs?q=${encodeURIComponent(name.replace(" 2026", ""))}`}
                  className="bg-slate-50 hover:bg-orange-50/50 p-6 rounded-2xl border border-slate-100 hover:border-orange-200 text-center font-bold text-gray-700 hover:text-orange-700 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    🏛️
                  </div>
                  <span style={{ fontSize: 15 }}>{name}</span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
