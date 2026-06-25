import { getDeadlineStatusText, isDeadlineExpired } from "../utils/jobDeadline";

const normalizeExternalUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

const formatDateDDMMYYYY = (value) => {
  if (!value) return "-";

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

const getIsNew = (postedDate) => {
  if (!postedDate) return false;
  const posted = new Date(postedDate);
  if (Number.isNaN(posted.getTime())) return false;
  const diffDays = (Date.now() - posted.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};

export default function AllJobCard({ title, org, lastDate, postedDate, location, applyLink, notificationUrl, noOfPosts, age, qualifications, category }) {
  const isExpired = isDeadlineExpired(lastDate);
  const deadlineStatusText = getDeadlineStatusText(lastDate);
  const isNew = getIsNew(postedDate);

  const handleApply = (e) => {
    e.preventDefault();
    const url = normalizeExternalUrl(applyLink);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNotification = (e) => {
    e.preventDefault();
    if (isExpired || !notificationUrl) return;
    const url = normalizeExternalUrl(notificationUrl);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400" />

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-[15px] font-extrabold text-gray-900 leading-6 line-clamp-2">
              {title}
            </h2>

            <p className="text-sm text-orange-600 font-semibold mt-1 line-clamp-1" title={org}>
              {org}
            </p>
          </div>

          {isNew && (
            <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500 text-white uppercase tracking-wide animate-pulse">
              New
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Posted</span>
            <span className="font-semibold text-green-600">{formatDateDDMMYYYY(postedDate)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Deadline</span>
            <span className={`font-bold ${isExpired ? "text-red-500" : "text-orange-600"}`}>
              {formatDateDDMMYYYY(lastDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Qualification</span>
            <span className="font-medium text-right max-w-[60%] truncate block" title={qualifications}>
              {qualifications || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Age</span>
            <span className="font-medium">{age || "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">No of Posts</span>
            <span className="font-medium">{noOfPosts || "-"}</span>
          </div>
        </div>

        <div className="mt-3 flex w-full gap-2 justify-center text-center">
          <span
            className={`w-full text-center text-[11px] font-semibold px-3 py-1 rounded-full border ${isExpired
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-green-50 text-green-600 border-green-200"
              }`}
          >
            {isExpired ? "Closed" : "Active"}
            {!isExpired && deadlineStatusText && (
              <span className="ml-1 text-center font-bold text-gray-700">
                ({deadlineStatusText})
              </span>
            )}
          </span>
        </div>

        <div className="flex-1 min-h-[18px]" />

        <div className="border-t border-gray-100 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleNotification}
              disabled={isExpired || !notificationUrl}
              className={`py-2.5 text-xs font-bold rounded-xl text-center transition-all ${isExpired || !notificationUrl
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
                }`}
            >
              View Notification
            </button>

            <button
              onClick={handleApply}
              disabled={isExpired}
              className={`py-2.5 text-xs font-bold rounded-xl text-center transition-all ${isExpired
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg"
                }`}
            >
              {isExpired ? "Closed" : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}