import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { IQuestion } from '@/interface/lesson.type';

interface TrueFalseAnswerSectionProps {
  question: IQuestion;
  onUpdateOption: (optionIndex: number, field: 'isCorrect', value: boolean) => void;
}

export function TrueFalseAnswerSection({
  question,
  onUpdateOption,
}: TrueFalseAnswerSectionProps) {
  const correctIndex = question.options.findIndex((opt) => opt.isCorrect);
  
  const handleChange = (value: string) => {
    const newCorrectIndex = parseInt(value, 10);
    question.options.forEach((_, idx) => {
      onUpdateOption(idx, 'isCorrect', idx === newCorrectIndex);
    });
  };

  return (
    <div className="space-y-3">
      <Label>Correct Answer</Label>
      <RadioGroup
        value={correctIndex >= 0 ? correctIndex.toString() : undefined}
        onValueChange={handleChange}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="0" id="true-option" />
          <Label htmlFor="true-option" className="font-normal cursor-pointer">
            True
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id="false-option" />
          <Label htmlFor="false-option" className="font-normal cursor-pointer">
            False
          </Label>
        </div>
      </RadioGroup>
      <p className="text-xs text-muted-foreground">
        Select whether the statement is true or false
      </p>
    </div>
  );
}
