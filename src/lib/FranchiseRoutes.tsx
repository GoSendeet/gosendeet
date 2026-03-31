import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getDefaultRouteForRole, isFranchiseRole } from "./roles";

const FranchiseRoutes = () => {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!authToken) {
      navigate("/signin", { replace: true });
      return;
    }

    if (!isFranchiseRole(role)) {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [authToken, role, navigate]);

  if (authToken && isFranchiseRole(role)) {
    return <Outlet />;
  }

  return null;
};

export default FranchiseRoutes;
