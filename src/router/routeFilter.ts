import type { UserRole } from "@/interface";
import { adminRoutes } from "./routes/admin";




export const getRoutesByRole = (role: UserRole) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return adminRoutes.filter((route) => route.roles.includes(role as any));
};
