import Courses from '@/pages/course/Courses';
import Home  from '../pages/home/Home';
import CourseDetails from '@/pages/course/CourseDetails';
import Contact from '@/pages/abouts/Contact';
import About from '@/pages/abouts/About';

const publicRoutes = [
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
export default publicRoutes;