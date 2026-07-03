import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/NewLogo.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome, FaInfoCircle, FaBlog, FaPhoneAlt,
  FaSignInAlt, FaSignOutAlt, FaTachometerAlt,
  FaLinkedin, FaTwitter, FaWhatsapp, FaInstagram,
  FaFacebook, FaYoutube, FaChevronDown, FaTimes, FaBars,
  FaUser, FaEnvelope, FaBell, FaCalendarAlt
} from "react-icons/fa";
import { calculateProfileCompletion, flattenEducation } from "../utils/profileCompletion";
import { isDeadlineExpired } from "../utils/jobDeadline";
import ProfileCard from "./ProfileCard";

const API_BASE = "https://www.careermitra.in/api";

const catSlugify = (s = '') =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

/* ─── SOCIAL LINKS ─────────────────────────────────────────────────────────── */
const socials = [
  { Icon: FaLinkedin, href: "#", color: "hover:text-blue-600", label: "LinkedIn" },
  { Icon: FaTwitter, href: "#", color: "hover:text-sky-500", label: "Twitter" },
  { Icon: FaWhatsapp, href: "#", color: "hover:text-green-500", label: "WhatsApp" },
  { Icon: FaInstagram, href: "#", color: "hover:text-pink-500", label: "Instagram" },
  { Icon: FaFacebook, href: "#", color: "hover:text-blue-700", label: "Facebook" },
];

/* ─── NAV LINKS ────────────────────────────────────────────────────────────── */
const navLinks = [
  { name: "Home", path: "/", Icon: FaHome },
  { name: "About Us", path: "/about-us", Icon: FaInfoCircle },
  // { name: "Our Team", path: "/meet-our-team", Icon: FaUser },
  { name: "Latest Job Notifications", path: "/latest-job-notifications", Icon: FaInfoCircle },
  // { name: "Internship Guide", path: "/internship-guide", Icon: FaInfoCircle },
  {
    name: "Career",
    dropdown: [
      { name: "Career Overview", path: "/career-guide" },
      // { name: "Internship FAQ's", path: "/internship-guide" },
      { name: "Internship Opportunities", path: "/internships" },
    ],
  },
  { name: "Government Jobs", Icon: FaBlog, blogsDropdown: true },
  { name: "Events", path: "/events", Icon: FaCalendarAlt },
  { name: "Contact Us", path: "/contact-us", Icon: FaPhoneAlt },

  // {
  //   name: "INSTAGRAM",
  //   path: "/coming-soon",
  //   Icon: FaInstagram,
  //   iconOnly: true,
  //   iconBg: "bg-gradient-to-br from-pink-700 via-red-500 to-pink-400 text-white",
  //   title: "Instagram",
  // },
];

/* ─── AVATAR ───────────────────────────────────────────────────────────────── */
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

const normalizeProfilePayload = (payload) => {
  const userData = payload?.user || payload || {};
  const rawEducation = payload?.education || userData?.education || {};
  const sportsData = payload?.sports || userData?.sports || null;
  return { ...userData, education: flattenEducation(rawEducation), sports: sportsData };
};

