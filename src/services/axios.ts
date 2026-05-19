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

let redirected = false;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !redirected) {
      redirected = true; // Prevent repeat redirects
      clearAuthSession();
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
