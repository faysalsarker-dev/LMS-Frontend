// Practice Types - TypeScript definitions for Practice Management
// Updated to match MongoDB schema

export interface PracticeItem {
  content: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  description?: string;
  order: number;
}

export interface Course {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface PracticeCreator {
  _id: string;
  name: string;
  email?: string;
}

export interface Practice {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  course?: Course | string; // Can be populated or just ID
  items: PracticeItem[];
  thumbnail?: string;
  isActive: boolean;
  totalItems: number;
  usageCount: number;
  createdBy?: PracticeCreator;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeFormData {
  title: string;
  description?: string;
  course?: string; // Course ID
  items: PracticeItem[];
  thumbnail?: string;
  isActive: boolean;
}

export interface PracticeFilters {
  page?: number;
  limit?: number;
  course?: string;
  isActive?: boolean | '';
  search?: string;
  sortBy?: 'createdAt' | 'title' | 'usageCount' | 'totalItems';
  sortOrder?: 'asc' | 'desc';
}

export interface PracticeStats {
  totalPractices: number;
  activePractices: number;
  totalItems: number;
  totalUsage: number;
  practicesByCourse?: {
    courseName: string;
    count: number;
  }[];
  mostUsedPractice?: Practice;
}

export interface PracticesResponse {
  data: Practice[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PracticeResponse {
  data: Practice;
  message?: string;
}

export type CreatePracticeRequest = PracticeFormData;

export interface UpdatePracticeRequest extends Partial<PracticeFormData> {
  _id: string;
}

export interface DeletePracticeResponse {
  success: boolean;
  message: string;
}

// Utility type for practice creation/update payloads
export type PracticePayload = Omit<Practice, '_id' | 'slug' | 'totalItems' | 'usageCount' | 'createdAt' | 'updatedAt'>;

// Type guard to check if course is populated
export function isCoursePopulated(course: Course | string | undefined): course is Course {
  return typeof course === 'object' && course !== null && '_id' in course;
}

// Helper to get course ID
export function getCourseId(course: Course | string | undefined): string | undefined {
  if (!course) return undefined;
  return isCoursePopulated(course) ? course._id : course;
}

// Helper to get course name
export function getCourseName(course: Course | string | undefined): string | undefined {
  return isCoursePopulated(course) ? course.name : undefined;
}