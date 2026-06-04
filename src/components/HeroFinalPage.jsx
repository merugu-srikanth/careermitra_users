import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaBell,
    FaUserGraduate,
    FaUniversity,
    FaGraduationCap,
    FaHandshake,
    FaArrowRight,
    FaUserPlus,
    FaBriefcase,
    FaChartLine,
    FaUserTie,
    FaFire,
    FaCompass,
} from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";


const ANNOUNCEMENT_API_BASE =
    import.meta.env.VITE_ANNOUNCEMENT_API_BASE || "https://www.careermitra.tech";

const fmtDate = (v) => {
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const CARDS = [
    {
        id: 1,
        title: "Student Dashboard",
        icon: FaUserGraduate,
        iconBg: "#ede9fe",
        iconColor: "#7c3aed",
        accentColor: "#7c3aed",
        badgeBg: "linear-gradient(135deg,#7c3aed,#a855f7)",
        btnGrad: "linear-gradient(135deg,#7c3aed,#c026d3)",
        btnIcon: FaUserPlus,
        description:
            "Get job alerts by email and manage your profile for better career opportunities.",
        button: "Free Registration",
        link: "/register",
    },
    {
        id: 2,
        title: "Latest Govt Jobs",
        icon: FaUniversity,
        iconBg: "#dbeafe",
        iconColor: "#2563eb",
        accentColor: "#2563eb",
        badgeBg: "linear-gradient(135deg,#2563eb,#6366f1)",
        btnGrad: "linear-gradient(135deg,#2563eb,#4f46e5)",
        btnIcon: FaBriefcase,
        description:
            "Browse the latest government job openings and apply for suitable positions easily.",
        button: "View Jobs",
        link: "/jobs",
    },
    {
        id: 3,
        title: "Internship & SkillUp",
        icon: FaGraduationCap,
        iconBg: "#d1fae5",
        iconColor: "#059669",
        accentColor: "#059669",
        badgeBg: "linear-gradient(135deg,#059669,#10b981)",
        btnGrad: "linear-gradient(135deg,#059669,#16a34a)",
        btnIcon: FaChartLine,
        description:
            "Explore internships and skill programs to improve knowledge and career growth.",
        button: "Explore Now",
        link: "/internship-guide",
    },
    {
        id: 4,
        title: "Career Guidance",
        icon: FaCompass,
        iconBg: "#ffedd5",
        iconColor: "#ea580c",
        accentColor: "#f97316",
        badgeBg: "linear-gradient(135deg,#f97316,#f59e0b)",
        btnGrad: "linear-gradient(135deg,#ea580c,#d97706)",
        btnIcon: FaArrowRight,
        description:
            "Receive expert guidance for career planning, education choices, and job readiness.",
        button: "Get Guidance",
        link: "/contact-us",
    },
    // {
    //     id: 5,
    //     title: "Vendor Registration",
    //     icon: FaHandshake,
    //     iconBg: "#ffedd5",
    //     iconColor: "#ea580c",
    //     accentColor: "#f97316",
    //     badgeBg: "linear-gradient(135deg,#f97316,#f59e0b)",
    //     btnGrad: "linear-gradient(135deg,#ea580c,#d97706)",
    //     btnIcon: FaUserTie,
    //     description:
    //         "Register as a vendor and collaborate with us for various opportunities.",
    //     button: "Register Now",
    //     link: "/coming-soon",
    // },

];

/* ─────────────────────────────────────────
   VERTICAL ANNOUNCEMENTS PANEL
   • RAF-based scroll — no duplicates
   • Height locked to flex-stretch (matches cards)
   • Pauses on hover, resumes on leave
───────────────────────────────────────── */
function VerticalAnnouncements() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    /* refs for the scroll loop — never cause re-renders */
    const viewportRef = useRef(null); // overflow:hidden container
    const trackRef = useRef(null); // the moving element
    const rafRef = useRef(null);
    const posRef = useRef(0);
    const pauseRef = useRef(false);

    /* fetch once */
    useEffect(() => {
        axios
            .get(`${ANNOUNCEMENT_API_BASE}/api/announcements`, {
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                const data = Array.isArray(res?.data?.data) ? res.data.data : [];
                setList(
                    data
                        .filter((a) => a.status === "active")
                        .map((a) => ({
                            id: a.id || a._id || "",
                            title: a.title || "Announcement",
                            slug: a.slug || "",
                            date: a.date || a.publishedAt || a.created_at || null,
                        }))
                );
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const shouldScroll = list.length > 2;

    /* start / restart RAF loop whenever list changes */
    useEffect(() => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        posRef.current = 0;
        track.style.transform = "translateY(0px)";

        if (!shouldScroll) return;

        const SPEED = 0.45; // px per frame (~27px/s at 60 fps)

        const tick = () => {
            if (!pauseRef.current) {
                posRef.current += SPEED;
                const maxScroll = track.scrollHeight - viewport.clientHeight;
                /* seamless loop: once the track scrolls its full height, reset */
                if (maxScroll > 0 && posRef.current >= maxScroll) {
                    posRef.current = 0;
                }
                track.style.transform = `translateY(-${posRef.current}px)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [list, shouldScroll]);

    const pause = () => { pauseRef.current = true; };
    const resume = () => { pauseRef.current = false; };

    return (
        <div
            className="h-full flex flex-col rounded-3xl overflow-hidden"
            style={{
                boxShadow: "0 4px 24px rgba(109,40,217,0.10), 0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #ede9fe",
                background: "#fff",
            }}
        >
            {/* ── Header ── */}
            <style>{`
              @keyframes ann-shake {
                0%,100% { transform: rotate(0deg) scale(1); }
                10%      { transform: rotate(-18deg) scale(1.1); }
                20%      { transform: rotate(14deg) scale(1.1); }
                30%      { transform: rotate(-12deg) scale(1.05); }
                40%      { transform: rotate(9deg) scale(1.05); }
                50%      { transform: rotate(-6deg); }
                60%      { transform: rotate(4deg); }
                70%      { transform: rotate(-2deg); }
              }
              .ann-shake-icon {
                display: inline-block;
                animation: ann-shake 1.8s ease-in-out infinite;
                transform-origin: bottom center;
              }
            `}</style>
            <div className="shrink-0 px-5 py-4 relative overflow-hidden bg-linear-to-r from-purple-600 to-purple-800">
                <div
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle,#a78bfa,transparent)" }}
                />
                <div
                    className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-15"
                    style={{ background: "radial-gradient(circle,#818cf8,transparent)" }}
                />
                <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <GrAnnounce className="text-white ann-shake-icon" style={{ fontSize: 28 }} />
                        </div>
                        <div>
                            <p className="font-black text-white text- leading-none tracking-wide">Announcements</p>
                            <p className="text-[11px] text-violet-200 mt-0.5 font-medium">
                                {loading ? "Loading…" : `${list.length} active updates`}
                            </p>
                        </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-200 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                        <FaFire style={{ color: "#fbbf24", fontSize: 9 }} />
                        Live
                    </span>
                </div>
            </div>

            {/* ── Scroll viewport (fixed height = flex-1, never grows) ── */}
            <div
                ref={viewportRef}
                className="flex-1 overflow-hidden relative min-h-0 bg-white"
            >
                {/* top + bottom fade overlays */}
                <div className="absolute top-0 inset-x-0 h-6 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom,#fff,transparent)" }} />
                <div className="absolute bottom-0 inset-x-0 h-6 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to top,#fff,transparent)" }} />

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-8 h-8 rounded-full animate-spin"
                            style={{ border: "2px solid #ede9fe", borderTopColor: "#7c3aed" }} />
                        <p className="text-xs text-slate-400 font-medium">Loading…</p>
                    </div>
                ) : list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                            <FaBell className="text-violet-200 text-xl" />
                        </div>
                        <p className="text-slate-400 text-sm font-semibold">No announcements yet</p>
                    </div>
                ) : (
                    /* track — translated by RAF, NOT doubled */
                    <div
                        ref={trackRef}
                        className="pt-2 will-change-transform"
                        onMouseEnter={pause}
                        onMouseLeave={resume}
                    >
                        {list.map((item) => (
                            <button
                                key={item.id || item.slug}
                                type="button"
                                onClick={() => item.slug ? navigate(`/announcements/${item.slug}`) : null}
                                className="group w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-violet-50/60 transition-colors flex items-start gap-3"
                            >
                                <span className="w-2 h-2 rounded-full shrink-0 mt-1.5 group-hover:scale-125 transition-transform"
                                    style={{ background: "#7c3aed" }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
                                        {item.title}
                                    </p>
                                    {item.date && (
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                            {fmtDate(item.date)}
                                        </p>
                                    )}
                                </div>
                                <FaArrowRight className="text-violet-300 group-hover:text-violet-500 text-[10px] shrink-0 mt-1 transition-all group-hover:translate-x-0.5" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-4 py-3 border-t border-violet-50 bg-violet-50/40">
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors py-1.5 rounded-xl hover:bg-violet-100"
                >
                    View All Announcements
                    <FaArrowRight style={{ fontSize: 9 }} />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   FEATURE CARD  (responsive)
───────────────────────────────────────── */
function FeatureCard({ card }) {
    const navigate = useNavigate();
    const Icon = card.icon;
    const BtnIcon = card.btnIcon;

    return (
        <div
            onClick={() => navigate(card.link)}
            className="bg-white flex flex-col overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5"
            style={{
                borderRadius: 20,
                border: "1px solid #f1f5f9",
                borderTop: `3px solid ${card.accentColor}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                    "0 16px 36px rgba(0,0,0,0.11), 0 4px 10px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
            }}
        >
            {/* Icon area — smaller on mobile */}
            <div className="pt-5 sm:pt-7 pb-1 flex flex-col items-center gap-2 sm:gap-3">
                <div
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: card.iconBg }}
                >
                    <Icon style={{ color: card.iconColor, fontSize: 26 }} />
                </div>
                {/* step badge */}
                <span
                    className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow"
                    style={{ background: card.badgeBg }}
                >
                    {card.id}
                </span>
            </div>

            {/* Content */}
            <div className="px-3 sm:px-5 pt-1 pb-1 flex-1 flex flex-col text-center">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1 sm:mb-2">
                    {card.title}
                </h3>
                <p className="text-[10px] sm:text-[12px] text-slate-500 leading-relaxed flex-1 hidden sm:block">
                    {card.description}
                </p>
            </div>

            {/* CTA */}
            <div className="px-3 sm:px-5 pb-4 sm:pb-6 pt-2 sm:pt-3">
                <button
                    className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-3 text-white text-[11px] sm:text-[13px] font-bold rounded-xl sm:rounded-2xl transition-all hover:opacity-90 active:scale-95"
                    style={{ background: card.btnGrad }}
                >
                    <BtnIcon style={{ fontSize: 11 }} />
                    <span className="truncate">{card.button}</span>
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function HeroFinalPage() {
    return (
        <section className="bg-white w-full py-25 sm:py-24 xl:py-28">
            <div className="w-full px-4 sm:px-6 xl:px-12">

                {/* ── Section heading ── */}
                <div className="text-center mb-14">
                    <span
                        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-5"
                        style={{
                            color: "#ea580c",
                            background: "#fff7ed",
                            borderColor: "#fed7aa",
                        }}
                    >
                        <FaFire style={{ color: "#f97316", fontSize: 10 }} />
                        Let your career be, an informed choice… not a forced decision
                    </span>

                    <h2
                        className="text-2xl sm:text-6xl font-black leading-tight tracking-tight"
                        style={{ color: "#0f172a" }}
                    >
                        Welcome to   {" "}
                        <span
                            className="  text-orange-500"

                        >
                            Careermitra
                        </span>
                    </h2>

                    {/* <p
            className="mt-4 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "#64748b" }}
          >
            Everything you need to advance your career in one place
          </p> */}
                </div>

                {/* ── Cards + Announcements ── */}
                <div className="flex flex-col xl:flex-row gap-5 items-stretch w-full">

                    {/* Cards — 2 col on mobile/tablet, 4 col on xl */}
                    <div className="w-full xl:w-[75%] grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
                        {CARDS.map((card) => (
                            <FeatureCard key={card.id} card={card} />
                        ))}
                    </div>

                    {/* Announcements — full width below cards on mobile, 40% on xl */}
                    <div className="w-full xl:w-[40%] min-h-[440px] xl:min-h-[360px]">
                        <VerticalAnnouncements />
                    </div>

                </div>

            </div>
        </section>
    );
}
