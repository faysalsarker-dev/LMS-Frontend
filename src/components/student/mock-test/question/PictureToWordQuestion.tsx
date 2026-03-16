import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const PictureToWordQuestion = ({ question, answer, onChange }: Props) => {
  const selected = answer?.selectedOptionId;
  const imageUrl = (question.images?.[0] as any) || "";


  return (
    <div className="space-y-8">
      {/* Image */}
      {imageUrl && (
        <div className="flex justify-center">
          <div className="max-w-xs rounded-3xl overflow-hidden border-4 border-card shadow-2xl">
            <img src={imageUrl} alt="Reference" className="w-full h-auto object-cover" />
          </div>
        </div>
      )}

      <p className="font-semibold text-muted-foreground text-center">
        Which word matches this picture?
      </p>

      <RadioGroup
        value={selected ?? ""}
        onValueChange={(val) =>
          onChange({ questionId: question._id!, questionType: question.type, selectedOptionId: val })
        }
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {question.options?.map((opt) => (
          <Label
            key={opt.optionId}
            htmlFor={`pic-${opt.optionId}`}
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200",
              selected === opt.optionId
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted bg-card hover:border-primary/30"
            )}
          >
            <RadioGroupItem value={opt.optionId} id={`pic-${opt.optionId}`} />
          
            <span>{opt.text}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
