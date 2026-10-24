"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Flame, Star, Building2 } from "lucide-react";
import { formatDateDDMonYYYY } from "@/utils/formatters";
import { clean, normalizeLink, detailHref, stipendText, placeText, tagFor, daysLeftText } from "@/utils/internshipDisplay";
import { ScrollArrows, TH, TD, THEAD } from "@/components/listing/ListingKit";

/** The finder's table view (desktop), styled like the jobs table. Clicking a row opens the detail page. */
export default function InternshipTable({ rows, startIndex = 0 }) {
  const router = useRouter();

  return (
    <ScrollArrows deps={[rows]}>
      <table className="w-full min-w-[860px] table-fixed">
        <thead className={THEAD}>
          <tr>
            <th scope="col" className={`${TH} w-12`}>S No</th>
            <th scope="col" className={`${TH} w-[32%]`}>Internship</th>
            <th scope="col" className={`${TH} w-[13%]`}>Location</th>
            <th scope="col" className={`${TH} w-[10%]`}>Duration</th>
            <th scope="col" className={`${TH} w-[12%]`}>Stipend</th>
            <th scope="col" className={`${TH} w-[11%]`}>Mode</th>
            <th scope="col" className={`${TH} w-[12%]`}>Apply By</th>
            <th scope="col" className={`${TH} w-[13%] text-center`}>Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((r, idx) => {
            const item = r.item;
            const href = detailHref(item);
            const applyLink = normalizeLink(clean(item.apply_link));
            const tag = tagFor(r);
            const closingSoon = !r.expired && r.daysLeft != null && r.daysLeft <= 7;
            const title = clean(item.internship_title) || clean(item.company_name) || "Internship";
            return (
              <tr key={item.id} onClick={() => router.push(href)}
                className={`group cursor-pointer transition-colors hover:bg-orange-50/30 ${r.expired ? "opacity-70" : ""}`}>
                <td className={`${TD} text-sm text-gray-400 font-mono`}>{startIndex + idx + 1}</td>
                <td className={TD}>
                  <Link href={href} onClick={(e) => e.stopPropagation()}
                    className="block text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                    {title}
                  </Link>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 min-w-0">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{clean(item.company_name)}</span>
                    {r.featured && <Star className="w-3 h-3 shrink-0 text-amber-500" fill="currentColor" aria-label="Featured" />}
                  </div>
                  {closingSoon && (
                    <span className="mt-1.5 inline-flex items-center gap-0.5 rounded bg-red-50 text-red-600 px-1.5 py-0.5 text-[10px] font-semibold">
                      <Flame className="w-2.5 h-2.5" /> Closing Soon
                    </span>
                  )}
                </td>
                <td className={`${TD} text-[13px] text-gray-700`}>
                  <span className="flex items-start gap-1"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" /><span className="line-clamp-2">{placeText(r)}</span></span>
                </td>
                <td className={`${TD} text-[13px] text-gray-700`}><span className="line-clamp-2">{clean(item.duration) || "—"}</span></td>
                <td className={`${TD} text-[13px] font-semibold ${r.amount > 0 ? "text-emerald-700" : "text-gray-500"}`}>
                  <span className="line-clamp-2">{stipendText(r)}</span>
                </td>
                <td className={TD}>
                  {tag ? (
                    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${tag.cls}`}>
                      <tag.Icon className="w-3 h-3 shrink-0" /> {tag.label}
                    </span>
                  ) : <span className="text-[13px] text-gray-500">{clean(item.internship_type) || "—"}</span>}
                </td>
                <td className={TD}>
                  {item.last_date_to_apply ? (
                    <>
                      <span className={`block text-[13px] font-bold ${r.expired ? "text-gray-500" : "text-gray-800"}`}>{formatDateDDMonYYYY(item.last_date_to_apply)}</span>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.expired
                        ? "bg-gray-100 text-gray-500" : closingSoon ? "bg-amber-50 border border-amber-200 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>{daysLeftText(r)}</span>
                    </>
                  ) : <span className="text-[13px] text-gray-400">—</span>}
                </td>
                <td className={TD}>
                  <div className="flex flex-col gap-1.5">
                    <Link href={href} onClick={(e) => e.stopPropagation()}
                      className="w-full text-center bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 rounded-md transition-colors">
                      View More
                    </Link>
                    {applyLink && !r.expired ? (
                      <a href={applyLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded-md transition-colors">
                        Apply Now
                      </a>
                    ) : r.expired ? (
                      <span className="w-full text-center bg-gray-100 text-gray-400 text-xs font-bold py-1.5 rounded-md">Closed</span>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollArrows>
  );
}
