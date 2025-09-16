import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Module, Lesson } from "@/types/course";
import { LessonItem } from "./LessonItem";

interface ModuleItemProps {
  module: Module;
  isOpen: boolean;
  currentLessonId?: string;
  onToggle: () => void;
  onLessonClick: (lesson: Lesson) => void;
}

export function ModuleItem({ 
  module, 
  isOpen, 
  currentLessonId, 
  onToggle, 
  onLessonClick 
}: ModuleItemProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/30 transition-colors">
          <div className="flex items-center space-x-2">
            {isOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span className="font-medium text-sm">{module.title}</span>
            {module.isCompleted && (
              <Badge variant="secondary" className="text-xs">
                ✓
              </Badge>
            )}
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1 mt-1 ml-4">
        {module.lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            isCurrentLesson={currentLessonId === lesson.id}
            onLessonClick={onLessonClick}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}