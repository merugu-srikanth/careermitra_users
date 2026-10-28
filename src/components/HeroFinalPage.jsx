"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
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
    FaWhatsapp,
    FaBookOpen,
    FaCode,
    FaCogs,
    FaChartBar,
    FaRocket,
} from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
import HeroVideoModal from "./HeroVideoModal";
import HeroPrimaryVideo from "./HeroPrimaryVideo";
import heroStudent from "../assets/hero-student2.jpeg";


const ANNOUNCEMENT_API_BASE =
    (process.env.NEXT_PUBLIC_ANNOUNCEMENT_API_BASE || process.env.VITE_ANNOUNCEMENT_API_BASE) || "https://www.careermitra.in";

const fmtDate = (v) => {
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
};

const CARDS = [
    {
        id: 1,
        title: "Student Dashboard",
        icon: FaUserGraduate,
        iconBg: "#ede9fe",
        iconColor: "#7c3aed",
        cornerGlow: "radial-gradient(circle at top right, rgba(168, 85, 247, 0.16) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 70%)",
        btnGrad: "linear-gradient(135deg, #7c3aed, #9333ea)",
        description:
            "Register once and get job alerts matched to your profile by email and through your dashboard.",
        button: "Register Free",
        link: "/register",
    },
    {
        id: 2,
        title: "Latest Govt Jobs",
        icon: FaUniversity,
        iconBg: "#dbeafe",
        iconColor: "#2563eb",
        cornerGlow: "radial-gradient(circle at top right, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%)",
        btnGrad: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        description:
            "Browse open vacancies with eligibility details and official application links.",
        button: "View Jobs",
        link: "/latest-job-notifications",
    },
    {
        id: 3,
        title: "Internships / SkillUps",
        icon: FaGraduationCap,
        iconBg: "#ffedd5",
        iconColor: "#ea580c",
        cornerGlow: "radial-gradient(circle at top right, rgba(249, 115, 22, 0.16) 0%, rgba(249, 115, 22, 0.04) 50%, transparent 70%)",
        btnGrad: "linear-gradient(135deg, #ea580c, #f97316)",
        description:
            "Find internships and skill programs that strengthen your profile.",
        button: "Explore Now",
        link: "/internships",
    },
    {
        id: 4,
        title: "PG Entrance",
        icon: FaBookOpen,
        iconBg: "#ecfdf5",
        iconColor: "#059669",
        cornerGlow: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.04) 50%, transparent 70%)",
        btnGrad: "linear-gradient(135deg, #059669, #10b981)",
        description:
            "Track All India, State, and Institute PG entrance exams with direct apply links.",
        button: "Explore Now",
        link: "/pg-entrance",
    },
    {
        id: 5,
        title: "Digital Presence",
        icon: FaRocket,
        iconBg: "#e0f2fe",
        iconColor: "#0284c7",
        cornerGlow: "radial-gradient(circle at top right, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0.04) 50%, transparent 70%)",
        btnGrad: "linear-gradient(135deg, #0284c7, #2563eb)",
        description:
            "Websites, CRM and digital marketing to launch your business online with confidence.",
        button: "Explore Now",
        link: "/digital-presence",
        horizontal: true, // wide card at the bottom: text left, button right
    },
];


// Internal links inside paragraph text
const INLINE_LINK = "font-semibold text-orange-600 underline decoration-orange-300 underline-offset-2 hover:text-orange-700 hover:decoration-orange-500";

// "New Government Job Announcements" block — hidden (set to true to bring it back).
const SHOW_ANNOUNCEMENTS = false;

