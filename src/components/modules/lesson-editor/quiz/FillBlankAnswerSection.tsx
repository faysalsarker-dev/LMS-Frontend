import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { IQuestion } from '@/interface/lesson.type';

interface FillBlankAnswerSectionProps {
  question: IQuestion;
  onUpdateField: (field: 'correctAnswer', value: string) => void;
}

export function FillBlankAnswerSection({
  question,
  onUpdateField,
}: FillBlankAnswerSectionProps) {
  return (
    <div className="space-y-3">
      <Alert variant="default" className="bg-info/10 border-info/30">
        <Info className="h-4 w-4 text-info" />
        <AlertDescription className="text-sm text-foreground">
          Use <code className="bg-muted px-1 rounded">____</code> (four underscores) in your question text to indicate where the blank should appear.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Input
          value={question.correctAnswer || ''}
          onChange={(e) => onUpdateField('correctAnswer', e.target.value)}
          placeholder="Enter the expected word or phrase..."
        />
        <p className="text-xs text-muted-foreground">
          The word or phrase that fills the blank
        </p>
      </div>
    </div>
  );
}
