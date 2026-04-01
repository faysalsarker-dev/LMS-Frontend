import type { IMockQuestion, AnswerState } from "@/interface/mockTest.types";

export interface IWritingResultItem {
  questionId: string;
  isCorrect: boolean;
  marks: number;
  earnedMarks: number;
  studentAnswer: string;
  correctAnswer: string;
  type: string;
  isAutoMarked: boolean;
}

export interface IWritingResult {
  correctCount: number;
  earnedMarks: number;
  totalPossibleMarks: number;
  items: IWritingResultItem[];
}

export const calculateWritingResult = (
  questions: IMockQuestion[],
  answers: AnswerState
): IWritingResult => {
  let correctCount = 0;
  let earnedMarks = 0;
  let totalPossibleMarks = 0;

  const items = questions.map((q) => {
    totalPossibleMarks += q.marks;
    const ans = answers[q._id!];
    let isCorrect = false;
    let earnedQuestionMarks = 0;
    let studentAnsText = "Not answered";
    let correctAnsText = q.correctSentence || q.correctOptionId || "Manual Grading Required";

    if (ans) {
      if (q.type === "W_PICTURE_TO_WORD") {
        const option = q.options?.find((o) => o.optionId === ans.selectedOptionId);
        isCorrect =
          ans.selectedOptionId === q.correctOptionId ||
          option?.text === q.correctOptionId;
        if (isCorrect) earnedQuestionMarks = q.marks;
        studentAnsText = option?.text || ans.selectedOptionId || "Selected";
        correctAnsText = q.correctOptionId || "N/A";
      } else if (q.type === "W_WORD_TO_SENTENCE") {
        const studentSentence = (ans.wordOrder || []).join(" ");
        isCorrect = studentSentence.trim() === (q.correctSentence || "").trim();
        if (isCorrect) earnedQuestionMarks = q.marks;
        studentAnsText = studentSentence || "None";
        correctAnsText = q.correctSentence || "N/A";
      } else {
        // Not auto-marked or different type
        studentAnsText = ans.textAnswer || "None";
        isCorrect = false; // Pending manual review
        earnedQuestionMarks = 0;
      }
    }

    if (isCorrect && q.isAutoMarked) correctCount++;
    earnedMarks += earnedQuestionMarks;

    return {
      questionId: q._id!,
      isCorrect,
      marks: q.marks,
      earnedMarks: Math.round(earnedQuestionMarks * 100) / 100,
      studentAnswer: studentAnsText,
      correctAnswer: correctAnsText,
      type: q.type,
      isAutoMarked: !!q.isAutoMarked,
    };
  });

  return {
    correctCount,
    earnedMarks: Math.round(earnedMarks * 100) / 100,
    totalPossibleMarks,
    items,
  };
};

export const constructWritingPayload = (
  sectionId: string,
  section: any,
  earnedMarks: number,
  answers: AnswerState
) => {
  const studentAnswers = Object.entries(answers).map(([id, ans]) => ({
    questionId: id,
    answer:
      ans.selectedOptionId ||
      ans.textAnswer ||
      ans.wordOrder,
  }));

  // Determine if the *entire* section is auto-graded
  // If even one question requires manual grading (isAutoMarked is false/undefined), the section isn't fully auto-graded.
  const isAutoGraded = section?.questions?.every((q: any) => q.isAutoMarked) ?? false;

  return {
    course: (section?.mockTest as any)?.course?._id || (section?.mockTest as any)?.course,
    mockTest: (section?.mockTest as any)?._id || section?.mockTest,
    sections: [
      {
        sectionId: sectionId,
        score: earnedMarks,
        isAutoGraded,
        studentAnswers,
        name: section?.name || 'Writing',
        totalMarks: section?.totalMarks || 0,

      },
    ],
  };
};

export const handleWritingSubmission = async ({
  questions,
  answers,
  sectionId,
  section,
  setResults,
  submitMockTest,
}: {
  questions: IMockQuestion[];
  answers: AnswerState;
  sectionId: string;
  section: any;
  setResults: (results: any) => void;
  submitMockTest: (payload: any) => { unwrap: () => Promise<any> };
}) => {
  const result = calculateWritingResult(questions, answers);
  setResults(result);

  const payload = constructWritingPayload(sectionId, section, result.earnedMarks, answers);
  console.log("Submitting writing section:", payload);

  await submitMockTest(payload).unwrap();
  return result;
};
