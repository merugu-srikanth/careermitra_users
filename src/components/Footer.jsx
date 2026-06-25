import { FaBell, FaSignInAlt, FaUserPlus, FaYoutube } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/NewLogo.png";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

function buildCategoryUrl(child, parents) {
  const parent = parents.find(p => p.id === child.parent_id);
  if (!parent) return "/articles";
  return `/${toSlug(parent.name, parent.slug)}/${toSlug(child.name, child.slug)}`;
}

export default function Footer() {
  const [cats, setCats] = useState({ parents: [], children: [] });

  useEffect(() => {
    fetch("https://careermitra.in/api/blogs/filters")
      .then(r => r.json())
      .then(data => {
        const d = data.data || data;
        setCats({ parents: d.parents || [], children: d.children || [] });
      })
      .catch(() => {});
  }, []);
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about-us" },
    { label: "Career Guide", to: "/career-guide" },
    { label: "Internship Guide", to: "/internship-guide" },
    { label: "Articles", to: "/government-jobs" },
    { label: "Contact", to: "/contact-us" },
    { label: "Terms of Service", to: "/terms-of-service" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Disclaimer", to: "/disclaimer" },
    { label: "Editorial Policy", to: "/editorial-policy" },
    { label: "Correction Policy", to: "/correction-policy" },
  ];

  const accountLinks = [
    { label: "Student Login", to: "/login", Icon: FaSignInAlt },
    { label: "Create Account", to: "/register", Icon: FaUserPlus },
  ];

  // const socialLinks = [
  //   { label: "Facebook", href: "#", Icon: FaFacebookF },
  //   { label: "Twitter", href: "#", Icon: FaTwitter },
  //   { label: "Instagram", href: "#", Icon: FaInstagram },
  //   { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  // ];

  const trustPoints = [
    "Government jobs only",
    "Daily opportunity updates",
    "Profile-based matching",
  ];

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-orange-200/20 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
      <div className="h-1 w-full bg-linear-to-r from-orange-500 via-amber-400 to-green-500" />

      {/* ── Popular Categories ── */}
      {cats.children.length > 0 && (
        <div className="border-b border-slate-800/70">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Popular Categories</h3>
            <div className="h-0.5 w-16 rounded-full bg-linear-to-r from-orange-500 to-amber-400 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2.5">
              {cats.children.map(child => (
                <Link
                  key={child.id}
                  to={buildCategoryUrl(child, cats.parents)}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-orange-300 transition-colors duration-200 whitespace-normal wrap-break-word"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                  {child.name} Jobs
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-orange-400/30 bg-linear-to-r from-orange-500/15 via-orange-400/10 to-green-500/15 p-5 shadow-lg shadow-black/20 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Career Mitra Alerts</p>
              <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">Get matched jobs before everyone else</h3>
              <p className="mt-1 text-sm text-slate-300">Personalized updates for eligible government opportunities.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600"
              >
                <FaUserPlus />
                Create Free Account
                <HiOutlineArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-2.5 text-sm font-bold text-slate-100 transition-colors duration-200 hover:border-orange-300 hover:text-orange-300"
              >
                <FaSignInAlt />
                Student Login
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm md:col-span-5 sm:p-6">
             <img src={logo} alt="Careermitra Logo" className="h-20 w-auto sm:h-24" />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
Your one-stop gateway for government jobs and career guidance across India.            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {trustPoints.map((point) => (
                <span key={point} className="rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <a
                href="https://www.youtube.com/@CareerMitraaa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Careermitra YouTube Channel"
                className="group inline-flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-600/10 px-5 py-3 text-red-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-600/20 hover:text-red-300"
              >
                <FaYoutube size={28} className="shrink-0 text-red-500 group-hover:text-red-400" />
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-sm font-black text-white">Careermitra</span>
                  <span className="text-xs font-medium text-red-400">@CareerMitraaa</span>
                </div>
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm md:col-span-3 sm:p-6">
            <h3 className="text-base font-bold text-white">Quick Links</h3>
            <div className="mt-2 h-0.5 w-14 rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
            <ul className="mt-4 grid grid-cols-1 gap-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="group inline-flex items-center gap-2 text-slate-300 transition-colors duration-200 hover:text-orange-300">
                    <span className="text-orange-400 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-green-500/20 md:col-span-4" style={{ background: "linear-gradient(145deg,#0f1e14 0%,#0d1f1a 50%,#0a1a12 100%)" }}>
            {/* glow blobs */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-500/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-orange-500/15 blur-2xl" />
            {/* dot grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

            <div className="relative p-5 sm:p-6">
              {/* Icon badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Live Alerts</span>
              </div>

              <h3 className="text-xl font-black leading-tight text-white">
                Never Miss {" "}
                <span className="bg-linear-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  a Job Alert
                </span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Smart job recommendations based on your education and profile details.
              </p>

              {/* divider */}
              <div className="my-4 h-px w-full bg-linear-to-r from-green-500/30 via-slate-700 to-transparent" />

              {/* CTA button */}
              <Link
                to="/register"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-black text-white shadow-lg shadow-green-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-green-500/30"
                style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <FaUserPlus size={14} />
                Subscribe for Job Alerts
                <HiOutlineArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {/* account links */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {accountLinks.map(({ label, to, Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-2 py-2.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-orange-400/50 hover:text-orange-300 text-center"
                  >
                    <Icon size={12} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="relative border-t border-slate-800/90 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 md:flex-row md:text-left lg:px-8">
          <p>© {new Date().getFullYear()} Careermitra. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms-of-service" className="hover:text-orange-400 transition-colors duration-200">Terms of Service</Link>
            <span className="text-slate-700">·</span>
            <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors duration-200">Privacy Policy</Link>
            <span className="text-slate-700">·</span>
            <Link to="/disclaimer" className="hover:text-orange-400 transition-colors duration-200">Disclaimer</Link>
            <span className="text-slate-700">·</span>
            <Link to="/editorial-policy" className="hover:text-orange-400 transition-colors duration-200">Editorial Policy</Link>
            <span className="text-slate-700">·</span>
            <Link to="/correction-policy" className="hover:text-orange-400 transition-colors duration-200">Correction Policy</Link>
            <span className="text-slate-700">·</span>
            <p>Built for aspirants across India.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}