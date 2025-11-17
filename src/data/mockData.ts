export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  featured: boolean;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading';
  completed?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  rating: number;
  students: number;
  courses: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}










export const dummyCourse = {
  id: "course-1",
  title: "Complete JavaScript Developer Course",
  milestones: [
    {
      id: "milestone-1",
      title: "JavaScript Fundamentals",
      progress: 85,
      modules: [
        {
          id: "module-1",
          title: "Variables and Data Types",
          isCompleted: true,
          lessons: [
            {
              id: "lesson-1",
              title: "Introduction to Variables",
              duration: "12:30",
              status: "completed",
            },
            {
              id: "lesson-2",
              title: "String Data Type",
              duration: "08:45",
              status: "completed",
            },
            {
              id: "lesson-3",
              title: "Number Data Type",
              duration: "10:15",
              status: "completed",
            },
          ],
        },
        {
          id: "module-2",
          title: "Functions and Scope",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-4",
              title: "Function Declarations",
              duration: "15:20",
              status: "completed",
            },
            {
              id: "lesson-5",
              title: "Arrow Functions",
              duration: "11:30",
              status: "in-progress",
            },
            {
              id: "lesson-6",
              title: "Lexical Scope",
              duration: "13:45",
              status: "locked",
            },
          ],
        },
      ],
    },
    {
      id: "milestone-2",
      title: "DOM Manipulation",
      progress: 40,
      modules: [
        {
          id: "module-3",
          title: "Selecting Elements",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-7",
              title: "querySelector and getElementById",
              duration: "09:20",
              status: "completed",
            },
            {
              id: "lesson-8",
              title: "Event Listeners",
              duration: "14:10",
              status: "locked",
            },
          ],
        },
        {
          id: "module-4",
          title: "Dynamic Content",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-9",
              title: "Creating Elements",
              duration: "12:00",
              status: "locked",
            },
            {
              id: "lesson-10",
              title: "Modifying Attributes",
              duration: "08:30",
              status: "locked",
            },
          ],
        },
      ],
    },
    {
      id: "milestone-3",
      title: "Advanced JavaScript",
      progress: 0,
      modules: [
        {
          id: "module-5",
          title: "Async Programming",
          isCompleted: false,
          lessons: [
            {
              id: "lesson-11",
              title: "Promises",
              duration: "16:45",
              status: "locked",
            },
            {
              id: "lesson-12",
              title: "Async/Await",
              duration: "14:20",
              status: "locked",
            },
          ],
        },
      ],
    },
  ],
  currentModule: {
    id: "module-2",
    title: "Functions and Scope",
    isCompleted: false,
    lessons: [],
  },
};








