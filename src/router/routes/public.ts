import Home from "@/pages/home/Home";
import Courses from "@/pages/course/Courses";
import Contact from "@/pages/abouts/Contact";
import About from "@/pages/abouts/About";
import CourseDetails from "@/pages/course/CourseDetails";



export const publicRoutes = [
  { Component: Home, path: "/", name: "Home" },
  { Component: Courses, path: "/courses", name: "Courses" },
  { Component: CourseDetails, path: "/courses/:slug", name: "Course Details" },
  { Component: Contact, path: "/contact", name: "Contact" },
  { Component: About, path: "/about", name: "About" },
];