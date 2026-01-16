import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// Types
// ============================================================================

type AssignmentStatus = 'graded' | 'pending' | 'submitted';

interface AssignmentSubmission {
  _id: string;
  lessonName: string;
  status: AssignmentStatus;
  marks: number;
  maxMarks: number | null;
  feedback: string | null;
  date: string;
}

interface IUserProgressData {
  overview: {
    progressPercentage: number;
    isCompleted: boolean;
    completedAt: string | null;
    totalLessonsCompleted: number;
    totalLessons: number;
  };
  quizStats: {
    totalAttempted: number;
    passed: number;
    failed: number;
  };
  assignmentStats: {
    avgMarks: number;
    submissions: AssignmentSubmission[];
  };
}

interface AssignmentsTableProps {
  progress: IUserProgressData | undefined;
  isLoading: boolean;
}

interface AssignmentRowProps {
  assignment: AssignmentSubmission;
  index: number;
}

// ============================================================================
// Utility Functions
// ============================================================================

const getMarksColor = (marks: number, maxMarks: number | null, status: AssignmentStatus): string => {
  if (status === 'pending') return 'text-muted-foreground';
  if (!maxMarks) return 'text-foreground';
  
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 80) return 'text-success font-semibold';
  if (percentage < 40) return 'text-destructive font-semibold';
  return 'text-foreground';
};

const getStatusBadge = (status: AssignmentStatus) => {
  const variants = {
    graded: <Badge variant="secondary" className="bg-success/10 text-success border-0">Graded</Badge>,
    pending: <Badge variant="secondary" className="bg-warning/10 text-warning border-0">Pending</Badge>,
    submitted: <Badge variant="secondary">Submitted</Badge>,
  };
  
  return variants[status];
};

// ============================================================================
// Components
// ============================================================================

const AssignmentRow = ({ assignment, index }: AssignmentRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasFeedback = assignment.feedback && assignment.feedback.trim().length > 0;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group hover:bg-muted/50 transition-colors"
      >
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{assignment.lessonName || "Untitled Assignment"}</p>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <span className={getMarksColor(assignment.marks, assignment.maxMarks, assignment.status)}>
            {assignment.status === 'pending' 
              ? '—' 
              : `${assignment.marks}${assignment.maxMarks ? `/${assignment.maxMarks}` : ''}`
            }
          </span>
        </TableCell>

        <TableCell className="hidden md:table-cell">
          {assignment.date 
            ? format(new Date(assignment.date), 'MMM d, yyyy')
            : '—'
          }
        </TableCell>

        <TableCell className="hidden sm:table-cell">
          {getStatusBadge(assignment.status)}
        </TableCell>

        <TableCell>
          {hasFeedback && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-8 px-2"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">Feedback</span>
            </Button>
          )}
        </TableCell>
      </motion.tr>

      <AnimatePresence>
        {expanded && hasFeedback && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <TableCell colSpan={5} className="bg-muted/30 py-4">
              <div className="px-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Instructor Feedback:
                </p>
                <p className="text-sm">{assignment.feedback}</p>
              </div>
            </TableCell>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

const LoadingSkeleton = () => (
  <Card className="stat-card">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="stat-card">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Assignments & Quizzes</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-1">No Assignments Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Assignments and quizzes will appear here once they're available for this course.
        </p>
      </div>
    </CardContent>
  </Card>
);

// ============================================================================
// Main Component
// ============================================================================

const AssignmentsTable = ({ progress, isLoading }: AssignmentsTableProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const submissions = progress?.assignmentStats?.submissions ?? [];

  if (submissions.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="stat-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Assignments & Quizzes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Assignment</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((assignment, index) => (
                  <AssignmentRow 
                    key={assignment._id} 
                    assignment={assignment} 
                    index={index} 
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssignmentsTable;