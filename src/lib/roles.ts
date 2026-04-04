export const isAdminRole = (role: string | null) =>
  ["admin", "super_admin"].includes(role || "");

export const isFranchiseRole = (role: string | null) =>
  ["partner", "franchise"].includes((role || "").toLowerCase());

export const getDefaultRouteForRole = (role: string | null) => {
  if (role === "user") {
    return "/dashboard";
  }

  if (isFranchiseRole(role)) {
    return "/franchise";
  }

  if (isAdminRole(role)) {
    return "/admin-dashboard";
  }

  return "/signin";
};
