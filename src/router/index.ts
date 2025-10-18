import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import Layout from './../layout/home/Home';
import { generateRoutes } from "./generateRoutes";
import {adminRoutes, invisibleRoutes, publicRoutes, studentRoutes} from "./allRoutes";
import { AdminLayout } from "@/layout/admin/AdminLayout";
import NotFoundPage from "@/pages/ErrorPages/NotFoundPage";

export const router = createBrowserRouter([

  {
      Component: Layout,
            path: '/',
            children:[
         ...generateRoutes(publicRoutes),
         ...generateRoutes(invisibleRoutes),
         ...generateRoutes(studentRoutes),



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
  },

{
  Component:NotFoundPage,
  path:'*'
}


  
]);