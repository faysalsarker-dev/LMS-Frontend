import { lazy } from "react";

import withAuth from "./withAuth";
import CheckoutPage from "@/pages/PublicPages/Checkout/CheckoutPage";
import PracticeDetail from "@/pages/practice/PracticeDetail";
import TermsAndConditions from "@/pages/PublicPages/policy/TermsAndConditions";
import PrivacyPolicyPage from "@/pages/PublicPages/policy/PrivacyPage";
import PaymentSuccess from "@/pages/PublicPages/Payments/PaymentSuccessPage";
import PaymentFailed from "@/pages/PublicPages/Payments/PaymentFailed";
import PaymentCancelled from "@/pages/PublicPages/Payments/PaymentCancelled";
import MockTestDetailPage from "@/pages/StudentPages/MockTestDetailPage";
import MockTestExamPage from "@/pages/StudentPages/MockTestExamPage";

const CourseDetails = lazy(
  () => import("@/pages/PublicPages/course/CourseDetails"),
);

const OtpVerify = lazy(() => import("@/pages/PublicPages/auth/OtpVerify"));
const ForgotPassword = lazy(
  () => import("@/pages/PublicPages/auth/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("@/pages/PublicPages/auth/ResetPassword"),
);

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

  {
    Component: OtpVerify,
    path: "/verify-account/:email",
    name: "Verify Account",
  },
  {
    Component: ForgotPassword,
    path: "/forget-password",
    name: "Forgot Password",
  },
  { Component: ResetPassword, path: "/reset-password", name: "Reset Password" },

  // 🧪 Mock Test Routes (Consolidated)
  // {
  //   Component: withAuth(MockTestDetailPage),
  //   path: "/practice/mock-test/:slug",
  //   name: "Mock Test Detail",
  // },
  // {
  //   Component: withAuth(MockTestExamPage),
  //   path: "/practice/mock-test/:slug/:sectionId",
  //   name: "Mock Test Exam",
  // },
];

// 🎓 Student routes
