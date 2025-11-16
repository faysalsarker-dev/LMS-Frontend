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
import CheckoutPage from "@/pages/Checkout/CheckoutPage";
import EnrolmentPage from "@/pages/Enrolment/EnrolmentPage";
import Profile from "@/pages/Student/Profile";
import AdminTestimonialsPage from "@/pages/admin/testimonial/TestimonialPage";
import AdminPromoPage from "@/pages/admin/promo/AdminPromoPage";
import UserPromoUsagePage from "@/pages/admin/promo/UserPromoUsagePage";


const AppSettings = lazy(() => import("@/pages/admin/app-setting/AppSettings"));
const CourseDetails = lazy(() => import("@/pages/course/CourseDetails"));
const Contact = lazy(() => import("@/pages/abouts/Contact"));
const About = lazy(() => import("@/pages/abouts/About"));

const Dashboard = lazy(() => import("@/pages/MyCourses/Dashboard"));
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
const MyDashboard = lazy(() => import("@//pages/MyCourses/Dashboard"));

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
    Component: withAuth(EnrolmentPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN]),
    path: "/dashboard/enrollments",
    name: "Enrollment Management",
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
    Component: withAuth(AdminPromoPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/promos-managment",
    name: "Promos",
    icon: Tag,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(UserPromoUsagePage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/user-managment",
    name: "User Promos",
    icon: Tag,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(AdminTestimonialsPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/testimonial",
    name: "Testimonials",
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
  {
    Component: withAuth(CheckoutPage),
    path: "/checkout/:slug",
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
  { Component: Profile, path: "/profile", name: "Profile" },
  { Component: withAuth(CoursePlayer,[UserRoles.STUDENT,UserRoles.INSTRUCTOR,UserRoles.ADMIN,UserRoles.SUPER_ADMIN],true), path: "/course/video/:id", name: "Course Player" },
  { Component: withAuth(MyDashboard), path: "/my-courses", name: "My Courses" },
];
