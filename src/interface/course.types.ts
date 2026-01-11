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
  progress?: number;
  category?: string | { _id: string; name: string };
  rating?: number;

}
