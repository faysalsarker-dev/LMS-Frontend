import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import type { Lesson } from "@/types/course";
import { cn } from "@/lib/utils";

interface LessonItemProps {
  lesson: Lesson;
  isCurrentLesson: boolean;
  onLessonClick: (lesson: Lesson) => void;
}

export function LessonItem({
  lesson,
  isCurrentLesson,
  onLessonClick,
}: LessonItemProps) {
  const getStatusIcon = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4 text-primary" />;
      case "locked":
        return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <button
      onClick={() => onLessonClick(lesson)}
      disabled={lesson.status === "locked"}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-md text-left transition-colors group",
        isCurrentLesson
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-accent/50",
        lesson.status === "locked"
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer"
      )}
    >
      <div className="flex items-center space-x-3">
        {getStatusIcon(lesson.status)}
        <p className="font-medium text-sm">{lesson.title}</p>
      </div>
    </button>
  );
}
