import Login from "@/pages/PublicPages/auth/Login";
import Register from "@/pages/PublicPages/auth/Register";
import { createBrowserRouter } from "react-router";
import Home from "./../layout/home/Home";
import { generateRoutes } from "./generateRoutes";
import { invisibleRoutes } from "./allRoutes";
import { AdminLayout } from "@/layout/admin/AdminLayout";
import NotFoundPage from "@/pages/PublicPages/ErrorPages/NotFoundPage";
import { publicRoutes } from "./routes/public";
import { adminInvicibleRoutes, adminRoutes } from "./routes/admin";
import { studentInvicibleRoutes, studentRoutes } from "./routes/student";
import AccessDenied from "@/pages/PublicPages/ErrorPages/AccessDenied";
import Unauthorized from "@/pages/PublicPages/ErrorPages/Unauthorized";
import StudentLayout from "@/layout/student/Student";
import withAuth from "./withAuth";
import MockTestDetailPage from "@/pages/StudentsPages/Mock-test/MockTestDetailPage";
import MockTestExamPage from "@/pages/StudentsPages/Mock-test/MockTestExamPage";


export const router = createBrowserRouter([
  {
    Component: Home,
    path: "/",
    children: [
      ...generateRoutes(publicRoutes),
      ...generateRoutes(invisibleRoutes),
      {
        Component: Register,
        path: "/register",
      },
      {
        Component: Login,
        path: "/login",
      },
    ],
  },

  {
    Component: StudentLayout,
    path: "/my-dashboard",
    children: [
      ...generateRoutes(studentRoutes),
      ...generateRoutes(studentInvicibleRoutes),
    ],
  },
    {
    Component: withAuth(MockTestDetailPage),
    path: "/mock-test/:slug",
  },
 {
    Component: withAuth(MockTestExamPage),
    path: "/mock-test/:slug/:sectionId",
 
  },



  {
    Component: AdminLayout,
    path: "/dashboard",
    children: [
      ...generateRoutes(adminRoutes),
      ...generateRoutes(adminInvicibleRoutes),
    ],
  },

  {
    Component: AccessDenied,
    path: "/access-denied",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  {
    Component: NotFoundPage,
    path: "*",
  },
]);
