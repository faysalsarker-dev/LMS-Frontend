import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import Layout from './../layout/home/Home';
import Home  from './../pages/Home';

export const router = createBrowserRouter([

  {
      Component: Layout,
            path: '/',
            children:[
              {
                Component: Home,
               index:true,
              }
            ]
  },
  {
      Component:Register,
            path:'/register',
  },
  {
      Component:Login,
            path:'/login',
  },

  
]);