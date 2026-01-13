import { z } from 'zod';

// Zod Schemas for validation
export const AssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['quiz', 'assignment', 'project']),
  marks: z.number().min(0).max(100),
  maxMarks: z.number().min(0).max(100),
  submittedAt: z.string(),
  feedback: z.string().optional(),
  status: z.enum(['submitted', 'graded', 'pending']),
});

export const LessonProgressSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  duration: z.number(),
});

export const CourseProgressSchema = z.object({
  courseId: z.string(),
  courseName: z.string(),
  totalLessons: z.number(),
  completedLessons: z.number(),
  progressPercentage: z.number().min(0).max(100),
  isCompleted: z.boolean(),
  certificateUrl: z.string().optional(),
  quizStats: z.object({
    total: z.number(),
    passed: z.number(),
    failed: z.number(),
    averageMarks: z.number(),
  }),
  assignments: z.array(AssignmentSchema),
  lessons: z.array(LessonProgressSchema),
});

export const EnrolledCourseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  instructor: z.string(),
  enrolledAt: z.string(),
  lastAccessedAt: z.string(),
});

// TypeScript Types derived from Zod schemas
export type Assignment = z.infer<typeof AssignmentSchema>;
export type LessonProgress = z.infer<typeof LessonProgressSchema>;
export type CourseProgress = z.infer<typeof CourseProgressSchema>;
export type EnrolledCourse = z.infer<typeof EnrolledCourseSchema>;

// API Response types
export interface GetEnrolledCoursesResponse {
  courses: EnrolledCourse[];
  total: number;
}

export interface GetProgressResponse {
  progress: CourseProgress;
}




export interface IProgressOverview {
  progressPercentage: number;
  isCompleted: boolean;
  completedAt: string | null;
  totalLessonsCompleted: number;
}

export interface IQuizStats {
  totalAttempted: number;
  passed: number;
  failed: number;
}

export type AssignmentStatus = "graded" | "pending" | "submitted";

export interface IAssignmentSubmission {
  lessonName: string;
  status: AssignmentStatus;
  marks: number | null;
  feedback: string | null;
  date: string; // ISO string
}

export interface IAssignmentStats {
  avgMarks: number;
  submissions: IAssignmentSubmission[];
}

export interface IUserProgressData {
  overview: IProgressOverview;
  quizStats: IQuizStats;
  assignmentStats: IAssignmentStats;
  certificateUrl?: string | null;
}
