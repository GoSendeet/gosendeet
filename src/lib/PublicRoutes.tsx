import { Navigate, Outlet } from "react-router-dom";

import { getDefaultRouteForRole } from "./roles";

const PublicRoutes = () => {
  const authToken = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role");

  if (authToken) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
