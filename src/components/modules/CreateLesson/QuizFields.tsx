/* eslint-disable @typescript-eslint/no-explicit-any */
import {type UseFormRegister,type FieldErrors,type Control, useFieldArray, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, PlusCircle, X } from 'lucide-react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

interface QuizFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
}

export const QuizFields = ({ register, errors, control }: QuizFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Quiz Questions</Label>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() =>
            append({
              questionText: '',
              type: 'multiple-choice',
              options: ['', ''],
              correctAnswer: '',
              timer: undefined,
              audio: null,
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {fields.map((field, qIndex) => (
        <div key={field.id} className="p-6 border rounded-lg space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Question {qIndex + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(qIndex)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`questions.${qIndex}.questionText`}>Question Text *</Label>
            {/* <Controller
              name={`questions.${qIndex}.questionText` as const}
              control={control}
              rules={{ required: 'Question text is required' }}
              render={({ field }) => (
                // <ReactQuill
                //   theme="snow"
                //   value={field.value || ''}
                //   onChange={field.onChange}
                //   className="bg-background"
                //   placeholder="Enter your question..."
                // />
              )}
            /> */}
 
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Question Type *</Label>
              <Controller
                name={`questions.${qIndex}.type` as const}
                control={control}
                defaultValue="multiple-choice"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`questions.${qIndex}.timer`}>Timer (seconds)</Label>
              <Input
                type="number"
                {...register(`questions.${qIndex}.timer` as const, {
                  valueAsNumber: true,
                })}
                placeholder="Optional"
              />
            </div>
          </div>

          <Controller
            name={`questions.${qIndex}.type` as const}
            control={control}
            render={({ field: typeField }) => (
              <>
                {typeField.value === 'multiple-choice' && (
                  <QuestionOptions
                    qIndex={qIndex}
                    register={register}
                    control={control}
                  />
                )}
              </>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor={`questions.${qIndex}.correctAnswer`}>Correct Answer *</Label>
            <Input
              {...register(`questions.${qIndex}.correctAnswer` as const, {
                required: 'Correct answer is required',
              })}
              placeholder="Enter the correct answer"
            />

          </div>

          <div className="space-y-2">
            <Label htmlFor={`questions.${qIndex}.audio`}>Question Audio (Optional)</Label>
            <Input
              type="file"
              accept="audio/*"
              {...register(`questions.${qIndex}.audio` as const)}
              className="cursor-pointer"
            />
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No questions added yet</p>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                questionText: '',
                type: 'multiple-choice',
                options: ['', ''],
                correctAnswer: '',
                timer: undefined,
                audio: null,
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Question
          </Button>
        </div>
      )}
    </div>
  );
};

const QuestionOptions = ({
  qIndex,
  register,
  control,
}: {
  qIndex: number;
  register: UseFormRegister<any>;
  control: Control<any>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${qIndex}.options` as any,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append('') as any}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
      {fields.map((field, optIndex) => (
        <div key={field.id} className="flex gap-2">
          <Input
            {...register(`questions.${qIndex}.options.${optIndex}` as any)}
            placeholder={`Option ${optIndex + 1}`}
          />
          {fields.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(optIndex)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};