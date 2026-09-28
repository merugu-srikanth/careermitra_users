"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// Career Mitra YouTube channel (@Career_Mitra_Official) uploads playlist —
// always plays the channel's newest video first. To pin one specific video
// instead, set VIDEO_ID (e.g. "ru-Qp4f1v8I") and it takes priority.
const UPLOADS_PLAYLIST_ID = "UUpsa4-5c3GG17b0kZ28SzeA";
const VIDEO_ID = "HuWuFVmFkJk"; // "How to Register Careermitra website" — https://youtu.be/HuWuFVmFkJk

const EMBED_URL = VIDEO_ID
    ? `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${UPLOADS_PLAYLIST_ID}&autoplay=1&rel=0&modestbranding=1`;

export default function HeroVideoModal({ label = "See How To Register On Careermitra" }) {
    const [open, setOpen] = useState(false);

    // Esc to close + lock page scroll while the modal is open.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group mt-4 sm:mt-5 inline-flex max-w-full items-center gap-2.5 sm:gap-3 rounded-full border border-orange-200 bg-white py-1.5 pl-1.5 pr-4 sm:pr-5 text-left text-xs sm:text-sm font-semibold leading-snug text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 cursor-pointer"
                aria-haspopup="dialog"
            >
                <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow">
                    <span className="absolute inset-0 rounded-full bg-orange-400/60 animate-ping" />
                    <FaPlay size={11} className="relative ml-0.5" />
                </span>
                {label}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="video-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
                        onClick={() => setOpen(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Career Mitra video"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            // Phones: full-width 16:9. Tablet/desktop: 70% of screen width & height.
                            className="relative w-full aspect-video md:aspect-auto md:w-[70vw] md:h-[70vh] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
                        >
                            <iframe
                                src={EMBED_URL}
                                title="Career Mitra on YouTube"
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </motion.div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close video"
                            className="absolute right-3 top-3 sm:right-5 sm:top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                        >
                            <IoClose size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
