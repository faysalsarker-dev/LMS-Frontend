import Home from "@/pages/PublicPages/home/Home";
import Courses from "@/pages/PublicPages/course/Courses";

import CourseDetails from "@/pages/PublicPages/course/CourseDetails";
import Contact from "@/pages/PublicPages/abouts/Contact";
import AboutPage from "@/pages/PublicPages/abouts/About";

export const publicRoutes = [
  { Component: Home, path: "/", name: "Home" },
  { Component: Courses, path: "/courses", name: "Courses" },
  { Component: CourseDetails, path: "/courses/:slug", name: "Course Details" },
  { Component: Contact, path: "/contact", name: "Contact" },
  { Component: AboutPage, path: "/About-us", name: "About" },
];
