"use client";

import {
  Landmark, Building2, Factory, Banknote, TrainFront, Shield, Siren, GraduationCap,
  HeartPulse, Scale, FlaskConical, Briefcase, Ellipsis, Check,
} from "lucide-react";

/**
 * "Department" (sector) chips shown right under the search bar (states live
 * in the "State-wise" tab above the search — see JobTabs).
 * Only options that currently have open jobs are listed (count > 0), so a
 * visitor never lands on an empty result. A chip that is selected (e.g. from a
 * shared URL) stays visible even if its count dropped to 0.
 */

const DEPARTMENTS = {
  "Central Government": { label: "Central Govt", Icon: Landmark },
  "State Government": { label: "State Govt", Icon: Building2 },
  "Public Sector (PSU)": { label: "PSUs", Icon: Factory },
  Banking: { label: "Bank", Icon: Banknote },
  Railways: { label: "Railway", Icon: TrainFront },
  Defence: { label: "Defence", Icon: Shield },
  Police: { label: "Police", Icon: Siren },
  "Teaching / Education": { label: "Teaching", Icon: GraduationCap },
  Healthcare: { label: "Healthcare", Icon: HeartPulse },
  Judiciary: { label: "Judiciary", Icon: Scale },
  Research: { label: "Research", Icon: FlaskConical },
  Private: { label: "Private", Icon: Briefcase },
  Other: { label: "Others", Icon: Ellipsis },
};

const available = (list = [], selected) =>
  list.filter((o) => o.count > 0 || o.value === selected);

function Chip({ active, onClick, Icon, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all duration-150 ${
        active
          ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-200"
          : "bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
      }`}
    >
      {active ? <Check size={14} strokeWidth={2.5} /> : Icon && <Icon size={14} className="text-gray-400 group-hover:text-orange-500" />}
      <span>{children}</span>
      {count > 0 && (
        <span className={`text-[11px] font-semibold rounded-full px-1.5 min-w-5 text-center ${
          active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function Row({ title, children }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
      <p className="sm:w-28 shrink-0 text-sm font-semibold text-gray-500 sm:pt-1.5">{title}</p>
      <div className="flex flex-wrap items-center gap-2 min-w-0">{children}</div>
    </div>
  );
}

export default function JobQuickFilters({ options = {}, loaded, filters, onChange }) {
  const departments = available(options.sector, filters.sector);

  if (!loaded) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-5 animate-pulse flex gap-6">
        <div className="h-4 w-20 bg-gray-100 rounded" />
        <div className="flex flex-wrap gap-2 flex-1">
          {[...Array(8)].map((_, j) => <div key={j} className="h-8 w-24 bg-gray-100 rounded-full" />)}
        </div>
      </div>
    );
  }
  if (!departments.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-5 mb-5">
      <Row title="Department">
        {departments.map((o) => {
          const meta = DEPARTMENTS[o.value] ?? { label: o.value, Icon: Briefcase };
          return (
            <Chip key={o.value} Icon={meta.Icon} count={o.count} active={filters.sector === o.value}
              onClick={() => onChange("sector", filters.sector === o.value ? "" : o.value)}>
              {meta.label}
            </Chip>
          );
        })}
      </Row>
    </div>
  );
}
