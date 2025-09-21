// types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  milestones: string[];
  thumbnail: string | null;
  tags: string[];
  skills: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  requirements: string[];
  price: number;
  status: "draft" | "published" | "archived";
}

export interface Milestone {
  id: string;
  title: string;
  course: string; // course id
  order: number;
  status: "active" | "inactive";
}

export interface Lesson {
  id: string;
  title: string;
  milestone: string; // milestone id
  order: number;
  contentType: "video" | "doc" | "quiz";
  videoUrl?: string | null;
  docContent?: string | null;
  status: "active" | "inactive";
}

// fake courses
export const courses: Course[] = [
  {
    id: "c1",
    title: "React Basics",
    slug: "react-basics",
    description: "Learn the fundamentals of React, components, and hooks.",
    instructor: "John Doe",
    milestones: ["m1", "m2"],
    thumbnail: null,
    tags: ["react", "frontend"],
    skills: ["JSX", "Hooks"],
    level: "Beginner",
    prerequisites: ["JavaScript basics"],
    requirements: ["Laptop with Node.js"],
    price: 0,
    status: "published",
  },
  {
    id: "c2",
    title: "Advanced Node.js",
    slug: "advanced-node",
    description: "Deep dive into Node.js performance, scaling, and APIs.",
    instructor: "Jane Smith",
    milestones: ["m3", "m4"],
    thumbnail: null,
    tags: ["node", "backend"],
    skills: ["Express", "Scaling"],
    level: "Advanced",
    prerequisites: ["Basic Node.js"],
    requirements: ["Node.js installed"],
    price: 49,
    status: "draft",
  },
  {
    id: "c3",
    title: "UI/UX Design Principles",
    slug: "uiux-design",
    description: "Master color theory, layout, and modern design systems.",
    instructor: "Emily Chen",
    milestones: [],
    thumbnail: null,
    tags: ["design", "ui"],
    skills: ["Figma", "Wireframing"],
    level: "Intermediate",
    prerequisites: [],
    requirements: [],
    price: 29,
    status: "published",
  },
  {
    id: "c4",
    title: "Fullstack MERN",
    slug: "fullstack-mern",
    description: "Learn to build full-stack apps with MongoDB, Express, React, Node.",
    instructor: "Michael Brown",
    milestones: ["m5"],
    thumbnail: null,
    tags: ["mern", "fullstack"],
    skills: ["React", "MongoDB"],
    level: "Advanced",
    prerequisites: ["React Basics", "Node Basics"],
    requirements: [],
    price: 99,
    status: "published",
  },
  {
    id: "c5",
    title: "Python for Data Science",
    slug: "python-data-science",
    description: "Intro to data science using Python, Pandas, and NumPy.",
    instructor: "Sarah Lee",
    milestones: [],
    thumbnail: null,
    tags: ["python", "data"],
    skills: ["Pandas", "NumPy"],
    level: "Beginner",
    prerequisites: [],
    requirements: [],
    price: 19,
    status: "archived",
  },
];

// fake milestones
export const milestones: Milestone[] = [
  { id: "m1", title: "React Setup", course: "c1", order: 1, status: "active" },
  { id: "m2", title: "React Hooks", course: "c1", order: 2, status: "active" },
  { id: "m3", title: "Node.js Performance", course: "c2", order: 1, status: "active" },
  { id: "m4", title: "Building REST APIs", course: "c2", order: 2, status: "inactive" },
  { id: "m5", title: "MERN Project Setup", course: "c4", order: 1, status: "active" },
];

// fake lessons
export const lessons: Lesson[] = [
  { id: "l1", title: "Installing Node & React", milestone: "m1", order: 1, contentType: "video", videoUrl: "https://example.com/video1", status: "active" },
  { id: "l2", title: "JSX Deep Dive", milestone: "m1", order: 2, contentType: "doc", docContent: "JSX basics content...", status: "active" },
  { id: "l3", title: "useState & useEffect", milestone: "m2", order: 1, contentType: "video", videoUrl: "https://example.com/video2", status: "active" },
  { id: "l4", title: "Express Middleware", milestone: "m3", order: 1, contentType: "doc", docContent: "Middleware explanation...", status: "inactive" },
  { id: "l5", title: "REST API Quiz", milestone: "m4", order: 1, contentType: "quiz", status: "active" },
];
