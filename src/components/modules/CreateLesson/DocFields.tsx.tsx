/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller,type  Control,type FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

interface DocFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

export const DocFields = ({ control, errors }: DocFieldsProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content *</Label>
      {/* <Controller
        name="content"
        control={control}
        rules={{ required: 'Content is required' }}
        render={({ field }) => (
        //   <ReactQuill
        //     theme="snow"
        //     value={field.value || ''}
        //     onChange={field.onChange}
        //     modules={modules}
        //     className="bg-background"
        //     placeholder="Enter lesson content..."
        //   />
        )}
      /> */}
      {errors.content && (
        <p className="text-sm text-destructive mt-2">{errors.content.message as string}</p>
      )}
    </div>
  );
};