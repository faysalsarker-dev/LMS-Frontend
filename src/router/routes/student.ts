import { lazy } from "react";



const MyDashboard = lazy(() => import("@//pages/MyCourses/Dashboard"));

const Dashboard = lazy(() => import("@/pages/MyCourses/Dashboard"));
const CoursePlayer = lazy(() =>
  import("@/pages/Student/course/CoursePlayer").then((m) => ({
    default: m.CoursePlayer,
  }))
);
import Profile from "@/pages/profile/Profile";
import withAuth from "../withAuth";
import { UserRoles } from "@/interface/user.type";
import StudentDashboard from "@/pages/Student/dashboard/StudentDashboard";



export const studentRoutes = [
  {
    Component: Dashboard,
    path: "/dashboard/attention",
    name: "Student Dashboard",
  },
  { Component: Profile, path: "/profile", name: "Profile" },
  { Component: withAuth(CoursePlayer,[UserRoles.STUDENT,UserRoles.INSTRUCTOR,UserRoles.ADMIN,UserRoles.SUPER_ADMIN],true), path: "/course/video/:id", name: "Course Player" },
  { Component: withAuth(MyDashboard), path: "/my-courses", name: "My Courses" },
  { Component: withAuth(StudentDashboard), path: "/my-dashboard", name: "My Dashboard" },
];
