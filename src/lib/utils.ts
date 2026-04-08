import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TWClassNames } from "./types";
import CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayToString(data: string[], separator: string) {
  return data.join(separator);
}

export function cls(
  ...classNames: (TWClassNames | string | null | undefined | false)[]
) {
  const validClasses = classNames.filter(
    (className) => !!className
  ) as string[];
  return arrayToString(validClasses, " ");
}

export function formatTimestampToReadable(dateString: string): string {
  const date = new Date(dateString);

  // Extract parts
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert to 12-hour format

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm}, ${day} ${month} ${year}`;
}

export function timeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);

  if (isNaN(past.getTime())) return "Invalid date";

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const weeks = Math.floor(seconds / 604800);

  // More accurate month/year calculation using calendar math
  const yearDiff = now.getFullYear() - past.getFullYear();
  const monthDiff = now.getMonth() - past.getMonth() + yearDiff * 12;
  const months = Math.floor(monthDiff);
  const years = Math.floor(monthDiff / 12);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}


// Month mapping in one place
const monthMap: Record<
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec",
  number
> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

// Helper to format a single date string
function formatDateWithYear(dateStr: string): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthAbbr = dateStr.split(" ")[2] as keyof typeof monthMap;

  const dateYear =
    monthMap[monthAbbr] < currentMonth ? currentYear + 1 : currentYear;

  return new Date(`${dateStr} ${dateYear}`).toISOString().split("T")[0];
}

// Universal parser
export function parseDateInput(input: string) {
  if (input.includes(" - ")) {
    const startStr = input.split(" - ")[0];
    return formatDateWithYear(startStr);
  } else {
    return formatDateWithYear(input);
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

// Example:
// console.log(formatDate("2025-08-19")); // "19 Aug 2025"

// utils/inputValidators.ts
export const allowOnlyNumbers = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9]/.test(event.key) &&
    event.key !== "+" &&
    event.key !== "." &&
    event.key !== "Backspace" &&
    event.key !== "Tab" &&
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight"
  ) {
    event.preventDefault();
  }
};

export function formatTo12Hour(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Example
// const formatted = formatTo12Hour("2025-08-27T17:17:55.297429");
// console.log(formatted); // 👉 "5:17 PM"

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const time = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month} ${year}, ${time}`;
}


// Example
// const formatted = formatDateTime("2023-05-27T17:17:55.297429");
// console.log(formatted); // 👉 "05:17 PM, 27 May 2023"

export function formatStatus(status: string) {
  return status
    ?.toLowerCase()
    .replace(/_/g, " ") // replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
}

export const toDateTimeLocalInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);

  return local.toISOString().slice(0, 16);
};

export const toISOFromLocalInput = (value?: string | null) => {
  if (!value) return undefined;

  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;

  return date.toISOString();
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong"
) => {
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  }

  return fallback;
};

export const formatToDatetimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function normalizeBase64Ciphertext(value: string) {
  const normalized = value.trim().replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;

  if (padding === 0) return normalized;

  return normalized.padEnd(normalized.length + (4 - padding), "=");
}

export function decryptAES256(encryptedText: string, key?: string | null) {
  const normalizedKey = key?.trim();

  if (!normalizedKey) {
    throw new Error("AES-256 key is missing");
  }

  if (normalizedKey.length !== 32) {
    throw new Error("AES-256 key must be exactly 32 characters long");
  }

  if (!encryptedText?.trim()) {
    throw new Error("Encrypted value is missing");
  }

  try {
    const normalizedCiphertext = normalizeBase64Ciphertext(encryptedText);
    const ciphertext = CryptoJS.enc.Base64.parse(normalizedCiphertext);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Utf8.parse(normalizedKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Unable to decrypt payload");
    }

    return decryptedText;
  } catch (error) {
    throw new Error(
      error instanceof Error ? `Unable to decrypt payload: ${error.message}` : "Unable to decrypt payload"
    );
  }
}
