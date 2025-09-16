import Courses from '@/pages/course/Courses';
import Home  from '../pages/home/Home';
import CourseDetails from '@/pages/course/CourseDetails';
import Contact from '@/pages/abouts/Contact';
import About from '@/pages/abouts/About';
import Dashboard from '@/pages/Student/Dashboard';
import Profile from '@/pages/Student/Profile';
import { CoursePlayer } from '@/pages/Student/course/CoursePlayer';
import OtpVerify from '@/pages/auth/OtpVerify';

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
