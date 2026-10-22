"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import {
  EDUCATION_OPTIONS, BRANCH_OPTIONS, SKILL_OPTIONS, WORK_MODE_OPTIONS, STIPEND_OPTIONS, DURATION_OPTIONS, DEADLINE_OPTIONS,
  EMPTY_FINDER_FILTERS, toggleIn,
} from "@/utils/internshipFinder";

/**
 * "More Filters" — slides in from the right. Edits a draft; "Apply Filters"
 * applies it, "Reset" clears everything here (search is kept).
 */

function Section({ title, children }) {
  return (
    <section className="py-4 border-b border-slate-100 last:border-0">
      <h3 className="text-sm font-bold text-slate-900 mb-3">{title}</h3>
      {children}
    </section>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`h-8 px-3 rounded-lg border text-[13px] transition-colors ${active
        ? "bg-orange-500 border-orange-500 text-white font-semibold"
        : "bg-white border-slate-200 text-slate-600 hover:border-orange-300"}`}>
      {children}
    </button>
  );
}

function CheckItem({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer select-none py-1">
      <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${checked ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white"}`}>
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="truncate">{children}</span>
    </label>
  );
}

function RadioItem({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer select-none py-1">
      <span className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${checked ? "border-orange-500" : "border-slate-300"}`}>
        {checked && <span className="w-2 h-2 rounded-full bg-orange-500" />}
      </span>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <span>{children}</span>
    </label>
  );
}

const GRID = "grid grid-cols-2 gap-x-4";

export default function MoreFiltersPanel({ open, filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- start from the applied filters each time it opens
  useEffect(() => { if (open) setDraft(filters); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = original; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;
  const toggle = (key, value) => setDraft((d) => ({ ...d, [key]: toggleIn(d[key], value) }));
  const pick = (key, value) => setDraft((d) => ({ ...d, [key]: d[key] === value ? "" : value }));

  return (
    <div className="fixed inset-0 z-90" role="dialog" aria-modal="true" aria-label="More filters">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">More Filters</h2>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 thin-scrollbar">
          <Section title="Education / Qualification">
            <div className="flex flex-wrap gap-2">
              {EDUCATION_OPTIONS.map((o) => (
                <Pill key={o.value} active={draft.education.includes(o.value)} onClick={() => toggle("education", o.value)}>{o.label}</Pill>
              ))}
            </div>
          </Section>

          <Section title="Branch / Stream">
            <div className={GRID}>
              {BRANCH_OPTIONS.map((o) => (
                <CheckItem key={o.value} checked={draft.branches.includes(o.value)} onChange={() => toggle("branches", o.value)}>{o.value}</CheckItem>
              ))}
            </div>
          </Section>

          <Section title="Domain / Skills">
            <div className={GRID}>
              {SKILL_OPTIONS.map((o) => (
                <CheckItem key={o.value} checked={draft.skills.includes(o.value)} onChange={() => toggle("skills", o.value)}>{o.value}</CheckItem>
              ))}
            </div>
          </Section>

          <Section title="Work Mode">
            <div className={GRID}>
              {WORK_MODE_OPTIONS.map((v) => (
                <CheckItem key={v} checked={draft.workModes.includes(v)} onChange={() => toggle("workModes", v)}>{v}</CheckItem>
              ))}
            </div>
          </Section>

          <Section title="Stipend Range">
            <div className="grid grid-cols-2 gap-x-3">
              {STIPEND_OPTIONS.map((o) => (
                <RadioItem key={o.value} checked={draft.stipend === o.value} onChange={() => pick("stipend", o.value)}>{o.label}</RadioItem>
              ))}
            </div>
          </Section>

          <Section title="Duration">
            <div className={GRID}>
              {DURATION_OPTIONS.map((o) => (
                <RadioItem key={o.value} checked={draft.duration === o.value} onChange={() => pick("duration", o.value)}>{o.label}</RadioItem>
              ))}
            </div>
          </Section>

          <Section title="Deadline">
            <div className={GRID}>
              {DEADLINE_OPTIONS.map((o) => (
                <RadioItem key={o.value || "all"} checked={draft.deadline === o.value} onChange={() => setDraft((d) => ({ ...d, deadline: o.value }))}>{o.label}</RadioItem>
              ))}
            </div>
          </Section>

          <Section title="More">
            <div className="space-y-0.5">
              <CheckItem checked={draft.fresher} onChange={() => setDraft((d) => ({ ...d, fresher: !d.fresher }))}>Freshers eligible</CheckItem>
              <CheckItem checked={draft.government} onChange={() => setDraft((d) => ({ ...d, government: !d.government }))}>Government organisations</CheckItem>
              <CheckItem checked={draft.showExpired} onChange={() => setDraft((d) => ({ ...d, showExpired: !d.showExpired }))}>Show expired internships (listed last)</CheckItem>
            </div>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 border-t border-slate-100">
          <button type="button" onClick={() => setDraft({ ...EMPTY_FINDER_FILTERS, q: filters.q })}
            className="h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50">
            Reset
          </button>
          <button type="button" onClick={() => { onApply(draft); onClose(); }}
            className="h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25">
            Apply Filters
          </button>
        </div>
      </aside>
    </div>
  );
}
