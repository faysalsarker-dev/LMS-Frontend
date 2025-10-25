import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, PlayCircle, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ILesson } from "@/interface";

interface Milestone {
  _id: string;
  title: string;
  lesson: ILesson[];
}

interface CourseSidebarProps {
  milestones: Milestone[];
  onLessonClick: (lesson: ILesson) => void;
  currentLessonId?: string;
  completedLessons: string[] | ILesson[] ;
}

export function CourseSidebar({ 
  milestones, 
  onLessonClick, 
  currentLessonId,
  completedLessons = []
}: CourseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());

  // Convert completed lessons to Set of IDs for O(1) lookup performance
  const completedLessonsSet = useMemo(() => {
    if (!completedLessons || completedLessons.length === 0) return new Set<string>();
    
    // Check if array contains objects or strings
    const firstItem = completedLessons[0];
    
    if (typeof firstItem === 'string') {
      // Array of IDs
      return new Set(completedLessons.filter(Boolean) as string[]);
    } else if (typeof firstItem === 'object' && firstItem !== null) {
      // Array of lesson objects - extract _id from each
      return new Set(
        completedLessons
          .filter((item): item is ILesson => typeof item === 'object' && item !== null && '_id' in item && Boolean((item as ILesson)._id))
          .map(item => item._id)
      );
    }
    
    return new Set<string>();
  }, [completedLessons]);

  // Get all lessons in order for sequential checking
  const allLessons = useMemo(() => {
    return milestones.flatMap(m => m.lesson || []).filter(Boolean);
  }, [milestones]);

  // Auto-expand milestone containing current lesson
  useEffect(() => {
    if (currentLessonId) {
      const milestoneWithCurrentLesson = milestones.find(m => 
        m.lesson?.some(l => l?._id === currentLessonId)
      );
      if (milestoneWithCurrentLesson) {
        setExpandedMilestones(prev => new Set([...prev, milestoneWithCurrentLesson._id]));
      }
    }
  }, [currentLessonId, milestones]);

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const getMilestoneProgress = (milestone: Milestone) => {
    if (!milestone?.lesson || milestone.lesson.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = milestone.lesson.length;
    const completed = milestone.lesson.filter(
      lesson => lesson?._id && completedLessonsSet.has(lesson._id)
    ).length;
    
    return { 
      completed, 
      total, 
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0 
    };
  };

  // Filter milestones based on search
  const filteredMilestones = useMemo(() => {
    if (!searchTerm.trim()) return milestones;
    
    const searchLower = searchTerm.toLowerCase();
    return milestones.filter(m =>
      m.title?.toLowerCase().includes(searchLower) ||
      m.lesson?.some(l => l.title?.toLowerCase().includes(searchLower))
    );
  }, [milestones, searchTerm]);

  // Determine lesson status with proper completion check
  const getLessonStatus = (lesson: ILesson, globalIndex: number): 'completed' | 'in-progress' | 'unlocked' | 'locked' => {
    if (!lesson?._id) return 'locked';

    // Check if lesson is completed using the Set (O(1) operation)
    if (completedLessonsSet.has(lesson._id)) return 'completed';
    
    // Check if it's the current lesson
    if (lesson._id === currentLessonId) return 'in-progress';
    
    // First lesson is always unlocked
    if (globalIndex === 0) return 'unlocked';
    
    // Check if previous lesson is completed (sequential unlock)
    const previousLesson = allLessons[globalIndex - 1];
    if (previousLesson?._id && completedLessonsSet.has(previousLesson._id)) {
      return 'unlocked';
    }
    
    return 'locked';
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold mb-3">Course Content</h3>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredMilestones?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No lessons found</p>
          </div>
        ) : (
          filteredMilestones?.map((milestone) => {
            if (!milestone?._id) return null;
            
            const isExpanded = expandedMilestones.has(milestone._id);
            const progress = getMilestoneProgress(milestone);
            
            return (
              <div key={milestone._id} className="border-b last:border-b-0">
                {/* Milestone header */}
                <button
                  onClick={() => toggleMilestone(milestone._id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 text-left">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {progress.completed} of {progress.total} lessons
                        {progress.percentage > 0 && (
                          <span className="ml-1">({progress.percentage}%)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {progress.completed === progress.total && progress.total > 0 && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </button>

                {/* Progress bar */}
                {progress.total > 0 && (
                  <div className="h-1 bg-muted">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}

                {/* Lessons list */}
                {isExpanded && (
                  <div className="bg-muted/20 mt-2">
                    {milestone?.lesson?.map((lesson, localIndex) => {
                      if (!lesson?._id) return null;
                      
                      const globalIndex = allLessons.findIndex(l => l?._id === lesson._id);
                      const status = getLessonStatus(lesson, globalIndex);
                      const isActive = lesson._id === currentLessonId;
                      const isCompleted = status === 'completed';
                      const isLocked = status === 'locked';
                      
                      return (
                        <button
                          key={lesson._id}
                          onClick={() => !isLocked && onLessonClick(lesson)}
                          disabled={isLocked}
                          className={cn(
                            "w-full p-3 pl-8 flex items-center gap-3 transition-all text-left",
                            "hover:bg-muted/80",
                            isActive && "bg-primary/10 border-l-4 border-primary shadow-sm",
                            isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                          )}
                        >
                          {/* Status icon */}
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : isActive ? (
                              <PlayCircle className="h-5 w-5 text-primary fill-primary/20" />
                            ) : isLocked ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          {/* Lesson info */}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              isActive && "text-primary font-semibold"
                            )}>
                              {localIndex + 1}. {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="capitalize">{lesson.contentType}</span>
                              {isCompleted && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">Completed</span>
                                </>
                              )}
                              {isActive && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary font-medium">Current</span>
                                </>
                              )}
                              {isLocked && (
                                <>
                                  <span>•</span>
                                  <span className="text-muted-foreground">Locked</span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}