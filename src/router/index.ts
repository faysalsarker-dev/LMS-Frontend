import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import Layout from './../layout/home/Home';
import Home  from '../pages/home/Home';
import { generateRoutes } from "./generateRoutes";
import publicRoutes from "./publicRoutes";

export const router = createBrowserRouter([

  {
      Component: Layout,
            path: '/',
            children:[
         ...generateRoutes(publicRoutes)
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