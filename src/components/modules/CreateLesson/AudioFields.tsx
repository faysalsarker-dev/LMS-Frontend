/* eslint-disable @typescript-eslint/no-explicit-any */
import { type UseFormRegister, type FieldErrors, type Control, useFieldArray } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface AudioFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
}

export const AudioFields = ({ register, errors, control }: AudioFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transcripts',
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="audioFile">Audio File *</Label>
        <Input
          id="audioFile"
          type="file"
          accept="audio/*"
          {...register('audioFile', { required: 'Audio file is required' })}
          className="cursor-pointer"
        />
        {errors.audioFile && (
          <p className="text-sm text-destructive">{errors.audioFile.message as string}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Multilingual Transcripts</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ language: '', transcript: '' })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transcript
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transcript {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`transcripts.${index}.language`}>Language</Label>
              <Input
                {...register(`transcripts.${index}.language` as const)}
                placeholder="e.g., English, Spanish"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`transcripts.${index}.transcript`}>Transcript</Label>
              <Textarea
                {...register(`transcripts.${index}.transcript` as const)}
                placeholder="Enter transcript..."
                rows={4}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};