/* ─────────────────────────────────────────
   COMPACT ANNOUNCEMENTS — mobile / tablet only
───────────────────────────────────────── */
function CompactAnnouncements({ list, loading }) {
    const router = useRouter();
    const navigate = (to, options) => { if (options?.replace) { router.replace(to); } else { router.push(to); } };
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
                            <div
                                key={item.id || item.slug}
                                className="w-full px-4 py-2.5 hover:bg-violet-50/60 flex items-start gap-1.5 transition-colors"
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                                    style={{ background: "#7c3aed" }}
                                />

                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                                        {item.title}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {/* Date */}
                                        {item.date && (
                                            <span className="text-[10px] text-slate-400">
                                                {fmtDate(item.date)}
                                            </span>
                                        )}
                                        {/* Apply Now */}
                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                                                style={{ background: "linear-gradient(90deg,#f97316,#ea580c)" }}
                                            >
                                                Apply Now
                                                <svg width="8" height="8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow — ONLY this navigates to detail page */}
                                {item.slug && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/announcements/${item.slug}`)}
                                        className="shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                        style={{ background: "#ede9fe" }}
                                        aria-label={`View ${item.title}`}
                                    >
                                        <FaArrowRight className="text-violet-500" style={{ fontSize: 9 }} />
                                    </button>
                                )}
                            </div>
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
    const router = useRouter();
    const navigate = (to, options) => { if (options?.replace) { router.replace(to); } else { router.push(to); } };

    /* refs for the scroll loop — never cause re-renders */
    const viewportRef = useRef(null); // native scroll container (user can wheel/touch scroll it)
    const trackRef = useRef(null); // the doubled content, used only to measure height
    const rafRef = useRef(null);
    const posRef = useRef(0); // float accumulator — scrollTop itself rounds to an int, so we can't read it back as the source of truth
    const pauseRef = useRef(false);
    const resumeTimerRef = useRef(null);

    const shouldScroll = list.length > 0;

    /* start / restart RAF loop whenever list changes */
    useEffect(() => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        posRef.current = 0;
        viewport.scrollTop = 0;

        if (!shouldScroll) return;

        const SPEED = 0.22; // px per frame — slow readable scroll

        const tick = () => {
            if (!pauseRef.current) {
                /* seamless loop: list is doubled — reset at exactly half the track height */
                const halfHeight = track.scrollHeight / 2;
                posRef.current += SPEED;
                if (halfHeight > 0 && posRef.current >= halfHeight) {
                    posRef.current -= halfHeight;
                }
                viewport.scrollTop = posRef.current;
            } else {
                /* keep the accumulator in sync with any manual scrolling that happened while paused */
                posRef.current = viewport.scrollTop;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [list, shouldScroll]);

    /* pause auto-scroll while the user is actively interacting (hover, wheel,
       touch/drag), and resume automatically a moment after they stop —
       this lets manual scrolling work at any time without permanently
       killing the auto-scroll. */
    const clearResumeTimer = () => {
        if (resumeTimerRef.current) {
            window.clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
    };

    const pause = () => {
        clearResumeTimer();
        pauseRef.current = true;
    };

    const resume = () => {
        clearResumeTimer();
        pauseRef.current = false;
    };

    const pauseThenResume = (delay = 1500) => {
        clearResumeTimer();
        pauseRef.current = true;
        resumeTimerRef.current = window.setTimeout(() => {
            pauseRef.current = false;
        }, delay);
    };

    useEffect(() => clearResumeTimer, []);

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
              .ann-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #c4b5fd transparent;
              }
              .ann-scrollbar::-webkit-scrollbar {
                width: 5px;
              }
              .ann-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .ann-scrollbar::-webkit-scrollbar-thumb {
                background: #c4b5fd;
                border-radius: 999px;
              }
              .ann-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #a78bfa;
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

            {/* ── Scroll viewport (fixed height = flex-1, never grows) ──
                 overflow-y auto so the user can wheel/touch/drag scroll it
                 manually at any time; auto-scroll pauses while they do and
                 resumes shortly after they stop. */}
            <div
                ref={viewportRef}
                className="flex-1 overflow-y-auto relative min-h-0 bg-white ann-scrollbar"
                onMouseEnter={pause}
                onMouseLeave={resume}
                onWheel={() => pauseThenResume()}
                onTouchStart={pause}
                onTouchMove={() => pauseThenResume()}
                onTouchEnd={() => pauseThenResume()}
                onPointerDown={pause}
                onPointerUp={() => pauseThenResume()}
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
                    <div ref={trackRef}>
                        {[...list, ...list].map((item, idx) => (
                            <div
                                key={`${item.id || item.slug}-${idx}`}
                                className="w-full px-4 py-2.5 border-b border-slate-50 hover:bg-violet-50/40 transition-colors flex items-start gap-2.5 group"
                            >
                                <span className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                                    style={{ background: "#7c3aed" }} />

                                {/* Title + date */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        {item.date && (
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {fmtDate(item.date)}
                                            </span>
                                        )}
                                        {/* Apply Now */}
                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                                                style={{ background: "linear-gradient(90deg,#f97316,#ea580c)" }}
                                            >
                                                Apply Now
                                                <svg width="8" height="8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow — only this navigates to detail page */}
                                {item.slug && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/announcements/${item.slug}`, { state: { id: item.id } })}
                                        className="shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                        style={{ background: "#ede9fe" }}
                                        aria-label={`View ${item.title}`}
                                    >
                                        <FaArrowRight className="text-violet-500" style={{ fontSize: 9 }} />
                                    </button>
                                )}
                            </div>
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
   FEATURE CARD — icon, title, description, button.
   card.horizontal → wide card (icon + text in one row, no button).
