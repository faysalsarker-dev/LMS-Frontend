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
  ClipboardList,
} from "lucide-react";

import withAuth from "../withAuth";
import { UserRoles } from "@/interface/user.type";
import CreatePracticePage from "@/pages/AdminPages/practice/CreatePracticePage";
import PracticesPage from "@/pages/AdminPages/practice/PracticesPage";
import ViewPracticePage from "@/pages/AdminPages/practice/ViewPracticePage";
import EditLessonPage from "@/pages/AdminPages/lesson/EditLessonPage";
import MockTestsPage from "@/pages/AdminPages/mockTest/MockTestsPage";
import CreateMockTestPage from "@/pages/AdminPages/mockTest/CreateMockTestPage";
import MockTestDetailPage from "@/pages/AdminPages/mockTest/MockTestDetailPageAdmin";
import MockTestSectionPage from "@/pages/AdminPages/mockTest/MockTestSectionPage";
import MockTestSectionsPage from "@/pages/AdminPages/mockTest/MockTestSectionsPage";
import OverViewPage from "@/pages/AdminPages/overView/AdminDashboardOverview";

// 🔹 Lazy-loaded admin pages
const Users = lazy(() => import("@/pages/AdminPages/users/Users"));
const CreateCourse = lazy(
  () => import("@/pages/AdminPages/course/CreateCourse"),
);
const AllCourses = lazy(() => import("@/pages/AdminPages/course/AllCourses"));
const MilestoneDashboardPage = lazy(
  () => import("@/pages/AdminPages/milestone/Milestone"),
);
const EnrolmentPage = lazy(
  () => import("@/pages/AdminPages/Enrolment/EnrolmentPage"),
);
const CategoryPage = lazy(
  () => import("@/pages/AdminPages/category/CategoryPage"),
);
const AdminTestimonialsPage = lazy(
  () => import("@/pages/AdminPages/testimonial/TestimonialPage"),
);
const AdminPromoPage = lazy(
  () => import("@/pages/AdminPages/promo/AdminPromoPage"),
);
const UserPromoUsagePage = lazy(
  () => import("@/pages/AdminPages/promo/UserPromoUsagePage"),
);
const AssignmentPage = lazy(
  () => import("@/pages/AdminPages/assignment/AssignmentPage"),
);
const LessonFormMain = lazy(
  () => import("@/components/admin/lesson-editor/LessonFormMain"),
);
const LessonPage = lazy(() => import("@/pages/AdminPages/lesson/LessonPage"));

export const adminRoutes = [
  {
    Component: withAuth(OverViewPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
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
    Component: withAuth(EnrolmentPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
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
    Component: withAuth(MilestoneDashboardPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/milestone",
    name: "Milestones",
    icon: Flag,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(LessonFormMain, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
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
    Component: withAuth(CreatePracticePage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/practices/create",
    name: "Create Practices",
    icon: BookOpen,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(PracticesPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/practices",
    name: "Create Practices",
    icon: BookOpen,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AssignmentPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/assignment",
    name: "Assignments",
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
    Component: withAuth(AdminPromoPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/promos-managment",
    name: "Promos",
    icon: Percent,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(UserPromoUsagePage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/user-managment",
    name: "User Promos",
    icon: Percent,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AdminTestimonialsPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/testimonial",
    name: "Testimonials",
    icon: Award,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(MockTestsPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/mock-tests",
    name: "Mock Tests",
    icon: ClipboardList,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(MockTestSectionsPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/mock-sections",
    name: "Mock Sections",
    icon: ClipboardList,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(CreateMockTestPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/mock-tests/create",
    name: "Create Mock Test",
    icon: ClipboardList,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
];

export const adminInvicibleRoutes = [
  {
    Component: withAuth(ViewPracticePage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/practice/view/:id",
    name: "View Practice",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(EditLessonPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
      UserRoles.INSTRUCTOR,
    ]),
    path: "/dashboard/lesson/:id/edit",
    name: "Course Details",
  },
  {
    Component: withAuth(MockTestDetailPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/mock-tests/:id",
    name: "Mock Test Detail",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(MockTestSectionPage, [
      UserRoles.SUPER_ADMIN,
      UserRoles.ADMIN,
    ]),
    path: "/dashboard/mock-test-sections/:id",
    name: "Mock Test Section Management",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
];
