import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { IQuestion } from '@/interface/lesson.type';

interface McqAnswerSectionProps {
  question: IQuestion;
  questionIndex: number;
  onUpdateOption: (optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
}

export function McqAnswerSection({
  question,
  questionIndex,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}: McqAnswerSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Answer Options</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAddOption}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Option
        </Button>
      </div>

      {question.options.map((option, oIndex) => (
        <div key={oIndex} className="flex items-center gap-3">
          <Checkbox
            checked={option.isCorrect}
            onCheckedChange={(checked) => onUpdateOption(oIndex, 'isCorrect', !!checked)}
            className="data-[state=checked]:bg-success data-[state=checked]:border-success"
          />
          <Input
            value={option.text}
            onChange={(e) => onUpdateOption(oIndex, 'text', e.target.value)}
            placeholder={`Option ${oIndex + 1}`}
            className={cn(
              'flex-1',
              option.isCorrect && 'border-success focus-visible:ring-success'
            )}
          />
          {question.options.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveOption(oIndex)}
              className="shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Check the box next to correct answer(s)
      </p>
    </div>
  );
}
