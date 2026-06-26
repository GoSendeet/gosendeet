export const USER_TIMEZONE_STORAGE_KEY = "userTimezone";

const FALLBACK_TIMEZONE = "UTC";

const hasExplicitOffset = (value: string) =>
  /(?:z|[+-]\d{2}:?\d{2})$/i.test(value.trim());

const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value.trim());

export const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIMEZONE;
  } catch {
    return FALLBACK_TIMEZONE;
  }
};

export const storeCurrentUserTimezone = (timezone = getBrowserTimezone()) => {
  sessionStorage.setItem(USER_TIMEZONE_STORAGE_KEY, timezone);
  localStorage.setItem(USER_TIMEZONE_STORAGE_KEY, timezone);
  return timezone;
};

export const getStoredUserTimezone = () =>
  sessionStorage.getItem(USER_TIMEZONE_STORAGE_KEY) ||
  localStorage.getItem(USER_TIMEZONE_STORAGE_KEY) ||
  getBrowserTimezone();

export const clearStoredUserTimezone = () => {
  sessionStorage.removeItem(USER_TIMEZONE_STORAGE_KEY);
  localStorage.removeItem(USER_TIMEZONE_STORAGE_KEY);
};

export const ensureCurrentUserTimezoneStored = () => {
  const currentTimezone = getBrowserTimezone();
  const storedTimezone = getStoredUserTimezone();

  if (storedTimezone !== currentTimezone) {
    return storeCurrentUserTimezone(currentTimezone);
  }

  sessionStorage.setItem(USER_TIMEZONE_STORAGE_KEY, storedTimezone);
  localStorage.setItem(USER_TIMEZONE_STORAGE_KEY, storedTimezone);
  return storedTimezone;
};

export const parseBackendUtcDate = (value?: string | number | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(" ", "T");
  if (isDateOnly(normalized)) {
    const [year, month, day] = normalized.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(
    hasExplicitOffset(normalized)
      ? normalized
      : `${normalized}Z`,
  );

  return isNaN(date.getTime()) ? null : date;
};

export const formatBackendUtcDateTime = (
  value?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = {},
) => {
  const date = parseBackendUtcDate(value);
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: getStoredUserTimezone(),
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  }).format(date);
};

export const formatBackendUtcDate = (
  value?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = {},
) => {
  const date = parseBackendUtcDate(value);
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: getStoredUserTimezone(),
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
};

export const formatBackendUtcTime = (
  value?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = {},
) => {
  const date = parseBackendUtcDate(value);
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: getStoredUserTimezone(),
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...options,
  }).format(date);
};
