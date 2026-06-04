import { FaBell, FaFacebookF, FaInstagram, FaLinkedinIn, FaSignInAlt, FaTwitter, FaUserPlus } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../assets/NewLogo.png";

export default function Footer() {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about-us" },
    { label: "Career Guide", to: "/career-guide" },
    { label: "Internship Guide", to: "/internship-guide" },
    { label: "Blogs", to: "/blogs" },
    { label: "Contact", to: "/contact-us" },
  ];

  const accountLinks = [
    { label: "Student Login", to: "/login", Icon: FaSignInAlt },
    { label: "Create Account", to: "/register", Icon: FaUserPlus },
  ];

  const socialLinks = [
    { label: "Facebook", href: "#", Icon: FaFacebookF },
    { label: "Twitter", href: "#", Icon: FaTwitter },
    { label: "Instagram", href: "#", Icon: FaInstagram },
    { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  ];

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
            <img src={logo} alt="CareerMitra Logo" className="h-20 w-auto sm:h-24" />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
Your one-stop gateway for government jobs and career guidance across India.            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {trustPoints.map((point) => (
                <span key={point} className="rounded-full border border-orange-300/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-300"
                >
                  <Icon size={16} />
                </a>
              ))}
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

          <section className="rounded-2xl border border-green-400/30 bg-linear-to-br from-slate-900 via-slate-900 to-green-900/20 p-5 shadow-lg shadow-green-900/10 md:col-span-4 sm:p-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
              <FaBell size={18} />
            </div>
            <h3 className="text-lg font-black text-white">Never Miss an Alert</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Smart job recommendations based on your education and profile details.
            </p>

            <Link
              to="/register"
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all duration-200 hover:from-green-600 hover:to-green-700"
            >
              <FaUserPlus />
              Subscribe for Job Alerts
              <HiOutlineArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {accountLinks.map(({ label, to, Icon }) => (
                <Link key={to} to={to} className="inline-flex items-center gap-2 text-slate-300 transition-colors duration-200 hover:text-orange-300">
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="relative border-t border-slate-800/90 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 md:flex-row md:text-left lg:px-8">
          <p>© {new Date().getFullYear()} CareerMitra. All rights reserved.</p>
          <p>Built for aspirants across India.</p>
        </div>
      </div>
    </footer>
  );
}