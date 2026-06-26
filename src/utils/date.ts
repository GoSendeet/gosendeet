import {
  formatBackendUtcDate,
  formatBackendUtcTime,
  parseBackendUtcDate,
} from "@/lib/timezone";

export const formatDateTime = (iso: string) => {
  const d = parseBackendUtcDate(iso);

  if (!d) {
    return {
      date: "N/A",
      time: "N/A",
      month: "N/A",
      day: 0,
      dateString: "",
    };
  }

  return {
    date: formatBackendUtcDate(iso, { localeMatcher: "best fit" }).replace(",", ""),
    time: formatBackendUtcTime(iso),
    month: formatBackendUtcDate(iso, { month: "long", day: undefined, year: undefined }),
    day: Number(formatBackendUtcDate(iso, { day: "numeric", month: undefined, year: undefined })),
    dateString: formatBackendUtcDate(iso, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};
