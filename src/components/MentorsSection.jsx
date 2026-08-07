"use client";

import { motion } from "framer-motion";
import { FaGraduationCap, FaAward, FaBuilding, FaUserTie } from "react-icons/fa";

const mentors = [
  {
    name: "Chirra Achalender Reddy, IFS (Retd)",
    role: "Former Chairman, National Biodiversity Authority, Govt of India",
    domain: "Environmental Governance & Forestry Service",
    bio: "An eminent Indian Forest Service officer who served as the Chairman of the National Biodiversity Authority. He brings deep experience in national-level policymaking, biodiversity conservation, and public administration.",
    highlights: [
      "Former Chairman of National Biodiversity Authority",
      "Distinguished Indian Forest Service (IFS) officer",
      "Expertise in environmental policies & public sector leadership"
    ],
    avatar: "CA",
    gradFrom: "#d97706", // Amber-600
    gradTo: "#b45309",   // Amber-700
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-100",
    accentText: "text-amber-700",
    dotColor: "bg-amber-500",
    tag: "Distinguished Mentor"
  },
  {
    name: "Sri Tadakamalla Vivek",
    role: "Former Member, Telangana Government Public Service Commission (TGPSC)",
    domain: "Public Administration & Selection Board Expert",
    bio: "An experienced administrator and former member of the TGPSC. His inside knowledge of state public service exams and recruitment methodologies is invaluable to civil services and state service aspirants.",
    highlights: [
      "Former board member of TGPSC",
      "Specialist in government recruitment processes",
      "Dedicated mentor for state civil services exams"
    ],
    avatar: "TV",
    gradFrom: "#3b82f6", // Blue-500
    gradTo: "#1d4ed8",   // Blue-700
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-100",
    accentText: "text-blue-700",
    dotColor: "bg-blue-500",
    tag: "Distinguished Mentor"
  },
  {
    name: "V. Usharani, IAS (Retd)",
    role: "Retired Indian Administrative Service Officer",
    domain: "Civil Services & Governance Excellence",
    bio: "A highly respected retired IAS officer who led key administrative roles and government initiatives. She is passionate about guiding the next generation of civil servants and public leaders.",
    highlights: [
      "Retired Indian Administrative Service (IAS) officer",
      "Decades of governance and administrative leadership",
      "Mentor for civil service strategy and career vision"
    ],
    avatar: "VU",
    gradFrom: "#10b981", // Emerald-500
    gradTo: "#047857",   // Emerald-700
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    accentText: "text-emerald-700",
    dotColor: "bg-emerald-500",
    tag: "Distinguished Mentor"
  }
];

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

export default function MentorsSection() {
  return (
    <section className="relative w-full py-16 bg-slate-50 border-t border-b border-slate-100">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 mb-4"
        >
          <FaUserTie size={14} className="shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">Our Advisors & Mentors</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4"
        >
          Guided by{" "}
          <span className="bg-gradient-to-r from-amber-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Distinguished Leaders
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Aspirants gain invaluable direction from retired IAS, IFS, and public service commission officers who have shaped policies at national and state levels.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="w-full px-4 md:px-15 relative z-10 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-8 w-full"
        >
          {mentors.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="group relative h-full flex flex-col"
            >
              {/* Card Container */}
              <div className={`h-full bg-white rounded-3xl border ${member.accentBorder} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}>
                <div className="h-2 w-full" style={{ backgroundImage: `linear-gradient(to right, ${member.gradFrom}, ${member.gradTo})` }} />

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      {/* <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0" 
                        style={{ backgroundImage: `linear-gradient(to bottom right, ${member.gradFrom}, ${member.gradTo})` }}
                      >
                        {member.avatar}
                      </div> */}
                      <div>
                        <h3 className="font-black text-slate-800 text-lg leading-snug">{member.name}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${member.accentText} bg-opacity-70 ${member.accentBg} px-2.5 py-0.5 rounded-md mt-1 inline-block`}>
                          {member.tag}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Designation */}
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <FaBuilding className="shrink-0" size={11} /> Former Role / Organization
                        </p>
                        <p className="text-sm font-semibold text-slate-700 leading-snug">
                          {member.role}
                        </p>
                      </div>



                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
