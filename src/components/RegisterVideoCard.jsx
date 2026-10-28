"use client";

import { FaPlay, FaYoutube } from "react-icons/fa";
import HeroVideoModal from "./HeroVideoModal";
import registerThumb from "../assets/register-video-thumb.webp";

// Thumbnail card for the "How to Register on Careermitra" video.
// The thumbnail is a screenshot of our Register page; clicking the card
// opens the same video popup as the hero button.
export default function RegisterVideoCard({ title = "Watch How to Register on Careermitra" }) {
    return (
        <HeroVideoModal
            renderTrigger={(open) => (
                <button
                    type="button"
                    onClick={open}
                    aria-haspopup="dialog"
                    aria-label={title}
                    className="group block w-full overflow-hidden rounded-2xl border border-orange-100 bg-white text-left shadow-lg shadow-orange-100/60 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                    <div className="relative aspect-video w-full overflow-hidden bg-orange-50">
                        <img
                            src={registerThumb.src || registerThumb}
                            alt="Careermitra registration page"
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
                        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-xl ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-110">
                            <span className="absolute inset-0 rounded-full bg-red-500/50 animate-ping" />
                            <FaPlay size={16} className="relative ml-1" />
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-3">
                        <FaYoutube size={20} className="shrink-0 text-red-600" />
                        <span className="text-sm font-bold text-slate-900">{title}</span>
                    </div>
                </button>
            )}
        />
    );
}
