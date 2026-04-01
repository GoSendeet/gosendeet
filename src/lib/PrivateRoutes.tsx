import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getDefaultRouteForRole } from "./roles";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");

  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!authToken) {
      navigate("/signin", { replace: true });
      return;
    }

    if (authToken && role !== "user") {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [authToken, role, navigate]);

  if (authToken && role === "user") {
    return <Outlet />;
  }

  return null;
};
export default PrivateRoutes;
