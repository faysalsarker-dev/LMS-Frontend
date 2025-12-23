
import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, PlayCircle, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Lesson {
  _id: string;
  title: string;
  order: number;
  contentType: string;
  isCompleted: boolean;
}

interface Milestone {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  curriculum: Milestone[];
  onLessonClick: (lesson: Lesson) => void;
  currentLessonId?: string;
  isLoading?: boolean;
}

export function CourseSidebar({ 
  curriculum,
  onLessonClick, 
  currentLessonId,
  isLoading = false
}: CourseSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set());

  
  const allLessons = useMemo(() => {
    if (!curriculum || curriculum.length === 0) return [];
    return curriculum.flatMap(m => m.lessons || []);
  }, [curriculum]);

  // Auto-expand milestone containing current lesson
  useEffect(() => {
    if (currentLessonId && curriculum && curriculum.length > 0) {
      const milestoneWithCurrentLesson = curriculum.find(m => 
        m.lessons?.some(l => l._id === currentLessonId)
      );
      if (milestoneWithCurrentLesson) {
        setExpandedMilestones(prev => new Set([...prev, milestoneWithCurrentLesson._id]));
      }
    }
  }, [currentLessonId, curriculum]);

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
    const total = milestone.lessons?.length || 0;
    const completed = milestone.lessons?.filter(l => l.isCompleted).length || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Filter milestones based on search
  const filteredMilestones = useMemo(() => {
    if (!curriculum || curriculum.length === 0) return [];
    if (!searchTerm.trim()) return curriculum;
    
    const searchLower = searchTerm.toLowerCase();
    return curriculum.filter(m =>
      m.title?.toLowerCase().includes(searchLower) ||
      m.lessons?.some(l => l.title?.toLowerCase().includes(searchLower))
    );
  }, [curriculum, searchTerm]);

  // Determine if lesson is unlocked (sequential unlock logic)
  const isLessonUnlocked = (lesson: Lesson): boolean => {
    const globalIndex = allLessons.findIndex(l => l._id === lesson._id);
    
    // First lesson is always unlocked
    if (globalIndex === 0) return true;
    
    // Check if previous lesson is completed
    const previousLesson = allLessons[globalIndex - 1];
    return previousLesson?.isCompleted || false;
  };

  const getLessonStatus = (lesson: Lesson): 'completed' | 'in-progress' | 'unlocked' | 'locked' => {
    if (lesson.isCompleted) return 'completed';
    if (lesson._id === currentLessonId) return 'in-progress';
    if (isLessonUnlocked(lesson)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold mb-3">Course Content</h3>
        
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
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Loading curriculum...</p>
            </div>
          </div>
        ) : !curriculum || curriculum.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No curriculum data available</p>
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No lessons found</p>
          </div>
        ) : (
          filteredMilestones.map((milestone) => {
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
                {isExpanded && milestone.lessons && milestone.lessons.length > 0 && (
                  <div className="bg-muted/20">
                    {milestone.lessons.map((lesson, index) => {
                        const status = getLessonStatus(lesson);
                        const isActive = lesson._id === currentLessonId;
                        const isCompleted = lesson.isCompleted;
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
                                {index + 1}. {lesson.title}
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