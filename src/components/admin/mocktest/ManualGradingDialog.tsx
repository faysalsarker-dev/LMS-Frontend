import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ManualGradingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (score: number, feedback: string) => void;
  title: string;
  maxMarks: number;
  currentScore?: number;
  currentFeedback?: string;
  isQuestion?: boolean;
}

const ManualGradingDialog: React.FC<ManualGradingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  maxMarks,
  currentScore = 0,
  currentFeedback = "",
  isQuestion = false,
}) => {
  const [score, setScore] = useState<number>(currentScore);
  const [feedback, setFeedback] = useState<string>(currentFeedback);

  React.useEffect(() => {
    if (isOpen) {
      setScore(currentScore);
      setFeedback(currentFeedback);
    }
  }, [isOpen, currentScore, currentFeedback]);

  const handleSave = () => {
    onSave(score, feedback);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grade {title}</DialogTitle>
          <DialogDescription>
            Provide marks and constructive feedback for the student.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="score" className="text-right font-semibold">
                Marks
              </Label>
              <span className="text-xs text-muted-foreground">Max: {maxMarks}</span>
            </div>
            <Input
              id="score"
              type="number"
              min={0}
              max={maxMarks}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          {
            !isQuestion && (
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-right font-semibold">
                  Feedback
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="e.g., Great pronunciation but needs work on fluency."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="col-span-3 min-h-[120px]"
                />
              </div>
            )
          }
          
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6 font-bold">
            Apply Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualGradingDialog;