───────────────────────────────────────── */
function FeatureCard({ card, className = "" }) {
    const router = useRouter();
    const handleClick = () => {
        if (card.isExternal) window.open(card.link, "_blank");
        else router.push(card.link);
    };
    const onKey = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } };
    const Icon = card.icon;
    const accent = card.iconColor;

    const iconBox = (size) => (
        <div
            className={`${size} rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
            style={{ background: card.iconBg, boxShadow: `0 6px 14px -6px ${accent}66, inset 0 0 0 1px ${accent}1f` }}
        >
            <Icon style={{ color: accent, fontSize: 17 }} />
        </div>
    );

    if (card.horizontal) {
        return (
            <div
                onClick={handleClick}
                onKeyDown={onKey}
                role="link"
                tabIndex={0}
                className={`${className} relative flex items-center gap-4 overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 px-4 py-4 sm:px-5 rounded-2xl`}
                style={{
                    background: `linear-gradient(110deg, #ffffff 55%, ${card.iconBg}cc 100%)`,
                    border: `1px solid ${accent}26`,
                    boxShadow: `0 10px 28px -20px ${accent}80`,
                }}
            >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.75" style={{ background: card.btnGrad }} />
                {/* Left ~80%: icon + text */}
                <div className="flex min-w-0 flex-1 sm:basis-[80%] items-center gap-3 sm:gap-4">
                    {iconBox("w-10 h-10 sm:w-11 sm:h-11")}
                    <div className="min-w-0 flex-1 text-left">
                        <h3 className="text-[13px] sm:text-[15px] font-extrabold text-slate-900 leading-tight">{card.title}</h3>
                        <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-relaxed">{card.description}</p>
                    </div>
                </div>

                {/* Right ~20%: button, vertically centred */}
                <div className="flex shrink-0 sm:basis-[20%] items-center justify-center self-stretch">
                    <span
                        className="hero-card-btn relative flex w-full items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap px-3 py-2 sm:py-2.5 text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02]"
                        style={{
                            background: card.btnGrad,
                            "--btn-glow": `${accent}99`,
                            "--shine-delay": `${(card.id - 1) * 0.6}s`,
                        }}
                        suppressHydrationWarning={true}
                    >
                        <span className="hero-card-btn-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3" aria-hidden="true" />
                        <span className="relative">{card.button}</span>
                        <FaArrowRight size={10} className="hero-card-btn-arrow relative shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            onKeyDown={onKey}
            role="link"
            tabIndex={0}
            className={`${className} relative flex flex-col justify-between overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 p-3.5 sm:p-4 rounded-2xl`}
            style={{
                background: `linear-gradient(160deg, #ffffff 55%, ${card.iconBg}aa 100%)`,
                border: `1px solid ${accent}22`,
                boxShadow: `0 10px 28px -20px ${accent}80`,
            }}
        >
            {/* Coloured top edge */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.75" style={{ background: card.btnGrad }} />
            {/* Dotted texture in the top-right corner */}
            <div
                className="pointer-events-none absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    backgroundImage: `radial-gradient(${accent}2e 1px, transparent 1.2px)`,
                    backgroundSize: "11px 11px",
                    WebkitMaskImage: "radial-gradient(circle at 100% 0%, #000 0%, transparent 55%)",
                    maskImage: "radial-gradient(circle at 100% 0%, #000 0%, transparent 55%)",
                }}
            />
            <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full transition-transform duration-500 group-hover:scale-110"
                style={{ border: `1.5px solid ${accent}1a` }} />

            <div className="relative z-10 text-left">
                {/* {iconBox("w-9 h-9 sm:w-10 sm:h-10 mb-2.5 sm:mb-3")} */}
                <h3 className="text-[13px] sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                    {card.title}
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {card.description}
                </p>
            </div>

            <div className="relative z-10 mt-3 sm:mt-4">
                <span
                    className="hero-card-btn relative w-full flex items-center justify-center gap-1.5 overflow-hidden py-2 sm:py-2.5 text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.02]"
                    style={{
                        background: card.btnGrad,
                        "--btn-glow": `${accent}99`,
                        "--shine-delay": `${(card.id - 1) * 0.6}s`,
                    }}
                    suppressHydrationWarning={true}
                >
                    {/* Light shine that sweeps across every few seconds */}
                    <span className="hero-card-btn-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/3" aria-hidden="true" />
                    <span className="relative truncate">{card.button}</span>
                    <FaArrowRight size={10} className="hero-card-btn-arrow relative shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SECTION HEADING (shared by the home blocks)
