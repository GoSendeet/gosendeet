import axios from "axios";
import { toast } from "sonner";
import { clearAuthSession } from "@/lib/authSession";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const TOKEN_STORAGE_KEY_PATTERN = /(token|jwt|access|refresh)/i;

const removeTokenLikeKeys = (storage: Storage) => {
  const keysToRemove = Array.from({ length: storage.length }, (_, index) =>
    storage.key(index)
  ).filter((key): key is string => Boolean(key && TOKEN_STORAGE_KEY_PATTERN.test(key)));

  keysToRemove.forEach((key) => storage.removeItem(key));
};

const clearAccessibleCookies = () => {
  const hostnameParts = window.location.hostname.split(".");
  const domainVariants = hostnameParts.flatMap((_, index) => {
    const domain = hostnameParts.slice(index).join(".");
    return [domain, `.${domain}`];
  });
  const pathSegments = window.location.pathname
    .split("/")
    .filter(Boolean)
    .reduce<string[]>(
      (paths, segment) => [...paths, `${paths[paths.length - 1]}${segment}/`],
      ["/"]
    );

  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0]?.trim();
    if (!cookieName) return;

    pathSegments.forEach((path) => {
      document.cookie = `${cookieName}=; Max-Age=0; path=${path}`;
      domainVariants.forEach((domain) => {
        document.cookie = `${cookieName}=; Max-Age=0; path=${path}; domain=${domain}`;
      });
    });
  });
};

const clearStoredAuthData = () => {
  clearAuthSession();
  removeTokenLikeKeys(sessionStorage);
  removeTokenLikeKeys(localStorage);
  clearAccessibleCookies();
};


// Only treat a genuine HTTP 401 as an auth failure.
// String-matching on response body text caused false-positive logouts on 403s
// (e.g. "You are not authorized to perform this action") and other errors whose
// body happened to contain the word "unauthorized".
const isUnauthorized = (error: any) => error?.response?.status === 401;

// Key stored in sessionStorage so the guard survives same-tab page reloads on
// mobile (iOS Safari can restore a page from bfcache, resetting module-level
// variables, but sessionStorage persists within the same tab).
const REDIRECT_IN_PROGRESS_KEY = "auth_redirect_in_progress";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isUnauthorized(error)) {
      return Promise.reject(error);
    }

    // Prevent multiple simultaneous logout flows (parallel API calls all 401-ing)
    if (sessionStorage.getItem(REDIRECT_IN_PROGRESS_KEY) === "true") {
      return Promise.reject(error);
    }

    sessionStorage.setItem(REDIRECT_IN_PROGRESS_KEY, "true");
    clearStoredAuthData();

    // Show the expiry toast on any protected route the user was actively using.
    // The previous check only covered paths with "dashboard" in them, so
    // franchise users (/franchise) were silently logged out with no feedback.
    const path = window.location.pathname;
    const isProtectedPage =
      path.includes("dashboard") || path.startsWith("/franchise");

    if (isProtectedPage) {
      toast.error("Your session has expired. Please log in again.");
    }

    setTimeout(() => {
      window.location.href = "/signin";
    }, isProtectedPage ? 1500 : 0);

    return Promise.reject(error);
  }
);
