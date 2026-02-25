import { lazy } from "react";


import withAuth from "./withAuth";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";
import PracticeDetail from "@/pages/practice/PracticeDetail";
import TermsAndConditions from "@/pages/policy/TermsAndConditions";
import PrivacyPolicyPage from "@/pages/policy/PrivacyPage";
import PaymentSuccess from "@/pages/Payments/PaymentSuccessPage";
import PaymentFailed from "@/pages/Payments/PaymentFailed";
import PaymentCancelled from "@/pages/Payments/PaymentCancelled";



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
    Component: TermsAndConditions,
    path: "/terms-and-conditions",
    name: "Terms and Conditions",
  },
  {
    Component: PrivacyPolicyPage,
    path: "/privacy-policy",
    name: "Privacy & Policy",
  },
  {
    Component: withAuth(CheckoutPage),
    path: "/checkout/:slug",
    name: "Course Details",
  },
  {
    Component: withAuth(PracticeDetail),
    path: "/practice/:id",
    name: "Practice Details",
  },
  {
    Component: withAuth(PaymentSuccess),
    path: "/payment/success",
    name: "Payment Success",
  },
  {
    Component: withAuth(PaymentFailed),
    path: "/payment/fail",
    name: "Payment fail",
  },
  {
    Component: withAuth(PaymentCancelled),
    path: "/payment/cancel",
    name: "Payment cancel",
  },


  { Component: OtpVerify, path: "/verify-account/:email", name: "Verify Account" },
  { Component: ForgotPassword, path: "/forget-password", name: "Forgot Password" },
  { Component: ResetPassword, path: "/reset-password", name: "Reset Password" },
];

// 🎓 Student routes
