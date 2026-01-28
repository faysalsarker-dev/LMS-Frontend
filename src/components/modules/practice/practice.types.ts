
export interface PracticeItem {
  _id: string;
  content: string;
  pronunciation?: string;
  audioUrl: string; 
  imageUrl?: string;
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
}

export interface Practice {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  course: Course;
  items: PracticeItem[];
  thumbnail?: string;
  isActive: boolean;
  usageCount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeFormData {
  title: string;
  description?: string;
  course: string; // Course ID
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
  sortBy?: 'createdAt' | 'title' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PracticeStats {
  totalPractices: number;
  activePractices: number;
  totalItems: number;
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
}
