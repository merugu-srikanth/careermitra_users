import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 20, ...p }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...p}>
        {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
    </svg>
);

const GridIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const TableIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
);

const CloseIcon = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ArrowIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

const CalIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" />
    </svg>
);

const BriefIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const shimmer = {
    animate: { backgroundPosition: ["200% 0", "-200% 0"] },
    transition: { duration: 1.8, repeat: Infinity, ease: "linear" },
};

const SkeletonBase = ({ className }) => (
    <motion.div
        className={`rounded-lg ${className}`}
        style={{
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
        }}
        animate={shimmer.animate}
        transition={shimmer.transition}
    />
);

const GridSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-md border border-orange-50 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between">
            <SkeletonBase className="h-5 w-2/3" />
            <SkeletonBase className="h-5 w-14 rounded-full" />
        </div>
        <SkeletonBase className="h-4 w-1/2" />
        <div className="flex gap-2 mt-1">
            <SkeletonBase className="h-4 w-20" /><SkeletonBase className="h-4 w-24" />
        </div>
        <div className="pt-2 border-t border-gray-100 flex gap-2">
            <SkeletonBase className="h-8 flex-1" /><SkeletonBase className="h-8 flex-1" />
        </div>
    </div>
);

const TableRowSkeleton = () => (
    <tr>
        {[60, 40, 30, 30, 30, 80].map((w, i) => (
            <td key={i} className="px-4 py-3">
                <SkeletonBase className={`h-4 w-${w}`} style={{ width: `${w}%` }} />
            </td>
        ))}
    </tr>
);

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = ({ label }) => {
    const map = {
        permanent: "bg-green-100 text-green-700",
        contract: "bg-blue-100 text-blue-700",
        temporary: "bg-yellow-100 text-yellow-700",
    };
    const key = Object.keys(map).find((k) => label?.toLowerCase().includes(k));
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${map[key] || "bg-orange-100 text-orange-700"}`}>
            {label || "Job"}
        </span>
    );
};

const formatDateDDMMYYYY = (value) => {
    if (!value) return "—";

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split("-");
        return `${d}/${m}/${y}`;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    const dd = String(parsed.getDate()).padStart(2, "0");
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const yyyy = parsed.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

const getDaysLeftText = (value) => {
    if (!value) return "";

    const deadline = new Date(value);
    if (Number.isNaN(deadline.getTime())) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((deadline.getTime() - today.getTime()) / msPerDay);

    if (days < 0) {
        const expiredDays = Math.abs(days);
        return `Expired ${expiredDays} day${expiredDays === 1 ? "" : "s"} ago`;
    }

    if (days === 0) return "Expires Today";
    return `Expires in ${days} day${days === 1 ? "" : "s"}`;
};

const isDeadlineExpired = (value) => {
    if (!value) return false;

    const deadline = new Date(value);
    if (Number.isNaN(deadline.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    return deadline.getTime() < today.getTime();
};

const normalizeExternalUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    const v = value.trim();
    if (!v) return "";
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

const pickFirst = (obj, keys, fallback = "") => {
    for (const key of keys) {
        const value = obj?.[key];
        if (value !== undefined && value !== null && value !== "") return value;
    }
    return fallback;
};

const toDateOnly = (value) => {
    if (!value || typeof value !== "string") return "";
    return value.split("T")[0] || "";
};

const formatDateTime = (value) => {
    if (!value) return "Not specified";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const mapApiJob = (job) => {
    const postedRaw = pickFirst(job, ["postedDate", "posted_date"]);
    const deadlineRaw = pickFirst(job, ["applicationDeadline", "application_deadline"]);

    return {
        raw: job,
        id: pickFirst(job, ["_id", "id"]),
        jobSourceId: pickFirst(job, ["job_source_id", "jobSourceId"]),
        sourceName: pickFirst(job, ["source_name", "sourceName", "jobSource"]),
        categoryId: pickFirst(job, ["category_id", "categoryId"]),
        categoryName: pickFirst(job, ["category_name", "categoryName"]),
        title: pickFirst(job, ["title"]),
        category: pickFirst(job, ["jobType", "job_type"], "Job"),
        org: pickFirst(job, ["jobSource", "source_name", "sourceName"]),
        noOfPosts: pickFirst(job, ["numberOfPosts", "no_of_posts"]),
        age: pickFirst(job, ["ageRequirement", "age"]),
        qualifications: pickFirst(job, ["qualifications"]),
        applyLink: pickFirst(job, ["applyLink", "apply_link"]),
        notificationUrl: pickFirst(job, ["notificationUrl", "notificationURL", "notification_url"]),
        postedDateRaw: postedRaw,
        lastDateRaw: deadlineRaw,
        postedDate: toDateOnly(postedRaw),
        lastDate: toDateOnly(deadlineRaw),
        status: pickFirst(job, ["status"]),
        createdAt: pickFirst(job, ["createdAt"]),
        updatedAt: pickFirst(job, ["updatedAt"]),
    };
};

// ─── Grid Card ────────────────────────────────────────────────────────────────

const getIsNew = (postedDate) => {
    if (!postedDate) return false;
    const posted = new Date(postedDate);
    if (Number.isNaN(posted.getTime())) return false;
    const diffDays = (Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
};

const JobGridCard = ({ job }) => {
    const isExpired = isDeadlineExpired(job.lastDate);
    const daysLeft = getDaysLeftText(job.lastDate);
    const isNew = getIsNew(job.postedDate);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            whileHover={{
                y: -6,
                boxShadow: "0 20px 45px rgba(234,88,12,0.12)",
            }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden flex flex-col group transition-all"
        >
            {/* Top Gradient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400" />

            <div className="p-5 flex flex-col h-full">

                {/* Top Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="text-[15px] font-extrabold text-gray-900 leading-6 line-clamp-2">
                            {job.title}
                        </h3>

                        <p className="text-sm text-orange-600 font-semibold mt-1 line-clamp-1" title={job.org}>
                            {job.org}
                        </p>
                    </div>
                    {isNew && (
                        <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500 text-white uppercase tracking-wide animate-pulse">
                            New
                        </span>
                    )}
                </div>

                {/* Meta Section */}
                <div className="mt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Posted</span>
                        <span className="font-semibold text-green-600">{formatDateDDMMYYYY(job.postedDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Deadline</span>
                        <span className={`font-bold ${isExpired ? "text-red-500" : "text-orange-600"}`}>
                            {formatDateDDMMYYYY(job.lastDate)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Qualification</span>
                        <span className="font-medium text-right max-w-[60%] truncate block" title={job.qualifications}>
                            {job.qualifications || "—"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Age</span>
                        <span className="font-medium">{job.ageRequirement || job.age || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">No of Posts</span>
                        <span className="font-medium">{job.noOfPosts || "—"}</span>
                    </div>
                </div>

                <div className="mt-3 flex w-full flex-wra gap-2 justify-center text-center">
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.3 }}
                        className={` items-center w-full text-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full border ${isExpired
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-600 border-green-200"
                            }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full text-center ${isExpired ? "bg-red-500" : "bg-green-500"} animate-pulse`}
                        />
                        {isExpired ? "Closed" : "Active"}
                        {!isExpired && daysLeft && (
                            <span className="ml-1 text-center font-bold text-gray-700">
                                ({daysLeft})
                            </span>
                        )}
                    </motion.span>
                </div>

                {/* Spacer */}
                <div className="flex-1 min-h-[18px]" />

                {/* Bottom Buttons */}
                <div className="p border-t border-gray-100">
                    {/* <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onView(job.id)}
                        className="w-full mb-2 py-2.5 text-xs font-bold rounded-xl text-center bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all"
                    >
                        View More
                    </motion.button> */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <motion.a
                            whileTap={{ scale: 0.97 }}
                            href={normalizeExternalUrl(job.notificationUrl) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`py-2.5 text-xs font-bold rounded-xl text-center transition-all ${normalizeExternalUrl(job.notificationUrl)
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                            onClick={(e) => {
                                if (!normalizeExternalUrl(job.notificationUrl)) e.preventDefault();
                            }}
                        >
                            View Notification
                        </motion.a>
                        <motion.a
                            whileTap={{ scale: 0.97 }}
                            href={normalizeExternalUrl(job.applyLink) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`py-2.5 text-xs font-bold rounded-xl text-center transition-all ${normalizeExternalUrl(job.applyLink)
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                            onClick={(e) => {
                                if (!normalizeExternalUrl(job.applyLink)) e.preventDefault();
                            }}
                        >
                            Apply Now
                        </motion.a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Table Row ────────────────────────────────────────────────────────────────

const JobTableRow = ({ job, onView, idx, isLoggedIn, onViewQual }) => {
    const isNew = getIsNew(job.postedDate);
    return (
    <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
        className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors group"
    >
        <td className="px-4 py-3.5 max-w-[200px]">
            <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{job.title}</p>
                {isNew && <span className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-green-500 text-white uppercase">New</span>}
            </div>
            <p className="text-xs text-orange-500 font-medium truncate">{job.org}</p>
        </td>
        <td className="px-4 py-3.5 hidden md:table-cell">
            {/* <Badge label={job.category} /> */}


            <Badge label=                {job.category && job.category.length > 20
                    ? `${job.category.substring(0, 20)}...`
                    : (job.category || "—")} />



        </td>
        <td className="px-4 py-3.5 text-xs text-gray-600 hidden lg:table-cell">
            {job.noOfPosts || "—"}
        </td>
        <td className="px-4 py-3.5 text-xs hidden xl:table-cell">
            <span className="text-gray-600 max-w-[140px] block">
                {job.qualifications && job.qualifications.length > 30
                    ? `${job.qualifications.substring(0, 30)}...`
                    : (job.qualifications || "—")}
            </span>
            {job.qualifications && job.qualifications.length > 30 && (
                <button
                    onClick={() => onViewQual({ title: job.title, qualifications: job.qualifications })}
                    className="mt-1 text-[11px] font-semibold text-orange-500 hover:text-orange-700 hover:underline transition-colors block"
                >
                    View More ↓
                </button>
            )}
        </td>
        <td className="px-4 py-3.5 text-xs hidden xl:table-cell">
            <span className="text-gray-500">{formatDateDDMMYYYY(job.postedDate)}</span>
        </td>
        <td className="px-4 py-3.5 text-xs">
            <span className={job.lastDate ? "text-red-600 font-semibold" : "text-gray-400"}>
                {job.lastDate ? `${formatDateDDMMYYYY(job.lastDate)} (${getDaysLeftText(job.lastDate)})` : "—"}
            </span>
        </td>
        <td className="px-4 py-3.5">
            <div className="flex gap-2">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onView(job.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                    View
                </motion.button>
                <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={normalizeExternalUrl(job.applyLink) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${normalizeExternalUrl(job.applyLink)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    onClick={(e) => {
                        if (!normalizeExternalUrl(job.applyLink)) e.preventDefault();
                    }}
                >
                    Apply Now
                </motion.a>
            </div>
        </td>
    </motion.tr>
    );
};

// ─── Modal ─────────────────────────────────────────────────────────────────────

const JobModal = ({ job, loading, onClose, isLoggedIn }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {loading ? (
                <div className="p-10 flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full border-4 border-orange-100" />
                        <motion.div
                            className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-orange-500"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <p className="text-gray-500 font-medium">Fetching job details…</p>
                </div>
            ) : (
                <>
                    {/* Modal Header */}
                    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-7 text-white rounded-t-3xl overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",
                            backgroundSize: "20px 20px"
                        }} />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        >
                            <CloseIcon />
                        </button>
                        <div className="pr-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-2 block">
                                Job Details
                            </span>
                            <h2 className="text-xl md:text-2xl font-black leading-tight mb-1">{job?.title}</h2>
                            <p className="text-orange-100 text-sm font-medium">{job?.org}</p>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { label: "Category", value: job?.categoryName || job?.category, emoji: "📁" },
                                        { label: "Total Posts", value: job?.noOfPosts, emoji: "📊" },
                                        { label: "Age Limit", value: job?.age, emoji: "🎂" },
                                        // { label: "Qualification", value: job?.qualifications, emoji: "🎓" },
                                        { label: "Posted Date", value: formatDateDDMMYYYY(job?.postedDate), emoji: "📅" },
                                        {
                                            label: "Last Date",
                                            value: job?.lastDate
                                                ? `${formatDateDDMMYYYY(job?.lastDate)} (${getDaysLeftText(job?.lastDate)})`
                                                : "Not specified",
                                            emoji: "⏰",
                                            highlight: true,
                                        },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            className={`rounded-xl p-3.5 border ${item.highlight ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{item.emoji}</span>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{item.label}</p>
                                            </div>
                                            <p className={`text-sm font-bold leading-snug ${item.highlight ? "text-red-600" : "text-gray-800"}`}>
                                                {item.value || "Not specified"}
                                            </p>
                                        </motion.div>
                                    ))}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                    <p className="text-sm font-black text-gray-800 mb-3">Detail View</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {[
                                            // ["_id", job?.id],
                                            // ["job_source_id", job?.jobSourceId],
                                            ["source_name", job?.sourceName || job?.org],
                                            // ["category_id", job?.categoryId],
                                            ["category_name", job?.categoryName],
                                            ["title", job?.title],
                                            ["job_type", job?.category],
                                            ["posted_date", formatDateDDMMYYYY(job?.postedDate)],
                                            ["application_deadline", formatDateDDMMYYYY(job?.lastDate)],
                                            ["qualifications", job?.qualifications],
                                            ["age", job?.age],
                                            ["no_of_posts", job?.noOfPosts],
                                            ["status", job?.status],
                                            ["createdAt", formatDateTime(job?.createdAt)],
                                            ["updatedAt", formatDateTime(job?.updatedAt)],
                                            ["notification_url", normalizeExternalUrl(job?.notificationUrl) || "Not specified"],
                                            ["apply_link", normalizeExternalUrl(job?.applyLink) || "Not specified"],
                                            
                                        ].map(([key, value]) => (
                                            <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{key}</p>
                                                <p className="text-gray-800 break-all font-semibold">{value || "Not specified"}</p>
                                            </div>
                                        ))}
                                    </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={normalizeExternalUrl(job?.notificationUrl) || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center gap-2 w-full py-4 font-black text-base rounded-2xl shadow-lg transition-all ${normalizeExternalUrl(job?.notificationUrl)
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        onClick={(e) => {
                                            if (!normalizeExternalUrl(job?.notificationUrl)) e.preventDefault();
                                        }}
                                    >
                                        View Notification
                                    </motion.a>

                                    <motion.a
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={normalizeExternalUrl(job?.applyLink) || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center gap-2 w-full py-4 font-black text-base rounded-2xl shadow-lg transition-all ${normalizeExternalUrl(job?.applyLink)
                                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        onClick={(e) => {
                                            if (!normalizeExternalUrl(job?.applyLink)) e.preventDefault();
                                        }}
                                    >
                                        Apply Now
                                    </motion.a>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CareerHomeJobs() {
    const { token } = useAuth();
    const isLoggedIn = !!token;

    const { allJobs, loading: contextLoading } = useJobs();
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingSingle, setLoadingSingle] = useState(false);
    const [qualModal, setQualModal] = useState(null);

    const loading = contextLoading;

    const jobs = useMemo(() => {
        if (contextLoading) return [];
        return allJobs
            .filter((j) => {
                const t = String(j?.jobType || "").toLowerCase();
                return !t.includes("intern") && !t.includes("skillup") && !t.includes("skill up") && !t.includes("skill_up");
            })
            .sort((a, b) => new Date(b.createdAt || b.postedDateRaw || 0) - new Date(a.createdAt || a.postedDateRaw || 0))
            .slice(0, 8);
    }, [allJobs, contextLoading]);

    const fetchJobDetails = async (id) => {
        setLoadingSingle(true);
        setShowModal(true);
        setSelectedJob(null);
        try {
            const res = await fetch(`https://careermitra.in/api/jobs/${id}`);
            const data = await res.json();
            if (data.success) {
                setSelectedJob(mapApiJob(data.data));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSingle(false);
        }
    };

    return (
        <section className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 shadow-sm mb-5">
                        <span className="text-sm">✨</span>
                        <span className="text-orange-700 font-bold text-xs uppercase tracking-widest">
                            Fresh Opportunities
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-green-600 bg-clip-text text-transparent">
                        Latest Government Jobs 
                    </h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-1 w-28 mx-auto mb-5 bg-gradient-to-r from-orange-500 via-yellow-400 to-green-500 rounded-full"
                    />

                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        Discover the latest government job opportunities across India.
                        Updated daily with new positions in various sectors.
                    </p>
                </motion.div>

                {/* ── Toolbar: View Toggle ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between mb-6"
                >
                    <p className="text-sm text-gray-500 font-medium">
                        {loading ? "Loading jobs..." : `Showing latest ${jobs.length} jobs`}
                    </p>
                    <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        {[
                            { mode: "grid", Icon: GridIcon, label: "Grid" },
                            { mode: "table", Icon: TableIcon, label: "Table" },
                        ].map(({ mode, Icon: Ic, label }) => (
                            <motion.button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === mode
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <Ic /> {label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* ── Grid View ── */}
                <AnimatePresence mode="wait">
                    {viewMode === "grid" && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12"
                        >
                            {loading
                                ? [...Array(8)].map((_, i) => <GridSkeleton key={i} />)
                                : jobs.map((job) => (
                                    <JobGridCard key={job.id} job={job} />
                                ))}
                        </motion.div>
                    )}

                    {/* ── Table View ── */}
                    {viewMode === "table" && (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mb-12 bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                            {["Job Title / Source", "Type", "Posts", "Qualification", "Posted", "Last Date", "Action"].map((h, i) => (
                                                <th
                                                    key={h}
                                                    className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider ${i === 1 ? "hidden md:table-cell" :
                                                        i === 2 ? "hidden lg:table-cell" :
                                                            i === 3 ? "hidden xl:table-cell" :
                                                                i === 4 ? "hidden xl:table-cell" : ""
                                                        }`}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading
                                            ? [...Array(8)].map((_, i) => <TableRowSkeleton key={i} />)
                                            : jobs.map((job, i) => (
                                                <JobTableRow
                                                    key={job.id}
                                                    job={job}
                                                    onView={fetchJobDetails}
                                                    idx={i}
                                                    isLoggedIn={isLoggedIn}
                                                    onViewQual={setQualModal}
                                                />
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            {!loading && jobs.length === 0 && (
                                <div className="text-center py-12 text-gray-400">No jobs found</div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── View All Button ── */}
                <div className="text-center">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            to="/latest-job-notifications"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white font-black rounded-full shadow-xl hover:shadow-2xl transition-all text-base group"
                        >
                            <span>View All Opportunities</span>
                            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                                <ArrowIcon />
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ── Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <JobModal
                        job={selectedJob}
                        loading={loadingSingle}
                        isLoggedIn={isLoggedIn}
                        onClose={() => { setShowModal(false); setSelectedJob(null); }}
                    />
                )}
            </AnimatePresence>

            {/* ── Qualification Modal ── */}
            {qualModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setQualModal(null)}>
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-wider">Qualification Requirements</h3>
                            </div>
                            <button
                                onClick={() => setQualModal(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="overflow-y-auto px-6 py-5">
                            <h4 className="text-base font-bold text-gray-900 mb-3">{qualModal.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{qualModal.qualifications}</p>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setQualModal(null)}
                                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 shadow-md hover:shadow-lg transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes blob {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(30px,-50px) scale(1.1); }
          66%  { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
        </section>
    );
}