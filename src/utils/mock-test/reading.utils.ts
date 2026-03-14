import type { IMockQuestion, AnswerState } from "@/interface/mockTest.types";

export interface IReadingResultItem {
  questionId: string;
  isCorrect: boolean;
  marks: number;
  earnedMarks: number;
  studentAnswer: string;
  correctAnswer: string;
  type: string;
}

export interface IReadingResult {
  correctCount: number;
  earnedMarks: number;
  totalPossibleMarks: number;
  items: IReadingResultItem[];
}

export const calculateReadingResult = (
  questions: IMockQuestion[],
  answers: AnswerState
): IReadingResult => {
  let correctCount = 0;
  let earnedMarks = 0;
  let totalPossibleMarks = 0;

  const items = questions.map((q) => {
    totalPossibleMarks += q.marks;
    const ans = answers[q._id!];
    let isCorrect = false;
    let earnedQuestionMarks = 0;
    let studentAnsText = "Not answered";
    let correctAnsText = "N/A";

    if (ans) {
      if (q.type === "R_SENTENCE_TO_PICTURE") {
        isCorrect = ans.selectedOptionId === q.correctOptionId;
        if (isCorrect) earnedQuestionMarks = q.marks;
        studentAnsText =
          q.options?.find((o) => o.optionId === ans.selectedOptionId)?.text ||
          ans.selectedOptionId ||
          "Selected";
        correctAnsText =
          q.options?.find((o) => o.optionId === q.correctOptionId)?.text ||
          q.correctOptionId ||
          "Correct Option";
      } else if (q.type === "R_FILL_IN_THE_GAP") {
        const rawCorrectGaps = q.correctGaps;
        let totalGaps = 0;
        let correctGapsCount = 0;
        let correctGapsDisplay: string[] = [];

        if (rawCorrectGaps && typeof rawCorrectGaps === "object") {
          if (Array.isArray(rawCorrectGaps)) {
            // It's an array (IMockGapEntry[])
            totalGaps = rawCorrectGaps.length;
            rawCorrectGaps.forEach((g) => {
              if (ans.gapSelections?.[g.gapId] === g.correctWord) correctGapsCount++;
              correctGapsDisplay.push(`${g.gapId}: ${g.correctWord}`);
            });
          } else {
            // It's a plain object { gap_1: "W1", ... }
            const entries = Object.entries(rawCorrectGaps as Record<string, string>);
            totalGaps = entries.length;
            entries.forEach(([gapId, correctWord]) => {
              if (ans.gapSelections?.[gapId] === correctWord) correctGapsCount++;
              correctGapsDisplay.push(`${gapId}: ${correctWord}`);
            });
          }
        }

        earnedQuestionMarks =
          totalGaps > 0 ? (q.marks / totalGaps) * correctGapsCount : 0;
        isCorrect = correctGapsCount === totalGaps && totalGaps > 0;
        studentAnsText = ans.gapSelections
          ? Object.entries(ans.gapSelections)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")
          : "None";
        correctAnsText = correctGapsDisplay.join(", ");
      } else if (q.type === "R_REARRANGE_PASSAGE") {
        const segments = q.segments || [];
        const totalSegments = segments.length;
        let correctSegmentsCount = 0;

        // Correct order based on correctPosition
        const correctOrder = [...segments]
          .sort((a, b) => a.correctPosition - b.correctPosition)
          .map((s) => s.segmentId);

        if (ans.segmentOrder) {
          ans.segmentOrder.forEach((segId, idx) => {
            if (segId === correctOrder[idx]) correctSegmentsCount++;
          });
        }

        earnedQuestionMarks =
          totalSegments > 0 ? (q.marks / totalSegments) * correctSegmentsCount : 0;
        isCorrect = correctSegmentsCount === totalSegments && totalSegments > 0;
        studentAnsText = ans.segmentOrder?.join(" → ") || "None";
        correctAnsText = correctOrder.join(" → ");
      } else if (q.type === "R_PASSAGE_MCQ") {
        const subQuestions = q.subQuestions || [];
        let totalSubCorrect = 0;
        subQuestions.forEach((sq: any) => {
          if (ans.subQuestionSelections?.[sq.subQuestionId] === sq.correctOptionId) {
            earnedQuestionMarks += sq.marks || 0;
            totalSubCorrect++;
          }
        });
        isCorrect = totalSubCorrect === subQuestions.length && subQuestions.length > 0;
        studentAnsText = ans.subQuestionSelections
          ? Object.entries(ans.subQuestionSelections)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")
          : "None";
        correctAnsText = subQuestions
          .map((sq) => `${sq.subQuestionId}: ${sq.correctOptionId}`)
          .join(", ");
      }
    }

    if (isCorrect) correctCount++;
    earnedMarks += earnedQuestionMarks;

    return {
      questionId: q._id!,
      isCorrect,
      marks: q.marks,
      earnedMarks: Math.round(earnedQuestionMarks * 100) / 100,
      studentAnswer: studentAnsText,
      correctAnswer: correctAnsText,
      type: q.type,
    };
  });

  return {
    correctCount,
    earnedMarks: Math.round(earnedMarks * 100) / 100,
    totalPossibleMarks,
    items,
  };
};

export const constructReadingPayload = (
  sectionId: string,
  section: any,
  earnedMarks: number,
  answers: AnswerState
) => {
  const studentAnswers = Object.entries(answers).reduce((acc, [id, ans]) => {
    acc[id] =
      ans.selectedOptionId ||
      ans.gapSelections ||
      ans.segmentOrder ||
      ans.subQuestionSelections ||
      ans.textAnswer ||
      ans.wordOrder;
    return acc;
  }, {} as Record<string, any>);

  return {
    course: (section?.mockTest as any)?.course?._id || (section?.mockTest as any)?.course,
    mockTest: (section?.mockTest as any)?._id || section?.mockTest,
    sections: [
      {
        sectionId: sectionId,
        score: earnedMarks,
        isAutoGraded: section?.questions?.[0]?.isAutoMarked || false,
        studentAnswers,
      },
    ],
  };
};

export const handleReadingSubmission = async ({
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
  const result = calculateReadingResult(questions, answers);
  setResults(result);

  const payload = constructReadingPayload(sectionId, section, result.earnedMarks, answers);
  console.log("Submitting reading section:", payload);

  await submitMockTest(payload).unwrap();
  return result;
};
