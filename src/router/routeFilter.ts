import { adminRoutes } from "./allRoutes";


type UserRole = "instructor" | "admin" | "super_admin";

export const getRoutesByRole = (role: UserRole) => {
  return adminRoutes.filter((route) => route.roles.includes(role));
};
