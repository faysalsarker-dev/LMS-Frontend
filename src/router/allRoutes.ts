import Courses from '@/pages/course/Courses';
import Home  from '../pages/home/Home';
import CourseDetails from '@/pages/course/CourseDetails';
import Contact from '@/pages/abouts/Contact';
import About from '@/pages/abouts/About';
import Dashboard from '@/pages/Student/Dashboard';
import Profile from '@/pages/Student/Profile';
import { CoursePlayer } from '@/pages/Student/course/CoursePlayer';
import OtpVerify from '@/pages/auth/OtpVerify';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import AdminDashboard from '@/pages/admin/Dashboard';
import Users from '@/pages/admin/Users';
import CreateCourse from '@/pages/admin/CreateCourse';

export const publicRoutes = [
  {
    Component: Home,
    path: '/',
    name: 'Home'
  },
  {
      Component: Courses,
    path: '/courses',
    name: 'Courses'
  },
  {
      Component: CourseDetails,
    path: '/courses/:slug',
    name: 'Courses'
  },
  {
      Component: Contact,
    path: '/contact',
    name: 'Contact'
  },
  {
      Component: About,
    path: '/about',
    name: 'About'
  },

];


export const adminRoutes = [


  {
      Component: AdminDashboard,
    path: '/dashboard',
    name: 'Dashboard'
  },
  {
      Component: Users,
    path: '/dashboard/users',
    name: 'Users'
  },
  {
      Component: CreateCourse,
    path: '/dashboard/Coures',
    name: 'Copures'
  },


  

];
export const invisibleRoutes = [

  {
      Component: CourseDetails,
    path: '/courses/:slug',
    name: 'Courses'
  },
  {
      Component: OtpVerify,
    path: '/verify-account/:email',
    name: 'Courses'
  },
  {
      Component: ForgotPassword,
    path: '/forget-password',
    name: 'Courses'
  },
  {
      Component: ResetPassword,
    path: '/reset-password',
    name: 'Courses'
  },

  

];

export const studentRoutes = [

  {
      Component: Dashboard,
    path: '/dashboard/attention',
    name: 'Courses'
  },
  {
      Component: Profile,
    path: '/dashboard/profile',
    name: 'Profile'
  },
  {
      Component: CoursePlayer,
    path: '/dashboard/video',
    name: 'Profile'
  },

  

];
