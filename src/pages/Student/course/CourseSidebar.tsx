import { useState } from "react";
import type { Milestone, Lesson } from "@/types/course";
import { MilestoneItem } from "./MilestoneItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CourseSidebarProps {
  milestones: Milestone[];
  onLessonClick: (lesson: Lesson) => void;
  currentLessonId?: string;
}

export function CourseSidebar({
  milestones,
  onLessonClick,
  currentLessonId,
}: CourseSidebarProps) {
  const [searchTerm] = useState("");
  const [openMilestones, setOpenMilestones] = useState<Set<string>>(
    new Set(["milestone-1"])
  );
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(["module-2"])
  );

  const toggleMilestone = (milestoneId: string) => {
    const newOpenMilestones = new Set(openMilestones);
    if (newOpenMilestones.has(milestoneId)) {
      newOpenMilestones.delete(milestoneId);
    } else {
      newOpenMilestones.add(milestoneId);
    }
    setOpenMilestones(newOpenMilestones);
  };

  const toggleModule = (moduleId: string) => {
    const newOpenModules = new Set(openModules);
    if (newOpenModules.has(moduleId)) {
      newOpenModules.delete(moduleId);
    } else {
      newOpenModules.add(moduleId);
    }
    setOpenModules(newOpenModules);
  };

  const filteredMilestones = milestones.filter((milestone) =>
    milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    milestone.modules.some((module) =>
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.lessons.some((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  return (
    <div className="h-full flex flex-col bg-card border-l">


  <div className="p-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lessons..."
          className="pl-10"
        />
      </div>
    </div>



      {/* Course Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {filteredMilestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              isOpen={openMilestones.has(milestone.id)}
              openModules={openModules}
              currentLessonId={currentLessonId}
              onToggle={() => toggleMilestone(milestone.id)}
              onModuleToggle={toggleModule}
              onLessonClick={onLessonClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}