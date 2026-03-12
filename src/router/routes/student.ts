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

const Dashboard = lazy(() => import("@/pages/StudentsPages/MyCourses/Dashboard")); 
const StudentDashboard = lazy(() => import("@/pages/StudentsPages/dashboard/StudentDashboard"));
const MockTestsPage = lazy(() => import("@/pages/Student/MockTestsPage"));
const PracticeTasksPage = lazy(() => import("@/pages/Student/PracticeTasksPage"));
const Profile = lazy(() => import("@/pages/StudentsPages/profile/Profile"));
const MockTestDetailPage = lazy(() => import("@/pages/StudentPages/MockTestDetailPage"));
const MockTestExamPage = lazy(() => import("@/pages/StudentPages/MockTestExamPage"));
const CoursePlayer = lazy(() =>
  import("@/pages/Student/course/CoursePlayer").then((m) => ({
    default: m.CoursePlayer,
  }))
);

export const studentRoutes = [
 
    
      {
        Component: withAuth(StudentDashboard),
        path: "/my-dashboard",
        name: "Overview",
        icon: LayoutDashboard,
      },
      {
        Component: withAuth(Dashboard),
        path: "/my-dashboard/my-courses",
        name: "My Courses",
        icon: BookOpen,
      },
      {
        Component: withAuth(PracticeTasksPage),
        path: "/my-dashboard/my-practice",
        name: "Practice Tasks",
        icon: Trophy,
      },
      {
        Component: withAuth(MockTestsPage),
        path: "/my-dashboard/my-mock-tests",
        name: "Mock Tests",
        icon: ClipboardCheck,
      },
      { 
        Component: withAuth(Profile), 
        path: "/my-dashboard/profile", 
        name: "Profile", 
        icon: User 
      },
    
  

];


export const  studentInvicibleRoutes = [
    { 
    Component: withAuth(CoursePlayer, [UserRoles.STUDENT, UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN], true), 
    path: "/my-dashboard/course/video/:id", 
    name: "Course Player",
    icon: GraduationCap,
    hidden: true 
  },
  {
    Component: withAuth(MockTestDetailPage),
    path: "/my-dashboard/mock-test/:slug",
    name: "Mock Test Detail",
    icon: ClipboardCheck,
    hidden: true,
  },
  {
    Component: withAuth(MockTestExamPage),
    path: "/my-dashboard/mock-test/:slug/:sectionId",
    name: "Mock Test Exam",
    icon: ClipboardCheck,
    hidden: true,
  },
]
