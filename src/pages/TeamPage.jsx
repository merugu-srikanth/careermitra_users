import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaBriefcase, FaCrown, FaUsers } from "react-icons/fa";
import SEO from "../components/SEO";

const FOUNDERS = [
  {
    name: "Srikanth Merugu",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    desc: "Driving the vision and overall strategy of CareerMitra to empower job seekers across India.",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Thrinath Gaddam",
    role: "Co-Founder & CTO",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    desc: "Overseeing technical architecture and platform innovations for seamless user experiences.",
    socials: { linkedin: "#", github: "#" }
  }
];

const TEAM_MEMBERS = [
  {
    name: "Emma Watson",
    role: "Chief Operating Officer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
    desc: "Managing daily operations and organizing structural workflows for maximum efficiency.",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Sophia Loren",
    role: "Head of Marketing",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    desc: "Leading outreach campaigns and digital marketing initiatives to connect with aspirants.",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Aarav Mehta",
    role: "Lead Software Developer",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80",
    desc: "Building scalable features and frontend applications for high performance.",
    socials: { linkedin: "#", github: "#" }
  },
  {
    name: "Elena Rostova",
    role: "Lead Product Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
    desc: "Crafting beautiful, accessible, and intuitive UI designs for CareerMitra users.",
    socials: { linkedin: "#", github: "#" }
  }
];

export default function TeamPage() {
  return (
    <>
      <SEO
        title="Meet Our Team — Careermitra"
        description="Get to know the founders and core experts behind Careermitra who are passionate about building pathways to employment."
      />

      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 pt-24 pb-20">
        
        {/* Hero Section */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 mb-4 text-indigo-600">
            <FaUsers size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">Our People</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Meet <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Experts</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Driven by innovation, guided by accuracy, and dedicated to connecting India's youth with the right career choices.
          </p>
        </div>

        {/* Main Team Showcase Container */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-24">

          {/* ── 1. FOUNDERS SECTION (Premium Landscape/Wide Cards) ── */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-10">
              <span className="h-px w-8 bg-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide flex items-center gap-2">
                <FaCrown className="text-amber-500" size={16} /> Leadership / Founders
              </h2>
              <span className="h-px w-8 bg-amber-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FOUNDERS.map((founder, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Founder Image */}
                  <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-md">
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Founder Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/50 mb-2">
                      Co-Founder
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{founder.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">{founder.role}</p>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{founder.desc}</p>
                    
                    {/* Socials */}
                    <div className="flex justify-center sm:justify-start items-center gap-3 mt-4">
                      {founder.socials.linkedin && (
                        <a href={founder.socials.linkedin} className="text-slate-400 hover:text-indigo-600 transition-colors">
                          <FaLinkedin size={15} />
                        </a>
                      )}
                      {founder.socials.twitter && (
                        <a href={founder.socials.twitter} className="text-slate-400 hover:text-sky-500 transition-colors">
                          <FaTwitter size={15} />
                        </a>
                      )}
                      {founder.socials.github && (
                        <a href={founder.socials.github} className="text-slate-400 hover:text-slate-900 transition-colors">
                          <FaGithub size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. CORE TEAM SECTION (Clean Grid Cards) ── */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-10">
              <span className="h-px w-8 bg-indigo-300" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide flex items-center gap-2">
                <FaBriefcase className="text-indigo-600" size={16} /> Core Team / Experts
              </h2>
              <span className="h-px w-8 bg-indigo-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {TEAM_MEMBERS.map((member, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col items-center text-center shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Portrait Avatar */}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden p-1 bg-linear-to-br from-indigo-500 to-purple-500 shadow-md mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{member.name}</h3>
                  <p className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-wider">{member.role}</p>
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-[180px]">
                    {member.desc}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-4">
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <FaLinkedin size={14} />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} className="text-slate-400 hover:text-sky-500 transition-colors">
                        <FaTwitter size={14} />
                      </a>
                    )}
                    {member.socials.github && (
                      <a href={member.socials.github} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <FaGithub size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
