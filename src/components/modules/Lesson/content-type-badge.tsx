import { cn } from "@/lib/utils";
import { FileText, Play, ClipboardCheck, BookOpen } from "lucide-react";

interface ContentTypeBadgeProps {
  type: "video" | "doc" | "quiz" | "assignment";
  className?: string;
}

const contentTypeConfig = {
  video: {
    icon: Play,
    label: "Video",
    className: "bg-primary/20 text-primary border-primary/30",
  },
  doc: {
    icon: FileText,
    label: "Document",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  quiz: {
    icon: ClipboardCheck,
    label: "Quiz",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  assignment: {
    icon: BookOpen,
    label: "Assignment",
    className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

export function ContentTypeBadge({ type, className }: ContentTypeBadgeProps) {
  const config = contentTypeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors",
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1.5" />
      {config.label}
    </span>
  );
}
