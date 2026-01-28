import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter } from "react-router";
import Layout from './../layout/home/Home';
import { generateRoutes } from "./generateRoutes";
import { invisibleRoutes} from "./allRoutes";
import { AdminLayout } from "@/layout/admin/AdminLayout";
import NotFoundPage from "@/pages/ErrorPages/NotFoundPage";
import { publicRoutes } from "./routes/public";
import { adminInvicibleRoutes, adminRoutes } from "./routes/admin";
import { studentRoutes } from "./routes/student";
import AccessDenied from "@/pages/ErrorPages/AccessDenied";

export const router = createBrowserRouter([

  {
      Component: Layout,
            path: '/',
            // errorElement: <NotFoundPage />,
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
      ...generateRoutes(adminRoutes),
      ...generateRoutes(adminInvicibleRoutes)
    ]
  },

{
  Component:AccessDenied,
  path:'/access-denied'
},
{
  Component:NotFoundPage,
  path:'*'
}


  
]);