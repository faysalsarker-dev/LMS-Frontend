import { lazy } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  ClipboardCheck,
  User,
  GraduationCap,
} from "lucide-react";
import withAuth from "../withAuth";
import { UserRoles } from "@/interface/user.type";


const MyCourses = lazy(
  () => import("@/pages/StudentsPages/MyCourses/MyCourses"),
);
const StudentDashboard = lazy(
  () => import("@/pages/StudentsPages/dashboard/StudentDashboard"),
);
const MockTestsPage = lazy(
  () => import("@/pages/StudentsPages/Mock-test/MockTestsPage"),
);
const PracticeTasksPage = lazy(
  () => import("@/pages/StudentsPages/Practice/PracticeTasksPage"),
);
const Profile = lazy(() => import("@/pages/StudentsPages/profile/Profile"));

const CoursePlayer = lazy(() =>
  import("@/pages/Student/course/CoursePlayer").then((m) => ({
    default: m.CoursePlayer,
  })),
);

const PracticeDetail = lazy(() => import("@/pages/StudentsPages/Practice/PracticeDetail"));



export const studentRoutes = [
  {
    Component: withAuth(StudentDashboard),
    path: "/my-dashboard",
    name: "routes.student.overview",
    icon: LayoutDashboard,
  },
  {
    Component: withAuth(MyCourses),
    path: "/my-dashboard/my-courses",
    name: "routes.student.myCourses",
    icon: BookOpen,
  },
  {
    Component: withAuth(PracticeTasksPage),
    path: "/my-dashboard/my-practice",
    name: "routes.student.practiceTasks",
    icon: Trophy,
  },
  {
    Component: withAuth(MockTestsPage),
    path: "/my-dashboard/my-mock-tests",
    name: "routes.student.mockTests",
    icon: ClipboardCheck,
  },
  {
    Component: withAuth(Profile),
    path: "/my-dashboard/profile",
    name: "routes.student.profile",
    icon: User,
  },
];

export const studentInvicibleRoutes = [
  {
    Component: withAuth(
      CoursePlayer,
      [
        UserRoles.STUDENT,
        UserRoles.INSTRUCTOR,
        UserRoles.ADMIN,
        UserRoles.SUPER_ADMIN,
      ],
      true,
    ),
    path: "/my-dashboard/course/video/:id",
    name: "routes.student.coursePlayer",
    icon: GraduationCap,
    hidden: true,
  },
  {
    Component: withAuth(PracticeDetail),
    path: "/my-dashboard/practice/:id",
    name: "routes.student.practiceDetails",
  },
 
];
