import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Milestone, Lesson } from "@/types/course";
import { LessonItem } from "./LessonItem";

interface MilestoneItemProps {
  milestone: Milestone;
  isOpen: boolean;
  onToggle: () => void;
  onLessonClick: (lesson: Lesson) => void;
  currentLessonId?: string;
}

export function MilestoneItem({
  milestone,
  isOpen,
  onToggle,
  onLessonClick,
  currentLessonId,
}: MilestoneItemProps) {
  return (
    <Collapsible open={isOpen}>
      <CollapsibleTrigger
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 rounded-lg p-3"
      >
        <div className="flex items-center space-x-3">
          {isOpen ? <ChevronDown /> : <ChevronRight />}
          <h3 className="font-semibold">{milestone.title}</h3>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 space-y-2 ml-5">
        {milestone.lesson.map((lesson) => (
          <LessonItem
            key={lesson._id}
            lesson={lesson}
            isCurrentLesson={lesson._id === currentLessonId}
            onLessonClick={onLessonClick}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
