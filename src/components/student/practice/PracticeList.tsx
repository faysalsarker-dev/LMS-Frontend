import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

import { PracticeTable } from './PracticeTable';
import { DeletePracticeDialog } from './DeletePracticeDialog';
import type { Practice, PracticesResponse } from './practice.types';

import { useDeletePracticeMutation } from '@/redux/features/practice/practice.api';

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

interface PracticeListProps {
  data: PracticesResponse | null;
  isLoading: boolean;
  onRefetch: () => void;
}

/* ---------------------------------- */
/* Skeletons */
/* ---------------------------------- */

const TableSkeleton = () => (
  <div className="rounded-xl border bg-card overflow-hidden p-4 space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    ))}
  </div>
);

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export function PracticeList({
  data,
  isLoading,
  onRefetch,
}: PracticeListProps) {
  const [practiceToDelete, setPracticeToDelete] = useState<Practice | null>(null);

  const [deletePractice, { isLoading: isDeleting }] =
    useDeletePracticeMutation();

  /* ---------------------------------- */
  /* Handlers */
  /* ---------------------------------- */

  const handleDeleteClick = (practice: Practice) => {
    setPracticeToDelete(practice);
  };

  const handleConfirmDelete = async () => {
    if (!practiceToDelete) return;

    try {
      await deletePractice(practiceToDelete._id).unwrap();
      toast.success('Practice deleted');
      setPracticeToDelete(null);
      onRefetch();
    } catch {
      toast.error('Failed to delete practice');
    }
  };

  /* ---------------------------------- */
  /* States */
  /* ---------------------------------- */

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!data?.data?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <LayoutGrid className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Practices Found</h3>
        <p className="max-w-md text-muted-foreground">
          Create a new practice or adjust your filters to get started.
        </p>
      </motion.div>
    );
  }

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PracticeTable
            practices={data.data}
            onDelete={handleDeleteClick}
          />
        </motion.div>
      </AnimatePresence>

      <DeletePracticeDialog
        open={!!practiceToDelete}
        onOpenChange={() => setPracticeToDelete(null)}
        practice={practiceToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
