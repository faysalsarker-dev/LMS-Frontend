import type { Control, UseFormRegister } from 'react-hook-form';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

import { QuestionCard } from './quiz/QuestionCard';
import type { ILessonFormData, IQuestion, QuestionType } from '@/interface/lesson.type';

interface QuizModuleProps {
  control: Control<ILessonFormData>;
  register: UseFormRegister<ILessonFormData>;
  questions: IQuestion[];
  onQuestionsChange: (questions: IQuestion[]) => void;
}

const createDefaultQuestion = (type: QuestionType): IQuestion => {
  const base = {
    type,
    questionText: '',
    explanation: '',
    timer: undefined,
    options: [],
    correctAnswer: '',
    modelAnswer: '',
    audioFile: null,
    audioUrl: '',
  };

  switch (type) {
    case 'mcq':
      return {
        ...base,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      };
    case 'true_false':
      return {
        ...base,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: false },
        ],
      };
    default:
      return base;
  }
};

export function QuizModule({ questions, onQuestionsChange }: QuizModuleProps) {
  const addQuestion = () => {
    onQuestionsChange([...questions, createDefaultQuestion('mcq')]);
  };

  const removeQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof IQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onQuestionsChange(updated);
  };

  const handleTypeChange = (index: number, newType: QuestionType) => {
    const updated = [...questions];
    const currentQuestion = updated[index];
    
    // Preserve common fields, reset type-specific ones
    updated[index] = {
      ...createDefaultQuestion(newType),
      questionText: currentQuestion.questionText,
      explanation: currentQuestion.explanation,
      timer: currentQuestion.timer,
    };
    onQuestionsChange(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ text: '', isCorrect: false });
    onQuestionsChange(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    onQuestionsChange(updated);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: 'text' | 'isCorrect',
    value: string | boolean
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      [field]: value,
    };
    onQuestionsChange(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base">Quiz Questions</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Create diverse question types with explanations
          </p>
        </div>
        <Button type="button" onClick={addQuestion} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              No questions yet. Click "Add Question" to create your first quiz question.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question, qIndex) => (
            <QuestionCard
              key={qIndex}
              question={question}
              questionIndex={qIndex}
              onRemove={() => removeQuestion(qIndex)}
              onUpdate={(field, value) => updateQuestion(qIndex, field, value)}
              onUpdateOption={(oIndex, field, value) => updateOption(qIndex, oIndex, field, value)}
              onAddOption={() => addOption(qIndex)}
              onRemoveOption={(oIndex) => removeOption(qIndex, oIndex)}
              onTypeChange={(type) => handleTypeChange(qIndex, type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
