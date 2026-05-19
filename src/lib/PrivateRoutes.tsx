import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { hasAuthSession } from "./authSession";
import { getDefaultRouteForRole } from "./roles";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }

    if (isAuthenticated && role !== "user") {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  if (isAuthenticated && role === "user") {
    return <Outlet />;
  }

  return null;
};
export default PrivateRoutes;
