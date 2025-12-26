


import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetCourseCurriculumQuery, useGetLessonContentQuery } from "@/redux/features/course/course.api";
import { CourseSidebar } from "./CourseSidebar";
import { CoursePlayerContent } from "./CoursePlayerContent";

import { useCreateProgressMutation } from "@/redux/features/progress/progress.api";
import { CourseHeader } from "./CourseHeader";
import { AnimatePresence, motion } from 'framer-motion';
import { LessonNavigation } from "./LessonNavigation";

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

export function CoursePlayer() {
  const { id } = useParams();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  
  const { data: curriculumData, isLoading: curriculumLoading } = useGetCourseCurriculumQuery(id as string);
  const [progressComplete, { isLoading: isCompletingProgress }] = useCreateProgressMutation();
  const { data: lessonContentData, isLoading: lessonContentLoading,refetch } = useGetLessonContentQuery(currentLessonId as string, {
     skip: !currentLessonId,
   });




  const curriculum: Milestone[] = curriculumData?.data?.curriculum || [];
  const allLessons = curriculum.flatMap(m => m.lessons || []);

  // Find current lesson object
  const currentLesson = currentLessonId 
    ? allLessons.find(l => l._id === currentLessonId) 
    : null;

  // Set initial lesson on mount
  useEffect(() => {
    if (allLessons.length > 0 && !currentLessonId) {
      // Find first incomplete lesson or start from beginning
      const firstIncomplete = allLessons.find(l => !l.isCompleted);
      setCurrentLessonId(firstIncomplete?._id || allLessons[0]._id);
    }
  }, [allLessons, currentLessonId]);

  const handleLessonComplete = async () => {
    if (!currentLesson || !id || currentLesson.isCompleted) return;

    try {
      await progressComplete({
        courseId: id,
        lessonId: currentLesson._id
      }).unwrap();

      // Auto-advance to next lesson after completion
      const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
      if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        setCurrentLessonId(allLessons[currentIndex + 1]._id);
      }
    } catch (error) {
      console.error("Progress save error:", error);
    }
  };

  const handleNextLesson = () => {
    if (!currentLesson) return;
    const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1]._id);
    }
  };

  const handlePrevLesson = () => {
    if (!currentLesson) return;
    const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1]._id);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLessonId(lesson._id);
    refetch()
  };

  // Loading state
  if (curriculumLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // No curriculum state
  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">This course has no lessons yet.</p>
        </div>
      </div>
    );
  }

  const currentIndex = currentLesson
    ? allLessons.findIndex(l => l._id === currentLesson._id)
    : -1;

  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === allLessons.length - 1;

  return (
    <div className="min-h-screen bg-background ">

    <CourseHeader
        title={curriculumData?.data?.title || "Course Player"}
        currentLessonTitle={lessonContentData?.data?.title || ""}
 
      />




      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full p-4 max-w-6xl mx-auto">
        {/* Left side → current lesson content */}




      

       <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {currentLesson ? (
                <motion.div
                  key={currentLesson._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CoursePlayerContent
                    isLoading={lessonContentLoading}
                    lesson={lessonContentData?.data}
                  />

                  <LessonNavigation
                    currentLesson={currentLesson}
                    currentIndex={currentIndex}
                    totalLessons={allLessons.length}
                    isFirstLesson={isFirstLesson}
                    isLastLesson={isLastLesson}
                    isCompletingProgress={isCompletingProgress}
                    onComplete={handleLessonComplete}
                    onPrevious={handlePrevLesson}
                    onNext={handleNextLesson}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-96 glass rounded-2xl"
                >
                  <p className="text-muted-foreground text-center">
                    Select a lesson to start learning.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>


        {/* Right side → curriculum sidebar */}
        <div>
          <CourseSidebar
            curriculum={curriculum}
            onLessonClick={handleLessonClick}
            currentLessonId={currentLessonId || undefined}
            isLoading={curriculumLoading}
          />
        </div>
      </div>
    </div>
  );
}






  // <div className="lg:col-span-2 space-y-4">
  //         {currentLesson ? (
  //           <>
  //             <CoursePlayerContent
  //             isLoading={lessonContentLoading}
  //             lesson={lessonContentData?.data} />
              
  //             <div className="space-y-4">
  //               {/* Complete Button */}
  //               {!currentLesson.isCompleted && (
  //                 <Button
  //                   onClick={handleLessonComplete}
  //                   disabled={isCompletingProgress}
  //                   className="w-full"
  //                   size="lg"
  //                 >
  //                   {isCompletingProgress ? (
  //                     <>
  //                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
  //                       Saving...
  //                     </>
  //                   ) : (
  //                     <>
  //                       <CheckCircle className="h-4 w-4 mr-2" />
  //                       Mark as Complete
  //                     </>
  //                   )}
  //                 </Button>
  //               )}

  //               {currentLesson.isCompleted && (
  //                 <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
  //                   <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 inline-block mr-2" />
  //                   <span className="text-green-700 dark:text-green-300 font-medium">
  //                     Lesson Completed
  //                   </span>
  //                 </div>
  //               )}

  //               <div className="flex justify-between items-center">
  //                 <Button
  //                   onClick={handlePrevLesson}
  //                   disabled={isFirstLesson}
  //                   variant="outline"
  //                   className="flex items-center gap-2"
  //                 >
  //                   <ChevronLeft className="h-4 w-4" />
  //                   Previous
  //                 </Button>

  //                 <div className="text-sm text-muted-foreground">
  //                   Lesson {currentIndex + 1} of {allLessons.length}
  //                 </div>

  //                 <Button
  //                   onClick={handleNextLesson}
  //                   disabled={isLastLesson}
  //                   className="flex items-center gap-2"
  //                 >
  //                   Next
  //                   <ChevronRight className="h-4 w-4" />
  //                 </Button>
  //               </div>
  //             </div>
  //           </>
  //         ) : (
  //           <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
  //             <p className="text-muted-foreground text-center">
  //               Select a lesson to start learning.
  //             </p>
  //           </div>
  //         )}
  //       </div>