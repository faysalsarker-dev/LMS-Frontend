// Assignment Submission Types

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IAssignmentCourse {
  _id: string;
  title: string;
}

export interface IAssignmentLesson {
  _id: string;
  title: string;
}

export type SubmissionType = 'file' | 'text' | 'link';
export type SubmissionStatus = 'pending' | 'reviewed' | 'graded';

export interface IAssignmentSubmission {
  _id: string;
  student: IStudent;
  course: IAssignmentCourse;
  lesson: IAssignmentLesson;
  submissionType: SubmissionType;
  file?: string;
  textResponse?: string | null;
  linkUrl?: string;
  submittedAt: string;
  status: SubmissionStatus;
  result?: number | null;
  feedback?: string | null;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface IAssignmentFilters {
  page: number;
  limit: number;
  search?: string;
  status?: SubmissionStatus | 'all';
  submissionType?: SubmissionType | 'all';
  course?: string | 'all';
  lesson?: string | 'all';
}

export interface IAssignmentMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IAssignmentListResponse {
  success: boolean;
  data: IAssignmentSubmission[];
  meta: IAssignmentMeta;
}

export interface IReviewSubmissionData {
  id: string;
  status: 'reviewed' | 'graded';
  result?: number;
  feedback?: string;
}
