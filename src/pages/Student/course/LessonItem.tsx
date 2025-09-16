import { CheckCircle2, PlayCircle, Lock, Clock } from "lucide-react";
import type { Lesson } from "@/types/course";
import { cn } from "@/lib/utils";

interface LessonItemProps {
  lesson: Lesson;
  isCurrentLesson: boolean;
  onLessonClick: (lesson: Lesson) => void;
}

export function LessonItem({ lesson, isCurrentLesson, onLessonClick }: LessonItemProps) {
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

  const getStatusColor = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return "text-success";
      case "in-progress":
        return "text-primary";
      case "locked":
        return "text-muted-foreground";
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
        <div>
          <p className={cn("font-medium text-sm", getStatusColor(lesson.status))}>
            {lesson.title}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {lesson.duration}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}