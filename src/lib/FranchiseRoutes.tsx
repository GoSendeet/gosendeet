import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { hasAuthSession } from "./authSession";
import { getDefaultRouteForRole, isFranchiseRole } from "./roles";

const FranchiseRoutes = () => {
  const navigate = useNavigate();
  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
      return;
    }

    if (!isFranchiseRole(role)) {
      navigate(getDefaultRouteForRole(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  if (isAuthenticated && isFranchiseRole(role)) {
    return <Outlet />;
  }

  return null;
};

export default FranchiseRoutes;
