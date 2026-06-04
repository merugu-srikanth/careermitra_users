import { Link } from "react-router-dom";
import HeroSection from "../components/Herosection";
import AnimatedSection from "../components/Animatedsection";
import StudentCareerSession from "../components/Studentcareersession";
import JobCategories from "../components/Jobcategories";
import SEO from "../components/SEO";
import GovernmentHero from "../components/GovernmentHero";
import CareerHomeJobs from "../components/CareerHomeJobs";
// import HeroSection from "../components/HeroSection";
// import JobCard from "../components/JobCard";
// import AnimatedSection from "../components/AnimatedSection";
// import StudentCareerSession from "../components/StudentCareerSession";
// import JobCategories from "../components/JobCategories";
import { motion } from "framer-motion";
import InternshipTable from "./InternshipTable";
import Heropage from "../components/Heropage";
import Hero from "../components/Hero";
import HeroFinalPage from "../components/HeroFinalPage";

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

export default function Home() {
  return (
    <div style={{ overflow: "hidden", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      <SEO
        title="Career Mitra: Personalized Latest Govt Jobs Notifications & Career Guidance in India"
        description="Get personalized latest Govt Jobs notifications, Sarkari Naukri updates, exam alerts, results, and expert career guidance at Career Mitra."
        keywords="Career Mitra, Latest Govt Jobs Notifications, Sarkari Naukri 2026, Free Job Alert, Career Guidance, Government Jobs India, Latest Job Alerts, Exam Notifications"
        url="https://careermitra.in/"
      />

      {/* <HeroSection /> */}
      {/* <Heropage /> */}
      {/* <Hero /> */}
      <HeroFinalPage />
      

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

              {/* <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#111827", marginBottom: 3, letterSpacing: "-1px", lineHeight: 1.1 }}>
                Internship & Skill Up{" "}
                <span style={{ background: "linear-gradient(90deg, #f97316, #22c55e, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "textShimmer 4s linear infinite" }}>
                  Opportunities
                </span>
              </h2> */}

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


          {/* <div style={{ marginTop: 51, textAlign: "center" }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
              <Link to={token ? "/jobs" : "/login"} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 40px", borderRadius: 9999,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff",
                fontWeight: 800, textDecoration: "none",
                fontSize: 15,
                boxShadow: "0 8px 28px rgba(249,115,22,0.38)",
                letterSpacing: "0.01em",
                transition: "box-shadow 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 36px rgba(249,115,22,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(249,115,22,0.38)"; }}
              >
                View All Opportunities <ArrowRightIcon />
              </Link>
            </motion.div>
          </div> */}
        </div>
      </section>

      {/* <StudentCareerSession /> */}

      {/* States Moving */}
      {/* <section style={{ padding: "96px 0", background: "rgba(255,247,237,0.5)" }}>
        <div style={{ padding: "0 60px 0", textAlign: "center" }}>
          <AnimatedSection animation="fade-up">
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>
              Explore by <span style={{ color: "#f97316" }}>State</span>
            </h2>
            <p style={{ color: "#6b7280", fontSize: 17, marginBottom: 48 }}>
              Find career opportunities in your local region with ease.
            </p>
          </AnimatedSection>
        </div>

        <div style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 18, padding: "8px 0" }}>
          {stateRows.map((row, rowIndex) => {
            const isOrange = rowIndex % 2 === 0;
            const borderColor = isOrange ? "#fed7aa" : "#bbf7d0";
            const hoverColor = isOrange ? "#f97316" : "#16a34a";

            return (
              <div
                key={rowIndex}
                style={{
                  display: "flex",
                  gap: 16,
                  animation: `${isOrange ? "scrollLeft" : "scrollRight"} 45s linear infinite`,
                  width: "max-content",
                }}
                onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
                onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
              >
                {[...row, ...row].map((s, i) => (
                  <Link
                    key={`${s}-${rowIndex}-${i}`}
                    to="/coming-soon"
                    style={{
                      padding: "12px 24px",
                      borderRadius: 16,
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      fontWeight: 700,
                      color: "#374151",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      fontSize: 14,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = hoverColor;
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = hoverColor;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#374151";
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </section> */}

      {/* Categories */}
      {/* <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ padding: "0 60px", textAlign: "center" }}>
          <AnimatedSection animation="fade-up">
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>
              Government Jobs by  <span style={{ color: "#f97316" }}>Qualification 2026</span>
            </h2>
            <p style={{ color: "#6b7280", fontSize: 17, marginBottom: 64 }}>
              Get job alerts tailored specifically to your qualification
            </p>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {categories.map((cat, i) => (
              <AnimatedSection key={cat.slug} animation="fade-up" delay={i * 50}>
                <Link to="#"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: 16, borderRadius: 20, background: "#fafafa",
                    border: "1px solid #f1f5f9", textDecoration: "none",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#f97316";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(249,115,22,0.12)";
                    e.currentTarget.querySelector(".cat-name").style.color = "#ea580c";
                    e.currentTarget.querySelector(".cat-arrow").style.background = "#f97316";
                    e.currentTarget.querySelector(".cat-arrow").style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#f1f5f9";
                    e.currentTarget.style.background = "#fafafa";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.querySelector(".cat-name").style.color = "#1f2937";
                    e.currentTarget.querySelector(".cat-arrow").style.background = "#fff";
                    e.currentTarget.querySelector(".cat-arrow").style.color = "#374151";
                  }}
                >
                  <span className="cat-name" style={{ fontWeight: 800, fontSize: 17, color: "#1f2937", transition: "color 0.3s" }}>
                    {cat.name}
                  </span>
                  <div className="cat-arrow" style={{
                    width: 40, height: 40, borderRadius: "50%", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.3s",
                  }}>
                    <ArrowRightIcon />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section> */}

      {/* <JobCategories />  */}

      {/* CTA Section */}
      <section style={{ padding: "0px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            borderRadius: 48,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 32px 80px rgba(249,115,22,0.35), 0 0 0 1px rgba(249,115,22,0.1)",
          }}
        >
          {/* Animated gradient background */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #ea580c 0%, #c2410c 30%, #15803d 70%, #16a34a 100%)",
            backgroundSize: "300% auto",
            animation: "gradientShift 5s ease infinite",
          }} />

          {/* Noise texture overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            opacity: 0.4,
            pointerEvents: "none",
          }} />

          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: -60, right: -60, width: 300, height: 300,
            borderRadius: "50%", background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: 40, width: 200, height: 200,
            borderRadius: "50%", background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }} />

          <AnimatedSection animation="fade-up">
            <div style={{ position: "relative", zIndex: 1, padding: "32px 10px", textAlign: "center", color: "#fff" }}>

              {/* Floating emoji badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: 40, marginBottom: 20 }}
              >
                🔔
              </motion.div>

              <h2 style={{
                fontSize: "clamp(1.5rem, 3vw, 3.5rem)", fontWeight: 900, marginBottom: 24,
                lineHeight: 1.15, letterSpacing: "-0.5px",
                textShadow: "0 2px 20px rgba(0,0,0,0.2)",
              }}>
                Stay Updated With Every Government Job Notifications 2026
              </h2>
              <p className="md:max-w-4xl mx-auto mb-5" >
                A missed job opportunity hurts more than a rejection. It turns into lasting regret for thousands of students everyday, simply due to late updates. With CareerMitra, get timely personalized job updates directly to your mobile/email.
              </p>

              {/* Stats row */}
              {/* <div style={{
                display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32,
                marginBottom: 48, opacity: 0.92,
              }}>
                {[["50K+", "Active Users"], ["1000+", "Jobs Listed"], ["100%", "Free Access"]].map(([num, label]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div> */}

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" style={{
                    padding: "18px 24px", background: "#fff", color: "#16a34a",
                    borderRadius: 9999, fontWeight: 900, fontSize: "clamp(1rem, 2vw, 1.1rem)",
                    textDecoration: "none",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    display: "inline-flex", alignItems: "center", gap: 8,
                    letterSpacing: "0.01em",
                  }}>
                    Subscribe For Matching Job Alerts
                    <span style={{ fontSize: 18 }}>→</span>
                  </Link>
                </motion.div>
                {/* <a href="#" style={{
                  padding: "16px 40px", background: "#3b82f6", color: "#fff",
                  borderRadius: 9999, fontWeight: 900, fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  textDecoration: "none", border: "1px solid #60a5fa", transition: "transform 0.2s",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  JOIN TELEGRAM
                </a> */}
              </div>
            </div>
          </AnimatedSection>
        </motion.div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes scrollLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes scrollRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes textShimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}