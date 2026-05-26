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

const stringifyResponseData = (data: unknown): string => {
  if (!data) return "";
  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const responseData = data as Record<string, unknown>;
    return [
      responseData.message,
      responseData.error,
      responseData.detail,
      responseData.title,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return String(data);
};

const isUnauthorizedOrInvalidToken = (error: any) => {
  const status = error?.response?.status;
  const responseText = stringifyResponseData(error?.response?.data).toLowerCase();

  return (
    status === 401 ||
    responseText.includes("unauthorized") ||
    responseText.includes("invalid token") ||
    responseText.includes("invalid_token")
  );
};

let redirected = false;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isUnauthorizedOrInvalidToken(error)) {
      clearStoredAuthData();
    }

    if (isUnauthorizedOrInvalidToken(error) && !redirected) {
      redirected = true; // Prevent repeat redirects
      sessionStorage.setItem("sessionExpired", "true");
      // Check if user is on the  dashboard
      const isDashboard = window.location.pathname.includes("dashboard");
      if (isDashboard) {
        toast.error("User session expired");
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/signin";
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);
