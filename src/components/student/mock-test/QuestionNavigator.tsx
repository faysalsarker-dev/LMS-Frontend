import type { AnswerState } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answers: AnswerState;
  questionIds: string[];
  onChange: (index: number) => void;
}

const isAnswered = (answer: AnswerState[string] | undefined): boolean => {
  if (!answer) return false;
  return !!(
    answer.selectedOptionId ||
    (answer.gapSelections && Object.keys(answer.gapSelections).length > 0) ||
    (answer.segmentOrder && answer.segmentOrder.length > 0) ||
    (answer.subQuestionSelections &&
      Object.keys(answer.subQuestionSelections).length > 0) ||
    answer.textAnswer ||
    (answer.wordOrder && answer.wordOrder.length > 0) ||
    answer.audioBlob
  );
};

export const QuestionNavigator = ({
  total,
  current,
  answers,
  questionIds,
  onChange,
}: QuestionNavigatorProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Questions
      </h4>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }, (_, i) => {
          const answered = isAnswered(answers[questionIds[i]]);
          const isCurrent = i === current;
          return (
            <button
              key={i}
              onClick={() => i >= current && onChange(i)}
              disabled={i < current}
              className={cn(
                "h-9 w-9 rounded-xl text-sm font-bold transition-all duration-150 border-2",
                isCurrent
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/30 scale-110"
                  : answered
                  ? "bg-green-500/10 text-green-700 border-green-500/30 hover:border-green-500"
                  : "bg-muted/50 text-muted-foreground border-muted hover:border-primary/40",
                i < current && "opacity-50 cursor-not-allowed"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-green-500/30 border border-green-500/50" />
          Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-muted border border-muted-foreground/20" />
          Unanswered
        </span>
      </div>
    </div>
  );
};
