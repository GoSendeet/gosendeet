import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "@/lib/authSession";

/**
 * Listens for cross-tab session changes via the `storage` event.
 * When another tab clears the auth session (logout or token expiry),
 * this tab clears its own sessionStorage and redirects to sign-in.
 */
export const useSessionSync = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "userId" && event.newValue === null) {
        clearAuthSession();
        navigate("/signin", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [navigate]);
};