/* ─── MAIN NAVBAR ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, token, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [jobsBellCount, setJobsBellCount] = useState({ activeCount: 0, newCount: 0, displayCount: 0, showNew: false });
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [blogCategories, setBlogCategories] = useState([]);
  const [hoveredParentId, setHoveredParentId] = useState(null);
  const [openMobileParent, setOpenMobileParent] = useState(null);
  const [isPWA, setIsPWA] = useState(false);

  const dropdownRef = useRef();

  /* fetch profile */
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const payload = res.data?.data || {};
        setProfileData(normalizeProfilePayload(payload));
      })
      .catch(console.error);
  }, [token]);

  /* expose SPA navigate function for Expo/WebView app wrapper */
  useEffect(() => {
    window.__spaNavigate = (path) => {
      try {
        navigate(path);
      } catch (err) {
        console.error("SPA navigate failed:", err);
      }
    };
    return () => {
      delete window.__spaNavigate;
    };
  }, [navigate]);

  /* scroll + outside click */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onOutside);
    };
  }, []);

  /* fetch categories from /api/blogs/filters */
  useEffect(() => {
    fetch("https://careermitra.in/api/blogs/filters")
      .then(r => r.json())
      .then(data => {
        if (!data.success) throw new Error("failed");
        const rawParents = data.data?.parents || [];
        const rawChildren = data.data?.children || [];
        const cats = rawParents
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(p => ({
            id: p.id,
            name: p.name,
            slug: catSlugify(p.name),
            parentId: null,
            children: rawChildren
              .filter(c => c.parent_id === p.id)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(c => ({ id: c.id, name: c.name, slug: catSlugify(c.name), parentId: p.id })),
          }));
        setBlogCategories(cats);
      })
      .catch(() => {});
  }, []);

  /* detect PWA standalone mode */
  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsPWA(mq.matches || window.navigator.standalone === true || !!window.isCareerMitraApp);
  }, []);

  /* close drawer on route change */
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const displayName = profileData?.name || user?.name || "User";
  const displayEmail = profileData?.email || user?.email || "";
  const profileCompletion = useMemo(
    () => calculateProfileCompletion(profileData),
    [profileData]
  );
  const profileIncomplete = !!token && profileCompletion < 100;

  const seenStorageKey = useMemo(() => {
    const ident = profileData?.id || profileData?.email || user?.id || user?.email || "guest";
    return `cm_dashboard_seen_${ident}`;
  }, [profileData?.id, profileData?.email, user?.id, user?.email]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const visibleNavLinks = useMemo(() =>
    navLinks.filter((link) => {
      if (link.name === "JOBS" && !token) return false;
      if (link.blogsDropdown && isPWA) return false;
      return true;
    }),
    [token, isPWA]
  );

  const categoryTree = useMemo(() => {
    const parents = blogCategories.filter(c => !c.parentId);
    const children = blogCategories.filter(c => c.parentId);
    if (parents.length === 0) {
      return [...blogCategories]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(c => ({ ...c, children: [] }));
    }
    return [...parents]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(parent => ({
        ...parent,
        children: children
          .filter(c => c.parentId === parent.id)
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [blogCategories]);

  useEffect(() => {
    if (!token) {
      setJobsBellCount({ activeCount: 0, newCount: 0, displayCount: 0, showNew: false });
      return;
    }

    const toDateOrNull = (d) => {
      if (!d) return null;
      const dt = new Date(d);
      return Number.isNaN(dt.getTime()) ? null : dt;
    };

    const jobDeadlineField = (job) =>
      job?.application_last_date ||
      job?.last_date ||
      job?.application_deadline ||
      job?.apply_last_date ||
      job?.deadline;

    (async () => {
      try {
        let jobsSeenAt = null;
        try {
          const raw = localStorage.getItem(seenStorageKey);
          const seen = raw ? JSON.parse(raw) : {};
          jobsSeenAt = toDateOrNull(seen.jobs_seen_at);
        } catch {
          jobsSeenAt = null;
        }

        const jobsRes = await axios.get(`${API_BASE}/user/recommended-jobs`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          params: { page: 1, limit: 100 },
        });

        const jobs = jobsRes?.data?.data?.jobs || jobsRes?.data?.jobs || [];
        const totalCount = jobsRes?.data?.data?.pagination?.total ?? jobs.length;

        const liveJobs = Array.isArray(jobs)
          ? jobs.filter((j) => !isDeadlineExpired(j?.application_deadline || jobDeadlineField(j)))
          : [];

        const jobsNewCount = liveJobs.filter((j) => {
          const created = toDateOrNull(j?.posted_date || j?.created_at || j?.updated_at);
          if (!created) return false;
          return !jobsSeenAt || created > jobsSeenAt;
        }).length;

        const onJobsTab =
          location.pathname === "/user-dashboard" &&
          new URLSearchParams(location.search).get("tab") === "jobs";

        const safeNewCount = onJobsTab ? 0 : jobsNewCount;
        const liveCount = liveJobs.length;

        setJobsBellCount({
          totalCount,
          activeCount: liveCount,
          newCount: safeNewCount,
          displayCount: liveCount,
          showNew: safeNewCount > 0,
        });
      } catch {
        setJobsBellCount((prev) => ({ ...prev, displayCount: prev.displayCount || 0 }));
      }
    })();
  }, [token, seenStorageKey, location.pathname, location.search]);

  const goToJobPostsTab = () => {
    navigate("/user-dashboard?tab=jobs");
    setProfileOpen(false);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ── TOP BAR (desktop only) ─────────────────────────────────────────── */}
      {/* <div className="hidden md:flex bg-orange-500 text-white text-xs py-1.5 px-6 items-center justify-between">
        <span className="font-medium tracking-wide">
          🎯 Careermitra — Empowering Youth Through Government Careers
        </span>
        <div className="flex items-center gap-3">
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div> */}

      {/* ── MAIN NAV ───────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
          : "bg-transparent"
          }`}
      >
        {/* top accent line */}
        <div className="h-0.5 w-full bg-linear-to-r from-orange-400 via-orange-500 to-green-500" />

        <div
          className={`px-4 md:px-15 flex items-center transition-all duration-300 ${scrolled ? "h-17" : "h-20"}`}
        >
          {/* ── MOBILE ROW: hamburger | logo center | youtube ── */}
          <div className="flex lg:hidden items-center w-full">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex-none flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors duration-200"
              aria-label="Open menu"
            >
              <FaBars size={18} />
            </button>
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="Careermitra"
                  className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-12" : "h-14"}`}
                />
              </Link>
            </div>
            <a
              href="https://www.youtube.com/@CareerMitraaa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CareerMitra YouTube Channel"
              className="flex-none inline-flex items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/10 p-2 text-red-400 transition-all duration-200 hover:border-red-500 hover:bg-red-600/20"
            >
              <FaYoutube size={24} className="text-red-500" />
            </a>
          </div>

          {/* ── DESKTOP ROW: logo | nav links + auth ── */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src={Logo}
                alt="Careermitra"
                className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}
              />
            </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-1">
            <div className="hidden lg:flex items-center gap-1">
              {visibleNavLinks.map((link) => {
                // 🔹 NORMAL LINK
                if (!link.dropdown && !link.blogsDropdown) {
                  const active = isActive(link.path);
                  const isIconOnly = link.iconOnly;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      title={link.title || link.name}
                      className={`group flex items-center justify-center transition-all duration-200 ${isIconOnly ? "w-12 h-12" : "px-4 py-2"} ${
                        active
                          ? "text-orange-600 font-bold"
                          : "text-slate-700 hover:text-orange-600"
                      }`}
                    >
                      {isIconOnly ? (
                        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${link.iconBg || "bg-slate-100 text-slate-800"}`}>
                          {link.Icon && <link.Icon size={28} />}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold">{link.name}</span>
                      )}
                    </Link>
                  );
                }

                // 🔹 CATEGORIES → Mega menu (parents left | children right)
                if (link.blogsDropdown) {
                  const hasMegaMenu = categoryTree.some(p => p.children?.length > 0);
                  const activeParent = categoryTree.find(p => p.id === hoveredParentId) || categoryTree[0];
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => { setOpenDropdown(null); setHoveredParentId(null); }}
                    >
                      <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50">
                        {link.name}
                        <FaChevronDown className={`transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`} size={12} />
                      </button>

                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 top-10 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50"
                            style={{ width: hasMegaMenu ? 540 : 280 }}
                          >
                            {/* All Government Jobs */}
                            <Link
                              to="/government-jobs"
                              className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 transition border-b border-orange-100"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 13, height: 13 }}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                              All Government Jobs
                            </Link>

                            {hasMegaMenu ? (
                              <div className="flex" style={{ minHeight: 260 }}>
                                {/* Left panel — parent categories */}
                                <div className="border-r border-slate-100 overflow-y-auto py-2" style={{ width: 200, maxHeight: 360, scrollbarWidth: "thin", scrollbarColor: "#f97316 #f3f4f6" }}>
                                  {categoryTree.map(parent => (
                                    <div
                                      key={parent.id}
                                      onMouseEnter={() => setHoveredParentId(parent.id)}
                                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all border-r-2 ${activeParent?.id === parent.id ? "bg-orange-50 border-orange-500" : "border-transparent hover:bg-slate-50"}`}
                                    >
                                      <Link
                                        to={`/${parent.slug}`}
                                        className={`flex-1 text-sm font-semibold truncate ${activeParent?.id === parent.id ? "text-orange-600" : "text-slate-700"}`}
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        {parent.name}
                                      </Link>
                                      {parent.children?.length > 0 && (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 11, height: 11, flexShrink: 0, marginLeft: 6, color: activeParent?.id === parent.id ? "#f97316" : "#cbd5e1" }}>
                                          <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Right panel — children of hovered parent */}
                                <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 360, scrollbarWidth: "thin", scrollbarColor: "#f97316 #f3f4f6" }}>
                                  {activeParent ? (
                                    activeParent.children?.length > 0 ? (
                                      <>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 px-2 mb-2">{activeParent.name}</p>
                                        <div className="grid grid-cols-2 gap-1">
                                          {activeParent.children.map(child => (
                                            <Link
                                              key={child.id}
                                              to={`/${activeParent.slug}/${child.slug}`}
                                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                                              onClick={() => setOpenDropdown(null)}
                                            >
                                              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
                                              {child.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-slate-400 text-sm py-10">
                                        No subcategories
                                      </div>
                                    )
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 py-10">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32, opacity: 0.35 }}>
                                        <polyline points="9 18 15 12 9 6" />
                                      </svg>
                                      <p className="text-xs text-center">Hover a category<br/>to see subcategories</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#f97316 #f3f4f6" }}>
                                {categoryTree.length === 0 ? (
                                  <div className="px-5 py-4 text-sm text-slate-400">Loading…</div>
                                ) : categoryTree.map(cat => (
                                  <Link
                                    key={cat.id}
                                    to={`/${cat.slug}`}
                                    className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // 🔹 REGULAR DROPDOWN (e.g. CAREER)
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50">
                      {link.name}
                      <FaChevronDown className={`transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`} size={12} />
                    </button>

                    <AnimatePresence>
                      {openDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-10 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                        >
                          <div className="max-h-100 overflow-y-auto">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                state={item.state}
                                className="block px-5 py-3 text-sm font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            {/* DESKTOP RIGHT */}
            {/* DESKTOP RIGHT */}
            <div className="hidden lg:flex items-center">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-1.5 flex items-center gap-3.5 shadow-2xs">
                {/* YouTube Link */}
                <a
                  href="https://www.youtube.com/@CareerMitraaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 flex items-center justify-center shadow-3xs"
                  title="YouTube Channel"
                >
                  <FaYoutube size={17} />
                </a>

                <div className="w-px h-5 bg-slate-200/60" />

                {token ? (
                  <>
                    {/* Jobs Bell Button */}
                    <div className="relative flex items-center">
                      <button
                        onClick={goToJobPostsTab}
                        className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all duration-200 flex items-center justify-center shadow-3xs"
                        title={`${jobsBellCount.totalCount ?? 0} total · ${jobsBellCount.activeCount ?? 0} live`}
                        aria-label="Open job notifications"
                      >
                        <FaBell size={15} />
                        <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center leading-none shadow-xs">
                          {jobsBellCount.totalCount ?? 0}
                        </span>
                        {jobsBellCount.newCount > 0 && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full animate-ping" />
                        )}
                      </button>
                    </div>

                    <div className="w-px h-5 bg-slate-200/60" />

                    {/* Profile Dropdown */}
                    <div
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={() => setProfileOpen(true)}
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 bg-transparent hover:bg-slate-50 pl-1 pr-2 py-1 rounded-xl transition-all duration-200"
                      >
                        <AvatarSVG size={28} />
                        <div className="flex flex-col items-start text-left min-w-0">
                          {/* <span className="text-xs font-black text-slate-700 leading-tight truncate max-w-20">{displayName}</span> */}
                          {/* <span className="text-[9px] text-slate-400 font-bold leading-none mt-0.5">Profile: {profileCompletion}%</span> */}
                        </div>
                        <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-slate-400">
                          <FaChevronDown size={9} />
                        </motion.span>
                      </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden z-50"
                        >
                        {/* profile header */}
                        <div className="bg-linear-to-br from-orange-500 to-orange-600 p-4">
                          <div className="flex items-center gap-3">
                            <AvatarSVG size={52} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-black text-base truncate">{displayName}</p>
                              <p className="text-orange-100 text-xs truncate">{displayEmail}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <div className={`rounded-2xl p-3 ${profileIncomplete ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-bold text-gray-700">Profile Completion</p>
                              <span  className={`text-xs font-black  ${profileIncomplete ? "text-amber-600" : "text-green-600"}`}>
                                {profileCompletion}% 
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/90 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${profileIncomplete ? "bg-amber-500" : "bg-green-500"}`}
                                style={{ width: `${profileCompletion}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2">
                              {profileCompletion < 100
                                ? "Add education to unlock job matches"
                                : "Profile fully complete ✓"}
                            </p>
                            {profileIncomplete && (
                              <button
                                onClick={() => {
                                  navigate("/user-profile-filling");
                                  setProfileOpen(false);
                                }}
                                className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors duration-200"
                              >
                                Complete Profile
                              </button>
                            )}
                          </div>
                          

                          <button
                            onClick={() => { navigate("/user-dashboard"); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors duration-200"
                          >
                            <FaTachometerAlt size={14} /> Dashboard
                          </button>
                          <button
                            onClick={() => { logout(navigate); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors duration-200"
                          >
                            <FaSignOutAlt size={14} /> Logout
                          </button>
                        </div>

                        {/* social strip */}
                        {/* <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-center gap-4">
                          {socials.map(({ Icon, href, label, color }) => (
                            <a key={label} href={href} aria-label={label} className={`text-gray-400 ${color} transition-colors duration-200`}>
                              <Icon size={15} />
                            </a>
                          ))}
                        </div> */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs shadow-orange-200 hover:shadow-md hover:shadow-orange-200 transition-all duration-200"
                >
                  <FaSignInAlt size={11} />Student Login
                </Link>
              )}
              </div>
            </div>
             {/* <Link
                  to="/login"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-200 transition-all duration-200"
                >
                  <FaSignInAlt size={13} /> Vender Login
                </Link> */}
          </div>


          </div>
        </div>

        {/* bottom shadow line */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-slate-300 to-transparent opacity-70" />
      </nav>

      {/* ── MOBILE / TABLET DRAWER ─────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 lg:hidden"
            />

            {/* DRAWER PANEL */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[82vw] max-w-85 z-70 lg:hidden flex flex-col"
              style={{ background: "#ffffff", boxShadow: "4px 0 32px rgba(0,0,0,0.12)" }}
            >

              {/* ── TOP HEADER ── */}
              <div className="shrink-0 relative overflow-hidden px-5 pt-5 pb-3"
                style={{ background: "linear-gradient(135deg,#fff7ed 0%,#ffffff 100%)" }}
              >
                {/* subtle orange glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle,#f97316,transparent)" }} />

                {/* close + logo row */}
                <div className="relative flex items-center justify-between">
                  <img src={Logo} alt="Careermitra" className="h-12 w-auto object-contain" />
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>

              {/* ── SCROLLABLE BODY ── */}
              <div className="flex-1 overflow-y-auto bg-white" style={{ scrollbarWidth: "none" }}>

                {/* User Block (Profile Card & Quick Links) */}
                <div className="px-5 pt-4 pb-3 border-b border-slate-100 bg-linear-to-b from-[#fffbf7] to-white">
                  {token ? (
                    <div className="space-y-4">
                      <ProfileCard token={token} />
                      <div className="grid grid-cols-2 gap-3 px-1">
                        <button
                          onClick={() => { navigate("/user-dashboard"); setDrawerOpen(false); }}
                          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-100 shadow-xs transition-all"
                        >
                          <FaTachometerAlt size={14} />
                          Dashboard
                        </button>
                        <button
                          onClick={() => { goToJobPostsTab(); setDrawerOpen(false); }}
                          className="relative flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 shadow-xs transition-all"
                        >
                          <div className="relative">
                            <FaBell size={14} />
                            {jobsBellCount.newCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            )}
                          </div>
                          Jobs ({jobsBellCount.displayCount})
                          {jobsBellCount.newCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] bg-green-500 text-white font-black animate-bounce">
                              New {jobsBellCount.newCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-sm shadow-orange-200"
                    >
                      <FaSignInAlt size={13} />
                      Login to your account
                    </Link>
                  )}
                </div>

                {/* NAV SECTION */}
                <div className="px-3 pt-4 pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] px-2 mb-2 text-slate-400">
                    Navigation
                  </p>
                  <nav className="space-y-0.5">
                    {visibleNavLinks.map((link) => {
                      if (!link.dropdown && !link.blogsDropdown) {
                        const active = isActive(link.path);
                        return (
                          <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                            style={{
                              background: active ? "#fff7ed" : "transparent",
                              border: active ? "1px solid #fed7aa" : "1px solid transparent",
                              color: active ? "#ea580c" : "#374151",
                            }}
                          >
                            {link.Icon && <link.Icon size={14} className="text-slate-400 shrink-0" />}
                            <span className="text-sm font-semibold">{link.name}</span>
                            {active && <span className="ml-auto w-2 h-2 rounded-full bg-orange-400" />}
                          </Link>
                        );
                      }

                      // CATEGORIES → accordion mega menu in mobile drawer
                      if (link.blogsDropdown) {
                        return (
                          <div key={link.name}>
                            <p className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{link.name}</p>
                            <Link
                              to="/government-jobs"
                              onClick={() => setDrawerOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 transition-all ml-2 mb-1"
                            >
                              Government Jobs
                            </Link>
                          </div>
                        );
                      }

                      return (
                        <div key={link.name}>
                          <p className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            {link.name}
                          </p>
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              state={item.state}
                              onClick={() => setDrawerOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all ml-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </nav>
                </div>

                {/* ACCOUNT SECTION */}
                {token && (
                  <div className="px-3 pb-4 pt-2">
                    <div className="my-3 h-px bg-slate-100" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] px-2 mb-2 text-slate-400">Account</p>
                    <div className="space-y-1">

                      {/* complete profile */}
                      {profileIncomplete && (
                        <button
                          onClick={() => { navigate("/user-profile-filling"); setDrawerOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-all"
                        >
                          <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                            <FaUser size={13} className="text-amber-500" />
                          </span>
                          <span className="text-sm font-semibold text-amber-600">Complete Profile</span>
                        </button>
                      )}

                      {/* logout */}
                      <button
                        onClick={() => { logout(navigate); setDrawerOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                      >
                        <span className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                          <FaSignOutAlt size={13} className="text-red-500" />
                        </span>
                        <span className="text-sm font-semibold text-red-500">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── FOOTER ── */}
              <div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-slate-50">
                <p className="text-center text-[11px] font-medium text-slate-400">
                  © 2026 <span className="text-orange-500 font-bold">Careermitra</span> · Hyderabad
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* spacer so content doesn't go under nav */}
      {/* <div className="h-16 md:h-[4.75rem]" /> */}
    </>
  );
}