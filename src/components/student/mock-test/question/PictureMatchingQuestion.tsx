import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const PictureMatchingQuestion = ({ question, answer, onChange }: Props) => {
  const selected = answer?.selectedOptionId;

  return (
    <div className="space-y-8">
      {question.audioUrl && (
        <AudioPlayer
          src={question.audioUrl}
          label="🔊 Audio playing..."
          autoPlay
        />
      )}

      <p className="text-lg font-semibold text-center text-muted-foreground">
        {question.instruction ?? "Which picture matches what you heard?"}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {question.options?.map((opt) => (
          <button
            key={opt.optionId}
            onClick={() =>
              onChange({
                questionId: question._id!,
                questionType: question.type,
                selectedOptionId: opt.optionId,
              })
            }
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 hover:border-primary/40",
              selected === opt.optionId
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-105"
                : "border-muted bg-card"
            )}
          >
            {opt.imageUrl ? (
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                <img
                  src={opt.imageUrl}
                  alt={opt.text ?? opt.optionId}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-muted rounded-xl flex items-center justify-center text-3xl">
                🖼️
              </div>
            )}
            <span
              className={cn(
                "font-bold text-lg",
                selected === opt.optionId ? "text-primary" : "text-muted-foreground"
              )}
            >
              {opt.optionId}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
