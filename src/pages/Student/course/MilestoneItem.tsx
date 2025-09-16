import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Milestone, Lesson } from "@/types/course";
import { ModuleItem } from "./ModuleItem";

interface MilestoneItemProps {
  milestone: Milestone;
  isOpen: boolean;
  openModules: Set<string>;
  currentLessonId?: string;
  onToggle: () => void;
  onModuleToggle: (moduleId: string) => void;
  onLessonClick: (lesson: Lesson) => void;
}

export function MilestoneItem({
  milestone,
  isOpen,
  openModules,
  currentLessonId,
  onToggle,
  onModuleToggle,
  onLessonClick
}: MilestoneItemProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors">
          <div className="flex items-center space-x-3">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <div className="text-left">
              <h3 className="font-semibold text-sm">{milestone.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={milestone.progress} className="w-24 h-2" />
                <span className="text-xs text-muted-foreground">
                  {milestone.progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 mt-2 ml-4">
        {milestone.modules.map((module) => (
          <ModuleItem
            key={module.id}
            module={module}
            isOpen={openModules.has(module.id)}
            currentLessonId={currentLessonId}
            onToggle={() => onModuleToggle(module.id)}
            onLessonClick={onLessonClick}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}