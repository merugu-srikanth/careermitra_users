"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Filter, RotateCcw, Search, X, LayoutGrid, Table2 } from "lucide-react";

/**
 * Building blocks shared by the listing pages (jobs look): sticky filter
 * sidebar on the left, header card + tabs + results on the right, and a
 * "Filters (n)" bar with a slide-up sheet on phones.
 */

/** Page frame: sidebar (desktop only) + main column. */
export function ListingShell({ sidebar, children, sidebarLabel = "Filters" }) {
  return (
    <div className="w-full mx-auto px-4 md:px-8 xl:px-15 pt-24 lg:pt-28 pb-8">
      <div className="flex items-start gap-5">
        {sidebar && (
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-24" aria-label={sidebarLabel}>
            {sidebar}
          </aside>
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

/** White header card: title, subtitle, an optional bar (e.g. section switch) and a search box. */
export function ListingHeader({ title, highlight, subtitle, bar, search }) {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-200/80 rounded-2xl shadow-sm px-5 sm:px-6 py-5 mb-4">
      <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full bg-orange-50 pointer-events-none" aria-hidden />
      <div className="relative">
        <h1 className="text-2xl lg:text-[28px] font-extrabold text-gray-900 tracking-tight leading-tight">
          {title} <span className="text-orange-600">{highlight}</span>
        </h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500 max-w-2xl">{subtitle}</p>}
        {bar && <div className="mt-3">{bar}</div>}
        {search && <div className="max-w-xl mt-4">{search}</div>}
      </div>
    </div>
  );
}

/** Search box in the header (filters as you type). */
export function ListingSearch({ value, onChange, placeholder, ariaLabel = "Search" }) {
  return (
    <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 h-11 border border-gray-200 focus-within:border-orange-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100 transition-colors">
      <Search size={17} className="shrink-0 text-orange-500" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={ariaLabel}
        className="flex-1 min-w-0 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent" />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/**
 * Big section switch (e.g. Internships | SkillUps): two cards with icon,
 * name, one-line description and count. The open one is solid orange with a
 * tick; the other says "Tap to view" so it reads as a button.
 */
export function SectionSwitch({ items, value, onChange, label = "What do you want to explore?" }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-2xl" role="tablist">
        {items.map(({ id, label: name, description, count, Icon }) => {
          const on = value === id;
          return (
            <button key={id} type="button" role="tab" aria-selected={on} onClick={() => onChange(id)}
              className={`relative text-left rounded-2xl border-2 p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 transition-all ${on
                ? "bg-linear-to-br from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                : "bg-white border-gray-200 text-gray-800 hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5"}`}>
              {Icon && (
                <span className={`shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${on ? "bg-white/20" : "bg-orange-50 text-orange-500"}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm sm:text-lg font-extrabold leading-tight">{name}</span>
                  {count != null && (
                    <span className={`text-[10px] sm:text-xs font-bold leading-none rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 ${on ? "bg-white text-orange-600" : "bg-orange-100 text-orange-700"}`}>{count}</span>
                  )}
                </span>
                {description && <span className={`block mt-0.5 text-[11px] sm:text-xs leading-snug ${on ? "text-white/90" : "text-gray-500"}`}>{description}</span>}
                <span className={`block mt-1 text-[11px] font-bold ${on ? "text-white" : "text-orange-600"}`}>
                  {on ? "✓ Showing now" : "Tap to view →"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Tabs above the results, each with a count (same look as the jobs tabs). */
export function CountTabs({ tabs, value, onChange, ariaLabel = "Type" }) {
  return (
    <div className="flex max-w-full overflow-x-auto no-scrollbar sm:inline-flex gap-0.5 bg-white border border-gray-200/80 rounded-xl p-0.5 shadow-sm" role="tablist" aria-label={ariaLabel}>
      {tabs.map(({ id, label, count }) => {
        const active = value === id;
        return (
          <button key={id} type="button" role="tab" aria-selected={active} onClick={() => onChange(id)}
            className={`shrink-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 rounded-lg px-2.5 py-1.5 sm:h-8 sm:py-0 transition-colors ${active
              ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"}`}>
            <span className="text-xs font-semibold leading-tight whitespace-nowrap">{label}</span>
            <span className={`text-[10px] font-semibold leading-none rounded-full px-1.5 py-0.5 ${active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
              {count ?? "–"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Small grey segmented control (e.g. All open | 7 days | 30 days). */
export function Segment({ options, value, onChange, fullWidth = false }) {
  return (
    <div className={`h-8 p-0.5 gap-0.5 flex items-center bg-gray-100 rounded-xl ${fullWidth ? "w-full" : "w-fit"}`}>
      {options.map((o) => (
        <button key={o.value || "all"} type="button" onClick={() => onChange(o.value)} title={o.title}
          className={`h-full flex-1 px-2 text-[11px] rounded-lg font-bold whitespace-nowrap transition-all ${value === o.value
            ? "bg-white shadow-sm text-orange-600" : "text-gray-500 hover:text-orange-500"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Table / cards switch. */
export function ViewToggle({ value, onChange }) {
  return (
    <div className="hidden md:flex h-8 items-center gap-0.5 bg-gray-100 p-0.5 rounded-xl" role="group" aria-label="View">
      {[{ v: "cards", label: "Card view", Icon: LayoutGrid }, { v: "table", label: "Table view", Icon: Table2 }].map(({ v, label, Icon }) => (
        <button key={v} type="button" onClick={() => onChange(v)} aria-pressed={value === v} title={label}
          className={`p-1 rounded-lg transition-all ${value === v ? "bg-white shadow-sm text-orange-500" : "text-gray-500 hover:text-orange-400"}`}>
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}

/** ‹ 2 / 14 › */
export function MiniPager({ page, total, onChange }) {
  if (total <= 1) return null;
  const btn = "w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-gray-600";
  return (
    <div className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-0.5 shadow-sm">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page" className={btn}><ChevronLeft size={16} /></button>
      <span className="px-1 text-xs font-semibold text-gray-600 tabular-nums">{page} / {total}</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= total} aria-label="Next page" className={btn}><ChevronRight size={16} /></button>
    </div>
  );
}

/** Numbered pagination under the list. */
export function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = [1];
  const left = Math.max(2, current - 2);
  const right = Math.min(total - 1, current + 2);
  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);
  const box = "w-9 h-9 flex items-center justify-center rounded-xl";
  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button type="button" onClick={() => onChange(current - 1)} disabled={current === 1} aria-label="Previous page"
        className={`${box} border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40`}>
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) => p === "…" ? (
        <span key={`e${i}`} className={`${box} text-gray-400 text-sm`}>…</span>
      ) : (
        <button key={p} type="button" onClick={() => onChange(p)}
          className={`${box} text-sm font-bold transition-all ${p === current
            ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-110"
            : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"}`}>
          {p}
        </button>
      ))}
      <button type="button" onClick={() => onChange(current + 1)} disabled={current === total} aria-label="Next page"
        className={`${box} border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40`}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/** Applied filters as small pills — × removes one. chips: [{ key, label, fixed? }] */
export function FilterPills({ chips, onRemove, onClearAll }) {
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {chips.map((c) => (
        <span key={c.key} className="inline-flex items-center gap-1 rounded-full border pl-2.5 pr-1.5 py-0.5 text-xs font-medium bg-orange-50 border-orange-200 text-orange-700">
          {c.label}
          {c.fixed ? <span className="w-1" /> : (
            <button type="button" onClick={() => onRemove(c)} aria-label={`Remove ${c.label}`}
              className="p-0.5 rounded-full text-orange-400 hover:text-orange-700 hover:bg-orange-100">
              <X size={11} />
            </button>
          )}
        </span>
      ))}
      {chips.filter((c) => !c.fixed).length > 1 && (
        <button type="button" onClick={onClearAll} className="text-xs font-semibold text-gray-500 hover:text-orange-600 px-1">Clear all</button>
      )}
    </div>
  );
}

/** Sidebar card: header (title + Clear All), scrolling fields, optional footer. */
export function SidebarCard({ title, onClearAll, children, footer }) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm flex flex-col max-h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100">
        <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
          <Filter size={14} className="text-orange-500" /> {title}
        </p>
        <button type="button" onClick={onClearAll} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-orange-600">
          <RotateCcw size={12} /> Clear All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pl-3.5 pr-2.5 py-3 mr-1 thin-scrollbar space-y-3">{children}</div>
      {footer && <div className="px-3.5 py-2.5 border-t border-gray-100">{footer}</div>}
    </div>
  );
}

/** One labelled field in the sidebar; highlighted while it has a value. */
export function SideField({ Icon, label, highlight, children }) {
  return (
    <div className={highlight ? "-mx-1.5 px-1.5 py-1.5 rounded-lg bg-orange-50/70 ring-1 ring-orange-200" : ""}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
        {Icon && <Icon size={13} strokeWidth={2} className={highlight ? "text-orange-500" : "text-gray-400"} />}
        {label}
      </p>
      {children}
    </div>
  );
}

export function ResetButton({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full h-8 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-600">
      <RotateCcw size={12} /> Reset filters
    </button>
  );
}

/** Phone: "Filters (n) | chip × | chip ×" — opens the sheet. */
export function MobileFilterBar({ chips, onOpen, onRemove }) {
  const removable = chips.filter((c) => !c.fixed);
  return (
    <div className="lg:hidden flex items-center gap-2 bg-white border border-orange-300 rounded-2xl pl-3 pr-1.5 py-1.5 shadow-sm mb-3">
      <button type="button" onClick={onOpen} className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 py-1.5">
        <Filter size={16} /> Filters ({removable.length})
      </button>
      <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {chips.map((c) => (
          <span key={c.key} className="shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold bg-orange-500 border-orange-500 text-white">
            {c.label}
            {!c.fixed && (
              <button type="button" onClick={() => onRemove(c)} aria-label={`Remove ${c.label}`} className="opacity-80 hover:opacity-100"><X size={13} /></button>
            )}
          </span>
        ))}
      </div>
      <button type="button" onClick={onOpen} aria-label="Open filters" className="shrink-0 p-1.5 text-orange-500"><ChevronRight size={20} /></button>
    </div>
  );
}

/** Phone: slide-up sheet holding the same fields as the sidebar (they apply live). */
export function MobileFilterSheet({ open, onClose, title = "Filters", resultCount, onReset, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-90 lg:hidden">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col bg-white rounded-t-3xl shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <p className="flex-1 font-black text-gray-900 text-lg">{title}</p>
          <button type="button" onClick={onClose} className="p-1 text-gray-500" aria-label="Close"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">{children}</div>
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button type="button" onClick={onReset} className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">Reset filters</button>
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-sm font-bold">
            Show {resultCount != null ? `${resultCount.toLocaleString("en-IN")} ` : ""}results
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Wraps a wide table with left / right arrows (shown only while it can scroll that way). */
export function ScrollArrows({ children, deps = [] }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-measure when the rows change
  }, deps);
  const nudge = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  const arrow = "absolute top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 border border-orange-200 text-orange-600 shadow-lg hover:bg-orange-500 hover:text-white transition-colors";
  return (
    <div className="relative">
      {edges.left && <button type="button" aria-label="Scroll left" onClick={() => nudge(-1)} className={`${arrow} -left-3`}><ChevronLeft size={18} /></button>}
      {edges.right && <button type="button" aria-label="Scroll right" onClick={() => nudge(1)} className={`${arrow} -right-3`}><ChevronRight size={18} /></button>}
      <div ref={ref} className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">{children}</div>
    </div>
  );
}

/** Table header cell / body cell classes (jobs-table look). */
export const TH = "px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider";
export const TD = "px-2 py-3 border border-amber-300 align-top";
export const THEAD = "bg-linear-to-r from-orange-50 to-amber-50 sticky top-0 z-20";
