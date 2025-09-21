import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { milestones, type Lesson } from '../datas';




type LessonFormData = z.infer<typeof any>;

interface LessonFormProps {
  lesson?: Lesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonForm({ lesson, open, onOpenChange }: LessonFormProps) {


  const form = useForm<LessonFormData>({
    defaultValues: {
      title: '',
      milestone: '',
      order: 1,
      contentType: 'video',
      videoUrl: null,
      docContent: null,
      status: 'active',
    },
  });

  const contentType = form.watch('contentType');

  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        milestone: lesson.milestone,
        order: lesson.order,
        contentType: lesson.contentType,
        videoUrl: lesson.videoUrl,
        docContent: lesson.docContent,
        status: lesson.status,
      });
    } else {
      form.reset({
        title: '',
        milestone: '',
        order: 1,
        contentType: 'video',
        videoUrl: null,
        docContent: null,
        status: 'active',
      });
    }
  }, [lesson, form]);

  const onSubmit = async (data: LessonFormData) => {
    try {

      if (lesson) {
        await updateLesson({
          id: lesson.id,
          data: lessonData,
        }).unwrap();
    
      } else {
        await createLesson(lessonData).unwrap();
      
      }
      onOpenChange(false);
    } catch (error) {
   console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'Edit Lesson' : 'Create Lesson'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Lesson title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="milestone">Milestone *</Label>
              <Select
                value={form.watch('milestone')}
                onValueChange={(value) => form.setValue('milestone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a milestone" />
                </SelectTrigger>
                <SelectContent>
                  {milestones.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.milestone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.milestone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                {...form.register('order', { valueAsNumber: true })}
                placeholder="1"
              />
              {form.formState.errors.order && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.order.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={form.watch('contentType')}
                onValueChange={(value) => form.setValue('contentType', value as LessonFormData['contentType'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="doc">Document</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as LessonFormData['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {contentType === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                {...form.register('videoUrl')}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          )}

          {contentType === 'doc' && (
            <div className="space-y-2">
              <Label htmlFor="docContent">Document Content</Label>
              <Textarea
                id="docContent"
                {...form.register('docContent')}
                placeholder="Enter the lesson content..."
                rows={10}
              />
            </div>
          )}

          {contentType === 'quiz' && (
            <div className="p-4 border border-admin-border rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Quiz content configuration will be available in a future update.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? (lesson ? 'Updating...' : 'Creating...')
                : (lesson ? 'Update Lesson' : 'Create Lesson')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}