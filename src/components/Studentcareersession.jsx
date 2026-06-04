import { useState } from "react";
import AnimatedSection from "./Animatedsection";

const features = [
  { id: 1, icon: "🔔", title: "Personalized Job Alerts:", description: "Get notified of relevant government job openings tailored to your qualifications.", bg: "#fff7ed", iconBg: "#ffedd5", iconColor: "#ea580c" },
  { id: 2, icon: "🏢", title: "Beyond Campus Placements:", description: "Uncover lesser-known public sector careers that are often overlooked. Explore opportunities in PSUs, autonomous bodies and more.", bg: "#f0fdf4", iconBg: "#dcfce7", iconColor: "#16a34a" },
  { id: 3, icon: "💡", title: "Unthought Careers:", description: "Tapping on the untapped careers like Translators, Secretarial Assistance, Parliamentary Officials, Protocol Officers.", bg: "#faf5ff", iconBg: "#ede9fe", iconColor: "#7c3aed" },
  { id: 4, icon: "🎓", title: "Support for +2 Graduates", description: "Careers like SSC, GD, RRB Group D, State Police and more, curated specifically for intermediate, ITI or Polytechnic Graduates.", bg: "#eff6ff", iconBg: "#dbeafe", iconColor: "#1d4ed8" },
  { id: 5, icon: "📍", title: "Pan-India Coverage", description: "Track job openings across all the states from kashmir to kanyakumari. Both state and central level job opportunities are covered in one place.", bg: "#fff1f2", iconBg: "#ffe4e6", iconColor: "#e11d48" },
  { id: 6, icon: "🛡️", title: "Strategic Sectors", description: "Get priority alerts from the strategic departments like defence, Space research(ISRO), DRDO, Forest Services, Intelligence Bureau and more.", bg: "#f8fafc", iconBg: "#e2e8f0", iconColor: "#334155" },
  { id: 7, icon: "👥", title: "Inclusive Career Discovery", description: "Targeted focus on professional and technical fields like Polytechnic, ITI, Diploma holders and Vocational training graduates.", bg: "#f0fdfa", iconBg: "#ccfbf1", iconColor: "#0d9488" },
  { id: 8, icon: "📄", title: "Recruitment process:", description: "Gain insights about the recruitment process– application, exam patterns, interviews and final selection", bg: "#fffbeb", iconBg: "#fef3c7", iconColor: "#d97706" },
];

