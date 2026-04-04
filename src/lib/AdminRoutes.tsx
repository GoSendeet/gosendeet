import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getDefaultRouteForRole, isAdminRole } from "./roles";

const AdminRoutes = () => {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!authToken) {
      navigate("/signin", { replace: true });
      return;
    }

    if (authToken && !isAdminRole(role)) {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [authToken, role, navigate]);

  if (authToken && isAdminRole(role)) {
    return <Outlet />;
  }

  return null;
};
export default AdminRoutes;
