import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SubmissionStep1 from './SubmissionStep1';
import SubmissionStep2 from './SubmissionStep2';
import SubmissionModal from './SubmissionModal';
import {
  useGetAssignmentQuery,
  useGetMySubmissionsQuery,
  useCreateSubmissionMutation,
  useRequestRecheckMutation,
} from '@/hooks/useStudentAssignmentApi';
import type { ICreateSubmissionData } from '@/types/studentAssignment.types';

interface AssignmentBoxProps {
  assignmentId: string;
}

const AssignmentBoxSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-10" />
    </CardContent>
  </Card>
);

const AssignmentBox = ({ assignmentId }: AssignmentBoxProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: assignmentData, isLoading: isLoadingAssignment } = useGetAssignmentQuery(assignmentId);
  const { data: submissionsData, isLoading: isLoadingSubmissions, refetch } = useGetMySubmissionsQuery(assignmentId);
  const { createSubmission, isLoading: isSubmitting } = useCreateSubmissionMutation();
  const { requestRecheck, isLoading: isRequesting } = useRequestRecheckMutation();

  const assignment = assignmentData?.data;
  const submissions = submissionsData?.data || [];
  const hasSubmission = submissions.length > 0;

  const handleStartSubmission = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleViewSubmission = () => setModalOpen(true);

  const handleSubmit = async (data: Omit<ICreateSubmissionData, 'assignmentId'>) => {
    if (!assignment) return;

    try {
      const result = await createSubmission({
        assignmentId: assignment._id,
        ...data,
      });

      if (result.success) {
        toast.success('Assignment submitted successfully!');
        refetch();
        setStep(1);
      }
    } catch {
      toast.error('Failed to submit assignment. Please try again.');
    }
  };

  const handleRequestRecheck = async (submissionId: string) => {
    try {
      const result = await requestRecheck(submissionId);
      if (result.success) {
        toast.success('Recheck requested. Your submission will be reviewed again.');
        refetch();
      }
    } catch {
      toast.error('Failed to request recheck. Please try again.');
    }
  };

  if (isLoadingAssignment || isLoadingSubmissions) {
    return <AssignmentBoxSkeleton />;
  }

  if (!assignment) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Assignment not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden shadow-lg border-0 bg-card">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Assignment</h3>
                <p className="text-xs text-muted-foreground">
                  {step === 1 ? 'Review instructions' : 'Submit your work'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SubmissionStep1
                    assignment={assignment}
                    hasSubmission={hasSubmission}
                    onStartSubmission={handleStartSubmission}
                    onViewSubmission={handleViewSubmission}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SubmissionStep2
                    assignment={assignment}
                    isSubmitting={isSubmitting}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submissions Modal */}
      <SubmissionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        submissions={submissions}
        assignment={assignment}
        onRequestRecheck={handleRequestRecheck}
        isRequesting={isRequesting}
      />
    </>
  );
};

export default AssignmentBox;
