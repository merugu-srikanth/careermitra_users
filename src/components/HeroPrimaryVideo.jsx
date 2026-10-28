"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaYoutube, FaChevronRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { API_BASE_URL } from "@/utils/api";

// For useSyncExternalStore: nothing to subscribe to, we only need to know if we are in the browser.
const noopSubscribe = () => () => {};

/**
 * "New Video on YouTube" card on the home hero — shows the video the admin
 * marked as the home page video (Media Library → ★ Set home), via
 * GET /api/media/primary. Clicking plays it in a popup. Closing the card hides
 * it until a different video is chosen. Nothing shows when none is chosen.
 */

const DISMISS_KEY = "cm_hero_video_dismissed";
const SITE = API_BASE_URL.replace(/\/api\/?$/, "");

const fileUrl = (url) => (!url ? null : /^https?:\/\//.test(url) ? url : `${SITE}${url.startsWith("/") ? "" : "/"}${url}`);

// inline      → normal block in the layout (no floating), full width.
// dismissible → show the ✕ that hides the card for this visitor.
export default function HeroPrimaryVideo({ inline = false, dismissible = true }) {
    const [video, setVideo] = useState(null);
    const [hidden, setHidden] = useState(true);
    const [playing, setPlaying] = useState(false);
    // The player is rendered into <body> (portal), which only exists in the browser.
    const portalReady = useSyncExternalStore(noopSubscribe, () => true, () => false);

    useEffect(() => {
        let alive = true;
        fetch(`${API_BASE_URL}/media/primary`)
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => {
                const v = json?.data;
                if (!alive || !v || !(v.youtube_id || v.file_url)) return;
                let dismissed = null;
                try { dismissed = localStorage.getItem(DISMISS_KEY); } catch { /* private mode */ }
                setVideo(v);
                setHidden(dismissible && dismissed === v.id);
            })
            .catch(() => { });
        return () => { alive = false; };
    }, []);

    // Esc closes the player; page scroll locked while it is open.
    useEffect(() => {
        if (!playing) return;
        const onKey = (e) => { if (e.key === "Escape") setPlaying(false); };
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, [playing]);

    if (!video) return null;

    const isYoutube = Boolean(video.youtube_id);
    const thumb = isYoutube ? `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg` : fileUrl(video.thumbnail_url);
    const dismiss = (e) => {
        e.stopPropagation();
        setHidden(true);
        try { localStorage.setItem(DISMISS_KEY, video.id); } catch { /* private mode */ }
    };

    return (
        <>
            <AnimatePresence>
                {!hidden && (
                    <motion.div
                        key="hero-video-card"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        // Phones / tablets: a card under the "See how to register" button. Desktop: floats top-right of the hero.
                        className={inline
                            ? "relative w-full text-left mb-5"
                            : "relative mx-auto mt-4 w-full max-w-sm text-left xl:absolute xl:right-6 xl:top-4 xl:mt-0 xl:w-80 z-20"}
                    >
                        {inline ? (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setPlaying(true)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPlaying(true)}
                            className="group flex items-center gap-3.5 cursor-pointer rounded-2xl border border-red-100 bg-white p-2.5 pr-4 shadow-[0_10px_30px_-18px_rgba(220,38,38,0.45)] transition-all hover:-translate-y-0.5 hover:border-red-200 hover:shadow-[0_14px_34px_-16px_rgba(220,38,38,0.5)]"
                        >
                            <div className="relative h-16 w-28 sm:h-18 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-slate-200 ring-1 ring-black/5">
                                {thumb && <img src={thumb} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />}
                                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-transform group-hover:scale-110">
                                        <FaPlay size={10} className="ml-0.5" />
                                    </span>
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                                    <FaYoutube size={12} /> New Video on YouTube
                                </span>
                                <p className="mt-1 text-[13px] sm:text-sm font-bold leading-snug text-slate-900 line-clamp-2">{video.title}</p>
                            </div>
                            <FaChevronRight className="shrink-0 text-red-500 transition-transform group-hover:translate-x-0.5" size={12} />
                        </div>
                        ) : (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => setPlaying(true)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPlaying(true)}
                            className="group cursor-pointer rounded-2xl border border-orange-200/80 bg-linear-to-br from-orange-50 via-white to-white p-3 shadow-lg shadow-orange-100/60 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-orange-300"
                        >
                            <div className="flex items-center justify-between mb-2 pr-6">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600">
                                    <FaYoutube className="text-red-600" size={16} /> New Video on YouTube
                                </span>
                            </div>
                            {dismissible && (
                            <button type="button" onClick={dismiss} aria-label="Hide video"
                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                <IoClose size={18} />
                            </button>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200 ring-1 ring-black/5">
                                    {thumb && <img src={thumb} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />}
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-transform group-hover:scale-110">
                                            <FaPlay size={10} className="ml-0.5" />
                                        </span>
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold leading-snug text-slate-900 line-clamp-2">{video.title}</p>
                                    <p className="mt-0.5 text-[11px] text-slate-500">Watch our latest video on YouTube</p>
                                </div>
                                <FaChevronRight className="shrink-0 text-orange-500 transition-transform group-hover:translate-x-0.5" size={12} />
                            </div>
                        </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {portalReady && createPortal(<AnimatePresence>
                {playing && (
                    <motion.div
                        key="hero-video-player"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        style={{ zIndex: 2147483000 }}
                        onClick={() => setPlaying(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-label={video.title}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className={`relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 ${video.video_type === "vertical"
                                ? "h-[80vh] aspect-9/16 max-w-full"
                                : "w-full aspect-video md:aspect-auto md:w-[70vw] md:h-[70vh]"}`}
                        >
                            {isYoutube ? (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
                                    title={video.title}
                                    className="absolute inset-0 h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : (
                                <video src={fileUrl(video.file_url)} controls autoPlay playsInline className="absolute inset-0 h-full w-full" />
                            )}
                        </motion.div>
                        <button type="button" onClick={() => setPlaying(false)} aria-label="Close video"
                            className="absolute right-3 top-3 sm:right-5 sm:top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 cursor-pointer">
                            <IoClose size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>, document.body)}
        </>
    );
}
