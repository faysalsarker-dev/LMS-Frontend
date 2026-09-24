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
  UserCheck,
  PenTool,
  FileQuestion,
  LayoutList,
  Clock,
} from "lucide-react";

import withAuth from "../withAuth";
import { UserRoles } from "@/interface/user.type";

// 🔹 Lazy-loaded admin pages (Visible routes)
const OverViewPage = lazy(() => import("@/pages/AdminPages/overView/AdminDashboardOverview"));
const Users = lazy(() => import("@/pages/AdminPages/users/Users"));
const EnrolmentPage = lazy(() => import("@/pages/AdminPages/Enrolment/EnrolmentPage"));
const CategoryPage = lazy(() => import("@/pages/AdminPages/category/CategoryPage"));
const AllCourses = lazy(() => import("@/pages/AdminPages/course/AllCourses"));
const MilestoneDashboardPage = lazy(() => import("@/pages/AdminPages/milestone/Milestone"));
const LessonPage = lazy(() => import("@/pages/AdminPages/lesson/LessonPage"));
const PracticesPage = lazy(() => import("@/pages/AdminPages/practice/PracticesPage"));
const AssignmentPage = lazy(() => import("@/pages/AdminPages/assignment/AssignmentPage"));
const MockTestsPage = lazy(() => import("@/pages/AdminPages/mockTest/MockTestsPage"));
const MockTestSectionsPage = lazy(() => import("@/pages/AdminPages/mockTest/MockTestSectionsPage"));
const PendingSubmissionsPage = lazy(() => import("@/pages/AdminPages/mockTest/PendingSubmissionsPage"));
const AdminPromoPage = lazy(() => import("@/pages/AdminPages/promo/AdminPromoPage"));
const AdminTestimonialsPage = lazy(() => import("@/pages/AdminPages/testimonial/TestimonialPage"));

// 🔹 Lazy-loaded admin pages (Invisible routes)
const CreateCourse = lazy(() => import("@/pages/AdminPages/course/CreateCourse"));
const LessonFormMain = lazy(() => import("@/components/admin/lesson-editor/LessonFormMain"));
const CreatePracticePage = lazy(() => import("@/pages/AdminPages/practice/CreatePracticePage"));
const EditLessonPage = lazy(() => import("@/pages/AdminPages/lesson/EditLessonPage"));
const ViewPracticePage = lazy(() => import("@/pages/AdminPages/practice/ViewPracticePage"));
const CreateMockTestPage = lazy(() => import("@/pages/AdminPages/mockTest/CreateMockTestPage"));
const MockTestDetailPage = lazy(() => import("@/pages/AdminPages/mockTest/MockTestDetailPageAdmin"));
const MockTestSectionPage = lazy(() => import("@/pages/AdminPages/mockTest/MockTestSectionPage"));
const SubmissionDetailPage = lazy(() => import("@/pages/AdminPages/mockTest/SubmissionDetailPage"));

export const adminRoutes = [
  {
    Component: withAuth(OverViewPage, [UserRoles.SUPER_ADMIN]),
    path: "/dashboard",
    name: "routes.admin.dashboard",
    icon: LayoutDashboard,
    roles: [UserRoles.SUPER_ADMIN],
  },
  {
    Component: withAuth(Users, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/users",
    name: "routes.admin.userManagement",
    icon: UsersIcon,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(EnrolmentPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/enrollments",
    name: "routes.admin.enrollmentManagement",
    icon: UserCheck,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(CategoryPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/category",
    name: "routes.admin.category",
    icon: Folder,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(AllCourses, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/courses",
    name: "routes.admin.allCourses",
    icon: Layers,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(MilestoneDashboardPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/milestone",
    name: "routes.admin.milestones",
    icon: Flag,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(LessonPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/lesson",
    name: "routes.admin.allLessons",
    icon: BookOpen,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(PracticesPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/practices",
    name: "routes.admin.practices",
    icon: PenTool,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(AssignmentPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/assignment",
    name: "routes.admin.assignments",
    icon: ClipboardCheck,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(MockTestsPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-tests",
    name: "routes.admin.mockTests",
    icon: FileQuestion,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(MockTestSectionsPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-sections",
    name: "routes.admin.mockSections",
    icon: LayoutList,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(PendingSubmissionsPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-tests/pending-submissions",
    name: "routes.admin.pendingSubmissions",
    icon: Clock,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(AdminPromoPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/promos-managment",
    name: "routes.admin.promos",
    icon: Percent,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    Component: withAuth(AdminTestimonialsPage, [UserRoles.SUPER_ADMIN, UserRoles.ADMIN]),
    path: "/dashboard/testimonial",
    name: "routes.admin.testimonials",
    icon: Award,
    roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
];

export const adminInvicibleRoutes = [
  {
    Component: withAuth(CreateCourse, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/course/create",
    name: "routes.admin.createCourse",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(LessonFormMain, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/lesson-create",
    name: "routes.admin.createLesson",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(EditLessonPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/lesson/:id/edit",
    name: "routes.admin.editLesson",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(CreatePracticePage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/practices/create",
    name: "routes.admin.createPractices",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(ViewPracticePage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/practice/view/:id",
    name: "routes.admin.viewPractice",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(CreateMockTestPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-tests/create",
    name: "routes.admin.createMockTest",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(MockTestDetailPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-tests/:id",
    name: "routes.admin.mockTestDetail",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(MockTestSectionPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-test-sections/:id",
    name: "routes.admin.mockTestSectionManagement",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
  {
    Component: withAuth(SubmissionDetailPage, [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
    path: "/dashboard/mock-test-submissions/:id",
    name: "routes.admin.submissionDetail",
    roles: [UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR],
  },
];
