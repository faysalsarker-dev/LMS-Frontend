import { Trash2, GripVertical, Clock } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { McqAnswerSection } from './McqAnswerSection';
import { TrueFalseAnswerSection } from './TrueFalseAnswerSection';
import { FillBlankAnswerSection } from './FillBlankAnswerSection';
import { ShortAnswerSection } from './ShortAnswerSection';
import { AudioAnswerSection } from './AudioAnswerSection';
import { QUESTION_TYPE_CONFIG, type IQuestion } from '@/interface/lesson.type';

interface QuestionCardProps {
  question: IQuestion;
  questionIndex: number;
  onRemove: () => void;
  onUpdate: (field: keyof IQuestion, value: any) => void;
  onUpdateOption: (optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
  onTypeChange: (type: any) => void;
}

export function QuestionCard({
  question,
  questionIndex,
  onRemove,
  onUpdate,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onTypeChange,
}: QuestionCardProps) {
  const renderAnswerSection = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <McqAnswerSection
            question={question}
            questionIndex={questionIndex}
            onUpdateOption={onUpdateOption}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
          />
        );
      case 'true_false':
        return (
          <TrueFalseAnswerSection
            question={question}
            onUpdateOption={onUpdateOption}
          />
        );
      case 'fill_blank':
        return (
          <FillBlankAnswerSection
            question={question}
            onUpdateField={(field, value) => onUpdate(field, value)}
          />
        );
      case 'short_answer':
        return (
          <ShortAnswerSection
            question={question}
            onUpdateField={(field, value) => onUpdate(field, value)}
          />
        );
      case 'audio':
        return (
          <AudioAnswerSection
            question={question}
            onUpdateField={(field, value) => onUpdate(field, value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GripVertical className="w-4 h-4" />
            <span className="text-sm font-medium">Question {questionIndex + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={question.type} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QUESTION_TYPE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Type Description */}
        <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
          {QUESTION_TYPE_CONFIG[question.type].description}
        </p>

        {/* Question Text with TinyMCE */}
        <div className="space-y-2">
          <Label>Question Text</Label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}

            value={question.questionText}
            onEditorChange={(content) => onUpdate('questionText', content)}
            init={{
              height: 150,
              menubar: false,
              plugins: ['lists', 'link', 'image', 'table'],
              toolbar: 'bold italic underline | bullist numlist | table | removeformat',
              content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
              branding: false,
              promotion: false,
            }}
          />
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <Label className="shrink-0">Timer (seconds)</Label>
          <Input
            type="number"
            min={0}
            value={question.timer || ''}
            onChange={(e) => onUpdate('timer', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            placeholder="No limit"
            className="w-32"
          />
        </div>

        {/* Dynamic Answer Section */}
        {renderAnswerSection()}

        {/* Explanation (Rich Text) */}
        <div className="space-y-2">
          <Label>Explanation (Optional)</Label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}

            // tinymceScriptSrc="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"
            value={question.explanation || ''}
            onEditorChange={(content) => onUpdate('explanation', content)}
            init={{
              height: 120,
              menubar: false,
              plugins: ['lists', 'link'],
              toolbar: 'bold italic underline | bullist numlist | removeformat',
              content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
              branding: false,
              promotion: false,
            }}
          />
          <p className="text-xs text-muted-foreground">
            Explain why this answer is correct
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
