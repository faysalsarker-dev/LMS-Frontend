import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, Clock, FileCheck,  MessageSquare, RotateCcw, FileText, Download } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { IAssignmentSchema, IStudentSubmission } from '@/interface/studentAssignment.types';

interface AssignmentResultProps {
  assignment: IAssignmentSchema;
  submission: IStudentSubmission;
  onResubmit: () => void;
}

const getStatusConfig = (status: IStudentSubmission['status']) => {
  switch (status) {
    case 'pending':
      return { 
        label: 'Pending Review', 
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-yellow-600'
      };
    case 'reviewed':
      return { 
        label: 'Reviewed', 
        variant: 'default' as const,
        icon: FileCheck,
        color: 'text-blue-600'
      };
    case 'graded':
      return { 
        label: 'Graded', 
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'text-green-600'
      };
    default:
      return { 
        label: status, 
        variant: 'outline' as const,
        icon: Clock,
        color: 'text-muted-foreground'
      };
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AssignmentResult = ({ assignment, submission, onResubmit }: AssignmentResultProps) => {
  const statusConfig = getStatusConfig(submission.status);
  const StatusIcon = statusConfig.icon;
  console.log('submission in AssignmentResult:', submission);
  const isPassed = submission.result !== undefined && 
    assignment.passingMarks !== undefined && 
    submission.result >= assignment.passingMarks;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {/* Status Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background ${statusConfig.color}`}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Status</p>
                  <Badge variant={statusConfig.variant} className="mt-1">
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
              
              {submission.result !== undefined && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Your Score</p>
                  <p className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-destructive'}`}>
                    {submission.result} <span className="text-base font-normal text-muted-foreground">/ {assignment.maxMarks}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submission Details */}
      <motion.div variants={itemVariants}>
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Submitted At</span>
              <span className="font-medium">
  {submission?.submittedAt
    ? format(new Date(submission.submittedAt), 'PPPpp')
    : '—'}
</span>

            </div>
            
            {submission.textResponse && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text Response
                  </p>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    {submission.textResponse}
                  </div>
                </div>
              </>
            )}
            
            {submission.fileUrl && submission.fileName && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Uploaded File</p>
                  <a 
                    href={submission.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="flex-1 text-sm font-medium truncate">{submission.fileName}</span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Feedback */}
      {submission.feedback && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Instructor Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {submission.feedback}
              </p>
              {submission.reviewedAt && (
                <p className="text-xs text-muted-foreground mt-3">
                  Reviewed on {format(new Date(submission.reviewedAt), 'PPP')}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resubmit Action */}
      {assignment.allowMultipleSubmissions && (
        <motion.div variants={itemVariants}>
          <Button 
            onClick={onResubmit} 
            variant="outline" 
            className="w-full"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Resubmit Assignment
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssignmentResult;
