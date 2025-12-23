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


const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Users = lazy(() => import("@/pages/admin/Users"));
const CreateCourse = lazy(() => import("@/pages/admin/CreateCourse"));
const AllCourses = lazy(() => import("@/pages/admin/AllCourses"));
const MilestoneDashboardPage = lazy(() => import("@/pages/admin/Milestone"));
const LessonPage = lazy(() => import("@/pages/admin/LessonPage"));
import EnrolmentPage from "@/pages/Enrolment/EnrolmentPage";
import { CategoryPage } from "@/pages/admin/category/CategoryPage";

import AdminTestimonialsPage from "@/pages/admin/testimonial/TestimonialPage";
import AdminPromoPage from "@/pages/admin/promo/AdminPromoPage";
import UserPromoUsagePage from "@/pages/admin/promo/UserPromoUsagePage";
import AssignmentPage from "@/pages/admin/assignment/AssignmentPage";
import withAuth from "../withAuth";
import { UserRoles } from "@/interface";
import CreateLesson from "@/components/modules/CreateLesson/CreateLesson";


const AppSettings = lazy(() => import("@/pages/admin/app-setting/AppSettings"));

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
    Component: withAuth(CreateLesson,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/lesson",
    name: "Lessons",
    icon: BookOpen,
    roles:[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]

  },
  {
    Component: withAuth(AssignmentPage,[UserRoles.SUPER_ADMIN,UserRoles.ADMIN,UserRoles.INSTRUCTOR]),
    path: "/dashboard/assignment",
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