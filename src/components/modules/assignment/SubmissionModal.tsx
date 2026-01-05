import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, Download, Clock, Award, MessageSquare, RefreshCw, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { IStudentSubmission, IAssignmentSchema } from '@/types/studentAssignment.types';

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissions: IStudentSubmission[];
  assignment: IAssignmentSchema;
  onRequestRecheck: (submissionId: string) => void;
  isRequesting: boolean;
}

const getStatusBadge = (status: IStudentSubmission['status']) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>;
    case 'reviewed':
      return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Reviewed</Badge>;
    case 'graded':
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Graded</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const SubmissionModal = ({
  open,
  onOpenChange,
  submissions,
  assignment,
  onRequestRecheck,
  isRequesting,
}: SubmissionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-lg">My Submissions</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <AnimatePresence mode="wait">
            {submissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No submissions yet</p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-4"
              >
                {submissions.map((submission, index) => (
                  <motion.div
                    key={submission._id}
                    variants={itemVariants}
                    className="border rounded-lg p-4 bg-card"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Submission #{submissions.length - index}
                        </span>
                        {getStatusBadge(submission.status)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(submission.submittedAt), 'PPP p')}
                      </div>
                    </div>

                    {/* Text Response */}
                    {submission.textResponse && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Response</p>
                        <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {submission.textResponse}
                        </div>
                      </div>
                    )}

                    {/* File */}
                    {submission.fileUrl && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Attached File</p>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors group"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground flex-1 truncate">
                            {submission.fileName || 'Download File'}
                          </span>
                          <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      </div>
                    )}

                    {/* Result & Feedback */}
                    {submission.status === 'graded' && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-3">
                          {/* Score */}
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-primary/10">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Score</p>
                              <p className="font-semibold text-foreground">
                                {submission.result}/{assignment.maxMarks}
                                {submission.result !== undefined && (
                                  <span className={`ml-2 text-xs ${
                                    submission.result >= assignment.passingMarks 
                                      ? 'text-green-600' 
                                      : 'text-destructive'
                                  }`}>
                                    {submission.result >= assignment.passingMarks ? 'Passed' : 'Failed'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Feedback */}
                          {submission.feedback && (
                            <div className="flex gap-3">
                              <div className="p-2 rounded-md bg-blue-500/10 h-fit">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-1">Instructor Feedback</p>
                                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md">
                                  {submission.feedback}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Recheck Button */}
                          {assignment.allowMultipleSubmissions && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRequestRecheck(submission._id)}
                              disabled={isRequesting}
                              className="w-full mt-2"
                            >
                              {isRequesting ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                  Requesting...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="h-3 w-3 mr-2" />
                                  Request Recheck
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </>
                    )}

                    {submission.status === 'pending' && (
                      <p className="text-xs text-muted-foreground text-center py-2 bg-yellow-500/5 rounded-md">
                        Awaiting instructor review...
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionModal;
