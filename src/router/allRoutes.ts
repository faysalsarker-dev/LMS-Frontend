import { lazy } from "react";


import withAuth from "./withAuth";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";


const CourseDetails = lazy(() => import("@/pages/course/CourseDetails"));



const OtpVerify = lazy(() => import("@/pages/auth/OtpVerify"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));



// 🌍 Public routes







// 🕶 Invisible routes
export const invisibleRoutes = [
  {
    Component: CourseDetails,
    path: "/courses/:slug",
    name: "Course Details",
  },
  {
    Component: withAuth(CheckoutPage),
    path: "/checkout/:slug",
    name: "Course Details",
  },

  { Component: OtpVerify, path: "/verify-account/:email", name: "Verify Account" },
  { Component: ForgotPassword, path: "/forget-password", name: "Forgot Password" },
  { Component: ResetPassword, path: "/reset-password", name: "Reset Password" },
];

// 🎓 Student routes
