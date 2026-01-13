import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, FileText, ClipboardCheck, FolderKanban } from 'lucide-react';
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
import type { Assignment,IUserProgressData } from '@/interface/student.types';

interface AssignmentsTableProps {
  progress: IUserProgressData | undefined;
  isLoading: boolean;
}

const getTypeIcon = (type: Assignment['type']) => {
  switch (type) {
    case 'quiz':
      return ClipboardCheck;
    case 'assignment':
      return FileText;
    case 'project':
      return FolderKanban;
    default:
      return FileText;
  }
};

const getMarksColor = (marks: number, status: Assignment['status']) => {
  if (status === 'pending') return 'text-muted-foreground';
  if (marks >= 80) return 'text-success font-semibold';
  if (marks < 40) return 'text-destructive font-semibold';
  return 'text-foreground';
};

const getStatusBadge = (status: Assignment['status']) => {
  switch (status) {
    case 'graded':
      return <Badge variant="secondary" className="bg-success/10 text-success border-0">Graded</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-warning/10 text-warning border-0">Pending</Badge>;
    case 'submitted':
      return <Badge variant="secondary">Submitted</Badge>;
    default:
      return null;
  }
};

const AssignmentRow = ({ assignment, index }: { assignment: Assignment; index: number }) => {
  console.log('Rendering AssignmentRow for:', assignment);

  const [expanded, setExpanded] = useState(false);
  const Icon = getTypeIcon(assignment.type);
  const shouldTruncate = assignment?.feedback && assignment?.feedback?.length > 80;
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
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{assignment.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{assignment.type}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span className={getMarksColor(assignment.marks, assignment.status)}>
            {assignment.status === 'pending' ? '—' : `${assignment.marks}/${assignment.maxMarks}`}
          </span>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {format(new Date(assignment?.date), 'MMM d, yyyy')}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {getStatusBadge(assignment.status)}
        </TableCell>
        <TableCell>
          {assignment.feedback && (
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
        {expanded && assignment.feedback && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <TableCell colSpan={5} className="bg-muted/30 py-4">
              <div className="px-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Instructor Feedback</p>
                <p className="text-sm">{assignment.feedback}</p>
              </div>
            </TableCell>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

const AssignmentsTable = ({ progress, isLoading }: AssignmentsTableProps) => {
console.log('AssignmentsTable progress prop:', progress);

  if (isLoading) {
    return (
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
  }

  if (!progress || progress?.assignmentStats?.length === 0) {
    return (
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
                {progress?.assignmentStats?.submissions?.map((assignment, index) => (
                  <AssignmentRow key={assignment._id} assignment={assignment} index={index} />
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
