import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import Layout from './../layout/home/Home';
import { generateRoutes } from "./generateRoutes";
import {adminRoutes, invisibleRoutes, publicRoutes} from "./allRoutes";
import { AdminLayout } from "@/layout/admin/AdminLayout";

export const router = createBrowserRouter([

  {
      Component: Layout,
            path: '/',
            children:[
         ...generateRoutes(publicRoutes),
         ...generateRoutes(invisibleRoutes),


           {
      Component:Register,
            path:'/register',
  },
  {
      Component:Login,
            path:'/login',
  },

            ]
  },


  {
    Component:AdminLayout,
    path:'/dashboard',
    children:[
      ...generateRoutes(adminRoutes)
    ]
  }




  
]);