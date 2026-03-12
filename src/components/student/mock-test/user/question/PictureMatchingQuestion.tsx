import { useEffect, useRef } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const PictureMatchingQuestion = ({ question, answer, onChange }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (question.audioUrl) {
      audioRef.current = new Audio(question.audioUrl);
      audioRef.current.play().catch(() => {});
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [question._id, question.audioUrl]);

  const selected = answer?.selectedOptionId;

  return (
    <div className="space-y-8">
      {question.audioUrl && (
        <div className="flex flex-col items-center gap-3 p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            🔊 Audio playing...
          </span>
          <audio
            controls
            src={question.audioUrl}
            className="w-full max-w-sm"
            autoPlay
          />
        </div>
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
