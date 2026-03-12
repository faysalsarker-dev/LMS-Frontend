import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const SentenceToPictureQuestion = ({ question, answer, onChange }: Props) => {
  const selected = answer?.selectedOptionId;

  return (
    <div className="space-y-8">
      {/* Sentence stimulus */}
      <div className="p-6 rounded-3xl bg-card border-2 border-primary/10 text-center">
        <p className="text-2xl font-bold leading-relaxed">
          &ldquo;{question.questionText}&rdquo;
        </p>
      </div>

      <p className="font-semibold text-muted-foreground text-center">
        Which picture matches this sentence?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {question.options?.map((opt) => (
          <button
            key={opt.optionId}
            onClick={() =>
              onChange({ questionId: question._id!, questionType: question.type, selectedOptionId: opt.optionId })
            }
            className={cn(
              "flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 hover:border-primary/40",
              selected === opt.optionId
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-105"
                : "border-muted bg-card"
            )}
          >
            {opt.imageUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <img src={opt.imageUrl} alt={opt.text ?? opt.optionId} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video w-full bg-muted rounded-xl flex items-center justify-center text-4xl">🖼️</div>
            )}
            <span className={cn("font-bold", selected === opt.optionId ? "text-primary" : "text-muted-foreground")}>
              {opt.optionId}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
