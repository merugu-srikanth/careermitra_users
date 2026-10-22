/**
 * Loading skeletons shaped like the real cards / tables they stand in for.
 * Bones shimmer (`.skel` in globals.css) and rows fade in one after another
 * (`.skel-item` with --i). Reduced-motion visitors get static placeholders.
 */

export function Bone({ className = "", warm = false }) {
  return <span aria-hidden className={`skel block ${warm ? "skel-warm" : ""} ${className}`} />;
}

const item = (i) => ({ "--i": i });

function Loading({ label, children, className = "" }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

// ── Internships (finder) ──────────────────────────────────────────────────────

export function InternshipTableSkeleton({ rows = 8 }) {
  return (
    <Loading label="Loading internships…" className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-6 px-4 py-3.5 bg-orange-50/70 border-b border-orange-100">
        {["w-6", "w-40", "w-20", "w-16", "w-16", "w-14", "w-16"].map((w, i) => <Bone key={i} warm className={`h-2.5 ${w} ${i > 2 ? "hidden lg:block" : ""}`} />)}
        <Bone warm className="h-2.5 w-14 ml-auto" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="skel-item flex items-center gap-4 px-4 py-4" style={item(i)}>
            <Bone className="h-3 w-5" />
            <Bone className="h-10 w-10 rounded-lg! shrink-0" />
            <div className="flex-1 min-w-0 space-y-2 max-w-sm">
              <Bone className="h-3.5 w-11/12" />
              <Bone className="h-2.5 w-1/2" />
            </div>
            <Bone className="hidden lg:block h-3 w-20" />
            <Bone className="hidden lg:block h-3 w-16" />
            <Bone className="hidden lg:block h-3 w-20" />
            <Bone className="hidden xl:block h-5 w-24 rounded-md!" />
            <div className="hidden lg:block space-y-1.5">
              <Bone className="h-3 w-20" />
              <Bone className="h-2 w-12" />
            </div>
            <div className="ml-auto flex gap-2">
              <Bone className="h-8 w-20 rounded-lg!" />
              <Bone warm className="h-8 w-20 rounded-lg!" />
            </div>
          </div>
        ))}
      </div>
    </Loading>
  );
}

export function InternshipCardSkeleton({ count = 4 }) {
  return (
    <Loading label="Loading internships…" className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skel-item bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4" style={item(i)}>
          <div className="flex gap-4 flex-1 min-w-0">
            <Bone className="hidden sm:block w-16 h-16 rounded-xl! shrink-0" />
            <div className="flex-1 space-y-2.5">
              <Bone warm className="h-4 w-20 rounded-md!" />
              <Bone className="h-4 w-4/5" />
              <Bone className="h-3 w-2/5" />
              <div className="flex flex-wrap gap-4 pt-1.5">
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-16" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:w-48 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
            <Bone className="h-6 w-28 rounded-lg!" />
            <Bone className="hidden sm:block h-8 w-24 rounded-md!" />
            <Bone warm className="h-10 w-32 rounded-xl!" />
          </div>
        </div>
      ))}
    </Loading>
  );
}

// ── SkillUps ──────────────────────────────────────────────────────────────────

export function SkillupCardsSkeleton({ count = 6 }) {
  return (
    <Loading label="Loading SkillUps…" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skel-item bg-white rounded-3xl border border-orange-100/70 p-5 space-y-4 shadow-sm" style={item(i)}>
          <div className="flex items-center justify-between">
            <Bone warm className="h-5 w-24" />
            <Bone className="h-5 w-16" />
          </div>
          <div className="space-y-2">
            <Bone className="h-4 w-11/12" />
            <Bone className="h-4 w-3/5" />
          </div>
          <div className="flex items-center gap-2.5">
            <Bone className="h-8 w-8 rounded-lg! shrink-0" />
            <Bone className="h-3 w-1/2" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((k) => <Bone key={k} className="h-11 rounded-xl!" />)}
          </div>
          <div className="flex gap-2.5 pt-1">
            <Bone className="h-10 flex-1 rounded-xl!" />
            <Bone warm className="h-10 flex-1 rounded-xl!" />
          </div>
        </div>
      ))}
    </Loading>
  );
}

