import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useUpdatePracticeMutation } from '@/redux/features/practice/practice.api';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';

const updateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  isActive: z.boolean(),
});

interface UpdatePracticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  practice: {
    _id: string;
    title: string;
    description?: string;
    isActive: boolean;
  };
  onSuccess?: () => void;
}

export const UpdatePracticeDialog = ({ open, onOpenChange, practice, onSuccess }: UpdatePracticeDialogProps) => {
  const [updatePractice, { isLoading }] = useUpdatePracticeMutation();

  const form = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: practice?.title || '',
      description: practice?.description || '',
      isActive: practice?.isActive ?? true,
    },
  });

  const onSubmit = async (data: z.infer<typeof updateSchema>) => {
    try {
      await updatePractice({ id: practice._id, data }).unwrap();
      toast.success('Practice updated');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
handleApiError(err)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Practice Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>Visible to students</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};