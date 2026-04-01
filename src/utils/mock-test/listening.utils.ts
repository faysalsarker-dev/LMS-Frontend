import type { IMockQuestion, AnswerState } from "@/interface/mockTest.types";

export interface IListeningResultItem {
  questionId: string;
  isCorrect: boolean;
  marks: number;
  studentAnswer: string;
  correctAnswer: string;
  type: string;
}

export interface IListeningResult {
  correctCount: number;
  earnedMarks: number;
  totalPossibleMarks: number;
  items: IListeningResultItem[];
}

export const calculateListeningResult = (
  questions: IMockQuestion[],
  answers: AnswerState
): IListeningResult => {
  let correctCount = 0;
  let earnedMarks = 0;
  let totalPossibleMarks = 0;

  const items = questions.map((q) => {
    totalPossibleMarks += q.marks;
    const ans = answers[q._id!];
    let isCorrect = false;
    let studentAnsText = "Not answered";
    let correctAnsText = "N/A";

    if (ans) {
      // Scoring Logic
      if (q.correctOptionId) {
        isCorrect = ans.selectedOptionId === q.correctOptionId;
        studentAnsText =
          q.options?.find((o) => o.optionId === ans.selectedOptionId)?.text ||
          ans.selectedOptionId ||
          "Selected";
        correctAnsText =
          q.options?.find((o) => o.optionId === q.correctOptionId)?.text ||
          q.correctOptionId ||
          "Correct Option";
      } else if (q.correctGaps) {
        // Fill in the gap (listening version might use same logic)
        const totalGaps = Array.isArray(q.correctGaps) ? q.correctGaps.length : 0;
        let correctGapsCount = 0;
        if (Array.isArray(q.correctGaps)) {
          q.correctGaps.forEach((g) => {
            if (ans.gapSelections?.[g.gapId] === g.correctWord) correctGapsCount++;
          });
          isCorrect = correctGapsCount === totalGaps && totalGaps > 0;
          studentAnsText = ans.gapSelections ? Object.values(ans.gapSelections).join(", ") : "None";
          correctAnsText = q.correctGaps.map((g) => g.correctWord).join(", ");
        }
      } else if (q.segments) {
        // Rearrange (listening version)
        const correctOrder = [...q.segments]
          .sort((a, b) => a.correctPosition - b.correctPosition)
          .map((s) => s.segmentId);
        isCorrect = JSON.stringify(ans.segmentOrder) === JSON.stringify(correctOrder);
        studentAnsText = ans.segmentOrder?.join(" → ") || "None";
        correctAnsText = correctOrder.join(" → ");
      } else if (q.correctSentence) {
        isCorrect =
          (ans.textAnswer || ans.wordOrder?.join(" ")) === q.correctSentence;
        studentAnsText = ans.textAnswer || ans.wordOrder?.join(" ") || "None";
        correctAnsText = q.correctSentence;
      }
    }

    if (isCorrect) {
      correctCount++;
      earnedMarks += q.marks;
    }

    return {
      questionId: q._id!,
      isCorrect,
      marks: q.marks,
      studentAnswer: studentAnsText,
      correctAnswer: correctAnsText,
      type: q.type,
    };
  });

  return { correctCount, earnedMarks, totalPossibleMarks, items };
};

export const constructListeningPayload = (
  sectionId: string,
  section: any,
  earnedMarks: number,
  answers: AnswerState
) => {
  const studentAnswers = Object.entries(answers).map(([id, ans]) => ({
    questionId: id,
    answer:
      ans.selectedOptionId ||
      ans.gapSelections ||
      ans.segmentOrder ||
      ans.subQuestionSelections ||
      ans.textAnswer ||
      ans.wordOrder,
  }));

  return {
    course: (section?.mockTest as any)?.course?._id || (section?.mockTest as any)?.course,
    mockTest: (section?.mockTest as any)?._id || section?.mockTest,
    sections: [
      {
        sectionId: sectionId,
        score: earnedMarks,
        isAutoGraded: section?.questions?.[0]?.isAutoMarked || false,
        studentAnswers,
        name: section?.name || 'Listening',
        totalMarks: section?.totalMarks || 0,
      },
    ],
  };
};

export const handleListeningSubmission = async ({
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
  const result = calculateListeningResult(questions, answers);
  setResults(result);

  const payload = constructListeningPayload(sectionId, section, result.earnedMarks, answers);
  console.log("Submitting listening section:", payload);
  
  // Re-enable submission
  await submitMockTest(payload).unwrap();
  return result;
};
