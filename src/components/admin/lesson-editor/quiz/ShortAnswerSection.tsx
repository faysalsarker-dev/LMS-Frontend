import { Editor } from '@tinymce/tinymce-react';
import { Label } from '@/components/ui/label';
import type { IQuestion } from '@/interface/lesson.type';

interface ShortAnswerSectionProps {
  question: IQuestion;
  onUpdateField: (field: 'modelAnswer', value: string) => void;
}

export function ShortAnswerSection({
  question,
  onUpdateField,
}: ShortAnswerSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Model Answer</Label>
      <Editor

  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}


        value={question.modelAnswer || ''}
        onEditorChange={(content) => onUpdateField('modelAnswer', content)}
        init={{
          height: 150,
          menubar: false,
          plugins: ['lists', 'link'],
          toolbar: 'bold italic underline | bullist numlist | removeformat',
          content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
          branding: false,
          promotion: false,
        }}
      />
      <p className="text-xs text-muted-foreground">
        Provide a sample answer for grading reference
      </p>
    </div>
  );
}
