const getDateOnly = (value) => {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

export const getDeadlineDayDifference = (value) => {
  const deadline = getDateOnly(value);
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((deadline.getTime() - today.getTime()) / msPerDay);
};

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