import { lazy } from "react";
import {
  LayoutDashboard,
  Users as UsersIcon,
  BookOpen,
  Layers,
  Flag,
  Settings,
  Tag,
} from "lucide-react";
import Home from "@/pages/home/Home";
import Courses from "@/pages/course/Courses";
import withAuth from "./withAuth";
import { UserRoles } from "@/interface";
import { CategoryPage } from "@/pages/admin/category/CategoryPage";


const AppSettings = lazy(() => import("@/pages/admin/app-setting/AppSettings"));
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
    Component: withAuth(AdminDashboard,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]),
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]
  },
  {
    Component: withAuth(Users,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]),
    path: "/dashboard/users",
    name: "User Management",
    icon: UsersIcon,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]

  },
  {
    Component: withAuth(CreateCourse,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/course/create",
    name: "Create Course",
    icon: BookOpen,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(AllCourses,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/courses",
    name: "All Courses",
    icon: Layers,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(MilestoneDashboardPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/milestone",
    name: "Milestones",
    icon: Flag,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(LessonPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/lesson",
    name: "Lessons",
    icon: BookOpen,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(CategoryPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/category",
    name: "Category",
    icon: Tag,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
    {
    Component: withAuth(AppSettings,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]),
    path: "/dashboard/App-settings",
    name: "App Setting",
        icon: Settings,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]


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
