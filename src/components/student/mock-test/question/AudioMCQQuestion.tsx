import { useEffect, useRef } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const AudioMCQQuestion = ({ question, answer, onChange }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (question.audioUrl) {
      audioRef.current = new Audio(question.audioUrl);
      audioRef.current.play().catch(() => {});
    }
    return () => { audioRef.current?.pause(); };
  }, [question._id, question.audioUrl]);

  const selected = answer?.selectedOptionId;

  return (
    <div className="space-y-8">
      {question.audioUrl && (
        <div className="flex flex-col items-center gap-3 p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">🔊 Listen carefully</span>
          <audio controls src={question.audioUrl} className="w-full max-w-sm" autoPlay />
        </div>
      )}

      <p className="font-semibold text-muted-foreground">
        {question.questionText ?? "Choose the correct answer:"}
      </p>

      <RadioGroup
        value={selected ?? ""}
        onValueChange={(val) =>
          onChange({ questionId: question._id!, questionType: question.type, selectedOptionId: val })
        }
        className="space-y-3"
      >
        {question.options?.map((opt) => (
          <Label
            key={opt.optionId}
            htmlFor={`opt-${opt.optionId}`}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              selected === opt.optionId
                ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                : "border-muted bg-card hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value={opt.optionId} id={`opt-${opt.optionId}`} />
            <span className="font-bold mr-1 text-primary">{opt.optionId})</span>
            <span className="text-base">{opt.text}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
