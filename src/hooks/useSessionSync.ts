import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession, setupCrossTabSync } from "@/lib/authSession";

/**
 * Handles cross-tab session lifecycle:
 * - Responds to REQUEST_SESSION from new tabs (setupCrossTabSync)
 * - Redirects to sign-in when another tab logs out (storage event)
 */
export const useSessionSync = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cleanupCrossTabSync = setupCrossTabSync();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "authSession" && event.newValue === null) {
        clearAuthSession();
        navigate("/signin", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      cleanupCrossTabSync();
    };
  }, [navigate]);
};
