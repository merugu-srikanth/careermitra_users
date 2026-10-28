"use client";

import Link from "next/link";
import { FaSignInAlt, FaUserPlus, FaShieldAlt, FaArrowRight, FaUserGraduate } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import RegisterVideoCard from "./RegisterVideoCard";

// Internal links inside paragraph text
const INLINE_LINK = "text-orange-600 underline decoration-orange-300 underline-offset-2 hover:text-orange-700 hover:decoration-orange-500";

// "Get Personalized Job Alerts" block on the home page (content team copy — keep wording as is).
export default function HomePersonalizedUpdates() {
    const { token } = useAuth();

    return (
        <section className="w-full px-4 md:px-15 py-10 sm:py-14">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50 via-white to-green-50 p-6 sm:p-10 shadow-[0_20px_50px_-30px_rgba(249,115,22,0.45)]">
                <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-green-200/40 blur-3xl" />

                <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
                    {/* Text */}
                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-black leading-tight tracking-tight text-slate-900">
                            Get Personalized Job Alerts by Registering with <span className="text-orange-500">CareerMitra</span>
                        </h2>
                        <div className="mt-3 h-1 w-16 rounded-full bg-linear-to-r from-orange-500 to-green-500" />

                        <div className="mt-5 space-y-3 text-[15px] leading-[1.8] text-slate-600">
                            <p>
                                Finding the right career opportunity starts with the right information, and CareerMitra makes this easier. Candidates can register for a CareerMitra account and build a <Link href="/user-dashboard" className={INLINE_LINK}>personal dashboard</Link> by adding education details at the time of sign-up.
                            </p>
                            <p>
                                The dashboard provides the latest <strong className="font-semibold text-slate-800"><Link href="/latest-job-notifications" className={INLINE_LINK}>government job alerts</Link>, exam updates, <Link href="/internships" className={INLINE_LINK}>internships</Link>, and scholarships</strong> based on individual eligibility. Updates are customized individually to each profile, so important announcements are never missed.
                            </p>
                            <p>
                                Registration takes just a few minutes and opens the door to career updates suited to each candidate’s profile. Existing users can log in to the account to access the dashboard and stay connected with the latest opportunities.
                            </p>
                        </div>
                    </div>

                    {/* Right: How-to-register video, then the account actions.
                        Logged in: only the dashboard button. Logged out: Login / Register + privacy note. */}
                    <div className="space-y-4">
                    <RegisterVideoCard />
                    {token ? (
                        <div className="flex items-center justify-center">

                            <Link
                                href="/user-dashboard"
                                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-300"
                            >
                                <FaUserGraduate size={15} />
                                Go to Student Dashboard
                                <FaArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    ) : (
                    <div className="rounded-2xl border border-white bg-white/90 p-5 sm:p-6 shadow-lg shadow-orange-100/60 backdrop-blur-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600"
                                >
                                    <FaSignInAlt size={13} /> Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <FaUserPlus size={13} /> Register
                                </Link>
                            </div>

                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50/70 p-4">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                                <FaShieldAlt size={14} />
                            </span>
                            <p className="text-[13px] leading-relaxed text-slate-600">
                                <strong className="font-bold text-slate-800">Data Privacy and Security:</strong> Personal information is used only to identify relevant career opportunities and is handled securely in accordance with CareerMitra’s{" "}
                                <Link href="/privacy-policy" className="font-semibold text-green-700 underline-offset-2 hover:underline">privacy policy</Link>.
                            </p>
                        </div>
                    </div>
                    )}
                    </div>
                </div>
            </div>
        </section>
    );
}
