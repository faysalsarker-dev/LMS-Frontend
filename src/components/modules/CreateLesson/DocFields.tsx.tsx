/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller,type  Control,type FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';


interface DocFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}



export const DocFields = ({ control, errors }: DocFieldsProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content *</Label>

      {errors.content && (
        <p className="text-sm text-destructive mt-2">{errors.content.message as string}</p>
      )}
    </div>
  );
};