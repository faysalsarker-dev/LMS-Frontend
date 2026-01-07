import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Link2, Type, ClipboardCheck, Inbox } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { IAssignmentSubmission, SubmissionStatus, SubmissionType } from '@/interface/assignment.types';

interface AssignmentTableProps {
  submissions: IAssignmentSubmission[];
  isLoading: boolean;
  onReview: (submission: IAssignmentSubmission) => void;
}

const statusConfig: Record<SubmissionStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  reviewed: { label: 'Reviewed', variant: 'outline' },
  graded: { label: 'Graded', variant: 'default' },
};

const typeIcons: Record<SubmissionType, React.ReactNode> = {
  file: <FileText className="h-4 w-4" />,
  text: <Type className="h-4 w-4" />,
  link: <Link2 className="h-4 w-4" />,
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const AssignmentTable = ({ submissions, isLoading, onReview }: AssignmentTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="ml-auto h-9 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 shadow-sm"
      >
        <div className="rounded-full bg-muted p-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No pending assignments found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          All submissions have been reviewed or try adjusting your filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {submissions.map((submission, index) => (
              <motion.tr
                key={submission._id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{submission.student.name}</p>
                    <p className="text-sm text-muted-foreground">{submission.student.email}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {submission.course.title}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {submission.lesson.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1 capitalize">
                    {typeIcons[submission.submissionType]}
                    {submission.submissionType}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[submission.status].variant}>
                    {statusConfig[submission.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReview(submission)}
                    className="gap-2"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Review
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};
