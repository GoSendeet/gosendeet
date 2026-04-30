import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { hasAuthSession } from "./authSession";
import { getDefaultRouteForRole, isAdminRole } from "./roles";

const AdminRoutes = () => {
  const navigate = useNavigate();
  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }

    if (isAuthenticated && !isAdminRole(role)) {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  if (isAuthenticated && isAdminRole(role)) {
    return <Outlet />;
  }

  return null;
};
export default AdminRoutes;
