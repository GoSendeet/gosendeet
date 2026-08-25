import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { hasAuthSession } from "./authSession";
import { getDefaultRouteForRole, isDeveloperRole } from "./roles";

const DeveloperRoutes = () => {
  const navigate = useNavigate();
  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }

    if (!isDeveloperRole(role)) {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  if (isAuthenticated && isDeveloperRole(role)) {
    return <Outlet />;
  }

  return null;
};

export default DeveloperRoutes;
