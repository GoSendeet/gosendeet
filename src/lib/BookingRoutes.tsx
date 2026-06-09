import { Outlet, Navigate } from "react-router-dom";

import { hasAuthSession } from "./authSession";

const BookingRoutes = () => {
  if (!hasAuthSession()) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default BookingRoutes;
