"use client";

import { FaBell, FaSignInAlt, FaUserPlus, FaYoutube, FaWhatsapp, FaMapMarkerAlt, FaDirections } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import Link from "next/link";
import { useState, useEffect } from "react";
import logo from "../assets/NewLogo.png";
import { useAuth } from "@/context/AuthContext";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// Same number/message as FloatingWhatsApp.jsx — keep both in sync.
const WHATSAPP_NUMBER = "917794045533";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Career Mitra team, I need help with a job opportunity.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// Same office location as the contact page (contact-us/ContactSectionClient.jsx).
const OFFICE_MAP_LINK = "https://maps.app.goo.gl/VPuEeCzYzvKbVNt98";
const OFFICE_DIRECTIONS_LINK = "https://www.google.com/maps/dir/?api=1&destination=17.4344216,78.4449091&travelmode=driving";

function buildCategoryUrl(child, parents) {
  const parent = parents.find(p => p.id === child.parent_id);
  if (!parent) return "/articles";
  return `/${toSlug(parent.name, parent.slug)}/${toSlug(child.name, child.slug)}`;
}

export default function Footer({ initialCategories = null }) {
  const { token } = useAuth();
  const [cats, setCats] = useState(initialCategories || { parents: [], children: [] });

  useEffect(() => {
    if (initialCategories && (initialCategories.parents?.length > 0 || initialCategories.children?.length > 0)) {
      return;
    }
    fetch("https://careermitra.in/api/blogs/filters")
      .then(r => r.json())
      .then(data => {
        const d = data.data || data;
        setCats({ parents: d.parents || [], children: d.children || [] });
      })
      .catch(() => { });
  }, [initialCategories]);
  // URLs kept in sync with Navbar.jsx's navLinks / dropdown entries.
  const quickLinks = [
    { label: "Home", to: "/" },
        { label: "Internships / SkillUps", to: "/internships" },

    { label: "About Us", to: "/about-us" },
        { label: "Latest Job Notifications", to: "/latest-job-notifications" },

    { label: "Our Team", to: "/meet-our-team" },
    // { label: "Latest Job Notifications", to: "/latest-job-notifications" },
    { label: "PG Entrance", to: "/pg-entrance" },
    { label: "Digital Presence", to: "/digital-presence" },
    { label: "Government Jobs", to: "/government-jobs" },
    { label: "Contact Us", to: "/contact-us" },

    // { label: "Terms of Service", to: "/terms-of-service" },
    // { label: "Privacy Policy", to: "/privacy-policy" },
    // { label: "Disclaimer", to: "/disclaimer" },
    // { label: "Editorial Policy", to: "/editorial-policy" },
    // { label: "Correction Policy", to: "/correction-policy" },
  ];

  const accountLinks = [
    { label: "Student Login", to: "/login", Icon: FaSignInAlt },
    { label: "Create Account", to: "/register", Icon: FaUserPlus },
  ];

  const trustPoints = [
    "Government jobs only",
    "Daily opportunity updates",
    "Profile-based matching",
  ];

  return (
    <footer className="relative  overflow-hidden border-t border-orange-200/20 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
      <div className="h-1 w-full bg-linear-to-r from-orange-500 via-amber-400 to-green-500" />

      {/* ── Popular Categories — parents first (bold), then children (dimmer) ── */}
      {(cats.parents.length > 0 || cats.children.length > 0) && (
        <div className="border-b border-slate-800/70">
          <div className="mx-auto w-full px-4 md:px-15 py-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-1.5">Popular Categories</p>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug mb-2">
              Explore Government Jobs by Sector, State, and Organization
            </h3>
            <div className="h-0.5 w-16 rounded-full bg-linear-to-r from-orange-500 to-amber-400 mb-4" />
            <p className="max-w-7xl text-sm leading-relaxed text-slate-400 mb-6">
              Browse government jobs by sector, state, or organization to narrow your search. Sector-wise categories include banking, railways, SSC, UPSC, defense, teaching, and PSUs. You can also check state-wise recruitment for Telangana, Bihar, West Bengal, Rajasthan, and more, or find notifications from organizations such as ICAI, AIIMS, and EPFO. Each category gathers the latest job notifications and career guides, with details on eligibility, selection stages, and application deadlines.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2.5">
              {cats.parents.map(parent => (
                <Link
                  key={parent.id}
                  href={`/${toSlug(parent.name, parent.slug)}`}
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-200 hover:text-orange-300 transition-colors duration-200 whitespace-normal wrap-break-word"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {parent.name}
                </Link>
              ))}
              {cats.children.map(child => (
                <Link
                  key={child.id}
                  href={buildCategoryUrl(child, cats.parents)}
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

      <div className="relative mx-auto w-full px-4 md:px-15 pb-12 pt-10">
        {/* {!token && (
          <div className="mb-8 rounded-2xl border border-orange-400/30 bg-linear-to-r from-orange-500/15 via-orange-400/10 to-green-500/15 p-5 shadow-lg shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Career Mitra Alerts</p>
                <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">Get matched jobs before everyone else</h3>
                <p className="mt-1 text-sm text-slate-300">Personalized updates for eligible government opportunities.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600"
                >
                  <FaUserPlus />
                  Create Free Account
                  <HiOutlineArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-2.5 text-sm font-bold text-slate-100 transition-colors duration-200 hover:border-orange-300 hover:text-orange-300"
                >
                  <FaSignInAlt />
                  Student Login
                </Link>
              </div>
            </div>
          </div>
        )} */}

        {/* Brand + Quick Links sit open (no card) so they never stretch into empty boxes
            next to the taller Job Alert card. */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-8 md:items-start">
          <section className="md:col-span-4">
            <img src={logo.src || logo} alt="Careermitra Logo" className="block mx-auto sm:mx-0 h-16 w-auto sm:h-20" />
            <p className="mt-3 max-w-sm mx-auto sm:mx-0 text-center sm:text-left text-sm leading-relaxed text-slate-300">
              CareerMitra offers services that assist students, graduates, and job seekers in finding out more about government jobs, PG entrance exam updates, internships, and skills development. To students and qualified alumni who have startup ideas, it offers web development and digital marketing assistance to make their ideas turn into real businesses. Whether you are getting ready for your next job or starting something of your own, CareerMitra gives you the information and support to take the next step.
            </p>

          </section>

          <section className="md:col-span-4 md:pt-2">
            <h3 className="text-base font-bold text-white">Quick Links</h3>
            <div className="mt-2 h-0.5 w-14 rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link href={item.to} className="group inline-flex items-center gap-2 text-slate-300 transition-colors duration-200 hover:text-orange-300">
                    <span className="text-orange-400 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="md:col-span-4 md:pt-2">
            <h3 className="text-base font-bold text-white">Get in Touch</h3>
            <div className="mt-2 h-0.5 w-14 rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
            <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm mx-auto sm:mx-0">
              <a
                href="https://www.youtube.com/@Career_Mitra_Official"
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Careermitra YouTube Channel"
                className="group flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-600/10 px-3 py-2.5 text-red-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-600/20 hover:text-red-300 min-w-0"
              >
                <FaYoutube size={24} className="shrink-0 text-red-500 group-hover:text-red-400" />
                <div className="flex flex-col items-start leading-tight text-left min-w-0">
                  <span className="text-sm font-black text-white truncate max-w-full">YouTube</span>
                  <span className="block text-xs font-medium text-red-400 truncate max-w-full">Watch &amp; subscribe</span>
                </div>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Careermitra on WhatsApp"
                className="group flex items-center gap-3 rounded-xl border border-green-500/40 bg-green-600/10 px-3 py-2.5 text-green-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-500 hover:bg-green-600/20 hover:text-green-300 min-w-0"
              >
                <FaWhatsapp size={24} className="shrink-0 text-green-500 group-hover:text-green-400" />
                <div className="flex flex-col items-start leading-tight text-left min-w-0">
                  <span className="text-sm font-black text-white truncate max-w-full">WhatsApp</span>
                  <span className="block text-xs font-medium text-green-400 truncate max-w-full">Chat with us</span>
                </div>
              </a>
            </div>

            {/* Office address */}
            <div className="mt-5 flex items-start gap-3 max-w-sm mx-auto sm:mx-0 text-left">
              <FaMapMarkerAlt size={18} className="mt-0.5 shrink-0 text-orange-400" />
              <div>
                <a
                  href={OFFICE_MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <address className="not-italic text-sm leading-relaxed text-slate-300 group-hover:text-white transition-colors">
                    <span className="block font-semibold text-white">Career Mitra</span>
                    <span className="block">7th Floor, 806, Vasavi MPM Mall,</span>
                    <span className="block">Ameerpet, Hyderabad, Telangana – 500016, India</span>
                  </address>
                </a>
                <a
                  href={OFFICE_DIRECTIONS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-orange-400/40 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300 transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-500/20 hover:text-orange-200"
                >
                  <FaDirections size={13} />
                  Get Directions
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="relative border-t border-slate-800/90 bg-slate-950/80">
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-3 px-4 md:px-15 py-4 text-center text-xs text-slate-400 md:flex-row md:text-left lg:px-8">
          <p>© {new Date().getFullYear()} Careermitra. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
            <Link href="/terms-of-service" className="hover:text-orange-400 transition-colors duration-200">Terms of Service</Link>
            <span className="hidden sm:inline text-slate-700">·</span>
            <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors duration-200">Privacy Policy</Link>
            <span className="hidden sm:inline text-slate-700">·</span>
            <Link href="/disclaimer" className="hover:text-orange-400 transition-colors duration-200">Disclaimer</Link>
            <span className="hidden sm:inline text-slate-700">·</span>
            <Link href="/editorial-policy" className="hover:text-orange-400 transition-colors duration-200">Editorial Policy</Link>
            <span className="hidden sm:inline text-slate-700">·</span>
            <Link href="/correction-policy" className="hover:text-orange-400 transition-colors duration-200">Correction Policy</Link>
            <span className="hidden md:inline text-slate-700">·</span>
            <p className="w-full md:w-auto mt-1 md:mt-0 text-slate-400/80">Built for aspirants across India.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}