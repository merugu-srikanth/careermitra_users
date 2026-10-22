"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Flame, Star, ChevronRight } from "lucide-react";
import { formatDateDDMonYYYY } from "@/utils/formatters";
import { clean, normalizeLink, detailHref, LOGO_COLORS, initials, stipendText, placeText, tagFor, daysLeftText } from "@/utils/internshipDisplay";

/** The finder's table view (desktop). Clicking a row opens the internship's detail page. */
export default function InternshipTable({ rows, startIndex = 0 }) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="bg-orange-50/70 border-b border-orange-100 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-3 py-3">Internship</th>
              <th className="px-3 py-3">Location</th>
              <th className="px-3 py-3">Duration</th>
              <th className="px-3 py-3">Stipend</th>
              <th className="px-3 py-3">Mode</th>
              <th className="px-3 py-3">Apply By</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, idx) => {
              const item = r.item;
              const href = detailHref(item);
              const applyLink = normalizeLink(clean(item.apply_link));
              const tag = tagFor(r);
              const closingSoon = !r.expired && r.daysLeft != null && r.daysLeft <= 7;
              const title = clean(item.internship_title) || clean(item.company_name) || "Internship";
              return (
                <tr key={item.id} onClick={() => router.push(href)}
                  className={`group cursor-pointer transition-colors hover:bg-orange-50/40 ${r.expired ? "opacity-70" : ""}`}>
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-400 align-top pt-5">{startIndex + idx + 1}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black ${LOGO_COLORS[(startIndex + idx) % LOGO_COLORS.length]}`} aria-hidden>
                        {initials(item.company_name)}
                      </div>
                      <div className="min-w-0 max-w-[340px]">
                        <Link href={href} onClick={(e) => e.stopPropagation()}
                          className="block text-sm font-bold text-slate-900 leading-snug group-hover:text-orange-600 line-clamp-2">
                          {title}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                          <span className="text-xs text-slate-500 truncate">{clean(item.company_name)}</span>
                          {r.featured && <Star className="w-3 h-3 shrink-0 text-amber-500" fill="currentColor" aria-label="Featured" />}
                          {closingSoon && (
                            <span className="shrink-0 inline-flex items-center gap-0.5 rounded bg-red-50 text-red-600 px-1.5 text-[10px] font-semibold">
                              <Flame className="w-2.5 h-2.5" /> Closing Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-[13px] text-slate-700">
                    <span className="inline-flex items-center gap-1 max-w-[160px]"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span className="truncate">{placeText(r)}</span></span>
                  </td>
                  <td className="px-3 py-3.5 text-[13px] text-slate-700"><span className="block max-w-[120px] line-clamp-2">{clean(item.duration) || "—"}</span></td>
                  <td className={`px-3 py-3.5 text-[13px] font-semibold ${r.amount > 0 ? "text-emerald-700" : "text-slate-500"}`}>
                    <span className="block max-w-[150px] line-clamp-2">{stipendText(r)}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    {tag ? (
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tag.cls}`}>
                        <tag.Icon className="w-3 h-3" /> {tag.label}
                      </span>
                    ) : <span className="text-[13px] text-slate-500">{clean(item.internship_type) || "—"}</span>}
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    {item.last_date_to_apply ? (
                      <>
                        <span className={`block text-[13px] font-bold ${r.expired ? "text-slate-500" : "text-slate-800"}`}>{formatDateDDMonYYYY(item.last_date_to_apply)}</span>
                        <span className={`block text-[11px] font-semibold ${r.expired ? "text-slate-400" : closingSoon ? "text-red-600" : "text-emerald-600"}`}>{daysLeftText(r)}</span>
                      </>
                    ) : <span className="text-[13px] text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <Link href={href} onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 h-8 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600">
                        View More <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      {applyLink && !r.expired && (
                        <a href={applyLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center h-8 px-3.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/30">
                          Apply Now
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
