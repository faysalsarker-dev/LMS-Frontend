import { motion } from 'framer-motion';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { Calendar, Target, Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { IAssignmentSchema } from '@/types/studentAssignment.types';

interface SubmissionStep1Props {
  assignment: IAssignmentSchema;
  hasSubmission: boolean;
  onStartSubmission: () => void;
  onViewSubmission: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SubmissionStep1 = ({
  assignment,
  hasSubmission,
  onStartSubmission,
  onViewSubmission,
}: SubmissionStep1Props) => {
  const { title, instruction, deadline, maxMarks, passingMarks, submissionType } = assignment;
  
  const isOverdue = isPast(new Date(deadline));
  const timeRemaining = formatDistanceToNow(new Date(deadline), { addSuffix: true });

  const getSubmissionTypeLabel = () => {
    switch (submissionType) {
      case 'file':
        return 'File Upload Only';
      case 'text':
        return 'Text Response Only';
      case 'both':
        return 'File + Text Response';
      default:
        return submissionType;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        <Badge variant={isOverdue ? 'destructive' : 'secondary'} className="text-xs">
          {getSubmissionTypeLabel()}
        </Badge>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="p-2 rounded-md bg-primary/10">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Marks</p>
            <p className="font-semibold text-foreground">{maxMarks}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="p-2 rounded-md bg-green-500/10">
            <Award className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Passing Marks</p>
            <p className="font-semibold text-foreground">{passingMarks}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 col-span-2">
          <div className={`p-2 rounded-md ${isOverdue ? 'bg-destructive/10' : 'bg-orange-500/10'}`}>
            {isOverdue ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Clock className="h-4 w-4 text-orange-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="font-semibold text-foreground">
              {format(new Date(deadline), 'PPP p')}
            </p>
            <p className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isOverdue ? 'Overdue' : timeRemaining}
            </p>
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Instructions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Instructions
        </h3>
        <div className="prose prose-sm max-w-none text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {instruction}
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onStartSubmission}
          disabled={isOverdue && !assignment.allowMultipleSubmissions}
          className="flex-1"
        >
          {hasSubmission ? 'Submit Again' : 'Start Submission'}
        </Button>
        
        {hasSubmission && (
          <Button variant="outline" onClick={onViewSubmission} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            My Submissions
          </Button>
        )}
      </motion.div>

      {isOverdue && !assignment.allowMultipleSubmissions && (
        <motion.p variants={itemVariants} className="text-xs text-destructive text-center">
          The deadline has passed. Submissions are no longer accepted.
        </motion.p>
      )}
    </motion.div>
  );
};

export default SubmissionStep1;
