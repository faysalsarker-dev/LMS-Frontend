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