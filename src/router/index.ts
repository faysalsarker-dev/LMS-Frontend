import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import Layout from './../layout/home/Home';
import { generateRoutes } from "./generateRoutes";
import {invisibleRoutes, publicRoutes, studentRoutes} from "./allRoutes";
import Student from "@/layout/student/Student";

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
    Component:Student,
    path:'/dashboard',
    children:[
      ...generateRoutes(studentRoutes)
    ]
  }




  
]);