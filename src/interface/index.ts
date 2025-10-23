export interface SingleFileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | string | null;
}


export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;

}




export const UserRoles = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = "admin" | "instructor" | "super_admin" | "student";

export interface IUser {
  _id:string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  profile?: string;
  courses: ICourse[];

  address: {
    country?: string;
    city?: string;
  };
  createdAt:Date;
  updateAt:Date;
}



export interface ICourse  {
    _id:string;
  title: string;
  slug: string;
  description?: string;
  instructor: string;
  milestones: string[];
  thumbnail?: string | null;
  tags: string[];
  skills: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  prerequisites: string[];
  requirements: string[];
  price: number;
  currency: string;
  isDiscounted: boolean;
  discountPrice: number;
  status: "draft" | "published" | "archived";
  averageRating: number;
  totalEnrolled: number;
  enrolledStudents:[];
  duration: string; 
  totalLectures: number;
  certificateAvailable: boolean;
  resources: string[]; 
  isFeatured:boolean;

}



export interface IMilestone {
    _id:string;
  title: string;
  course?:ICourse | string;
  order: number;
  status: "active" | "inactive";
  lesson: string[] | ILesson[];
  createdAt:Date;
  updatedAt:Date;
}



// ✅ Option structure for quiz questions
export interface IQuizOption {
  text: string;
  isCorrect?: boolean; // optional if you allow marking answers
}

// ✅ Quiz structure
export interface IQuiz {
  question: string;
  options: IQuizOption[];
  correctAnswer: string;
  explanation?: string;
  timer?: number | null; 
}

export interface ILesson {
  _id: string;
  title: string;
  slug: string;
  milestone: string;
  course: string;
  order?: number;
  contentType: "video" | "doc" | "quiz" | "assignment";
  videoUrl?: string;
  videoSourceType?: "link" | "upload";
  docContent?: string;
  quiz?: IQuiz;
  status?: "active" | "inactive";
  viewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}





export type ContentType = "video" | "doc" | "quiz" | "assignment";
export type LessonStatus = "active" | "inactive" | undefined;
export type VideoSourceType = string | undefined;
export type VideoStorageType = "cdn" | "external";

export interface VideoMeta {
  filename?: string;
  size?: number;
  mimeType?: string;
  duration?: number;
  storage: VideoStorageType;
}

export interface QuizOption {
  text: string;
  isCorrect?: boolean;
}

export interface QuizData {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
  timer?: number | null; 
}


export interface LessonFormData {
  title?: string;
  order?: number;
  contentType?: "video" | "doc" | "quiz" | "assignment";
  status?: "active" | "inactive";
  course?: string;
  milestone?: string;
  videoUrl?: string;
  videoSourceType?: string;
  docContent?: string;
  quiz?: QuizData;
  videoFile: File | string | null ;

}

export interface UploadProgress {
  progress: number;
  status: "idle" | "uploading" | "processing" | "success" | "error";
  error?: string;
}


export interface ICategory {
  _id?:string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  totalCourse?: number;
}