export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive web development course.',
    instructor: 'Angela Yu',
    instructorImage: '/placeholder.svg',
    image: 'https://s.udemycdn.com/career-academies/product-cards/career-card-fswd.png',
    price: 84.99,
    originalPrice: 199.99,
    rating: 4.6,
    students: 156789,
    duration: '65 hours',
    level: 'Beginner',
    category: 'Development',
    featured: true,
    modules: [
      {
        id: 'mod1',
        title: 'Introduction to Web Development',
        lessons: [
          { id: 'l1', title: 'What is Web Development?', duration: '8:30', type: 'video' },
          { id: 'l2', title: 'Setting up Your Environment', duration: '12:45', type: 'video' },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning A-Z',
    description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
    instructor: 'Kirill Eremenko',
    instructorImage: '/placeholder.svg',
    image: '/placeholder.svg',
    price: 74.99,
    originalPrice: 149.99,
    rating: 4.5,
    students: 98543,
    duration: '44 hours',
    level: 'Intermediate',
    category: 'Data Science',
    featured: true,
    modules: []
  },
  {
    id: '3',
    title: 'The Complete Digital Marketing Course',
    description: 'Master digital marketing strategy, social media marketing, SEO, YouTube, email, Facebook marketing, analytics & more!',
    instructor: 'Rob Percival',
    instructorImage: '/placeholder.svg',
    image: '/placeholder.svg',
    price: 64.99,
    originalPrice: 124.99,
    rating: 4.4,
    students: 67890,
    duration: '23 hours',
    level: 'Beginner',
    category: 'Marketing',
    featured: false,
    modules: []
  },
  {
    id: '4',
    title: 'iOS 16 & Swift 5 - The Complete iOS App Development',
    description: 'From Beginner to iOS App Developer with just one course! Fully updated with a comprehensive module dedicated to SwiftUI!',
    instructor: 'Angela Yu',
    instructorImage: '/placeholder.svg',
    image: '/placeholder.svg',
    price: 89.99,
    originalPrice: 179.99,
    rating: 4.7,
    students: 45678,
    duration: '58 hours',
    level: 'Intermediate',
    category: 'Mobile Development',
    featured: true,
    modules: []
  },
  {
    id: '5',
    title: 'Complete Python Bootcamp',
    description: 'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games!',
    instructor: 'Jose Portilla',
    instructorImage: '/placeholder.svg',
    image: '/placeholder.svg',
    price: 79.99,
    originalPrice: 159.99,
    rating: 4.6,
    students: 234567,
    duration: '22 hours',
    level: 'Beginner',
    category: 'Programming',
    featured: false,
    modules: []
  },
  {
    id: '6',
    title: 'The Complete Node.js Developer Course',
    description: 'Learn Node.js by building real-world applications with Node JS, Express, MongoDB, Jest, and more!',
    instructor: 'Andrew Mead',
    instructorImage: '/placeholder.svg',
    image: '/placeholder.svg',
    price: 69.99,
    originalPrice: 134.99,
    rating: 4.6,
    students: 123456,
    duration: '35 hours',
    level: 'Intermediate',
    category: 'Development',
    featured: false,
    modules: []
  }
];

export const mockInstructors: Instructor[] = [
  {
    id: '1',
    name: 'Angela Yu',
    title: 'Lead Instructor at App Brewery',
    bio: 'I\'m Angela, I\'m a developer with a passion for teaching. I\'m the lead instructor at the London App Brewery, London\'s leading Programming Bootcamp.',
    image: '/placeholder.svg',
    rating: 4.7,
    students: 543210,
    courses: 12
  },
  {
    id: '2',
    name: 'Kirill Eremenko',
    title: 'Data Scientist',
    bio: 'I\'m a Data Scientist and was rated as the #1 Data Science instructor on Udemy. I have helped hundreds of thousands of students worldwide.',
    image: '/placeholder.svg',
    rating: 4.6,
    students: 432109,
    courses: 8
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Software Developer at Google',
    image: '/placeholder.svg',
    content: 'This platform completely changed my career. The courses are incredibly well-structured and the instructors are world-class.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Data Scientist at Microsoft',
    image: '/placeholder.svg',
    content: 'I went from complete beginner to landing my dream job in just 6 months. The practical projects really made the difference.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Product Manager at Stripe',
    image: '/placeholder.svg',
    content: 'The quality of education here is unmatched. I\'ve tried other platforms, but nothing comes close to this experience.',
    rating: 5
  }
];

export const mockCategories = [
  'Development',
  'Data Science',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Music',
  'Health & Fitness',
  'Language',
  'Personal Development'
];


export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
}

export interface Lesson {
  id: string;
  title: string;
}

export type SubmissionType = "link" | "text" | "file";
export type SubmissionStatus = "pending" | "reviewed" | "graded";

export interface AssignmentSubmission {
  id: string;
  student: Student;
  course: Course;
  lesson: Lesson;
  submissionType: SubmissionType;
  file: {
    url: string | null;
  };
  textResponse: string | null;
  submittedAt: string;
  status: SubmissionStatus;
  result: number | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubmissionsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: SubmissionStatus | "";
  submissionType?: SubmissionType | "";
  course?: string;
  lesson?: string;
  sortBy?: "submittedAt" | "student.name" | "result";
  sortOrder?: "asc" | "desc";
}

export interface SubmissionsResponse {
  submissions: AssignmentSubmission[];
  pagination: PaginationInfo;
}

export interface GradeFormData {
  result: number;
  feedback: string;
  status: SubmissionStatus;
}

