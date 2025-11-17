import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AssignmentSubmission, GradeFormData } from "@/data/mockData";

interface GradeDialogProps {
  submission: AssignmentSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GradeFormData) => Promise<void>;
}

const GradeDialog = ({ submission, open, onOpenChange, onSubmit }: GradeDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<GradeFormData>({
    defaultValues: {
      result: submission?.result || 0,
      feedback: submission?.feedback || "",
      status: submission?.status || "pending",
    },
  });

  const status = watch("status");

  const handleFormSubmit = async (data: GradeFormData) => {
    try {
      await onSubmit(data);
      toast.success("Submission graded successfully");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to grade submission");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            {submission && (
              <>
                Grading {submission.student.name}'s submission for{" "}
                {submission.lesson.title}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="result">
              Score (0-100) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="result"
              type="number"
              min={0}
              max={100}
              {...register("result", {
                required: "Score is required",
                min: { value: 0, message: "Score must be at least 0" },
                max: { value: 100, message: "Score cannot exceed 100" },
                valueAsNumber: true,
              })}
              className={errors.result ? "border-destructive" : ""}
            />
            {errors.result && (
              <p className="text-sm text-destructive">{errors.result.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (max 2000 characters)</Label>
            <Textarea
              id="feedback"
              rows={4}
              placeholder="Provide constructive feedback..."
              {...register("feedback", {
                maxLength: {
                  value: 2000,
                  message: "Feedback cannot exceed 2000 characters",
                },
              })}
              className={errors.feedback ? "border-destructive" : ""}
            />
            {errors.feedback && (
              <p className="text-sm text-destructive">{errors.feedback.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue("status", value as GradeFormData["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GradeDialog;