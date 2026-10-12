import { getDaysLeft } from "./istDate";

// Whole days from today to the deadline, both as IST calendar days
// (0 = closes today, negative = closed). The old version used the browser's
// local midnight, which shifted the day for visitors outside India.
export const getDeadlineDayDifference = (value) => getDaysLeft(value);

export const isDeadlineExpired = (value) => {
  const days = getDeadlineDayDifference(value);
  return days !== null && days < 0;
};

export const getDeadlineStatusText = (value) => {
  const days = getDeadlineDayDifference(value);
  if (days === null) return "";

  if (days < 0) {
    const expiredDays = Math.abs(days);
    return `Expired ${expiredDays} day${expiredDays === 1 ? "" : "s"} ago`;
  }

  if (days === 0) return "Expires Today";
  return `Expires in ${days} day${days === 1 ? "" : "s"}`;
};