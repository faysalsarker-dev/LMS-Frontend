import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, HelpCircle, ArrowRight } from "lucide-react";
import type { IMockTestSection } from "@/interface/mockTest.types";

interface StartExamModalProps {
  section: IMockTestSection;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const SECTION_ICONS: Record<string, string> = {
  listening: "🎧",
  reading: "📖",
  writing: "✍️",
  speaking: "🎤",
};

export const StartExamModal = ({
  section,
  open,
  onConfirm,
  onCancel,
}: StartExamModalProps) => {
  const icon = SECTION_ICONS[section.name] ?? "📋";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md rounded-3xl border-2 border-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-3 capitalize">
            <span className="text-3xl">{icon}</span>
            {section.name} Section
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <Clock className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Time Limit
              </p>
              <p className="font-bold text-lg">{section.timeLimit} min</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <HelpCircle className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Questions
              </p>
              <p className="font-bold text-lg">{section.questions?.length ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {section.instruction && (
          <p className="text-sm text-muted-foreground px-1">{section.instruction}</p>
        )}

        {/* Warnings */}
        <div className="rounded-2xl bg-orange-500/5 border border-orange-500/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
            <AlertTriangle className="h-4 w-4" />
            Important
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Do not reload the page during the exam</li>
            <li>• Switching tabs will trigger auto-submit</li>
            <li>• Once started, the timer cannot be paused</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} className="rounded-xl flex-1">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="rounded-xl flex-1 font-bold shadow-lg shadow-primary/20 group"
          >
            Start Exam
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
