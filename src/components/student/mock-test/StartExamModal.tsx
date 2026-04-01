import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  HelpCircle,
  ArrowRight,
  Mic,
  MicOff,
  Loader2,
} from "lucide-react";
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
  const isSpeaking = section.name === "speaking";

  const [micStatus, setMicStatus] = useState<
    "idle" | "checking" | "granted" | "denied"
  >("idle");

  useEffect(() => {
    if (open && isSpeaking) {
      // Check permission silently first if API is supported
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: "microphone" as PermissionName })
          .then((result) => {
            if (result.state === "granted") {
              setMicStatus("granted");
            } else if (result.state === "denied") {
              setMicStatus("denied");
            } else {
              setMicStatus("idle");
            }

            // Listen for changes (e.g., if user changes it in site settings)
            result.onchange = () => {
              if (result.state === "granted") setMicStatus("granted");
              else if (result.state === "denied") setMicStatus("denied");
              else setMicStatus("idle");
            };
          })
          .catch(() => setMicStatus("idle"));
      } else {
        setMicStatus("idle");
      }
    } else {
      setMicStatus("idle");
    }
  }, [open, isSpeaking]);

  const requestMicPermission = async () => {
    setMicStatus("checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately after getting permission to free the device
      stream.getTracks().forEach((track) => track.stop());
      setMicStatus("granted");
    } catch (err) {
      setMicStatus("denied");
    }
  };

  const canStart = !isSpeaking || micStatus === "granted";

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
              <p className="font-bold text-lg">
                {section.questions?.length ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Mic Permission Status for Speaking Section */}
        {isSpeaking && (
          <div
            className={`p-4 rounded-2xl border ${
              micStatus === "granted"
                ? "bg-green-500/10 border-green-500/20 text-green-700"
                : micStatus === "denied"
                  ? "bg-red-500/10 border-red-500/20 text-red-700"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3 font-bold">
              <div className="flex items-center gap-3">
                {micStatus === "idle" && <Mic className="h-5 w-5" />}
                {micStatus === "checking" && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                {micStatus === "granted" && <Mic className="h-5 w-5" />}
                {micStatus === "denied" && <MicOff className="h-5 w-5" />}

                <span>
                  {micStatus === "idle" && "Microphone Required"}
                  {micStatus === "checking" && "Requesting Access..."}
                  {micStatus === "granted" && "Microphone Granted"}
                  {micStatus === "denied" && "Microphone Denied"}
                </span>
              </div>

              {(micStatus === "idle" || micStatus === "denied") && (
                <Button
                  size="sm"
                  onClick={requestMicPermission}
                  className="rounded-xl shadow-md"
                >
                  Grant Access
                </Button>
              )}
            </div>
            {(micStatus === "idle" || micStatus === "denied") && (
              <p className="text-sm mt-2 opacity-90 font-normal">
                Please click the button to allow microphone access. You cannot
                start the exam without it.
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        {section.instruction && (
          <p className="text-sm text-muted-foreground px-1">
            {section.instruction}
          </p>
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
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-xl flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canStart}
            className="rounded-xl flex-1 font-bold shadow-lg shadow-primary/20 group hover:opacity-90 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Start Exam
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
