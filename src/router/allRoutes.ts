import { lazy } from "react";

import withAuth from "./withAuth";
import CheckoutPage from "@/pages/PublicPages/Checkout/CheckoutPage";
import TermsAndConditions from "@/pages/PublicPages/policy/TermsAndConditions";
import PrivacyPolicyPage from "@/pages/PublicPages/policy/PrivacyPage";
import PaymentSuccess from "@/pages/PublicPages/Payments/PaymentSuccessPage";
import PaymentFailed from "@/pages/PublicPages/Payments/PaymentFailed";
import PaymentCancelled from "@/pages/PublicPages/Payments/PaymentCancelled";


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


export const invisibleRoutes = [
  {
    Component: CourseDetails,
    path: "/courses/:slug",
    name: "routes.public.courseDetails",
  },
  {
    Component: TermsAndConditions,
    path: "/terms-and-conditions",
    name: "routes.public.termsAndConditions",
  },
  {
    Component: PrivacyPolicyPage,
    path: "/privacy-policy",
    name: "routes.public.privacyPolicy",
  },
  {
    Component: withAuth(CheckoutPage),
    path: "/checkout/:slug",
    name: "routes.public.courseDetails",
  },

  {
    Component: withAuth(PaymentSuccess),
    path: "/payment/success",
    name: "routes.public.paymentSuccess",
  },
  {
    Component: withAuth(PaymentFailed),
    path: "/payment/fail",
    name: "routes.public.paymentFail",
  },
  {
    Component: withAuth(PaymentCancelled),
    path: "/payment/cancel",
    name: "routes.public.paymentCancel",
  },

  {
    Component: OtpVerify,
    path: "/verify-account/:email",
    name: "routes.public.verifyAccount",
  },
  {
    Component: ForgotPassword,
    path: "/forget-password",
    name: "routes.public.forgotPassword",
  },
  { Component: ResetPassword, path: "/reset-password", name: "routes.public.resetPassword" },

];


