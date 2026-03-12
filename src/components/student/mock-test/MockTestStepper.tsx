import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Lock,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Play,
} from "lucide-react";
import type { SectionState, IMockTest, SectionName } from "@/interface/mockTest.types";

interface MockTestStepperProps {
  sections: SectionState;
  mockTest: IMockTest;
  onStart: (name: SectionName) => void;
}

const SECTION_CONFIG: {
  name: SectionName;
  label: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { name: "listening", label: "Part 1: Listening", Icon: Headphones },
  { name: "reading",   label: "Part 2: Reading",   Icon: BookOpen },
  { name: "writing",   label: "Part 3: Writing",   Icon: PenLine },
  { name: "speaking",  label: "Part 4: Speaking",  Icon: Mic },
];

export const MockTestStepper = ({
  sections,
  mockTest,
  onStart,
}: MockTestStepperProps) => {
  return (
    <div className="space-y-4">
      {SECTION_CONFIG.map((cfg, idx) => {
        const status = sections[cfg.name];
        const sectionData = mockTest[cfg.name];
        const isLocked    = status === "locked";
        const isDone      = status === "submitted";
        const isActive    = status === "not_started" || status === "in_progress";

        // Time limit from section data (may be embedded or just id string)
        const timeLimit =
          typeof sectionData === "object" && sectionData !== null
            ? (sectionData as { timeLimit?: number }).timeLimit
            : null;
        const questionCount =
          typeof sectionData === "object" && sectionData !== null
            ? ((sectionData as { questions?: unknown[] }).questions ?? []).length
            : null;

        return (
          <div
            key={cfg.name}
            className={`relative flex items-center gap-5 p-5 rounded-3xl border-2 transition-all duration-300 ${
              isActive
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.01]"
                : isDone
                ? "border-green-500/30 bg-green-500/5"
                : "border-muted bg-muted/20 opacity-60"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center ${
                isActive
                  ? "bg-primary text-white"
                  : isDone
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : isLocked ? (
                <Lock className="h-5 w-5" />
              ) : (
                <cfg.Icon className="h-5 w-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4
                  className={`font-bold text-base ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {cfg.label}
                </h4>
                {isDone && (
                  <Badge className="bg-green-500/10 text-green-600 border-none text-xs">
                    Completed
                  </Badge>
                )}
                {isLocked && (
                  <Badge variant="secondary" className="text-xs">
                    Locked
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {timeLimit ? `${timeLimit} min` : "—"}
                {questionCount !== null ? ` · ${questionCount} questions` : ""}
              </p>
            </div>

            {/* Action */}
            <div className="flex-shrink-0">
              {isActive ? (
                <Button
                  onClick={() => onStart(cfg.name)}
                  size="sm"
                  className="rounded-xl px-5 group"
                >
                  Start
                  <Play className="ml-1.5 h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                </Button>
              ) : isDone ? (
                <span className="text-green-500 font-medium text-sm">Done ✓</span>
              ) : null}
            </div>

            {/* Connecting line */}
            {idx < SECTION_CONFIG.length - 1 && (
              <div className="absolute left-[34px] top-[68px] bottom-[-20px] w-0.5 bg-muted -z-10" />
            )}
          </div>
        );
      })}
    </div>
  );
};