// Mock data
const mockSubmissions: AssignmentSubmission[] = [
  {
    id: "sub_1",
    student: { id: "u_101", name: "Ayesha Rahman", email: "ayesha.r@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_1", title: "Callbacks & Promises" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_1.pdf" },
    textResponse: null,
    submittedAt: "2025-11-10T09:12:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-10T09:12:00.000Z",
    updatedAt: "2025-11-10T09:12:00.000Z",
  },
  {
    id: "sub_2",
    student: { id: "u_102", name: "Rafi Khan", email: "rafi.k@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_7", title: "Performance Optimization" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Implemented lazy loading and memoization. Code snippet: const MyComponent = React.memo(() => { ... })",
    submittedAt: "2025-11-12T14:05:00.000Z",
    status: "reviewed",
    result: null,
    feedback: "Good work; add comments to your code.",
    createdAt: "2025-11-12T14:05:00.000Z",
    updatedAt: "2025-11-13T10:22:00.000Z",
  },
  {
    id: "sub_3",
    student: { id: "u_103", name: "Faisal Ahmed", email: "faisal.a@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_2", title: "DOM & Events" },
    submissionType: "link",
    file: { url: null },
    textResponse: null,
    submittedAt: "2025-11-15T18:22:00.000Z",
    status: "graded",
    result: 88,
    feedback: "Solid — minor DOM edge cases missed.",
    createdAt: "2025-11-15T18:22:00.000Z",
    updatedAt: "2025-11-16T09:15:00.000Z",
  },
  {
    id: "sub_4",
    student: { id: "u_104", name: "Nadia Islam", email: "nadia.i@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_15", title: "REST API Design" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_4.zip" },
    textResponse: null,
    submittedAt: "2025-11-08T11:45:00.000Z",
    status: "graded",
    result: 92,
    feedback: "Excellent implementation of RESTful principles.",
    createdAt: "2025-11-08T11:45:00.000Z",
    updatedAt: "2025-11-09T14:30:00.000Z",
  },
  {
    id: "sub_5",
    student: { id: "u_105", name: "Imran Hossain", email: "imran.h@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_8", title: "Custom Hooks" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Created useDebounce hook: const useDebounce = (value, delay) => { const [debouncedValue, setDebouncedValue] = useState(value); useEffect(() => { const handler = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(handler); }, [value, delay]); return debouncedValue; }",
    submittedAt: "2025-11-14T16:30:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-14T16:30:00.000Z",
    updatedAt: "2025-11-14T16:30:00.000Z",
  },
  {
    id: "sub_6",
    student: { id: "u_106", name: "Sadia Begum", email: "sadia.b@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_3", title: "Array Methods" },
    submissionType: "link",
    file: { url: null },
    textResponse: null,
    submittedAt: "2025-11-11T13:20:00.000Z",
    status: "reviewed",
    result: null,
    feedback: "Please add more test cases.",
    createdAt: "2025-11-11T13:20:00.000Z",
    updatedAt: "2025-11-12T08:15:00.000Z",
  },
  {
    id: "sub_7",
    student: { id: "u_107", name: "Kamal Uddin", email: "kamal.u@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_16", title: "Database Integration" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_7.pdf" },
    textResponse: null,
    submittedAt: "2025-11-09T10:05:00.000Z",
    status: "graded",
    result: 78,
    feedback: "Good start, but error handling needs improvement.",
    createdAt: "2025-11-09T10:05:00.000Z",
    updatedAt: "2025-11-10T11:20:00.000Z",
  },
  {
    id: "sub_8",
    student: { id: "u_108", name: "Fatima Ali", email: "fatima.a@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_9", title: "Context API" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Implemented auth context with login/logout functionality. Used useContext and useReducer pattern.",
    submittedAt: "2025-11-13T15:40:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-13T15:40:00.000Z",
    updatedAt: "2025-11-13T15:40:00.000Z",
  },
  {
    id: "sub_9",
    student: { id: "u_109", name: "Rashid Mahmood", email: "rashid.m@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_4", title: "Async JavaScript" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_9.js" },
    textResponse: null,
    submittedAt: "2025-11-07T14:25:00.000Z",
    status: "graded",
    result: 95,
    feedback: "Outstanding work! Very clean async/await implementation.",
    createdAt: "2025-11-07T14:25:00.000Z",
    updatedAt: "2025-11-08T09:10:00.000Z",
  },
  {
    id: "sub_10",
    student: { id: "u_110", name: "Zara Malik", email: "zara.m@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_17", title: "Authentication & JWT" },
    submissionType: "link",
    file: { url: null },
    textResponse: null,
    submittedAt: "2025-11-16T12:10:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-16T12:10:00.000Z",
    updatedAt: "2025-11-16T12:10:00.000Z",
  },
  {
    id: "sub_11",
    student: { id: "u_111", name: "Hassan Reza", email: "hassan.r@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_10", title: "Redux Toolkit" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_11.zip" },
    textResponse: null,
    submittedAt: "2025-11-06T09:50:00.000Z",
    status: "graded",
    result: 85,
    feedback: "Good use of Redux Toolkit. Consider adding more slices.",
    createdAt: "2025-11-06T09:50:00.000Z",
    updatedAt: "2025-11-07T13:45:00.000Z",
  },
  {
    id: "sub_12",
    student: { id: "u_112", name: "Samira Khan", email: "samira.k@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_5", title: "ES6 Features" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Demonstrated destructuring, spread operator, arrow functions, and template literals with practical examples.",
    submittedAt: "2025-11-05T17:15:00.000Z",
    status: "reviewed",
    result: null,
    feedback: "Great examples. Please add one more on optional chaining.",
    createdAt: "2025-11-05T17:15:00.000Z",
    updatedAt: "2025-11-06T10:30:00.000Z",
  },
  {
    id: "sub_13",
    student: { id: "u_113", name: "Omar Farooq", email: "omar.f@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_18", title: "WebSockets" },
    submissionType: "link",
    file: { url: null },
    textResponse: null,
    submittedAt: "2025-11-15T11:30:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-15T11:30:00.000Z",
    updatedAt: "2025-11-15T11:30:00.000Z",
  },
  {
    id: "sub_14",
    student: { id: "u_114", name: "Laila Hussain", email: "laila.h@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_11", title: "Testing with Jest" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_14.pdf" },
    textResponse: null,
    submittedAt: "2025-11-04T13:55:00.000Z",
    status: "graded",
    result: 90,
    feedback: "Comprehensive test coverage. Well done!",
    createdAt: "2025-11-04T13:55:00.000Z",
    updatedAt: "2025-11-05T08:20:00.000Z",
  },
  {
    id: "sub_15",
    student: { id: "u_115", name: "Tariq Aziz", email: "tariq.a@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_6", title: "Object-Oriented JS" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Created class hierarchy with proper inheritance: class Animal { constructor(name) { this.name = name; } speak() { console.log(`${this.name} makes a sound`); } } class Dog extends Animal { speak() { console.log(`${this.name} barks`); } }",
    submittedAt: "2025-11-17T08:40:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-17T08:40:00.000Z",
    updatedAt: "2025-11-17T08:40:00.000Z",
  },
  {
    id: "sub_16",
    student: { id: "u_116", name: "Mariam Sheikh", email: "mariam.s@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_19", title: "Microservices" },
    submissionType: "link",
    file: { url: null },
    textResponse: null,
    submittedAt: "2025-11-03T16:20:00.000Z",
    status: "graded",
    result: 87,
    feedback: "Good architecture design. Consider adding circuit breakers.",
    createdAt: "2025-11-03T16:20:00.000Z",
    updatedAt: "2025-11-04T12:15:00.000Z",
  },
  {
    id: "sub_17",
    student: { id: "u_117", name: "Yasir Iqbal", email: "yasir.i@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_12", title: "Server Components" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_17.zip" },
    textResponse: null,
    submittedAt: "2025-11-02T10:10:00.000Z",
    status: "reviewed",
    result: null,
    feedback: "Interesting approach. Please clarify data fetching strategy.",
    createdAt: "2025-11-02T10:10:00.000Z",
    updatedAt: "2025-11-03T09:05:00.000Z",
  },
  {
    id: "sub_18",
    student: { id: "u_118", name: "Hina Yusuf", email: "hina.y@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_1", title: "Callbacks & Promises" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Explained callback hell and how Promises solve it. Included examples with .then() and async/await.",
    submittedAt: "2025-11-01T14:35:00.000Z",
    status: "graded",
    result: 82,
    feedback: "Good explanation. Add error handling examples.",
    createdAt: "2025-11-01T14:35:00.000Z",
    updatedAt: "2025-11-02T11:50:00.000Z",
  },
  {
    id: "sub_19",
    student: { id: "u_119", name: "Adnan Malik", email: "adnan.m@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_20", title: "GraphQL APIs" },
    submissionType: "link",
    file: { url: null },
    textResponse: null,
    submittedAt: "2025-11-16T15:25:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-16T15:25:00.000Z",
    updatedAt: "2025-11-16T15:25:00.000Z",
  },
  {
    id: "sub_20",
    student: { id: "u_120", name: "Saima Aslam", email: "saima.a@example.com" },
    course: { id: "c_2", title: "React Advanced" },
    lesson: { id: "l_13", title: "Animation Libraries" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_20.mp4" },
    textResponse: null,
    submittedAt: "2025-11-16T09:45:00.000Z",
    status: "reviewed",
    result: null,
    feedback: "Nice animations! Document the keyframes used.",
    createdAt: "2025-11-16T09:45:00.000Z",
    updatedAt: "2025-11-17T07:30:00.000Z",
  },
  {
    id: "sub_21",
    student: { id: "u_121", name: "Bilal Nasir", email: "bilal.n@example.com" },
    course: { id: "c_1", title: "Intro to JS" },
    lesson: { id: "l_2", title: "DOM & Events" },
    submissionType: "file",
    file: { url: "https://example.com/files/sub_21.html" },
    textResponse: null,
    submittedAt: "2025-10-30T12:50:00.000Z",
    status: "graded",
    result: 76,
    feedback: "Basic implementation works. Add event delegation.",
    createdAt: "2025-10-30T12:50:00.000Z",
    updatedAt: "2025-10-31T10:40:00.000Z",
  },
  {
    id: "sub_22",
    student: { id: "u_122", name: "Rabia Hassan", email: "rabia.h@example.com" },
    course: { id: "c_3", title: "Node.js Backend" },
    lesson: { id: "l_15", title: "REST API Design" },
    submissionType: "text",
    file: { url: null },
    textResponse: "Designed RESTful endpoints: GET /api/users, POST /api/users, PUT /api/users/:id, DELETE /api/users/:id. Followed CRUD principles.",
    submittedAt: "2025-11-14T11:15:00.000Z",
    status: "pending",
    result: null,
    feedback: null,
    createdAt: "2025-11-14T11:15:00.000Z",
    updatedAt: "2025-11-14T11:15:00.000Z",
  },
];

let dataStore = [...mockSubmissions];

export const mockSubmissionService = {
  // Get all submissions with filters, pagination, sorting
  getAllSubmissions: async (query: SubmissionsQuery = {}): Promise<SubmissionsResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...dataStore];

    // Search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.student.name.toLowerCase().includes(searchLower) ||
          sub.student.email.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (query.status) {
      filtered = filtered.filter((sub) => sub.status === query.status);
    }

    // Submission type filter
    if (query.submissionType) {
      filtered = filtered.filter((sub) => sub.submissionType === query.submissionType);
    }

    // Course filter
    if (query.course) {
      filtered = filtered.filter((sub) => sub.course.id === query.course);
    }

    // Lesson filter
    if (query.lesson) {
      filtered = filtered.filter((sub) => sub.lesson.id === query.lesson);
    }

    // Sort
    const sortBy = query.sortBy || "submittedAt";
    const sortOrder = query.sortOrder || "desc";

    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "submittedAt") {
        aVal = new Date(a.submittedAt).getTime();
        bVal = new Date(b.submittedAt).getTime();
      } else if (sortBy === "student.name") {
        aVal = a.student.name.toLowerCase();
        bVal = b.student.name.toLowerCase();
      } else if (sortBy === "result") {
        aVal = a.result ?? -1;
        bVal = b.result ?? -1;
      } else {
        aVal = 0;
        bVal = 0;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const submissions = filtered.slice(startIndex, endIndex);

    return {
      submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  // Get submission by ID
  getSubmissionById: async (id: string): Promise<AssignmentSubmission | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return dataStore.find((sub) => sub.id === id) || null;
  },

  // Update submission (for grading)
  updateSubmission: async (
    id: string,
    payload: Partial<GradeFormData>
  ): Promise<AssignmentSubmission | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = dataStore.findIndex((sub) => sub.id === id);
    if (index === -1) return null;

    const updated = {
      ...dataStore[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    dataStore[index] = updated;
    return updated;
  },
};