import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, AlertCircle, RefreshCw } from 'lucide-react';
import debounce from 'lodash.debounce';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { AssignmentFilters } from '@/components/modules/assignment/AssignmentFilters';
import { AssignmentTable } from '@/components/modules/assignment/AssignmentTable';
import { AssignmentPagination } from '@/components/modules/assignment/AssignmentPagination';
import { AssignmentDialog } from '@/components/modules/assignment/AssignmentDialog';
import { useGetAllAssignmentsQuery, useReviewAssignmentMutation } from '@/redux/features/assignment/assignmentSubmissionApi';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import { useGetAllMilestonesQuery } from '@/redux/features/milestone/milestone.api';
import type { IAssignmentFilters, IAssignmentSubmission } from '@/interface/assignment.types';

const defaultFilters: IAssignmentFilters = {
  page: 1,
  limit: 10,
  status: 'pending',
  submissionType: 'all',
  course: 'all',
  lesson: 'all',
  search: '',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AssignmentsPage = () => {
  const [filters, setFilters] = useState<IAssignmentFilters>(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<IAssignmentSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Queries
  const { data, isLoading, isFetching, refetch, isError } = useGetAllAssignmentsQuery({
    ...filters,
    search: debouncedSearch,
  });

  const { data: coursesData, isLoading: isLoadingCourses } = useGetAllCoursesQuery({page: 1, limit: 1000});
  const { data: lessonsData, isLoading: isLoadingLessons } = useGetAllMilestonesQuery(
    filters.course !== 'all' ? filters.course : undefined
  );

  // Mutations
  const [reviewSubmission, { isLoading: isReviewing }] = useReviewAssignmentMutation();

  // Debounced search effect
  useEffect(() => {
    const debouncedFn = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 400);

    debouncedFn(filters.search as string);

    return () => {
      debouncedFn.cancel();
    };
  }, [filters.search]);

  useEffect(() => {
    refetch();
  }, [filters, debouncedSearch, refetch]);

  // Reset lesson when course changes
  useEffect(() => {
    if (filters.course === 'all') {
      setFilters((prev) => ({ ...prev, lesson: 'all' }));
    }
  }, [filters.course]);

  const handleFilterChange = (key: keyof IAssignmentFilters, value: string | number) => {
    if (key === 'page') {
      setFilters((prev) => ({ ...prev, page: value as number }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setDebouncedSearch('');
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleReview = (submission: IAssignmentSubmission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleSubmitReview = async (reviewData: {
    status: 'reviewed' | 'graded';
    result?: number;
    feedback?: string;
  }) => {
    if (!selectedSubmission) return;
console.log(reviewData,'reviewData');
    try {



     await reviewSubmission({
  id: selectedSubmission._id,
  data: {
    status: reviewData.status,
    marks: reviewData.result,
    feedback: reviewData.feedback,
  },
});


      toast.success('Review submitted successfully');
      setDialogOpen(false);
      setSelectedSubmission(null);
      refetch();
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const submissions = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false };
  const courses = coursesData?.data.data || [];
  const lessons = lessonsData?.data || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto max-w-7xl space-y-6 p-4 py-8 md:p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Assignment Submissions</h1>
              <p className="text-sm text-muted-foreground">Review and grade student submissions</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <AssignmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          courses={courses}
          lessons={lessons}
          isLoadingCourses={isLoadingCourses}
          isLoadingLessons={isLoadingLessons}
        />
      </motion.div>

      {/* Error State */}
      {isError && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Failed to load submissions</h3>
          <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </motion.div>
      )}

      {/* Table */}
      {!isError && (
        <motion.div variants={itemVariants}>
          <AssignmentTable
            submissions={submissions}
            isLoading={isLoading}
            onReview={handleReview}
          />
        </motion.div>
      )}

      {/* Pagination */}
      {!isError && !isLoading && submissions.length > 0 && (
        <motion.div variants={itemVariants}>
          <AssignmentPagination meta={meta} onPageChange={handlePageChange} />
        </motion.div>
      )}

      {/* Review Dialog */}
      <AssignmentDialog
        submission={selectedSubmission}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitReview}
        isLoading={isReviewing}
      />
    </motion.div>
  );
};

export default AssignmentsPage;