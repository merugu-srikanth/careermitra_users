import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { calculateProfileCompletion, flattenEducation } from "../utils/profileCompletion";

const AvatarSVG = ({ size = 64 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-2xl bg-orange-100 overflow-hidden flex items-end justify-center border-2 border-orange-200/50 shrink-0"
  >
    <svg viewBox="0 0 64 72" style={{ width: size }} fill="none">
      <rect x="14" y="42" width="36" height="30" rx="6" fill="#2d3a6b" />
      <path d="M24 42 L32 50 L40 42" stroke="#f97316" strokeWidth="1.5" fill="none" />
      <ellipse cx="32" cy="30" rx="14" ry="16" fill="#f4a674" />
      <ellipse cx="18" cy="30" rx="3" ry="4" fill="#f4a674" />
      <ellipse cx="46" cy="30" rx="3" ry="4" fill="#f4a674" />
      <path d="M18 24 Q32 13 46 24" fill="#f97316" />
      <rect x="21" y="11" width="22" height="14" rx="4" fill="#ea580c" />
      <rect x="15" y="22" width="34" height="4" rx="2" fill="#f97316" />
      <ellipse cx="27" cy="30" rx="2.5" ry="3" fill="white" />
      <ellipse cx="37" cy="30" rx="2.5" ry="3" fill="white" />
      <ellipse cx="27.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e" />
      <ellipse cx="37.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e" />
      <path d="M27 37 Q32 41 37 37" stroke="#c0622e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

const toDateOrNull = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  return dt && !isNaN(dt.getTime()) ? dt : null;
};

const normalizeProfilePayload = (payload) => {
  const userData = payload?.user || payload || {};
  const rawEducation = payload?.education || userData?.education || {};
  const sportsData = payload?.sports || userData?.sports || null;
  return { ...userData, education: flattenEducation(rawEducation), sports: sportsData };
};

export default function ProfileCard({ token }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, newCount: 0 });

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    return calculateProfileCompletion(profile);
  }, [profile]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch User Profile
        const profileRes = await axios.get("https://careermitra.in/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = profileRes.data?.data || profileRes.data || {};
        const normalized = normalizeProfilePayload(profileData);
        setProfile(normalized);

        // Fetch Stats (Recommended Jobs count)
        const storageKey = `cm_dashboard_seen_${normalized.id || normalized.email || "guest"}`;
        let seenStorage = {};
        try {
          const raw = localStorage.getItem(storageKey);
          seenStorage = raw ? JSON.parse(raw) : {};
        } catch (e) {}

        const jobsSeenAt = toDateOrNull(seenStorage.jobs_seen_at);

        const jobsRes = await axios.get("https://careermitra.in/api/user/recommended-jobs", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          params: { page: 1, limit: 100 }
        });

        const jobsData = jobsRes.data?.data || jobsRes.data || {};
        const jobs = jobsData.jobs || [];
        const totalJobs = jobsData.pagination?.total ?? jobs.length;
        const newJobsCount = jobs.filter((j) => {
          const created = toDateOrNull(j?.posted_date || j?.createdAt || j?.updatedAt);
          return created && (!jobsSeenAt || created > jobsSeenAt);
        }).length;

        setStats({ total: totalJobs, newCount: newJobsCount });
      } catch (err) {
        console.error("Error loading profile card data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (!token || loading || !profile) return null;

  const profileIncomplete = profileCompletion < 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-6 bg-[#fffbf7] border border-[#ffecd5] rounded-3xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        
        {/* Left: Avatar */}
        <AvatarSVG size={72} />

        {/* Right: Info + Progress + Stats */}
        <div className="flex-1 w-full min-w-0">
          <div className="text-center sm:text-left">
            <h2 className="text-slate-800 font-black text-lg truncate leading-tight">
              {profile.name || "Student User"}
            </h2>
            <p className="text-slate-500 text-xs truncate mt-0.5">
              {profile.email}
            </p>
          </div>

          {/* Progress Bar Row */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-500">Profile</span>
              <span className={profileIncomplete ? "text-amber-500" : "text-green-500"}>
                {profileCompletion}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  profileIncomplete ? "bg-amber-400" : "bg-green-500"
                }`}
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium text-center sm:text-left">
              {profileIncomplete
                ? "Add education to unlock job matches"
                : "Profile fully complete ✓"}
            </p>
          </div>

          {/* Bottom Stats boxes removed */}

        </div>

      </div>
    </div>
  );
}
