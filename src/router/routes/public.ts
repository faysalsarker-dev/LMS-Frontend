import Home from "@/pages/PublicPages/home/Home";
import Courses from "@/pages/PublicPages/course/Courses";

import CourseDetails from "@/pages/PublicPages/course/CourseDetails";
import AboutPage from "@/pages/PublicPages/abouts/About";

export const publicRoutes = [
  { Component: Home, path: "/", name: "routes.public.home" },
  { Component: Courses, path: "/courses", name: "routes.public.courses" },
  { Component: CourseDetails, path: "/courses/:slug", name: "routes.public.courseDetails" },
  { Component: AboutPage, path: "/About-us", name: "routes.public.about" },
];
