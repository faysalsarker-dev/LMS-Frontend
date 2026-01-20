// Practice Types - TypeScript definitions for Practice Management

export type PracticeType = 'pronunciation' | 'vocabulary' | 'grammar' | 'exercise' | 'quiz' | 'other';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PracticeItem {
  _id?: string;
  content: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  description?: string;
  order: number;
}

export interface PracticeCategory {
  _id: string;
  name: string;
}

export interface PracticeCreator {
  _id: string;
  name: string;
}

export interface Practice {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  type: PracticeType;
  category?: PracticeCategory;
  items: PracticeItem[];
  difficulty: DifficultyLevel;
  estimatedTime?: string;
  tags?: string[];
  thumbnail?: string;
  isActive: boolean;
  createdBy?: PracticeCreator;
  totalItems: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeFormData {
  title: string;
  description?: string;
  type: PracticeType;
  category?: string;
  items: PracticeItem[];
  difficulty: DifficultyLevel;
  estimatedTime?: string;
  tags?: string[];
  thumbnail?: string;
  isActive: boolean;
}

export interface PracticeFilters {
  page?: number;
  limit?: number;
  type?: PracticeType | '';
  difficulty?: DifficultyLevel | '';
  category?: string;
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
