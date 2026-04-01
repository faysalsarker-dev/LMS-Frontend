import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const LongDialogueQuestion = ({ question, answer, onChange }: Props) => {
  const selected = answer?.selectedOptionId;

  return (
    <div className="space-y-8">
      {question.audioUrl && (
        <AudioPlayer
          src={question.audioUrl}
          label="🔊 Listen to the full dialogue"
          autoPlay
        />
      )}

      <p className="font-semibold text-muted-foreground text-center">
        {question.instruction ?? "Select the correct match after listening:"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {question.options?.map((opt) => (
          <button
            key={opt.optionId}
            onClick={() =>
              onChange({ questionId: question._id!, questionType: question.type, selectedOptionId: opt.optionId })
            }
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:border-primary/40",
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
              <p className="text-center text-sm font-medium py-4">{opt.text}</p>
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
