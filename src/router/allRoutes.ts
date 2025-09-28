import { lazy } from "react";
import {
  LayoutDashboard,
  Users as UsersIcon,
  BookOpen,
  Layers,
  Flag,
} from "lucide-react";
import Home from "@/pages/home/Home";
import Courses from "@/pages/course/Courses";

// ✅ Lazy loaded pages
const CourseDetails = lazy(() => import("@/pages/course/CourseDetails"));
const Contact = lazy(() => import("@/pages/abouts/Contact"));
const About = lazy(() => import("@/pages/abouts/About"));

const Dashboard = lazy(() => import("@/pages/Student/Dashboard"));
const Profile = lazy(() => import("@/pages/Student/Profile"));
const CoursePlayer = lazy(() =>
  import("@/pages/Student/course/CoursePlayer").then((m) => ({
    default: m.CoursePlayer,
  }))
);

const OtpVerify = lazy(() => import("@/pages/auth/OtpVerify"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Users = lazy(() => import("@/pages/admin/Users"));
const CreateCourse = lazy(() => import("@/pages/admin/CreateCourse"));
const AllCourses = lazy(() => import("@/pages/admin/AllCourses"));
const MilestoneDashboardPage = lazy(() => import("@/pages/admin/Milestone"));
const LessonPage = lazy(() => import("@/pages/admin/LessonPage"));

// 🌍 Public routes
export const publicRoutes = [
  { Component: Home, path: "/", name: "Home" },
  { Component: Courses, path: "/courses", name: "Courses" },
  { Component: CourseDetails, path: "/courses/:slug", name: "Course Details" },
  { Component: Contact, path: "/contact", name: "Contact" },
  { Component: About, path: "/about", name: "About" },
];

// 🔑 Admin routes (with icons)
export const adminRoutes = [
  {
    Component: AdminDashboard,
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    Component: Users,
    path: "/dashboard/users",
    name: "User Management",
    icon: UsersIcon,
  },
  {
    Component: CreateCourse,
    path: "/dashboard/course/create",
    name: "Create Course",
    icon: BookOpen,
  },
  {
    Component: AllCourses,
    path: "/dashboard/courses",
    name: "All Courses",
    icon: Layers,
  },
  {
    Component: MilestoneDashboardPage,
    path: "/dashboard/milestone",
    name: "Milestones",
    icon: Flag,
  },
  {
    Component: LessonPage,
    path: "/dashboard/lesson",
    name: "Lessons",
    icon: Flag,
  },

];

// 🕶 Invisible routes
export const invisibleRoutes = [
  {
    Component: CourseDetails,
    path: "/courses/:slug",
    name: "Course Details",
  },
  { Component: OtpVerify, path: "/verify-account/:email", name: "Verify Account" },
  { Component: ForgotPassword, path: "/forget-password", name: "Forgot Password" },
  { Component: ResetPassword, path: "/reset-password", name: "Reset Password" },
];

// 🎓 Student routes
export const studentRoutes = [
  {
    Component: Dashboard,
    path: "/dashboard/attention",
    name: "Student Dashboard",
  },
  { Component: Profile, path: "/dashboard/profile", name: "Profile" },
  { Component: CoursePlayer, path: "/dashboard/video", name: "Course Player" },
];
