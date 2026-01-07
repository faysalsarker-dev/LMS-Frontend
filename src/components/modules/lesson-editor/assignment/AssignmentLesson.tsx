import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AssignmentInstruction from './AssignmentInstruction';
import AssignmentSubmissionForm from './AssignmentSubmissionForm';
import AssignmentResult from './AssignmentResult';

import type { IAssignmentSchema, ICreateSubmissionData } from '@/interface/studentAssignment.types';
import { useCreateAssignmentMutation, useGetAssignmentByLessonIdQuery } from '@/redux/features/assignment/assignmentSubmissionApi';

interface AssignmentLessonProps {
  assignment: IAssignmentSchema;
  lessonId: string;
}

type ViewState = 'instruction' | 'form' | 'result';

const AssignmentLessonSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6 space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-10" />
    </CardContent>
  </Card>
);

const AssignmentLesson = ({ assignment, lessonId }: AssignmentLessonProps) => {
  const [view, setView] = useState<ViewState>('instruction');

  const { data: submissionsData, isLoading, refetch } = useGetAssignmentByLessonIdQuery(lessonId);
  const [createSubmission, { isLoading: isSubmitting }] = useCreateAssignmentMutation();

  const submissions = submissionsData?.data || [];
  const latestSubmission = submissions[0];
  const hasSubmission = submissions.length > 0;

  // Determine effective view: show result if has submission and not explicitly viewing form
  const effectiveView = hasSubmission && view === 'instruction' ? 'result' : view;

  const handleOpenForm = () => setView('form');
  const handleCancelForm = () => setView(hasSubmission ? 'result' : 'instruction');

  const handleSubmit = async (data: Omit<ICreateSubmissionData, 'assignmentId'>) => {
    try {
      const result = await createSubmission({
        assignmentId: assignment._id,
        ...data,
      }).unwrap();

      if (result.success) {
        toast.success('Assignment submitted successfully!');
        setView('result');
        refetch();
      }
    } catch {
      toast.error('Failed to submit assignment. Please try again.');
    }
  };

  if (isLoading) {
    return <AssignmentLessonSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden shadow-lg border-0 bg-card">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{assignment.title}</h3>
              <p className="text-xs text-muted-foreground">
                {effectiveView === 'instruction' && 'Review instructions'}
                {effectiveView === 'form' && 'Submit your work'}
                {effectiveView === 'result' && 'View your submission'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {effectiveView === 'instruction' && (
              <motion.div
                key="instruction"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AssignmentInstruction
                  assignment={assignment}
                  onSubmit={handleOpenForm}
                />
              </motion.div>
            )}

            {effectiveView === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AssignmentSubmissionForm
                  assignment={assignment}
                  isSubmitting={isSubmitting}
                  onCancel={handleCancelForm}
                  onSubmit={handleSubmit}
                />
              </motion.div>
            )}

            {effectiveView === 'result' && latestSubmission && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AssignmentResult
                  assignment={assignment}
                  submission={latestSubmission}
                  onResubmit={handleOpenForm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssignmentLesson;
