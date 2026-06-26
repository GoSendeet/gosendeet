import { Navigate, Outlet } from "react-router-dom";

import { hasAuthSession } from "./authSession";
import { getPreSigninQuoteDashboardRoute } from "./preSigninQuote";
import { getDefaultRouteForRole } from "./roles";

const PublicRoutes = () => {
  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role");

  if (isAuthenticated) {
    const quoteRoute =
      role === "user" ? getPreSigninQuoteDashboardRoute() : null;

    if (quoteRoute) {
      return (
        <Navigate
          to={quoteRoute.pathname}
          state={quoteRoute.state}
          replace
        />
      );
    }

    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