───────────────────────────────────────── */
function BlockHeading({ title, children }) {
    return (
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {title}
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
            {children && (
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">{children}</p>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────
   BLOCK 3 — NEW GOVERNMENT JOB ANNOUNCEMENTS
───────────────────────────────────────── */
function AnnouncementsBlock({ list, loading }) {
    return (
        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
            {/* Text */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-orange-50/60 p-6 sm:p-8 flex flex-col justify-center">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-200">
                        <GrAnnounce className="text-white" style={{ fontSize: 24 }} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                        New Government Job Announcements: Stay Updated
                    </h2>
                    <div className="mt-3 h-1 w-16 rounded-full bg-linear-to-r from-purple-600 to-orange-500" />
                    <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-slate-600">
                        This panel lists recent recruitment notices from UPSC, SSC, and IBPS. It also covers public sector banks, high courts, and state public service commissions. Check the notice date and the last date for each job. Then read the full notification before you apply. Use this section to find relevant openings. Confirm the eligibility, application steps, and deadlines in the official notification.
                    </p>
                    <Link
                        href="/latest-job-notifications"
                        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-300"
                    >
                        Apply Now
                        <FaArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            {/* Live list */}
            <div className="lg:col-span-3 flex flex-col h-90 lg:h-auto lg:min-h-95">
                <VerticalAnnouncements list={list} loading={loading} />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function HeroFinalPage({ initialAnnouncements = [] }) {
    const { token } = useAuth();
    const [annList, setAnnList] = useState(initialAnnouncements);
    const [annLoading, setAnnLoading] = useState(initialAnnouncements.length === 0);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const dynamicCards = CARDS.map((card) => {
        if (card.id === 1 && mounted && token) {
            return {
                ...card,
                button: "Go to Dashboard",
                btnIcon: FaArrowRight,
                link: "/user-dashboard",
            };
        }
        return card;
    });

    useEffect(() => {
        if (!SHOW_ANNOUNCEMENTS || (initialAnnouncements && initialAnnouncements.length > 0)) {
            return;
        }
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
                            url: a.url || null,
                            date: a.date || a.publishedAt || a.created_at || null,
                        }))
                );
            })
            .catch(() => { })
            .finally(() => setAnnLoading(false));
    }, [initialAnnouncements]);

    return (
        <section className="relative w-full overflow-hidden bg-linear-to-br from-white via-white to-orange-50/40 py-8 sm:py-12 xl:py-14">
            {/* Soft background shapes */}
            <div className="pointer-events-none absolute -left-40 top-1/3 h-112 w-112 rounded-full bg-orange-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-green-100/50 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />

            <div className="relative w-full px-4 md:px-15 mx-auto">

                {/* ── BLOCK 1 (left, with student photo) + BLOCK 2 cards (right) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 lg:gap-8 xl:gap-12 items-start">

                {/* Left: hero text + photo */}
                <div className="relative text-center lg:text-left">

                    {/* Student photo — large screens only, to the right of the text */}
                    <div className="pointer-events-none absolute inset-y-0 -right-2 hidden xl:flex items-center w-[38%]">
                        <div className="absolute right-0 top-[15%] h-[70%] w-[110%] rounded-full bg-linear-to-br from-orange-100/60 via-orange-50/40 to-transparent blur-3xl" />
                        <img
                            src={heroStudent.src || heroStudent}
                            alt=""
                            aria-hidden="true"
                            className="relative w-full h-auto max-h-full object-contain"
                            style={{
                                // multiply: the photo's white background takes the page colour, so there is no white box
                                mixBlendMode: "multiply",
                                // soft fade on all four edges
                                WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 6%, #000 85%, transparent 100%)",
                                WebkitMaskComposite: "source-in",
                                maskImage: "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 6%, #000 85%, transparent 100%)",
                                maskComposite: "intersect",
                            }}
                        />
                    </div>

                    <div className="relative z-10 xl:max-w-[60%]">
                        <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50/80 text-orange-600 mb-5">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500 shadow-[0_0_0_3px_rgba(249,115,22,0.18)]" />
                            Find Your Direction Before You Take the Next Step
                        </span>

                        <h1 className="text-[1.85rem] sm:text-[2.5rem] xl:text-[1.80rem] font-black leading-[1.08] tracking-[-0.025em] text-slate-900">
                            <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                Government Jobs Notifications 
                            </span>{" "}
                            <span className="block mt-1">Recruitment Insights for Your Career Growth</span>
                        </h1>

                        <p className="mt-4 text-[15px] sm:text-base font-bold text-slate-800 leading-snug">
                            Government jobs, internships, SkillUps, and PG entrance matched to your profile
                        </p>

                        <div className="mt-3.5 space-y-3 text-[13.5px] sm:text-sm leading-[1.75] text-slate-600 max-w-2xl mx-auto lg:mx-0 lg:text-justify lg:hyphens-auto">
                            <p>
                                Finding the right opportunity should not take hours of searching. <Link href="/latest-job-notifications" className={INLINE_LINK}>Government job notifications</Link>, <Link href="/internships" className={INLINE_LINK}>internships</Link>, <Link href="/internships?tab=skillups" className={INLINE_LINK}>SkillUps</Link>, and <Link href="/pg-entrance" className={INLINE_LINK}>PG entrance</Link> updates are spread across many websites. Each department and state has its own portal. Careermitra brings them all to one place. You can see what fits your goals without checking dozens of sites every day.
                            </p>
                            <p>
                                Create a free profile to get updates that match you. They reach your email and your <Link href="/user-dashboard" className={INLINE_LINK}>Careermitra dashboard</Link>. Each listing shows the eligibility, the number of vacancies, and the last date to apply. It also links to the official notification, so you can check the details yourself and decide with confidence.
                            </p>
                        </div>

                        <HeroVideoModal label="Watch How to Register on Careermitra" />
                    </div>
                </div>

                {/* Right: pinned YouTube video + quick access cards */}
                <div className="relative z-10">
                    {/* The video pinned in the admin panel (Media Library → ★ Set home). */}
                    <HeroPrimaryVideo inline dismissible={false} />

                    <div className="text-center lg:text-left mb-4">
                        <h2 className="text-xl sm:text-[1.4rem] font-black tracking-tight text-slate-900 leading-tight">
                            The Right Path Starts With the Right Choice
                        </h2>
                        <div className="mx-auto lg:mx-0 mt-2 h-0.75 w-12 rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
                        <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">
                            Whether you&apos;re a student, a final-year candidate, or an experienced professional, start with what matters to you. Choose the option below that fits where you are right now.
                        </p>
                    </div>

                    {/* Card button animations: shine sweep, arrow nudge, glow on hover */}
                    <style>{`
                      @keyframes hero-btn-shine {
                        0%   { transform: translateX(0) skewX(-20deg); opacity: 0; }
                        8%   { opacity: 1; }
                        30%  { transform: translateX(480%) skewX(-20deg); opacity: 0; }
                        100% { transform: translateX(480%) skewX(-20deg); opacity: 0; }
                      }
                      @keyframes hero-btn-arrow {
                        0%, 100% { transform: translateX(0); }
                        50%      { transform: translateX(3px); }
                      }
                      .hero-card-btn {
                        box-shadow: 0 8px 16px -8px var(--btn-glow), inset 0 1px 0 rgba(255,255,255,0.25);
                      }
                      .group:hover .hero-card-btn {
                        box-shadow: 0 12px 24px -8px var(--btn-glow), inset 0 1px 0 rgba(255,255,255,0.3);
                      }
                      .hero-card-btn-shine {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
                        animation: hero-btn-shine 3.2s ease-in-out infinite;
                        animation-delay: var(--shine-delay);
                      }
                      .hero-card-btn-arrow {
                        animation: hero-btn-arrow 1.4s ease-in-out infinite;
                      }
                      .group:hover .hero-card-btn-arrow { animation-play-state: paused; }
                      @media (prefers-reduced-motion: reduce) {
                        .hero-card-btn-shine, .hero-card-btn-arrow { animation: none; }
                      }
                    `}</style>

                    {/* 2 cards per row; Digital Presence is the wide card at the bottom */}
                    <div className="grid grid-cols-2 gap-3">
                        {dynamicCards.map((card) => (
                            <FeatureCard key={card.id} card={card} className={card.horizontal ? "col-span-2" : ""} />
                        ))}
                    </div>
                </div>

                </div>

                {/* ── BLOCK 3: New Government Job Announcements ── */}
                {SHOW_ANNOUNCEMENTS && (
                    <AnnouncementsBlock list={annList} loading={annLoading} />
                )}

            </div>
        </section>
    );
}
