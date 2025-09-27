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
  course: string;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
  upstringdAt: string;
}


export interface ILesson {
  _id:string;
  title: string;
  milestone: string; 
  order?: number;
  contentType: "video" | "doc" | "quiz";
  videoUrl?: string;
  docContent?: string;
  status?: "active" | "inactive";
}