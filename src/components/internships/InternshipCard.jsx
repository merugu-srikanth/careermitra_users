"use client";

import Link from "next/link";
import { MapPin, Clock, IndianRupee, Flame, Star, GraduationCap, CalendarDays } from "lucide-react";
import { formatDateDDMonYYYY } from "@/utils/formatters";
import { clean, normalizeLink, detailHref, LOGO_COLORS, initials, stipendText, placeText, tagFor } from "@/utils/internshipDisplay";

/** One internship in the finder's card view. `r` is readInternship(item). The whole card opens the detail page. */
export default function InternshipCard({ r, colorIndex = 0 }) {
  const item = r.item;
  const title = clean(item.internship_title) || clean(item.company_name) || "Internship";
  const href = detailHref(item);
  const applyLink = normalizeLink(clean(item.apply_link));
  const closingSoon = !r.expired && r.daysLeft != null && r.daysLeft <= 7;
  const tag = tagFor(r);
  const deadline = item.last_date_to_apply ? formatDateDDMonYYYY(item.last_date_to_apply) : null;

  return (
    <article className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/40 transition-all">
      <div className="flex gap-4 flex-1 min-w-0">
        <div className={`hidden sm:flex shrink-0 w-16 h-16 rounded-xl items-center justify-center text-lg font-black ${LOGO_COLORS[colorIndex % LOGO_COLORS.length]}`} aria-hidden>
          {initials(item.company_name)}
        </div>

        <div className="flex-1 min-w-0">
          {(closingSoon || r.featured || r.expired) && (
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {closingSoon && (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 text-red-600 px-2 py-0.5 text-[11px] font-semibold">
                  <Flame className="w-3 h-3" /> {r.daysLeft === 0 ? "Closes today" : "Closing Soon"}
                </span>
              )}
              {r.featured && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-semibold">
                  <Star className="w-3 h-3" fill="currentColor" /> Featured
                </span>
              )}
              {r.expired && <span className="rounded-md bg-slate-100 text-slate-500 px-2 py-0.5 text-[11px] font-semibold">Expired</span>}
            </div>
          )}

          {/* The stretched link makes the whole card clickable. */}
          <Link href={href} className="block text-[15px] sm:text-base font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 after:absolute after:inset-0 after:rounded-2xl">
            {title}
          </Link>
          <p className="mt-0.5 text-sm text-slate-500 truncate">
            {clean(item.company_name)}
            {clean(item.organization_type) && <span className="text-slate-400"> · {item.organization_type}</span>}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1.5 min-w-0"><MapPin className="w-4 h-4 text-slate-400 shrink-0" /><span className="truncate max-w-[220px]">{placeText(r)}</span></span>
            {clean(item.duration) && <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" />{item.duration}</span>}
            <span className="inline-flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-slate-400" />{stipendText(r)}</span>
            {clean(item.qualification_level) && (
              <span className="inline-flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-slate-400" />{item.qualification_level}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:w-48 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
        <div className="flex flex-col sm:items-end gap-2">
          {tag && (
            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${tag.cls}`}>
              <tag.Icon className="w-3.5 h-3.5" /> {tag.label}
            </span>
          )}
          {deadline && (
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays className={`w-5 h-5 ${r.expired ? "text-slate-400" : "text-red-500"}`} />
              <span>
                {r.expired ? "Closed on" : "Apply by"}
                <span className={`block text-sm font-bold ${r.expired ? "text-slate-500" : "text-red-600"}`}>{deadline}</span>
              </span>
            </span>
          )}
        </div>
        {applyLink && !r.expired ? (
          <a href={applyLink} target="_blank" rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center justify-center h-10 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-sm shadow-orange-500/30 transition-colors">
            Apply Now
          </a>
        ) : (
          <span className="inline-flex items-center justify-center h-10 px-6 rounded-xl border border-slate-200 text-slate-700 group-hover:border-orange-300 group-hover:text-orange-600 text-sm font-bold transition-colors">
            View More
          </span>
        )}
      </div>
    </article>
  );
}
