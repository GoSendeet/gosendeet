import { Navigate, Outlet } from "react-router-dom";

import { hasAuthSession } from "./authSession";
import { getDefaultRouteForRole } from "./roles";

const PublicRoutes = () => {
  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role");

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
