import Home  from './../pages/Home';
import  Register  from '@/pages/auth/Register';
import  Login  from '@/pages/auth/Login';

const publicRoutes = [
  {
    Component: Home,
    path: '/',
    name: 'Home'
  },
  {
      Component: Register,
    path: '/register',
    name: 'Register'
  },
  {
    Component: Login,
    path: '/login',
    name: 'Login'
  },
];
export default publicRoutes;