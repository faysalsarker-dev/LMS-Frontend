// Student Assignment Submission Types

export type AssignmentSubmissionType = 'file' | 'text' | 'both';
export type AssignmentStatus = 'pending' | 'reviewed' | 'graded';

export interface IAssignmentSchema {
  _id: string;
  title: string;
  instruction: string;
  deadline: string;
  maxMarks: number;
  passingMarks: number;
  submissionType: AssignmentSubmissionType;
  allowMultipleSubmissions: boolean;
  courseId: string;
  lessonId: string;
}

export interface IStudentSubmission {
  _id: string;
  assignmentId: string;
  studentId: string;
  textResponse?: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  status: AssignmentStatus;
  result?: number;
  feedback?: string;
  reviewedAt?: string;
}

export interface ICreateSubmissionData {
  assignmentId: string;
  textResponse?: string;
  file?: File;
}

export interface ISubmissionResponse {
  success: boolean;
  data: IStudentSubmission;
  message?: string;
}

export interface IAssignmentResponse {
  success: boolean;
  data: IAssignmentSchema;
}

export interface ISubmissionListResponse {
  success: boolean;
  data: IStudentSubmission[];
}
