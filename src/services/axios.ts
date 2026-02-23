import axios from "axios";
import { toast } from "sonner";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const APP_BASE_URL = window.location.origin.replace(/\/$/, "");

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

// Request interceptor to add authorization header if access token exists
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("authToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let redirected = false;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !redirected) {
      redirected = true; // Prevent repeat redirects
      sessionStorage.clear(); // clear all session data
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
