export type MockTestSubmissionStatus = "pending_review" | "graded";

export interface IMockTestSectionSubmission {
  sectionId: string;
  score: number;
  isAutoGraded: boolean;
  studentAnswers: { questionId: string; answer: any }[];
  adminScore?: number;
  adminFeedback?: string;
}

export interface IMockTestSubmission {
  _id: string;
  student: string | any;
  course: string | any;
  mockTest: string | any;
  sections: IMockTestSectionSubmission[];
  totalScore: number;
  status: MockTestSubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ISubmitMockTestPayload {
  course: string;
  mockTest: string;
  sections: {
    sectionId: string;
    score: number;
    isAutoGraded: boolean;
    studentAnswers: { questionId: string; answer: any }[];
  }[];
}

export interface IGradeSubmissionPayload {
  grades: {
    sectionId: string;
    score: number;
    feedback?: string;
  }[];
}

export interface IPendingSubmissionsFilters {
  search?: string;
  course?: string;
  mockTest?: string;
  section?: string;
  createdAt?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}
