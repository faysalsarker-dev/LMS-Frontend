import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  BookOpen, 
  X, 
  Plus,
  Trash2,
  FileText,
  Video,
  Music,
  FileQuestion,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

import { useGetLessonByIdQuery, useUpdateLessonMutation } from '@/redux/features/lesson/lesson.api';


// Base lesson schema
const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  status: z.enum(['published', 'draft', 'archived']),
  order: z.number().min(1, 'Order must be at least 1'),
  course: z.string().min(1, 'Please select a course'),
  milestone: z.string().min(1, 'Please select a milestone'),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

const lessonStatuses = [
  { value: 'published' as const, label: 'Published', color: 'bg-green-500' },
  { value: 'draft' as const, label: 'Draft', color: 'bg-yellow-500' },
  { value: 'archived' as const, label: 'Archived', color: 'bg-gray-500' },
];

interface Question {
  type: 'mcq' | 'true_false' | 'fill_blank' | 'short_answer' | 'audio';
  questionText: string;
  audio?: string;
  options?: { text: string }[];
  correctAnswer?: string | boolean;
  explanation?: string;
  timer?: number | null;
}

export default function EditLessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lesson, isLoading: isLoadingLesson, isError, error, refetch } = useGetLessonByIdQuery(id!);
    const lessonData = lesson?.data;

  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();



  // Content-specific states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [transcripts, setTranscripts] = useState<{ language: string; text: string }[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assignment, setAssignment] = useState({
    instruction: '',
    maxMarks: '',
    allowMultipleSubmissions: false,
    passingMarks: '',
    deadline: ''
  });

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      status: 'published' as const,
      order: 1,
      course: '',
      milestone: '',
    },
  });

  // Populate form when lesson data loads
  useEffect(() => {
    if (lessonData) {
      form.reset({
        title: lessonData.title,
        status: lessonData.status as 'published' | 'draft' | 'archived',
        order: Number(lessonData.order),
        course: lessonData.course,
        milestone: lessonData?.milestone || lessonData?.milestone,
      });


      // Set content-specific data
      if (lessonData.type === 'video' && lessonData.video) {
        setVideoDuration(lessonData.video.duration);
      }
      
      if (lessonData.type === 'audio' && lessonData.audio) {
        setAudioDuration(lessonData.audio.duration);
        setTranscripts(lessonData.audio.transcripts || []);
      }

      if (lessonData.type === 'quiz' && lessonData.questions) {
        setQuestions(lessonData.questions);
      }

      if (lessonData.type === 'assignment' && lessonData.assignment) {
        setAssignment({
          instruction: lessonData.assignment.instruction || '',
          maxMarks: lessonData.assignment.maxMarks?.toString() || '',
          allowMultipleSubmissions: lessonData.assignment.allowMultipleSubmissions || false,
          passingMarks: lessonData.assignment.passingMarks?.toString() || '',
          deadline: lessonData.assignment.deadline ? new Date(lessonData.assignment.deadline).toISOString().split('T')[0] : ''
        });
      }
    }
  }, [lessonData, form]);

  const onSubmit = async (values: LessonFormValues) => {
    if (!id) return;

    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', values.title);
      formData.append('status', values.status);
      formData.append('order', values.order.toString());
      formData.append('course', values.course);
      formData.append('milestone', values.milestone);

      // Handle type-specific content
      if (lessonData?.type === 'video') {
        if (videoFile) {
          formData.append('video', videoFile);
        }
        if (videoDuration) {
          formData.append('videoDuration', videoDuration.toString());
        }
      }

      if (lessonData?.type === 'audio') {
        if (audioFile) {
          formData.append('audio', audioFile);
        }
        if (audioDuration) {
          formData.append('audioDuration', audioDuration.toString());
        }
        if (transcripts.length > 0) {
          formData.append('transcripts', JSON.stringify(transcripts));
        }
      }

      if (lessonData?.type === 'doc') {
        if (docFile) {
          formData.append('doc', docFile);
        }
      }

      if (lessonData?.type === 'quiz') {
        if (questions.length > 0) {
          formData.append('questions', JSON.stringify(questions));
        }
      }

      if (lessonData?.type === 'assignment') {
        formData.append('assignment', JSON.stringify({
          instruction: assignment.instruction,
          maxMarks: assignment.maxMarks ? Number(assignment.maxMarks) : null,
          allowMultipleSubmissions: assignment.allowMultipleSubmissions,
          passingMarks: assignment.passingMarks ? Number(assignment.passingMarks) : null,
          deadline: assignment.deadline || null
        }));
      }

      await updateLesson({ id, data: formData }).unwrap();
      toast.success('Lesson updated successfully!');
      navigate('/dashboard/lesson');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update lesson. Please try again.');
    }
  };

  // Question handlers
  const addQuestion = () => {
    setQuestions([...questions, {
      type: 'mcq',
      questionText: '',
      options: [{ text: '' }, { text: '' }],
      correctAnswer: '',
      explanation: '',
      timer: null
    }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = [];
    }
    updated[questionIndex].options!.push({ text: '' });
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions];
    updated[questionIndex].options![optionIndex] = { text };
    setQuestions(updated);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options!.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
  };

  // Transcript handlers
  const addTranscript = () => {
    setTranscripts([...transcripts, { language: '', text: '' }]);
  };

  const updateTranscript = (index: number, field: 'language' | 'text', value: string) => {
    const updated = [...transcripts];
    updated[index][field] = value;
    setTranscripts(updated);
  };

  const deleteTranscript = (index: number) => {
    setTranscripts(transcripts.filter((_, i) => i !== index));
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      case 'doc': return <FileText className="h-5 w-5" />;
      case 'quiz': return <FileQuestion className="h-5 w-5" />;
      case 'assignment': return <ClipboardList className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Invalid lesson ID</p>
            <Button asChild className="w-full mt-4">
              <Link to="/dashboard/lesson">Back to Lessons</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">
              {error?.message || 'Failed to load lesson'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
              <Button asChild>
                <Link to="/dashboard/lesson">Back to Lessons</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-4xl py-8 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/dashboard/lesson"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Lessons
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-4 ring-primary/10">
                {lessonData && getTypeIcon(lessonData.type)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Edit Lesson</h1>
                <p className="text-muted-foreground mt-1">Update lesson content and settings</p>
              </div>
            </div>
            {lessonData && (
              <Badge variant="outline" className="capitalize">
                {lessonData.type}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-2xl shadow-xl border-border/50 overflow-hidden">
            {isLoadingLesson ? (
              <CardContent className="p-8">
                <div className="space-y-6">
                  <Skeleton className="h-12 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle>Lesson Information</CardTitle>
                  <CardDescription>
                    Update the basic details of your lesson
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base">Lesson Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter a descriptive title"
                                  {...field}
                                  className="h-12 text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {lessonStatuses.map((status) => (
                                      <SelectItem key={status.value} value={status.value}>
                                        <div className="flex items-center gap-2">
                                          <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                          {status.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                       
                        </div>

                  
                      </div>

                      <Separator />

                      {/* Content-Specific Sections */}
                      <AnimatePresence mode="wait">
                        {lessonData?.type === 'video' && (
                          <motion.div
                            key="video"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Video className="h-5 w-5 text-primary" />
                                Video Content
                              </h3>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Current Video
                                  </label>
                                  {lessonData.video?.url && (
                                    <div className="bg-muted/50 p-4 rounded-lg mb-3">
                                      <p className="text-sm text-muted-foreground">
                                        {lessonData.video.url}
                                      </p>
                                      {lessonData.video.duration && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Duration: {Math.floor(lessonData.video.duration / 60)}m {lessonData.video.duration % 60}s
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Upload New Video (optional)
                                  </label>
                                  <div className="flex items-center gap-4">
                                    <Input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                      className="h-11"
                                    />
                                    {videoFile && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setVideoFile(null)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                  {videoFile && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Selected: {videoFile.name}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Duration (seconds)
                                  </label>
                                  <Input
                                    type="number"
                                    value={videoDuration || ''}
                                    onChange={(e) => setVideoDuration(Number(e.target.value) || null)}
                                    placeholder="Auto-detect or enter manually"
                                    className="h-11"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {lessonData?.type === 'audio' && (
                          <motion.div
                            key="audio"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <div>
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Music className="h-5 w-5 text-primary" />
                                Audio Content
                              </h3>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Current Audio
                                  </label>
                                  {lessonData.audio?.url && (
                                    <div className="bg-muted/50 p-4 rounded-lg mb-3">
                                      <p className="text-sm text-muted-foreground">
                                        {lessonData.audio.url}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Upload New Audio (optional)
                                  </label>
                                  <Input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    className="h-11"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    Duration (seconds)
                                  </label>
                                  <Input
                                    type="number"
                                    value={audioDuration || ''}
                                    onChange={(e) => setAudioDuration(Number(e.target.value) || null)}
                                    className="h-11"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-base font-semibold">Transcripts</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addTranscript}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Transcript
                                </Button>
                              </div>

                              <div className="space-y-4">
                                {transcripts.map((transcript, index) => (
                                  <Card key={index} className="p-4">
                                    <div className="flex items-start gap-4">
                                      <div className="flex-1 space-y-3">
                                        <Input
                                          placeholder="Language (e.g., English, Spanish)"
                                          value={transcript.language}
                                          onChange={(e) => updateTranscript(index, 'language', e.target.value)}
                                          className="h-10"
                                        />
                                        <Textarea
                                          placeholder="Transcript text"
                                          value={transcript.text}
                                          onChange={(e) => updateTranscript(index, 'text', e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteTranscript(index)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {lessonData?.type === 'doc' && (
                          <motion.div
                            key="doc"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              Document Content
                            </h3>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Upload New Document (optional)
                              </label>
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                                className="h-11"
                              />
                              {docFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Selected: {docFile.name}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {lessonData?.type === 'quiz' && (
                          <motion.div
                            key="quiz"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileQuestion className="h-5 w-5 text-primary" />
                                Quiz Questions
                              </h3>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addQuestion}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                              </Button>
                            </div>

                            <div className="space-y-6">
                              {questions.map((question, qIndex) => (
                                <Card key={qIndex} className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 space-y-4">
                                        <div className="flex gap-3">
                                          <Badge variant="outline" className="shrink-0">
                                            Q{qIndex + 1}
                                          </Badge>
                                          <Select
                                            value={question.type}
                                            onValueChange={(value) => updateQuestion(qIndex, 'type', value)}
                                          >
                                            <SelectTrigger className="w-48 h-9">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="mcq">Multiple Choice</SelectItem>
                                              <SelectItem value="true_false">True/False</SelectItem>
                                              <SelectItem value="fill_blank">Fill in Blank</SelectItem>
                                              <SelectItem value="short_answer">Short Answer</SelectItem>
                                              <SelectItem value="audio">Audio Question</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <Textarea
                                          placeholder="Enter question text"
                                          value={question.questionText}
                                          onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                          rows={2}
                                        />

                                        {(question.type === 'mcq' || question.type === 'true_false') && (
                                          <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                              <label className="text-sm font-medium">Options</label>
                                              {question.type === 'mcq' && (
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => addOption(qIndex)}
                                                >
                                                  <Plus className="h-3 w-3 mr-1" />
                                                  Add Option
                                                </Button>
                                              )}
                                            </div>
                                            
                                            {question.type === 'true_false' ? (
                                              <div className="space-y-2">
                                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                                  <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={question.correctAnswer === true}
                                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', true)}
                                                    className="h-4 w-4"
                                                  />
                                                  <span className="text-sm">True</span>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                                  <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={question.correctAnswer === false}
                                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', false)}
                                                    className="h-4 w-4"
                                                  />
                                                  <span className="text-sm">False</span>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="space-y-2">
                                                {question.options?.map((option, oIndex) => (
                                                  <div key={oIndex} className="flex items-center gap-3">
                                                    <input
                                                      type="radio"
                                                      name={`correct-${qIndex}`}
                                                      checked={question.correctAnswer === option.text}
                                                      onChange={() => updateQuestion(qIndex, 'correctAnswer', option.text)}
                                                      className="h-4 w-4 shrink-0"
                                                    />
                                                    <Input
                                                      placeholder={`Option ${oIndex + 1}`}
                                                      value={option.text}
                                                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                      className="h-10"
                                                    />
                                                    {question.options && question.options.length > 2 && (
                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteOption(qIndex, oIndex)}
                                                        className="shrink-0"
                                                      >
                                                        <X className="h-4 w-4" />
                                                      </Button>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {(question.type === 'fill_blank' || question.type === 'short_answer') && (
                                          <div>
                                            <label className="text-sm font-medium block mb-2">
                                              Correct Answer
                                            </label>
                                            <Input
                                              placeholder="Enter the correct answer"
                                              value={question.correctAnswer as string || ''}
                                              onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                              className="h-10"
                                            />
                                          </div>
                                        )}

                                        <div>
                                          <label className="text-sm font-medium block mb-2">
                                            Explanation (optional)
                                          </label>
                                          <Textarea
                                            placeholder="Explain the answer"
                                            value={question.explanation || ''}
                                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                            rows={2}
                                          />
                                        </div>

                                        <div>
                                          <label className="text-sm font-medium block mb-2">
                                            Timer (seconds, optional)
                                          </label>
                                          <Input
                                            type="number"
                                            placeholder="No time limit"
                                            value={question.timer || ''}
                                            onChange={(e) => updateQuestion(qIndex, 'timer', e.target.value ? Number(e.target.value) : null)}
                                            className="h-10 w-40"
                                          />
                                        </div>
                                      </div>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteQuestion(qIndex)}
                                        className="text-destructive hover:text-destructive shrink-0"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}

                              {questions.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                  <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                  <p className="text-sm text-muted-foreground">
                                    No questions added yet. Click "Add Question" to start.
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {lessonData?.type === 'assignment' && (
                          <motion.div
                            key="assignment"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <ClipboardList className="h-5 w-5 text-primary" />
                              Assignment Details
                            </h3>

                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium block mb-2">
                                  Instructions
                                </label>
                                <Textarea
                                  placeholder="Enter assignment instructions"
                                  value={assignment.instruction}
                                  onChange={(e) => setAssignment({ ...assignment, instruction: e.target.value })}
                                  rows={4}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium block mb-2">
                                    Maximum Marks
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder="100"
                                    value={assignment.maxMarks}
                                    onChange={(e) => setAssignment({ ...assignment, maxMarks: e.target.value })}
                                    className="h-11"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm font-medium block mb-2">
                                    Passing Marks
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder="50"
                                    value={assignment.passingMarks}
                                    onChange={(e) => setAssignment({ ...assignment, passingMarks: e.target.value })}
                                    className="h-11"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium block mb-2">
                                  Deadline
                                </label>
                                <Input
                                  type="date"
                                  value={assignment.deadline}
                                  onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })}
                                  className="h-11"
                                />
                              </div>

                              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                <div>
                                  <label className="text-sm font-medium block">
                                    Allow Multiple Submissions
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Students can resubmit their work
                                  </p>
                                </div>
                                <Switch
                                  checked={assignment.allowMultipleSubmissions}
                                  onCheckedChange={(checked) => 
                                    setAssignment({ ...assignment, allowMultipleSubmissions: checked })
                                  }
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/dashboard/lesson')}
                          disabled={isUpdating}
                          className="min-w-24"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isUpdating}
                          className="min-w-32"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Update Lesson
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}