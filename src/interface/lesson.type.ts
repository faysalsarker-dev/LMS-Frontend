export type LessonType = 'video' | 'audio' | 'doc' | 'quiz' | 'assignment';

export type LessonStatus = 'draft' | 'published' | 'archived';

export interface ITranscript {
  language: string;
  text: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'fill_blank' | 'short_answer' | 'audio';

export interface IQuestionOption {
  text: string;
  isCorrect?: boolean;
}

export interface IQuestion {
  type: QuestionType;
  questionText: string;
  options: IQuestionOption[];
  explanation?: string;
  timer?: number;
  // For fill_blank type
  correctAnswer?: string;
  // For short_answer type
  modelAnswer?: string;
  // For audio type
  audioFile?: File | null;
  audioUrl?: string;
  
}

export const QUESTION_TYPE_CONFIG = {
  mcq: {
    label: 'Multiple Choice',
    description: 'Select one correct answer from options',
  },
  true_false: {
    label: 'True / False',
    description: 'Binary true or false question',
  },
  fill_blank: {
    label: 'Fill in the Blank',
    description: 'Use "____" in question text for blank',
  },
  short_answer: {
    label: 'Short Answer',
    description: 'Free-form text response',
  },
  audio: {
    label: 'Audio Question',
    description: 'Audio-based question with response',
  },
} as const;

export interface ILessonFormData {
  title: string;
  description?: string;
  type: LessonType;
  order: number;
  status: LessonStatus;
 courseId: string;     
  milestoneId: string;


  // Video fields
  videoUrl?: string;
  videoFile?: File | null;
  videoDuration?: number;
  // Audio fields
  audioUrl?: string;
  audioFile?: File | null;
  transcripts?: ITranscript[];
  // Doc fields
  doc?: string;
  // Quiz fields
  questions?: IQuestion[];
  // Assignment fields
  assignmentInstruction?: string;
  maxMarks?: number;
  deadline?: Date;
}

export const LESSON_TYPE_CONFIG = {
  video: {
    label: 'Video',
    icon: 'Play',
    description: 'Upload or link a video lesson',
    color: 'var(--primary)',
  },
  audio: {
    label: 'Audio',
    icon: 'Headphones',
    description: 'Audio content with transcripts',
    color: 'var(--accent)',
  },
  doc: {
    label: 'Document',
    icon: 'FileText',
    description: 'Rich text document content',
    color: 'var(--info)',
  },
  quiz: {
    label: 'Quiz',
    icon: 'HelpCircle',
    description: 'Interactive quiz questions',
    color: 'var(--warning)',
  },
  assignment: {
    label: 'Assignment',
    icon: 'ClipboardList',
    description: 'Graded assignment submission',
    color: 'var(--success)',
  },
} as const;

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground' },
  published: { label: 'Published', color: 'bg-success text-success-foreground' },
  archived: { label: 'Archived', color: 'bg-secondary text-secondary-foreground' },
} as const;
