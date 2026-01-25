import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Save, Loader2, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { TypeSelector } from './TypeSelector';
import { VideoModule } from './VideoModule';
import { DocModule } from './DocModule';
import { QuizModule } from './QuizModule';
import { AssignmentModule } from './AssignmentModule';
import { AudioModule } from './AudioModule';
import { STATUS_CONFIG, type IQuestion, type ITranscript, type LessonStatus, type LessonType } from '@/interface/lesson.type';
import { useCreateLessonMutation } from '@/redux/features/lesson/lesson.api';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import { useGetAllMilestonesQuery } from '@/redux/features/milestone/milestone.api';
import type { ICourse } from '@/interface/course.types';
import type { IMilestone } from '@/interface/milestone.types';
import { useNavigate } from 'react-router';


const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['video', 'audio', 'doc', 'quiz', 'assignment']),
  order: z.number().min(0),
  status: z.enum(['draft', 'published', 'archived']),
  courseId: z.string().min(1, 'Course is required'),
  milestoneId: z.string().min(1, 'Milestone is required'),
});

type LessonFormData = z.infer<typeof lessonSchema>;

export default function LessonFormMain() {
  const { t } = useTranslation();
  const [createLesson, { isLoading: isSubmitting }] = useCreateLessonMutation();
  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCoursesQuery({ page: 1, limit: 100 });
  const navigate =useNavigate()
  const [lessonType, setLessonType] = useState<LessonType>('video');
  const [status, setStatus] = useState<LessonStatus>('draft');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  
  // Fetch milestones based on selected course
  const { data: milestonesData } = useGetAllMilestonesQuery(
    { page: 1, limit: 100, course: selectedCourseId },
    { skip: !selectedCourseId }
  );
  

  // Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Audio state
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcripts, setTranscripts] = useState<ITranscript[]>([]);
  
  // Doc state
  const [docContent, setDocContent] = useState('');
  
  // Quiz state
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  // Assignment state
  const [assignmentInstruction, setAssignmentInstruction] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'video' as LessonType,
      order: 0,
      status: 'draft' as LessonStatus,
      courseId: '',
      milestoneId: '',
    },
  });

  const handleTypeChange = (type: LessonType) => {
    setLessonType(type);
    setValue('type', type);
   
    if (type !== 'video') {
      setVideoUrl('');
      setVideoFile(null);
      setVideoDuration(0);
    }
    if (type !== 'audio') {
      setAudioUrl('');
      setAudioFile(null);
      setTranscripts([]);
    }
    if (type !== 'doc') {
      setDocContent('');
    }
    if (type !== 'quiz') {
      setQuestions([]);
    }
    if (type !== 'assignment') {
      setAssignmentInstruction('');
      setMaxMarks(100);
      setDeadline(undefined);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedMilestoneId(''); // Reset milestone when course changes
    setValue('courseId', courseId);
    setValue('milestoneId', '');
  };

  const handleMilestoneChange = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setValue('milestoneId', milestoneId);
  };





