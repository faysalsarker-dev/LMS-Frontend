import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Download,
  ExternalLink,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Star,
} from "lucide-react";
import type { AssignmentSubmission } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";

interface SubmissionDetailModalProps {
  submission: AssignmentSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGrade: (submission: AssignmentSubmission) => void;
}

const SubmissionDetailModal = ({
  submission,
  open,
  onOpenChange,
  onGrade,
}: SubmissionDetailModalProps) => {
  if (!submission) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDownload = () => {
    if (submission.file.url) {
      window.open(submission.file.url, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Full submission information and grading
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(submission.student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{submission.student.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {submission.student.email}
              </div>
            </div>
            <StatusBadge status={submission.status} />
          </div>

          <Separator />

          {/* Course & Lesson */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Course
              </div>
              <p className="text-sm">{submission.course.title}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Lesson
              </div>
              <p className="text-sm">{submission.lesson.title}</p>
            </div>
          </div>

          <Separator />

          {/* Submission Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Submission</h4>
              <TypeBadge type={submission.submissionType} />
            </div>

            {submission.submissionType === "file" && submission.file.url && (
              <div className="rounded-md border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">File Submission</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.file.url.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                </div>
              </div>
            )}

            {submission.submissionType === "link" && (
              <div className="rounded-md border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Link Submission</p>
                      <p className="text-xs text-muted-foreground">
                        External resource
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {submission.submissionType === "text" && submission.textResponse && (
              <div className="rounded-md border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">Text Response:</p>
                <p className="whitespace-pre-wrap text-sm">{submission.textResponse}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted
              </div>
              <p className="font-medium">
                {format(new Date(submission.submittedAt), "PPp")}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last Updated
              </div>
              <p className="font-medium">
                {format(new Date(submission.updatedAt), "PPp")}
              </p>
            </div>
          </div>

          {/* Grading Section */}
          {(submission.result !== null || submission.feedback) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Grading
                </h4>
                {submission.result !== null && (
                  <div className="rounded-md border border-border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Score</p>
                    <p className="text-2xl font-bold">{submission.result}/100</p>
                  </div>
                )}
                {submission.feedback && (
                  <div className="rounded-md border border-border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground mb-2">Feedback</p>
                    <p className="text-sm whitespace-pre-wrap">{submission.feedback}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => onGrade(submission)}>
              {submission.result !== null ? "Edit Grade" : "Grade Submission"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailModal;