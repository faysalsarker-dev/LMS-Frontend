import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { courses, type Milestone } from '../datas';




type MilestoneFormData = z.infer<typeof any>;

interface MilestoneFormProps {
  milestone?: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneForm({ milestone, open, onOpenChange }: MilestoneFormProps) {


  const form = useForm<MilestoneFormData>({
    defaultValues: {
      title: '',
      course: '',
      order: 1,
      status: 'active',
    },
  });

  useEffect(() => {
    if (milestone) {
      form.reset({
        title: milestone.title,
        course: milestone.course,
        order: milestone.order,
        status: milestone.status,
      });
    } else {
      form.reset({
        title: '',
        course: '',
        order: 1,
        status: 'active',
      });
    }
  }, [milestone, form]);

  const onSubmit = async (data: MilestoneFormData) => {
    try {

      if (milestone) {
        await updateMilestone({
          id: milestone.id,
          data: milestoneData,
        }).unwrap();
   
      } else {
        await createMilestone(milestoneData).unwrap();
  
      }
      onOpenChange(false);
    } catch (error) {
console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {milestone ? 'Edit Milestone' : 'Create Milestone'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Milestone title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select
              value={form.watch('course')}
              onValueChange={(value) => form.setValue('course', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.course && (
              <p className="text-sm text-destructive">
                {form.formState.errors.course.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as MilestoneFormData['status'])}
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
                ? (milestone ? 'Updating...' : 'Creating...')
                : (milestone ? 'Update Milestone' : 'Create Milestone')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}