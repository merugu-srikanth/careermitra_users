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
    import.meta.env.VITE_ANNOUNCEMENT_API_BASE || "https://www.careermitra.in";

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
            "Register and stay updated with profile-based job alerts on email and your dashboard.",
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
            "Explore the Latest Jobs & Apply Instantly.",
        button: "View Jobs",
        link: "/latest-job-notifications",
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
            "Explore internships and skill-up programs to accelerate your career.",
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
            "Expert guidance for career planning, education and job readiness.",
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
   COMPACT ANNOUNCEMENTS — mobile / tablet only
───────────────────────────────────────── */
function CompactAnnouncements({ list, loading }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    return (
        <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "#ede9fe", boxShadow: "0 2px 12px rgba(109,40,217,0.08)" }}
        >
            {/* header — always visible, tap to expand */}
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-800"
            >
                <div className="flex items-center gap-2.5">
                    <GrAnnounce className="text-white shrink-0" style={{ fontSize: 20 }} />
                    <div className="text-left">
                        <p className="text-sm font-black text-white leading-none">Announcements</p>
                        <p className="text-[10px] text-violet-200 mt-0.5">
                            {loading ? "Loading…" : `${list.length} active updates`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-200 bg-white/10 border border-white/15 px-2 py-0.5 rounded-full">
                        <FaFire style={{ color: "#fbbf24", fontSize: 8 }} /> Live
                    </span>
                    <FaArrowRight
                        className="text-white/70 transition-transform duration-200"
                        style={{ fontSize: 11, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                </div>
            </button>

            {/* collapsible body */}
            {open && (
                <div className="max-h-52 overflow-y-auto divide-y divide-slate-50 bg-white">
                    {loading ? (
                        <div className="flex items-center justify-center py-6 gap-2">
                            <div className="w-5 h-5 rounded-full animate-spin"
                                style={{ border: "2px solid #ede9fe", borderTopColor: "#7c3aed" }} />
                            <p className="text-xs text-slate-400">Loading…</p>
                        </div>
                    ) : list.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No announcements yet</p>
                    ) : (
                        list.map((item) => (
                            <button
                                key={item.id || item.slug}
                                type="button"
                                onClick={() => item.slug && navigate(`/announcements/${item.slug}`)}
                                className="w-full text-left px-4 py-2.5 hover:bg-violet-50/60 flex items-start gap-2.5 transition-colors"
                            >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "#7c3aed" }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">{item.title}</p>
                                    {item.date && <p className="text-[10px] text-slate-400 mt-0.5">{fmtDate(item.date)}</p>}
                                </div>
                                <FaArrowRight className="text-violet-300 text-[9px] shrink-0 mt-1" />
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────
   VERTICAL ANNOUNCEMENTS PANEL
   • RAF-based scroll — no duplicates
   • Height locked to flex-stretch (matches cards)
   • Pauses on hover, resumes on leave
───────────────────────────────────────── */
function VerticalAnnouncements({ list, loading }) {
    const navigate = useNavigate();

    /* refs for the scroll loop — never cause re-renders */
    const viewportRef = useRef(null); // overflow:hidden container
    const trackRef = useRef(null); // the moving element
    const rafRef = useRef(null);
    const posRef = useRef(0);
    const pauseRef = useRef(false);

    const shouldScroll = list.length > 0;

    /* start / restart RAF loop whenever list changes */
    useEffect(() => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        posRef.current = 0;
        track.style.transform = "translateY(0px)";

        if (!shouldScroll) return;

        const SPEED = 0.22; // px per frame — slow readable scroll

        const tick = () => {
            if (!pauseRef.current) {
                posRef.current += SPEED;
                /* seamless loop: list is doubled — reset at exactly half the track height */
                const halfHeight = track.scrollHeight / 2;
                if (halfHeight > 0 && posRef.current >= halfHeight) {
                    posRef.current -= halfHeight;
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
                    /* track — list doubled for seamless loop */
                    <div
                        ref={trackRef}
                        className="will-change-transform"
                        onMouseEnter={pause}
                        onMouseLeave={resume}
                    >
                        {[...list, ...list].map((item, idx) => (
                            <button
                                key={`${item.id || item.slug}-${idx}`}
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
            {/* <div className="shrink-0 px-4 py-3 border-t border-violet-50 bg-violet-50/40">
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors py-1.5 rounded-xl hover:bg-violet-100"
                >
                    View All Announcements
                    <FaArrowRight style={{ fontSize: 9 }} />
                </button>
            </div> */}
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
            {/* Icon area */}
            <div className="pt-4 sm:pt-6 pb-1 flex flex-col items-center gap-2">
                <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: card.iconBg }}
                >
                    <Icon style={{ color: card.iconColor, fontSize: 22 }} />
                </div>
                {/* step badge */}
                {/* <span
                    className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow"
                    style={{ background: card.badgeBg }}
                >
                    {card.id}
                </span> */}
            </div>

            {/* Content */}
            <div className="px-3 sm:px-4 pt-1 pb-1 flex-1 flex flex-col text-center">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1">
                    {card.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed flex-1">
                    {card.description}
                </p>
            </div>

            {/* CTA */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-5 pt-2">
                <button
                    className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all hover:opacity-90 active:scale-95"
                    style={{ background: card.btnGrad }}
                >
                    <BtnIcon style={{ fontSize: 10 }} />
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
    const [annList, setAnnList] = useState([]);
    const [annLoading, setAnnLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${ANNOUNCEMENT_API_BASE}/api/announcements`, {
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                const data = Array.isArray(res?.data?.data) ? res.data.data : [];
                setAnnList(
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
            .catch(() => {})
            .finally(() => setAnnLoading(false));
    }, []);

    return (
        <section className="bg-white w-full py-8 sm:py-12 xl:py-16">
            <div className="w-full px-4 sm:px-6 xl:px-10">

                {/* ── Section heading ── */}
                <div className="text-center mb-6 sm:mb-8 xl:mb-10">
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
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 items-stretch w-full">

                    {/* Cards — 2 col on mobile/tablet, 4 col on xl+ */}
                    <div className="w-full xl:flex-1 grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
                        {CARDS.map((card) => (
                            <FeatureCard key={card.id} card={card} />
                        ))}
                    </div>

                    {/* Announcements */}
                    <div className="w-full xl:w-96 xl:shrink-0">
                        {/* Mobile/tablet: compact collapsible strip */}
                        <div className="xl:hidden">
                            <CompactAnnouncements list={annList} loading={annLoading} />
                        </div>
                        {/* Desktop: full vertical scroll panel — fixed 250px */}
                        <div className="hidden xl:flex xl:flex-col" style={{ height: 250 }}>
                            <VerticalAnnouncements list={annList} loading={annLoading} />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
