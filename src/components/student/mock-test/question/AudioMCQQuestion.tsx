import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const AudioMCQQuestion = ({ question, answer, onChange }: Props) => {
  const selected = answer?.selectedOptionId;

  return (
    <div className="space-y-8">
      {question.audioUrl && (
        <AudioPlayer
          src={question.audioUrl}
          label="🔊 Listen carefully"
          autoPlay
        />
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