const onSubmit = async (data: LessonFormData) => {
  try {
    // Build FormData for Multer compatibility
    const formData = new FormData();
    
    // Common fields
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('type', lessonType);
    formData.append('order', String(data.order));
    formData.append('status', status);
    formData.append('course', data.courseId);
    formData.append('milestone', data.milestoneId);

    // Type-specific fields
    switch (lessonType) {
      case 'video':
        if (videoFile) {
          formData.append('video', videoFile);
        } else if (videoUrl) {
          formData.append('videoUrl', videoUrl);
        }
        formData.append('videoDuration', String(videoDuration));
        break;
        
      case 'audio':
        if (audioFile) {
          formData.append('audioFile', audioFile);
        } else if (audioUrl) {
          formData.append('audioUrl', audioUrl);
        }
        formData.append('transcripts', JSON.stringify(transcripts));
        break;
        
      case 'doc':
        formData.append('doc', docContent);
        break;
        
      case 'quiz': {
      const audioQuestion = questions.find(q => q.type === 'audio' && q.audioFile);

if (audioQuestion?.audioFile) {
  formData.append('audioFile', audioQuestion.audioFile);
}
        formData.append('questions', JSON.stringify(questions));
        break;
      }
        
   

        case 'assignment': {
  const assignment = {
    instruction: assignmentInstruction,
    maxMarks,
    ...(deadline && { deadline: deadline.toISOString() }),
  };

  formData.append('assignment', JSON.stringify(assignment));
  break;
}



    }

    

    // Debug log in development
  

    await createLesson(formData).unwrap();
    
    toast.success(t('lesson.lessonSavedSuccessfully'));

    // Reset form and state
    reset();
    setSelectedCourseId('');
    setSelectedMilestoneId('');
    setQuestions([]);
    navigate('/dashboard/lesson')
    
  } catch (error) {
    console.error('Error saving lesson:', error);
    
    // More detailed error handling
    let errorMessage = t('common.pleaseTryAgain');
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      // Handle RTK Query error format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rtkError = error as any;
      if (rtkError.data?.message) {
        errorMessage = rtkError.data.message;
      } else if (rtkError.error) {
        errorMessage = rtkError.error;
      }
    }
    
    toast.error(t('lesson.failedToSaveLesson'), {
      description: errorMessage,
    });
  }
};










  const renderTypeModule = () => {
    switch (lessonType) {
      case 'video':
        return (
          <VideoModule
            videoUrl={videoUrl}
            videoFile={videoFile}
            videoDuration={videoDuration}
            onUrlChange={setVideoUrl}
            onFileChange={setVideoFile}
            onDurationChange={setVideoDuration}
          />
        );
      case 'audio':
        return (
          <AudioModule
            audioUrl={audioUrl}
            audioFile={audioFile}
            transcripts={transcripts}
            onUrlChange={setAudioUrl}
            onFileChange={setAudioFile}
            onTranscriptsChange={setTranscripts}
          />
        );
      case 'doc':
        return (
          <DocModule
            content={docContent}
            onChange={setDocContent}
          />
        );
      case 'quiz':
        return (
          <QuizModule
            control={control}
            register={register}
            questions={questions}
            onQuestionsChange={setQuestions}
          />
        );
      case 'assignment':
        return (
          <AssignmentModule
            instruction={assignmentInstruction}
            maxMarks={maxMarks}
            deadline={deadline}
            onInstructionChange={setAssignmentInstruction}
            onMaxMarksChange={setMaxMarks}
            onDeadlineChange={setDeadline}
          />
        );
      default:
        return null;
    }
  };

  const courses = coursesData?.data.data || [];
  const milestones = milestonesData?.data || [];


  return (
    <div className="space-y-8 px-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t('lesson.createLesson')}</h1>
            <p className="text-sm text-muted-foreground">{t('lesson.addNewLesson')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as LessonStatus)}>
            <SelectTrigger className="w-[140px]">
              <Badge className={STATUS_CONFIG[status].color}>
                {t(`lesson.${status}`)}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <Badge className={config.color}>{t(`lesson.${key}`)}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting} 
            className="gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('lesson.saveLesson')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('lesson.basicInformation')}</CardTitle>
          <CardDescription>{t('lesson.setTitleCourseDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('lesson.lessonTitle')} *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder={t('lesson.lessonTitlePlaceholder')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">{t('lesson.displayOrder')}</Label>
              <Input
                id="order"
                type="number"
                min={0}
                {...register('order', { valueAsNumber: true })}
                placeholder={t('lesson.orderPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">{t('lesson.course')} *</Label>
              <Select value={selectedCourseId} onValueChange={handleCourseChange}>
                <SelectTrigger className={errors.courseId ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t('lesson.selectCourse')} />
                </SelectTrigger>
                <SelectContent>


                  {isCoursesLoading  ? (
                    <div className="p-2 text-sm text-muted-foreground">{t('lesson.loadingCourses')}</div>
                  ) : courses?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">{t('lesson.noCoursesAvailable')}</div>
                  ) : (
                    courses?.map((course: ICourse) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title || t('lesson.untitledCourse')}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p className="text-xs text-destructive">{errors.courseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="milestoneId">{t('lesson.milestone')} *</Label>
              <Select 
                value={selectedMilestoneId} 
                onValueChange={handleMilestoneChange}
                disabled={!selectedCourseId}
              >
                <SelectTrigger className={errors.milestoneId ? 'border-destructive' : ''}>
                  <SelectValue placeholder={selectedCourseId ? t('lesson.selectMilestone') : t('lesson.selectCourseFirst')} />
                </SelectTrigger>
                <SelectContent>
                  {milestones?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      {selectedCourseId ? t('lesson.noMilestonesAvailable') : t('lesson.selectCourseFirst')}
                    </div>
                  ) : (
                    milestones?.map((milestone: IMilestone) => (
                      <SelectItem key={milestone._id} value={milestone._id}>
                        {milestone.title || t('lesson.untitledMilestone')}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.milestoneId && (
                <p className="text-xs text-destructive">{errors.milestoneId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('lesson.description')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('lesson.descriptionPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>{t('lesson.contentType')}</CardTitle>
          <CardDescription>{t('lesson.chooseContentType')}</CardDescription>
        </CardHeader>
        <CardContent>
          <TypeSelector value={lessonType} onChange={handleTypeChange} />
        </CardContent>
      </Card>

      {/* Type-specific Module */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t(`lesson.${lessonType === 'doc' ? 'document' : lessonType}Label`)} {t('lesson.content')}
          </CardTitle>
          <CardDescription>{t(`lesson.${lessonType === 'doc' ? 'document' : lessonType}Description`)}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderTypeModule()}
        </CardContent>
      </Card>
    </div>
  );
}