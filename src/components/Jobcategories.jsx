import { useState } from "react";
import AnimatedSection from "./Animatedsection";

const categories = [
  { id: 1, icon: "🏛️", name: "UPSC – Union Public Service Commission", shortDesc: "IAS, IPS, IFS, CDS, NDA & more", description: "UPSC conducts India's most prestigious exams like IAS, CDS, NDA, and Engineering Services. Graduation required; age 21–32; criteria vary by exam. Gateway to top civil services positions in India." },
  { id: 2, icon: "📋", name: "Staff Selection Commission (SSC)", shortDesc: "CGL, CHSL, MTS, GD Constable", description: "SSC recruits staff for Group B and C posts in various ministries. Exams include SSC CGL, CHSL, MTS, GD Constable, and others across India. One of the largest recruitment bodies." },
  { id: 3, icon: "🏢", name: "Public Sector Undertakings (PSUs)", shortDesc: "BHEL, ONGC, NTPC, IOCL, SAIL", description: "PSUs recruit for technical, managerial, and administrative roles through GATE scores and direct exams. Major recruiters include BHEL, ONGC, NTPC, IOCL, SAIL, and other central enterprises." },
  { id: 4, icon: "🏦", name: "Banking & Insurance", shortDesc: "IBPS, SBI, RBI, LIC, SEBI", description: "Banking and insurance sectors offer stable careers through exams by IBPS, SBI, RBI, LIC, and other insurers. Recruitments also in financial regulators like SEBI, NABARD, and IRDAI." },
  { id: 5, icon: "🚂", name: "Indian Railways", shortDesc: "RRB NTPC, Group D, JE, ALP", description: "One of the world's largest employers, conducts recruitment through RRBs. Offers opportunities in technical, non-technical, and paramedical categories across Group A, B, C, and D posts." },
  { id: 6, icon: "🛡️", name: "Ministry of Defence", shortDesc: "NDA, CDS, AFCAT, DRDO, HAL", description: "Recruits for armed forces, civilian roles, and technical positions through NDA, CDS, and AFCAT. Also oversees Defence PSUs like HAL, DRDO, BEL, and BEML for engineers and scientists." },
  { id: 7, icon: "🚩", name: "State Services", shortDesc: "APPSC, TSPSC, Group 1,2,3,4", description: "State PSCs recruit for various government departments through Group exams. Includes technical posts in Engineering, Panchayat Raj, Women & Child Welfare, Agriculture, Forestry, and more." },
  { id: 8, icon: "🏗️", name: "Central Ministries", shortDesc: "58 Ministries, 94+ Departments", description: "Government of India comprises 58 ministries and over 94 departments. Opportunities include scientists, trainers, administrators, and diverse roles across various organizations and institutes." },
];

const WHATSAPP_NUMBER = "917794045533";

export default function JobCategories() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      padding: "36px 0", position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #f9fafb 0%, #fff 50%, rgba(255,237,213,0.3) 100%)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 384, height: 384, background: "rgba(249,115,22,0.05)", borderRadius: "50%", filter: "blur(60px)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 384, height: 384, background: "rgba(34,197,94,0.05)", borderRadius: "50%", filter: "blur(60px)", transform: "translate(50%,50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <AnimatedSection animation="fade-up">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff7ed", color: "#c2410c",
              padding: "6px 16px", borderRadius: 9999,
              fontSize: 13, fontWeight: 600, marginBottom: 14,
            }}>
              <span style={{ width: 8, height: 8, background: "#f97316", borderRadius: "50%", animation: "pulse 2s infinite" }} />
              Explore Your Future
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#111827", marginBottom: 16, letterSpacing: "-1px" }}>
              A Glance at Different{" "}
              <span style={{ background: "linear-gradient(90deg, #f97316, #16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Careers
              </span>
            </h2>
            <div style={{ width: 112, height: 6, background: "linear-gradient(90deg, #f97316, #22c55e, #f97316)", borderRadius: 9999, margin: "0 auto 24px" }} />
            <p style={{ color: "#4b5563", maxWidth: 560, margin: "0 auto", fontSize: 17, fontWeight: 500 }}>
              Find here a brief idea about what each recruitment is about. This will help you understand the scope of various recruitments.
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {categories.map((cat, idx) => (
            <AnimatedSection key={cat.id} animation="fade-up" delay={idx * 60}>
              <div
                style={{ height: 340, perspective: 1000, cursor: "pointer" }}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.6s ease-in-out", transform: hovered === cat.id ? "rotateY(180deg)" : "rotateY(0)" }}>
                  {/* Front */}
                  <div style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    background: "#fff", borderRadius: 20,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: 24, textAlign: "center",
                  }}>
                    <div style={{
                      width: 96, height: 96, background: "linear-gradient(135deg, #fff7ed, #f0fdf4)",
                      borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 40, marginBottom: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}>
                      {cat.icon}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1f2937", marginBottom: 8, lineHeight: 1.3 }}>{cat.name}</h3>
                    <div style={{ width: 48, height: 4, background: "linear-gradient(90deg, #f97316, #22c55e)", borderRadius: 9999, margin: "0 auto 12px" }} />
                    <p style={{ color: "#6b7280", fontSize: 13 }}>{cat.shortDesc}</p>
                    <div style={{ marginTop: 16, color: "#f97316", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      Explore →
                    </div>
                  </div>

                  {/* Back */}
                  <div style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "linear-gradient(135deg, #111827, #1f2937)",
                    borderRadius: 20, padding: 24,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    border: "1px solid rgba(249,115,22,0.2)",
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, background: "rgba(249,115,22,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                          {cat.icon}
                        </div>
                        <span style={{ fontSize: 11, background: "rgba(34,197,94,0.2)", color: "#4ade80", padding: "3px 8px", borderRadius: 9999 }}>
                          #{idx + 1}
                        </span>
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{cat.name}</h4>
                      <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #f97316, #22c55e)", borderRadius: 9999, marginBottom: 10 }} />
                      <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.6 }}>{cat.description}</p>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Career Mitra team, I want to know more details about ${cat.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}
                    >
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>Want to know more details?</span>
                      <span style={{ color: "#fb923c", fontSize: 11 }}>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );
}