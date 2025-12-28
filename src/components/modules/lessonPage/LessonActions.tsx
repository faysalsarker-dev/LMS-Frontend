import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteLessonDialog } from './DeleteLessonDialog';
import type { Lesson } from '@/types/lesson.types';

interface LessonActionsProps {
  lesson: Lesson;
  onDeleteSuccess: () => void;
}

export function LessonActions({ lesson, onDeleteSuccess }: LessonActionsProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/dashboard/lesson/${lesson._id}/edit`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem
            onClick={handleEdit}
            className="gap-2 cursor-pointer rounded-lg"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteLessonDialog
        lesson={lesson}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}
