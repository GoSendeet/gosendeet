export const isAdminRole = (role: string | null) =>
  ["admin", "super_admin"].includes((role || "").toLowerCase());

export const isFranchiseRole = (role: string | null) =>
  ["partner", "franchise"].includes((role || "").toLowerCase());

export const isDeveloperRole = (role: string | null) =>
  (role || "").toLowerCase() === "developer";

export const getDefaultRouteForRole = (role: string | null) => {
  const normalizedRole = (role || "").toLowerCase();

  if (normalizedRole === "user") {
    return "/dashboard";
  }

  if (isDeveloperRole(normalizedRole)) {
    return "/developer-dashboard";
  }

  if (isFranchiseRole(normalizedRole)) {
    return "/franchise";
  }

  if (isAdminRole(normalizedRole)) {
    return "/admin-dashboard";
  }

  return "/signin";
};
