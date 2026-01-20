
import { lazy } from "react";
import {
  LayoutDashboard,
  Users as UsersIcon,
  BookOpen,
  Layers,
  Flag,
  Award,
  ClipboardCheck,
  Folder,
  Percent,
} from "lucide-react";

import withAuth from "../withAuth";
import { UserRoles } from "@/interface/user.type";
import PracticesPage from "@/pages/admin/practices/PracticesPage";
import CreatePracticePage from "@/pages/admin/practices/CreatePracticePage";

// 🔹 Lazy-loaded admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Users = lazy(() => import("@/pages/admin/Users"));
const CreateCourse = lazy(() => import("@/pages/admin/course/CreateCourse"));
const AllCourses = lazy(() => import("@/pages/admin/course/AllCourses"));
const MilestoneDashboardPage = lazy(() => import("@/pages/admin/milestone/Milestone"));
const EnrolmentPage = lazy(() => import("@/pages/admin/Enrolment/EnrolmentPage"));
const CategoryPage = lazy(() => import("@/pages/admin/category/CategoryPage"));
const AdminTestimonialsPage = lazy(() => import("@/pages/admin/testimonial/TestimonialPage"));
const AdminPromoPage = lazy(() => import("@/pages/admin/promo/AdminPromoPage"));
const UserPromoUsagePage = lazy(() => import("@/pages/admin/promo/UserPromoUsagePage"));
const AssignmentPage = lazy(() => import("@/pages/admin/assignment/AssignmentPage"));
const LessonFormMain = lazy(() => import("@/components/modules/lesson-editor/LessonFormMain"));
const LessonPage = lazy(() => import("@/pages/admin/lesson/LessonPage"));


export const adminRoutes = [
  {
    Component: withAuth(AdminDashboard, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(Users, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/users",
    name: "User Management",
    icon: UsersIcon,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(EnrolmentPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/enrollments",
    name: "Enrollment Management",
    icon: ClipboardCheck,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(CreateCourse, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/course/create",
    name: "Create Course",
    icon: BookOpen,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AllCourses, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/courses",
    name: "All Courses",
    icon: Layers,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(MilestoneDashboardPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/milestone",
    name: "Milestones",
    icon: Flag,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(LessonFormMain, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/lesson-create",
    name: "Create Lesson",
    icon: BookOpen,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(LessonPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/lesson",
    name: "All Lessons",
    icon: BookOpen,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AssignmentPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/assignment",
    name: "Assignments",
    icon: ClipboardCheck,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(PracticesPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/practice",
    name: "Practice",
    icon: ClipboardCheck,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(CreatePracticePage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/practices/create",
    name: "Practice",
    icon: ClipboardCheck,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(CategoryPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/category",
    name: "Category",
    icon: Folder,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AdminPromoPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/promos-managment",
    name: "Promos",
    icon: Percent,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(UserPromoUsagePage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/user-managment",
    name: "User Promos",
    icon: Percent,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AdminTestimonialsPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/testimonial",
    name: "Testimonials",
    icon: Award,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },

];