const stats = [
  { value: "500+", label: "Exam Updates", icon: "🔔", gradient: "linear-gradient(135deg, #f97316, #ea580c)" },
  { value: "50+", label: "PSU Recruiters", icon: "🏢", gradient: "linear-gradient(135deg, #22c55e, #16a34a)" },
  { value: "25+", label: "Strategic Sectors", icon: "🛡️", gradient: "linear-gradient(135deg, #a855f7, #7c3aed)" },
  { value: "100%", label: "Free Access", icon: "⭐", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

const steps = [
  { step: "01", title: "Notification", desc: "Official release of exam dates and vacancies", icon: "📢" },
  { step: "02", title: "Application", desc: "Online form filling and fee payment", icon: "📝" },
  { step: "03", title: "Prelims", desc: "First stage screening examination", icon: "📚" },
  { step: "04", title: "Mains", desc: "Descriptive and subject-specific exam", icon: "✍️" },
  { step: "05", title: "Interview", desc: "Personality test and document verification", icon: "🎯" },
  { step: "06", title: "Selection", desc: "Final merit list and joining", icon: "🏆" },
];

const whyUs = [
  "Personalized exam strategy for each student",
  "Real-time updates on all government vacancies",
  "Expert mentorship from selected officers",
  "Free mock tests and study materials",
];

export default function StudentCareerSession() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      padding: "80px 0", overflow: "hidden", position: "relative",
      background: "linear-gradient(135deg, #f9fafb 0%, #fff 50%, rgba(255,237,213,0.3) 100%)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 384, height: 384, background: "rgba(249,115,22,0.05)", borderRadius: "50%", filter: "blur(60px)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 384, height: 384, background: "rgba(34,197,94,0.05)", borderRadius: "50%", filter: "blur(60px)", transform: "translate(50%,50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(90deg, #f97316, #22c55e)",
              color: "#fff", padding: "6px 16px", borderRadius: 9999,
              fontSize: 13, fontWeight: 600, marginBottom: 20,
            }}>
              🚀 Your Gateway to Government Jobs
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#111827", marginBottom: 16, letterSpacing: "-1px" }}>
              Focused on{" "}
              <span style={{ background: "linear-gradient(90deg, #f97316, #22c55e, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Government Jobs
              </span>
            </h2>
            <div style={{ width: 128, height: 6, background: "linear-gradient(90deg, #f97316, #22c55e)", borderRadius: 9999, margin: "0 auto 20px" }} />
            <p style={{ color: "#4b5563", maxWidth: 560, margin: "0 auto", fontSize: 17 }}>
              Your complete platform for government exam preparation, personalized alerts, and career guidance across all strategic sectors in India.
            </p>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 64 }}>
          {stats.map((s, i) => (
            <AnimatedSection key={i} animation="fade-up" delay={i * 80}>
              <div style={{
                background: s.gradient, borderRadius: 20, padding: 20,
                textAlign: "center", color: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{s.value}</div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>{s.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Features Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, marginBottom: 64 }}>
          {features.map((f, i) => (
            <AnimatedSection key={f.id} animation="fade-up" delay={i * 60}>
              <div
              className="h-70"
                style={{
                  background: f.bg, borderRadius: 20, padding: 24,
                  border: "1px solid rgba(0,0,0,0.04)",
                  boxShadow: hovered === f.id ? "0 16px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.3s", cursor: "pointer",
                  transform: hovered === f.id ? "translateY(-8px)" : "translateY(0)",
                }}
                onMouseEnter={() => setHovered(f.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  width: 56, height: 56, background: f.iconBg, borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 16,
                  transition: "transform 0.3s",
                  transform: hovered === f.id ? "scale(1.1)" : "scale(1)",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{f.description}</p>
                {/* {hovered === f.id && (
                  <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: f.iconColor, display: "flex", alignItems: "center", gap: 4 }}>
                    Learn more →
                  </div>
                )} */}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Recruitment Steps */}
        <AnimatedSection animation="fade-up">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#111827", color: "#fff",
              padding: "6px 16px", borderRadius: 9999, fontSize: 13, fontWeight: 600, marginBottom: 16,
            }}>
              📋 Step by Step Guide
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#111827" }}>
              Understanding the{" "}
              <span style={{ background: "linear-gradient(90deg, #f97316, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Recruitment Process
              </span>
            </h2>
            <div style={{ width: 80, height: 4, background: "linear-gradient(90deg, #f97316, #22c55e)", borderRadius: 9999, margin: "12px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 64 }}>
            {steps.map((s, i) => (
              <div key={i}
                style={{
                  background: "#fff", borderRadius: 14, padding: "16px 20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", gap: 16,
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
              >
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#f97316", background: "#fff7ed", padding: "2px 8px", borderRadius: 9999 }}>{s.step}</span>
                    <h4 style={{ fontWeight: 800, color: "#1f2937", fontSize: 15 }}>{s.title}</h4>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection animation="fade-up">
          <div style={{
            background: "linear-gradient(135deg, #111827, #1f2937)",
            borderRadius: 32, padding: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginBottom: 64,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ color: "#fb923c", fontSize: 22 }}>🏆</span>
                  <span style={{ color: "#fb923c", fontWeight: 700 }}>Why Students Trust Us</span>
                </div>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
                  Your Success is Our Mission
                </h3>
                <p style={{ color: "#d1d5db", marginBottom: 24, lineHeight: 1.6, fontSize: 14 }}>
                  We've helped thousands of students achieve their dream government jobs through personalized guidance, timely updates, and comprehensive preparation strategies.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {whyUs.map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#4ade80", fontSize: 14 }}>✓</span>
                      <span style={{ color: "#d1d5db", fontSize: 14 }}>{w}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  background: "linear-gradient(90deg, #f97316, #22c55e)",
                  color: "#fff", padding: "10px 24px", borderRadius: 9999,
                  fontWeight: 700, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "transform 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Start Your Journey →
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { emoji: "📚", val: "500+", label: "Practice Tests" },
                  { emoji: "👨‍🏫", val: "50+", label: "Expert Mentors" },
                  { emoji: "🎯", val: "85%", label: "Success Rate" },
                  { emoji: "⏰", val: "24/7", label: "Support Available" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.08)", borderRadius: 20,
                    padding: 20, textAlign: "center", backdropFilter: "blur(8px)",
                  }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{s.emoji}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#d1d5db" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Banner */}
        <AnimatedSection animation="fade-up">
          <div style={{
            background: "linear-gradient(90deg, #f97316, #22c55e, #f97316)",
            backgroundSize: "200% auto",
            animation: "gradientShift 4s ease infinite",
            borderRadius: 24, padding: "40px 32px", textAlign: "center",
          }}>
            <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Ready to Crack Your Dream Government Exam?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: 24, fontSize: 15 }}>
              Join thousands of successful aspirants who started their journey with us
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <button style={{
                background: "#fff", color: "#ea580c",
                padding: "10px 24px", borderRadius: 9999,
                fontWeight: 800, border: "none", cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                Get Personalized Alerts
              </button>
              <button style={{
                background: "transparent", color: "#fff",
                padding: "10px 24px", borderRadius: 9999,
                fontWeight: 700, border: "2px solid #fff", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Explore Careers
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
      <style>{`@keyframes gradientShift { 0%,100%{background-position:0%} 50%{background-position:200%} }`}</style>
    </section>
  );
}