export function SkillupTableSkeleton({ rows = 8 }) {
  return (
    <Loading label="Loading SkillUps…" className="bg-white rounded-3xl border border-orange-100/70 overflow-hidden shadow-sm">
      <div className="flex gap-6 px-5 py-4 bg-orange-50/70 border-b border-orange-100">
        {["w-8", "w-44", "w-24", "w-20", "w-20"].map((w, i) => <Bone key={i} warm className={`h-2.5 ${w}`} />)}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="skel-item flex items-center gap-6 px-5 py-4" style={item(i)}>
            <Bone className="h-3 w-8" />
            <div className="flex-1 space-y-2 max-w-md">
              <Bone className="h-3.5 w-11/12" />
              <Bone className="h-2.5 w-1/3" />
            </div>
            <Bone className="hidden md:block h-3 w-24" />
            <Bone className="hidden md:block h-3 w-20" />
            <Bone warm className="h-8 w-20 rounded-lg! ml-auto" />
          </div>
        ))}
      </div>
    </Loading>
  );
}

// ── Jobs (/latest-job-notifications) ──────────────────────────────────────────

export function JobCardSkeleton({ i = 0 }) {
  return (
    <div className="skel-item bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm" style={item(i)}>
      <div className="flex items-center gap-3">
        <Bone className="w-12 h-12 rounded-2xl! shrink-0" />
        <div className="space-y-2 flex-1">
          <Bone warm className="h-3.5 w-24" />
          <Bone className="h-3 w-36" />
        </div>
      </div>
      <div className="space-y-2">
        <Bone className="h-4 w-11/12" />
        <Bone className="h-4 w-3/5" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Bone className="h-10 rounded-xl!" />
        <Bone className="h-10 rounded-xl!" />
      </div>
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <Bone className="h-3 w-24" />
        <Bone warm className="h-9 w-28 rounded-xl!" />
      </div>
    </div>
  );
}

export function JobCardsSkeleton({ count = 6, className = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" }) {
  return (
    <Loading label="Loading jobs…" className={className}>
      {Array.from({ length: count }, (_, i) => <JobCardSkeleton key={i} i={i} />)}
    </Loading>
  );
}

/** Mirrors the jobs table: S No · Job Title · Qualification · Posts · Age Limit · Dates · Action. */
export function JobTableSkeleton({ rows = 8 }) {
  const cols = ["w-10", "w-[34%]", "w-[16%]", "w-[8%]", "w-[8%]", "w-[14%]", "w-[14%]"];
  return (
    <Loading label="Loading jobs…" className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
      <div className="flex bg-linear-to-r from-orange-50 to-amber-50 border-b border-amber-200">
        {cols.map((w, i) => (
          <div key={i} className={`${w} shrink-0 px-2 py-3.5 ${i ? "border-l border-amber-200" : ""}`}><Bone warm className="h-2.5 w-3/4" /></div>
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="skel-item flex border-b border-amber-100 last:border-0" style={item(r)}>
          <div className={`${cols[0]} shrink-0 px-2 py-4`}><Bone className="h-3 w-4" /></div>
          <div className={`${cols[1]} shrink-0 px-2 py-4 border-l border-amber-100 space-y-2`}>
            <Bone className="h-3.5 w-11/12" />
            <Bone className="h-3.5 w-2/3" />
            <Bone warm className="h-2.5 w-1/3" />
          </div>
          <div className={`${cols[2]} shrink-0 px-2 py-4 border-l border-amber-100 space-y-2`}>
            <Bone className="h-3 w-4/5" />
            <Bone className="h-3 w-1/2" />
          </div>
          <div className={`${cols[3]} shrink-0 px-2 py-4 border-l border-amber-100`}><Bone className="h-3 w-3/5" /></div>
          <div className={`${cols[4]} shrink-0 px-2 py-4 border-l border-amber-100`}><Bone className="h-3 w-4/5" /></div>
          <div className={`${cols[5]} shrink-0 px-2 py-4 border-l border-amber-100 space-y-2`}>
            <Bone className="h-3 w-4/5" />
            <Bone className="h-3 w-3/5" />
          </div>
          <div className={`${cols[6]} shrink-0 px-2 py-4 border-l border-amber-100 flex justify-center`}><Bone warm className="h-8 w-4/5 rounded-lg!" /></div>
        </div>
      ))}
    </Loading>
  );
}
