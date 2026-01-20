import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutGrid,
  List,
  Trash2,
  Power,
  PowerOff,
  Download,
} from 'lucide-react';
import { PracticeCard } from './PracticeCard';
import { PracticeTable } from './PracticeTable';
import { DeletePracticeDialog } from './DeletePracticeDialog';
import type { Practice, PracticesResponse } from './practice.types';
import toast from 'react-hot-toast';
import { useDeletePracticeMutation } from '@/redux/features/practice/practice.api';


interface PracticeListProps {
  data: PracticesResponse | null;
  isLoading: boolean;
  onRefetch: () => void;
}

const CardSkeleton = () => (
  <div className="rounded-xl border bg-card p-4 space-y-4">
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="rounded-xl border bg-card overflow-hidden">
    <div className="p-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export const PracticeList = ({ data, isLoading, onRefetch }: PracticeListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [practiceToDelete, setPracticeToDelete] = useState<Practice | null>(null);

  const { deletePractice, isLoading: isDeleting } = useDeletePracticeMutation();
  // const { toggleStatus } = useTogglePracticeStatusMutation();

  const handleDeleteClick = (practice: Practice) => {
    setPracticeToDelete(practice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!practiceToDelete) return;
    try {
      await deletePractice(practiceToDelete._id);
      toast.success('Practice deleted successfully');
      setDeleteDialogOpen(false);
      setPracticeToDelete(null);
      onRefetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleStatus(id, isActive);
      toast.success(`Practice ${isActive ? 'activated' : 'deactivated'}`);
      onRefetch();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedIds.length === 0) {
      toast.error('No practices selected');
      return;
    }

    try {
      if (action === 'delete') {
        for (const id of selectedIds) {
          await deletePractice(id);
        }
        toast.success(`Deleted ${selectedIds.length} practices`);
      } else {
        for (const id of selectedIds) {
          await toggleStatus(id, action === 'activate');
        }
        toast.success(`${action === 'activate' ? 'Activated' : 'Deactivated'} ${selectedIds.length} practices`);
      }
      setSelectedIds([]);
      onRefetch();
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  const handleExport = () => {
    if (!data?.data) return;
    const exportData = data.data.map((p) => ({
      title: p.title,
      type: p.type,
      difficulty: p.difficulty,
      category: p.category?.name,
      items: p.totalItems,
      usageCount: p.usageCount,
      isActive: p.isActive,
      createdAt: p.createdAt,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'practices-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export completed');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton />
        )}
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <LayoutGrid className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Practices Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          No practices match your current filters. Try adjusting your search or
          create a new practice to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  <Power className="mr-1 h-4 w-4" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <PowerOff className="mr-1 h-4 w-4" />
                  Deactivate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'grid' | 'table')}
          >
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-3">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="table" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {data.data.map((practice, index) => (
              <PracticeCard
                key={practice._id}
                practice={practice}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PracticeTable
              practices={data.data}
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Dialog */}
      <DeletePracticeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        practice={practiceToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
