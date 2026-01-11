export interface ICategory {
    _id: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  totalCourse?: number;
}