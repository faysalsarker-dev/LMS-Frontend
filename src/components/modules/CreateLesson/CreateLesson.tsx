import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateLessonMutation } from '@/redux/features/lesson/lesson.api';
import { AudioFields } from './AudioFields';
import { DocFields } from './DocFields.tsx';
import { QuizFields } from './QuizFields.tsx';
import { VideoFields } from './VideoFields.tsx';


export type LessonType = 'video' | 'doc' | 'quiz' | 'audio';

export interface QuizQuestion {
  questionText: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  timer?: number;
  audio?: File | string | null;
}

export interface MultilingualTranscript {
  language: string;
  transcript: string;
}

export interface BaseLesson {
  id?: string;
  title: string;
  description: string;
  type: LessonType;
  order?: number;
}

export interface VideoLesson extends BaseLesson {
  type: 'video';
  videoFile?: File;
  videoUrl?: string;
  duration?: number;
}

export interface DocLesson extends BaseLesson {
  type: 'doc';
  content: string;
}

export interface QuizLesson extends BaseLesson {
  type: 'quiz';
  questions: QuizQuestion[];
}

export interface AudioLesson extends BaseLesson {
  type: 'audio';
  audioFile?: File;
  audioUrl?: string;
  transcripts: MultilingualTranscript[];
}

export type Lesson = VideoLesson | DocLesson | QuizLesson | AudioLesson;

export interface CreateLessonPayload {
  title: string;
  description: string;
  type: LessonType;
  videoFile?: File;
  videoUrl?: string;
  duration?: number;
  content?: string;
  questions?: QuizQuestion[];
  audioFile?: File;
  transcripts?: MultilingualTranscript[];
}

export interface UpdateLessonPayload extends CreateLessonPayload {
  id: string;
}













const CreateLesson = () => {
  const navigate = useNavigate();
  const [createLesson, { isLoading }] = useCreateLessonMutation();
  const [selectedType, setSelectedType] = useState<LessonType>('video');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateLessonPayload>({
    defaultValues: {
      type: 'video',
      transcripts: [],
      questions: [],
    },
  });

  const onSubmit = async (data: CreateLessonPayload) => {
    try {
      await createLesson(data).unwrap();
      toast.success('Lesson created successfully!');
      navigate('/lessons');
    } catch (error) {
      console.error('Failed to create lesson:', error);
      toast.error('Failed to create lesson. Please try again.');
    }
  };

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'video':
        return <VideoFields register={register} errors={errors} />;
      case 'doc':
        return <DocFields control={control} errors={errors} />;
      case 'quiz':
        return <QuizFields register={register} errors={errors} control={control} />;
      case 'audio':
        return <AudioFields register={register} errors={errors} control={control} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/lessons')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lessons
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Lesson</CardTitle>
            <CardDescription>
              Fill in the details below to create a new lesson for your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to React Hooks"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what students will learn..."
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Lesson Type *</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value as LessonType);
                    register('type').onChange({ target: { value } });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Lesson</SelectItem>
                    <SelectItem value="doc">Document Lesson</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="audio">Audio Lesson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                {renderTypeSpecificFields()}
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create Lesson'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/lessons')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateLesson;