"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";

/**
 * A small styled dropdown for the jobs filters (replaces the native <select>,
 * whose open list can't be styled). The list opens in a portal so the
 * scrolling filter panel never clips it; it flips above the button when there
 * is no room below. Long lists get a search box.
 *
 * options: [{ value, label }] — value "" is the "All" choice.
 */

const SEARCH_FROM = 9; // show a search box once a list has this many options
const PANEL_MAX = 264; // px

export default function FilterDropdown({ id, value, options, onChange, highlight = false, clearable = false, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rect, setRect] = useState(null);
  const [active, setActive] = useState(-1);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.value === value);
  const searchable = options.length >= SEARCH_FROM;
  const q = query.trim().toLowerCase();
  const visible = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  const place = () => {
    const r = buttonRef.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom;
    const up = below < PANEL_MAX + 16 && r.top > below;
    setRect({ left: r.left, width: r.width, top: up ? undefined : r.bottom + 6, bottom: up ? window.innerHeight - r.top + 6 : undefined });
  };

  const openList = () => {
    place();
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const close = (focusButton = false) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };
  const choose = (v) => { onChange(v); close(true); };

  // Close on outside click, page scroll / resize (the button moves), Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!panelRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) close();
    };
    const onScroll = (e) => { if (!panelRef.current?.contains(e.target)) close(); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // Keep the highlighted option in view.
  useLayoutEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); openList(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(visible.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter" && visible[active]) { e.preventDefault(); choose(visible[active].value); }
    else if (e.key === "Tab") close();
  };

  const picked = Boolean(value);
  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : openList())}
        className={`w-full h-8 flex items-center gap-1 rounded-lg border bg-white pl-2.5 pr-2 text-xs text-left transition-colors focus:outline-none focus:ring-4 focus:ring-orange-100 ${open
          ? "border-orange-400 ring-4 ring-orange-100"
          : highlight && picked ? "border-orange-300 hover:border-orange-400" : "border-gray-200 hover:border-orange-300"}`}
      >
        <span className={`flex-1 truncate ${picked ? "text-gray-900 font-medium" : "text-gray-600"}`}>{selected?.label ?? value}</span>
        {clearable && picked && (
          <span role="button" tabIndex={-1} aria-label="Clear" onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="p-0.5 rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-100">
            <X size={12} />
          </span>
        )}
        <ChevronDown size={14} className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180 text-orange-500" : ""}`} />
      </button>

      {open && rect && createPortal(
        <div
          ref={panelRef}
          style={{ position: "fixed", left: rect.left, width: Math.max(rect.width, 200), top: rect.top, bottom: rect.bottom }}
          className="z-100 bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-900/10 overflow-hidden"
        >
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <label className="flex items-center gap-1.5 h-8 px-2 rounded-lg bg-gray-50 border border-gray-200 focus-within:border-orange-300 focus-within:bg-white">
                <Search size={13} className="text-gray-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                  placeholder="Search..."
                  className="flex-1 min-w-0 bg-transparent text-xs focus:outline-none"
                />
              </label>
            </div>
          )}
          <ul ref={listRef} role="listbox" className="overflow-y-auto py-1" style={{ maxHeight: searchable ? PANEL_MAX - 48 : PANEL_MAX }}>
            {visible.length === 0 && <li className="px-3 py-3 text-xs text-gray-400 text-center">No matches</li>}
            {visible.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value || "__all"}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o.value)}
                  className={`mx-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer ${isSelected
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : i === active ? "bg-gray-50 text-gray-900" : "text-gray-700"}`}
                >
                  <span className="flex-1 truncate">{o.label}</span>
                  {isSelected && <Check size={13} className="shrink-0 text-orange-500" />}
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}
