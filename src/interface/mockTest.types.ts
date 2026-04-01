// ─── Question Type Enum ────────────────────────────────────────────────────
export type QuestionType =
  // Listening
  | "L_PICTURE_MATCHING"
  | "L_AUDIO_MCQ"
  | "L_LONG_DIALOGUE_MATCHING"
  // Reading
  | "R_SENTENCE_TO_PICTURE"
  | "R_FILL_IN_THE_GAP"
  | "R_REARRANGE_PASSAGE"
  | "R_PASSAGE_MCQ"
  // Writing
  | "W_PICTURE_TO_WORD"
  | "W_WORD_TO_SENTENCE"
  | "W_PINYIN_TO_CHARACTER"
  | "W_COMPOSITION_PICTURES"
  | "W_COMPOSITION_TOPIC"
  // Speaking
  | "S_REPEAT_AFTER_LISTENING"
  | "S_SPEAK_ON_PICTURE"
  | "S_ANSWER_QUESTION";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  L_PICTURE_MATCHING: "Listening – Picture Matching",
  L_AUDIO_MCQ: "Listening – Audio MCQ",
  L_LONG_DIALOGUE_MATCHING: "Listening – Long Dialogue",
  R_SENTENCE_TO_PICTURE: "Reading – Sentence to Picture",
  R_FILL_IN_THE_GAP: "Reading – Fill in the Gap",
  R_REARRANGE_PASSAGE: "Reading – Rearrange Passage",
  R_PASSAGE_MCQ: "Reading – Passage MCQ",
  W_PICTURE_TO_WORD: "Writing – Picture to Word",
  W_WORD_TO_SENTENCE: "Writing – Word to Sentence",
  W_PINYIN_TO_CHARACTER: "Writing – Pinyin to Character",
  W_COMPOSITION_PICTURES: "Writing – Composition (Pictures)",
  W_COMPOSITION_TOPIC: "Writing – Composition (Topic)",
  S_REPEAT_AFTER_LISTENING: "Speaking – Repeat After Listening",
  S_SPEAK_ON_PICTURE: "Speaking – Speak on Picture",
  S_ANSWER_QUESTION: "Speaking – Answer Question",
};

export type SectionName = "listening" | "reading" | "writing" | "speaking";

// ─── Sub-models ────────────────────────────────────────────────────────────
export interface IMockOption {
  optionId: string;
  text?: string;
  imageUrl?: string;
}

export interface IMockSegment {
  segmentId: string;
  text: string;
  correctPosition: number;
}

export interface IMockGapEntry {
  gapId: string;
  correctWord: string;
}

export interface IMockSubQuestion {
  subQuestionId: string;
  questionText: string;
  options: IMockOption[];
  correctOptionId: string;
}

export interface IMedia {
  url: string;
  alt?: string;
}

// ─── Main Question ──────────────────────────────────────────────────────────
export interface IMockQuestion {
  _id?: string;
  type: QuestionType;
  marks: number;
  instruction?: string;
  isAutoMarked?: boolean;

  // Audio / Speaking
  audioUrl?: string;
  allowedRecordingTime?: number;

  // Text
  questionText?: string;
  passageText?: string;
  topic?: string;
  pinyin?: string;
  passage?: string;

  // Media
  images?: IMedia[];

  // MCQ
  options?: IMockOption[];
  correctOptionId?: string;

  // Fill-in-gap
  wordPool?: IMockOption[];
  correctGaps?: IMockGapEntry[];

  // Rearrange
  segments?: IMockSegment[];

  // Word to Sentence
  wordTokens?: string[];
  correctSentence?: string;

  // Composition
  minWordCount?: number;

  // Sub-questions (passage MCQ)
  subQuestions?: IMockSubQuestion[];
}

// ─── Section ────────────────────────────────────────────────────────────────
export interface IMockTestSection {
  _id: string;
  mockTest: string | { _id: string; title: string; slug?: string };
  name: SectionName;
  timeLimit: number;
  instruction?: string | null;
  questions: IMockQuestion[];
  totalMarks: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Section Status ──────────────────────────────────────────────────────────
export type SectionStatus = "locked" | "not_started" | "in_progress" | "submitted";

export interface SectionState {
  listening: SectionStatus;
  reading: SectionStatus;
  writing: SectionStatus;
  speaking: SectionStatus;
}

// ─── Answer State ─────────────────────────────────────────────────────────────
export interface QuestionAnswer {
  questionId: string;
  questionType: QuestionType;
  // Single option select
  selectedOptionId?: string;
  // Fill in the gap — key = gapId, value = optionId chosen
  gapSelections?: Record<string, string>;
  // Rearrange — array of segmentIds in student's current order
  segmentOrder?: string[];
  // Passage MCQ — key = subQuestionId, value = selectedOptionId
  subQuestionSelections?: Record<string, string>;
  // Free text
  textAnswer?: string;
  wordCount?: number;
  // Word ordering
  wordOrder?: string[];
  // Audio recording
  audioBlob?: Blob;
  audioDurationSeconds?: number;
}

export type AnswerState = Record<string, QuestionAnswer>;

// ─── Mock Test ──────────────────────────────────────────────────────────────
export interface IMockTest {
  _id: string;
  slug: string;
  title: string;
  thumbnail?: string;
  course: { _id: string; title: string; slug?: string };
  listening?: string | IMockTestSection;
  reading?: string | IMockTestSection;
  writing?: string | IMockTestSection;
  speaking?: string | IMockTestSection;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
