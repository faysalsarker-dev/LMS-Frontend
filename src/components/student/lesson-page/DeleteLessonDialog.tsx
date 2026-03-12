import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteLessonMutation } from '@/redux/features/lesson/lesson.api';
import type { ILesson } from '@/interface';
import toast from 'react-hot-toast';
import { handleApiError } from '@/utils/errorHandler';

interface DeleteLessonDialogProps {
  lesson: ILesson;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteLessonDialog({
  lesson,
  open,
  onOpenChange,
  onSuccess,
}: DeleteLessonDialogProps) {
  const [deleteLesson, { isLoading }] = useDeleteLessonMutation();

  const handleDelete = async () => {
    try {
      await deleteLesson(lesson._id).unwrap();
      toast.success('Lesson deleted successfully!');
   
      onOpenChange(false);
      onSuccess();
    } catch (error) {
  handleApiError(error)
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Delete Lesson
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">"{lesson.title}"</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-xl flex-1"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-xl flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Lesson'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
