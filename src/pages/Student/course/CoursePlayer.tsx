import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetCourseByIdQuery } from "@/redux/features/course/course.api";
import { CourseSidebar } from "./CourseSidebar";
import { CoursePlayerContent } from "./CoursePlayerContent";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import type { ILesson, IMilestone } from "@/interface";
import { 
  useCreateProgressMutation, 
  useGetProgressQuery 
} from "@/redux/features/progress/progress.api";

export function CoursePlayer() {
  const { id } = useParams();
  
  const { data, isLoading, error } = useGetCourseByIdQuery(id);
  const { data: pData, isLoading: loadingProgress } = useGetProgressQuery(id);
  const [progressComplete, { isLoading: isCompletingProgress }] = useCreateProgressMutation();

  const course = data?.data;
  const progress = pData?.data;

  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔹 Load lessons on course change
  useEffect(() => {
    if (!course) return;

    const allLessons = course.milestones?.flatMap((m: IMilestone) => m.lesson).filter(Boolean) || [];
    setLessons(allLessons);
  }, [course]);

  // 🔹 Initialize current lesson only once on mount
  useEffect(() => {
    if (!course || isInitialized || lessons.length === 0) return;

    if (!progress || !progress.completedLessons || progress.completedLessons.length === 0) {
      // No progress yet, start from first lesson
      setCurrentLesson(lessons[0]);
      setIsInitialized(true);
      return;
    }

    // Find the first incomplete lesson
    const completedIds = new Set(progress.completedLessons);
    const nextIncompleteLesson = lessons.find(
      (lesson: ILesson) => !completedIds.has(lesson._id)
    );

    if (nextIncompleteLesson) {
      // Set to first incomplete lesson
      setCurrentLesson(nextIncompleteLesson);
    } else {
      // All lessons completed, show last lesson
      setCurrentLesson(lessons[lessons.length - 1]);
    }
    
    setIsInitialized(true);
  }, [course, progress, lessons, isInitialized]);

  // 🔹 Handle lesson completion
  const handleLessonComplete = async () => {
    if (!currentLesson || !id) return;

    // Don't mark already completed lessons
    if (isCurrentLessonCompleted) {
 
      return;
    }

    try {
      await progressComplete({
        courseId: id,
        lessonId: currentLesson._id
      }).unwrap();



      // Auto-advance to next lesson after completion
      const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
      if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    } catch (error) {
      console.error("Progress save error:", error);

    }
  };

  // 🔹 Navigation
  const handleNextLesson = () => {
    if (!currentLesson || lessons.length === 0) return;
    const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!currentLesson || lessons.length === 0) return;
    const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  const handleLessonClick = (lesson: ILesson) => {
    setCurrentLesson(lesson);
  };

  // Check if current lesson is completed
  const isCurrentLessonCompleted = currentLesson && progress?.completedLessons
    ? progress.completedLessons.includes(currentLesson._id)
    : false;


    console.log(isCurrentLessonCompleted,'check');
  // Loading state
  if (isLoading || loadingProgress) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            {error ? "Failed to load course." : "Course not found."}
          </p>
        </div>
      </div>
    );
  }

  // No lessons state
  if (lessons.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">This course has no lessons yet.</p>
      </div>
    );
  }

  const currentIndex = currentLesson
    ? lessons.findIndex((l) => l._id === currentLesson._id)
    : -1;

  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === lessons.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full p-4">
        {/* Left side → current video */}
        <div className="lg:col-span-2 space-y-4">
          {currentLesson ? (
            <>
              <CoursePlayerContent lesson={currentLesson} />
              
              {/* Navigation and Complete Button */}
              <div className="space-y-4">
                {/* Complete Button */}
                {!isCurrentLessonCompleted && (
                  <Button
                    onClick={handleLessonComplete}
                    disabled={isCompletingProgress}
                    className="w-full"
                    size="lg"
                  >
                    {isCompletingProgress ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                )}

                {isCurrentLessonCompleted && (
                  <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 inline-block mr-2" />
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Lesson Completed
                    </span>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handlePrevLesson}
                    disabled={isFirstLesson}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </div>

                  <Button
                    onClick={handleNextLesson}
                    disabled={isLastLesson}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
              <p className="text-muted-foreground text-center">
                Select a lesson to start learning.
              </p>
            </div>
          )}
        </div>

        {/* Right side → collapsible sidebar */}
        <div>
          <CourseSidebar
            milestones={course.milestones || []}
            onLessonClick={handleLessonClick}
            currentLessonId={currentLesson?._id}
            completedLessons={progress?.completedLessons || []}
          />
        </div>
      </div>
    </div>
  );
}