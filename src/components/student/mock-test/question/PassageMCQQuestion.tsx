import { useState, useEffect } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const PassageMCQQuestion = ({ question, answer, onChange }: Props) => {
  const [subSelections, setSubSelections] = useState<Record<string, string>>(
    answer?.subQuestionSelections ?? {}
  );

  useEffect(() => {
    setSubSelections(answer?.subQuestionSelections ?? {});
  }, [question._id]);

  const handleSubAnswer = (subId: string, optionId: string) => {
    const next = { ...subSelections, [subId]: optionId };
    setSubSelections(next);
    onChange({ questionId: question._id!, questionType: question.type, subQuestionSelections: next });
  };

  return (
    <div className="space-y-6">
      {/* Passage */}
      <ScrollArea className="max-h-60">
        <div className="p-6 rounded-3xl bg-card border-2 border-primary/10 prose prose-neutral max-w-none">
          <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground mb-3">Passage</h3>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{question.passage}</p>
        </div>
      </ScrollArea>

      {/* Sub-questions */}
      <div className="space-y-6">
        {question.subQuestions?.map((sq, idx) => (
          <div key={sq.subQuestionId} className="space-y-3">
            <p className="font-bold">
              Q{idx + 1}. {sq.questionText}
            </p>
            <RadioGroup
              value={subSelections[sq.subQuestionId] ?? ""}
              onValueChange={(val) => handleSubAnswer(sq.subQuestionId, val)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {sq.options.map((opt) => (
                <Label
                  key={opt.optionId}
                  htmlFor={`${sq.subQuestionId}-${opt.optionId}`}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    subSelections[sq.subQuestionId] === opt.optionId
                      ? "border-primary bg-primary/5"
                      : "border-muted bg-card hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem value={opt.optionId} id={`${sq.subQuestionId}-${opt.optionId}`} />
                  <span className="font-bold text-primary mr-1">{opt.optionId})</span>
                  <span>{opt.text}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
};
