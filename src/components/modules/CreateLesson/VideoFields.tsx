/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { type UseFormRegister,type FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface VideoFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const VideoFields = ({ register, errors }: VideoFieldsProps) => {
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Video Source *</Label>
        <RadioGroup value={uploadType} onValueChange={(value) => setUploadType(value as 'file' | 'url')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id="file" />
            <Label htmlFor="file" className="cursor-pointer font-normal">Upload Video File</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url" className="cursor-pointer font-normal">Video URL</Label>
          </div>
        </RadioGroup>
      </div>

      {uploadType === 'file' ? (
        <div className="space-y-2">
          <Label htmlFor="videoFile">Video File *</Label>
          <Input
            id="videoFile"
            type="file"
            accept="video/*"
            {...register('videoFile', { required: uploadType === 'file' ? 'Video file is required' : false })}
            className="cursor-pointer"
          />
          {errors.videoFile && (
            <p className="text-sm text-destructive">{errors.videoFile.message as string}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL *</Label>
          <Input
            id="videoUrl"
            type="url"
            placeholder="https://example.com/video.mp4"
            {...register('videoUrl', { required: uploadType === 'url' ? 'Video URL is required' : false })}
          />
          {errors.videoUrl && (
            <p className="text-sm text-destructive">{errors.videoUrl.message as string}</p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          placeholder="e.g., 300"
          {...register('duration', { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-sm text-destructive">{errors.duration.message as string}</p>
        )}
      </div>
    </div>
  );
};