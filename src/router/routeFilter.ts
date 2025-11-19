import { adminRoutes } from "./routes/admin";


type UserRole = "instructor" | "admin" | "super_admin";

export const getRoutesByRole = (role: UserRole) => {
  return adminRoutes.filter((route) => route.roles.includes(role));
};
