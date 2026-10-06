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
        cornerGlow: "radial-gradient(circle at top right, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%)",
        btnGrad: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        description:
            "Explore the Latest Jobs & Apply Instantly.",
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
            "Explore Internships / SkillUps to accelerate your career.",
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
            "Pan-India, State & Institute PG entrance exam notifications and direct apply links.",
        button: "Explore Now",
        link: "/pg-entrance",
    }
];

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
   FEATURE CARD  (responsive)
───────────────────────────────────────── */
function FeatureCard({ card }) {
    const router = useRouter();
    const navigate = (to, isExt) => {
        if (isExt) {
            window.open(to, "_blank");
        } else {
            router.push(to);
        }
    };
    const Icon = card.icon;

    return (
        <div
            onClick={() => navigate(card.link, card.isExternal)}
            className="bg-white relative flex flex-col justify-between overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 p-4 sm:p-5 rounded-3xl border border-slate-100/90 shadow-xs hover:shadow-xl"
            style={{
                boxShadow: "0 2px 14px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",
            }}
        >
            {/* Top-right soft corner gradient wave */}
            <div
                className="pointer-events-none absolute -top-2 -right-2 w-32 sm:w-36 h-32 sm:h-36 rounded-bl-full transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                style={{
                    background: card.cornerGlow,
                }}
            />

            {/* Top icon and content */}
            <div className="relative z-10 text-left">
                {/* Icon box (rounded squircle) */}
                <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs"
                    style={{ background: card.iconBg }}
                >
                    <Icon style={{ color: card.iconColor, fontSize: 20 }} />
                </div>

                {/* Title & Description (left aligned) */}
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug mb-1.5">
                    {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                    {card.description}
                </p>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 mt-4 sm:mt-5 pt-1">
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all hover:opacity-95 active:scale-98 shadow-sm group-hover:shadow-md"
                    style={{ background: card.btnGrad }}
                    suppressHydrationWarning={true}
                >
                    <span className="truncate">{card.button}</span>
                    <FaArrowRight size={11} className="transition-transform group-hover:translate-x-1 shrink-0" />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   GROW ONLINE BANNER
───────────────────────────────────────── */
function GrowOnlineBanner() {
    return (
        <Link
            href="/digital-presence"
            className="group block relative mt-6 sm:mt-8 w-full rounded-3xl overflow-hidden border border-sky-200/80 bg-linear-to-r from-[#edf5ff] via-[#f4f9ff] to-[#e8f2ff] p-5 sm:p-7 lg:p-9 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer"
        >
            {/* Background subtle mesh glow */}
            <div className="pointer-events-none absolute -right-12 -bottom-12 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
            <div className="pointer-events-none absolute left-1/4 -top-12 w-56 h-56 bg-sky-300/20 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                {/* Left content */}
                <div className="flex-1 text-center lg:text-left">
                    <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-blue-600 mb-2 font-mono">
                        GROW ONLINE
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        Launch Your Digital Presence <br className="hidden sm:inline" />
                        with Confidence
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                        Whether you&apos;re starting a business, launching a startup, building a personal brand, or taking your existing business online, we provide <strong className="font-bold text-slate-800">affordable website development</strong>, <strong className="font-bold text-slate-800">CRM solutions</strong>, and <strong className="font-bold text-slate-800">digital marketing services</strong> tailored to your needs.
                    </p>

                    <div className="mt-6 flex items-center justify-center lg:justify-start">
                        <span className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                            <span>Get Started</span>
                            <FaArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>

                {/* Right Illustration & Feature Pills */}
                <div className="relative shrink-0 flex flex-col sm:flex-row items-center gap-5 lg:gap-7">
                    
                    {/* Laptop & Launching Rocket Illustration */}
                    <div className="relative flex items-center justify-center">
                        {/* Floating WWW tag */}
                        <div className="absolute -top-3 -left-3 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black shadow-sm z-20">
                            WWW
                        </div>

                        {/* Floating Chart Icon */}
                        <div className="absolute -top-2 right-2 px-1.5 py-1 rounded-md bg-white border border-rose-100 text-rose-500 shadow-sm z-20 text-xs">
                            📈
                        </div>

                        {/* Plant Pot */}
                        <div className="absolute -bottom-1 -left-4 text-xl sm:text-2xl z-20">
                            🪴
                        </div>

                        {/* Laptop Mockup */}
                        <div className="relative w-44 sm:w-52 h-28 sm:h-34 bg-slate-900 rounded-t-xl border-4 border-slate-700 shadow-lg flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-linear-to-b from-sky-400 via-blue-500 to-indigo-600 flex flex-col items-center justify-center p-2 relative">
                                
                                {/* Rocket taking off */}
                                <div className="text-3xl sm:text-4xl -rotate-45 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 z-10 filter drop-shadow-md">
                                    🚀
                                </div>
                                
                                {/* Smoke / Clouds */}
                                <div className="absolute bottom-0 inset-x-0 h-8 bg-white/30 backdrop-blur-xs rounded-t-full flex items-center justify-around px-2">
                                    <span className="w-3 h-3 bg-white/70 rounded-full" />
                                    <span className="w-5 h-5 bg-white/80 rounded-full" />
                                    <span className="w-3 h-3 bg-white/70 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Laptop Bottom Base */}
                        <div className="absolute -bottom-1.5 w-52 sm:w-60 h-2 bg-slate-300 rounded-b-lg shadow-sm" />
                    </div>

                    {/* 3 Pill Cards on Right */}
                    <div className="flex flex-col gap-2.5 w-48 sm:w-52 shrink-0">
                        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 border border-blue-100 shadow-xs group-hover:shadow-md transition-all">
                            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                                &lt;/&gt;
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">Web Development</span>
                        </div>

                        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 border border-blue-100 shadow-xs group-hover:shadow-md transition-all">
                            <span className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 text-sm">
                                ⚙️
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">CRM Solutions</span>
                        </div>

                        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 border border-blue-100 shadow-xs group-hover:shadow-md transition-all">
                            <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 text-sm">
                                📊
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800">Digital Marketing</span>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
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
        if (initialAnnouncements && initialAnnouncements.length > 0) {
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
        <section className="bg-white w-full py-8 sm:py-12 xl:py-16">
            <div className="w-full px-4 md:px-15 mx-auto">

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

                    <HeroVideoModal />

                    {/* <p
            className="mt-4 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "#64748b" }}
          >
            Everything you need to advance your career in one place
          </p> */}
                </div>

                {/* ── Cards + Announcements ── */}
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 items-stretch w-full">

                    {/* Cards — 2 col on mobile, 2 col on tablet, 4 col on xl+ */}
                    <div className="w-full xl:flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
                        {dynamicCards.map((card) => (
                            <FeatureCard key={card.id} card={card} />
                        ))}
                    </div>

                    {/* Announcements */}
                    <div className="w-full xl:w-96 xl:shrink-0">
                        {/* Auto-scrolling announcements panel on all screen sizes */}
                        <div className="flex flex-col" style={{ height: 250 }}>
                            <VerticalAnnouncements list={annList} loading={annLoading} />
                        </div>
                    </div>

                </div>

                {/* ── Grow Online Banner (Links to /build-your-venture) ── */}
                <GrowOnlineBanner />

            </div>
        </section>
    );
}
