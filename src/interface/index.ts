// ---- Audio ----
export interface IAudio {
  url: string;
  duration?: number;
  transcripts: {
    language: string;
    text: string;
  }[];
}

// ---- Question ----
export interface IQuestion {
  type: "mcq" | "true_false" | "fill_blank" | "short_answer" | "audio";
  questionText: string;
  audio?: string | null;
  options?: { text: string }[];
  correctAnswer?: string | string[] | boolean | Record<string, any>;
  explanation?: string;
  timer?: number | null;
}

// ---- Video ----
export interface IVideo {
  url: string;
  duration?: number;
}

// ---- Assignment ----
export interface IAssignment {
  instruction: string;
  maxMarks?: number;
  allowMultipleSubmissions?: boolean;
  passingMarks?: number | null;
  deadline: Date | null;
}

// ---- Lesson ----
export interface ILesson {
  _id: string;
  title: string;
  slug: string;
  milestone: string; // ObjectId replaced with string
  course: string;    // ObjectId replaced with string
  order?: number;

  type: "video" | "doc" | "quiz" | "audio" | "assignment";

  doc?: string;
  questions?: IQuestion[] | null;
  video?: IVideo | null;
  audio?: IAudio | null;
  assignment?: IAssignment | null;

  status?: "active" | "inactive";
  viewCount?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
