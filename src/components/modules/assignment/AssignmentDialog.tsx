import { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Link2, Type, User, BookOpen, Loader2, ExternalLink } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IAssignmentSubmission, SubmissionStatus } from '@/interface/assignment.types';

interface AssignmentDialogProps {
  submission: IAssignmentSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { status: SubmissionStatus; result?: number; feedback?: string }) => Promise<void>;
  isLoading: boolean;
}

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const AssignmentDialog = ({
  submission,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AssignmentDialogProps) => {
  const [status, setStatus] = useState<SubmissionStatus>('reviewed');
  const [result, setResult] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = async () => {
    await onSubmit({
      status,
      result: result ? Number(result) : undefined,
      feedback: feedback || undefined,
    });
  };

  const resetForm = () => {
    setStatus('reviewed');
    setResult('');
    setFeedback('');
  };

  if (!submission) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <AnimatePresence>
        {open && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Review Submission
                  <Badge variant="outline" className="ml-2 capitalize">
                    {submission.submissionType}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Review and grade this assignment submission
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                {/* Student Info */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{submission.student.name}</p>
                      <p className="text-sm text-muted-foreground">{submission.student.email}</p>
                    </div>
                  </div>
                </div>

                {/* Course & Lesson */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      Course
                    </div>
                    <p className="mt-1 font-medium">{submission.course.title}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Lesson
                    </div>
                    <p className="mt-1 font-medium">{submission.lesson.title}</p>
                  </div>
                </div>

                {/* Submitted At */}
                <div className="text-sm text-muted-foreground">
                  Submitted on {format(new Date(submission.submittedAt), 'MMMM dd, yyyy at h:mm a')}
                </div>

                {/* Submission Content */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {submission.submissionType === 'file' && <FileText className="h-4 w-4" />}
                    {submission.submissionType === 'text' && <Type className="h-4 w-4" />}
                    {submission.submissionType === 'link' && <Link2 className="h-4 w-4" />}
                    Submission Content
                  </Label>

                  {submission.submissionType === 'file' && submission.file && (
                    <a
                      href={submission.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="flex-1 truncate">View Submitted File</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}

                  {submission.submissionType === 'text' && submission.textResponse && (
                    <div className="max-h-40 overflow-y-auto rounded-lg border bg-muted/30 p-3 text-sm">
                      {submission.textResponse}
                    </div>
                  )}

                  {submission.submissionType === 'link' && submission.linkUrl && (
                    <a
                      href={submission.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      <Link2 className="h-5 w-5 text-primary" />
                      <span className="flex-1 truncate">{submission.linkUrl}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                </div>

                {/* Review Form */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Review & Grade</h4>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as SubmissionStatus)}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="graded">Graded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Score */}
                  <div className="space-y-2">
                    <Label htmlFor="result">Score (0-100)</Label>
                    <Input
                      id="result"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter score..."
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                    />
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Provide feedback for the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
