import type { IMockQuestion, AnswerState } from "@/interface/mockTest.types";

// ── Per-question submission ──────────────────────────────────────────────────

/**
 * Build a FormData payload for a single speaking question.
 * Sent via multipart/form-data so the server can receive the audio via multer.
 */
export const buildSpeakingFormData = ({
  sectionId,
  questionId,
  questionType,
  audioBlob,
  audioDurationSeconds,
  section,
}: {
  sectionId: string;
  questionId: string;
  questionType: string;
  audioBlob: Blob;
  audioDurationSeconds?: number;
  section: any;
}): FormData => {
  const fd = new FormData();

  fd.append("sectionId", sectionId);
  fd.append("questionId", questionId);
  fd.append("questionType", questionType);
  fd.append("audioDurationSeconds", String(audioDurationSeconds ?? 0));

  const mockTestId =
    (section?.mockTest as any)?._id || section?.mockTest;
  const courseId =
    (section?.mockTest as any)?.course?._id ||
    (section?.mockTest as any)?.course;

  if (mockTestId) fd.append("mockTest", mockTestId);
  if (courseId) fd.append("course", courseId);

  // Attach the audio file – name it so multer picks it up as "audio"
  fd.append("audio", audioBlob, `speaking_${questionId}.webm`);

  return fd;
};

// ── Submit a single speaking question ────────────────────────────────────────

/**
 * Submits one speaking question's recording.
 * Returns the server response or throws if the call fails.
 */
export const submitSpeakingQuestion = async ({
  question,
  answers,
  sectionId,
  section,
  submitSpeakingMockTest,
}: {
  question: IMockQuestion;
  answers: AnswerState;
  sectionId: string;
  section: any;
  submitSpeakingMockTest: (payload: FormData) => { unwrap: () => Promise<any> };
}): Promise<void> => {
  const ans = answers[question._id!];
  if (!ans?.audioBlob) {
    console.warn(`No audio for question ${question._id}. Skipping submission.`);
    return;
  }

  const fd = buildSpeakingFormData({
    sectionId,
    questionId: question._id!,
    questionType: question.type,
    audioBlob: ans.audioBlob,
    audioDurationSeconds: ans.audioDurationSeconds,
    section,
  });

  // ── Debug: log all FormData fields so you can verify before enabling the API call
  console.group(`🎤 Speaking FormData — Q: ${question._id}`);
  fd.forEach((value, key) => {
    if (value instanceof File) {
      console.log(`  [FILE] ${key}:`, {
        name: value.name,
        type: value.type,
        size: `${(value.size / 1024).toFixed(1)} KB`,
      });
    } else {
      console.log(`  [FIELD] ${key}:`, value);
    }
  });
  console.groupEnd();

  await submitSpeakingMockTest(fd).unwrap();
};

// ── Result types ─────────────────────────────────────────────────────────────

export interface ISpeakingResultItem {
  questionId: string;
  type: string;
  marks: number;
  hasRecording: boolean;
  audioDurationSeconds: number;
}

export interface ISpeakingResult {
  totalPossibleMarks: number;
  submittedCount: number;
  items: ISpeakingResultItem[];
}

// ── Calculate speaking result (for the result screen) ─────────────────────────
// All speaking questions are manually graded, so we never compute earned marks here.

export const calculateSpeakingResult = (
  questions: IMockQuestion[],
  answers: AnswerState
): ISpeakingResult => {
  let totalPossibleMarks = 0;
  let submittedCount = 0;

  const items: ISpeakingResultItem[] = questions.map((q) => {
    totalPossibleMarks += q.marks;
    const ans = answers[q._id!];
    const hasRecording = !!(ans?.audioBlob);
    if (hasRecording) submittedCount++;

    return {
      questionId: q._id!,
      type: q.type,
      marks: q.marks,
      hasRecording,
      audioDurationSeconds: ans?.audioDurationSeconds ?? 0,
    };
  });

  return { totalPossibleMarks, submittedCount, items };
};
