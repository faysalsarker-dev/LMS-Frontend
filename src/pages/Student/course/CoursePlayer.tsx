// import { useParams } from "react-router";
// import { useEffect, useState } from "react";
// import { useGetCourseByIdQuery, useGetCourseCurriculumQuery, useGetLessonContentQuery } from "@/redux/features/course/course.api";
// import { CourseSidebar } from "./CourseSidebar";
// import { CoursePlayerContent } from "./CoursePlayerContent";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
// import type { ILesson, IMilestone } from "@/interface";
// import { 
//   useCreateProgressMutation, 
//   useGetProgressQuery 
// } from "@/redux/features/progress/progress.api";

// export function CoursePlayer() {
//   const { id } = useParams();
//   const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
//   const { data, isLoading, error } = useGetCourseByIdQuery(id);
//   const { data: curriculumData, isLoading: curriculumLoading } = useGetCourseCurriculumQuery(id);
//   const { data: lessonContentData, isLoading: lessonContentLoading } = useGetLessonContentQuery(currentLessonId, {
//     skip: !currentLessonId,
//   });


// console.log(lessonContentData,'lesson data');



//   const { data: pData, isLoading: loadingProgress } = useGetProgressQuery(id);
//   const [progressComplete, { isLoading: isCompletingProgress }] = useCreateProgressMutation();

//   const course = data?.data;
//   const progress = pData?.data;

//   const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
//   const [lessons, setLessons] = useState<ILesson[]>([]);
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     if (!course) return;

//     const allLessons = course.milestones?.flatMap((m: IMilestone) => m.lesson).filter(Boolean) || [];
//     setLessons(allLessons);
//   }, [course]);




//  useEffect(() => {
//   if (!course || !progress || lessons.length === 0 || isInitialized === true) return;

//   if (!progress.completedLessons || progress.completedLessons.length === 0) {
//     setCurrentLesson(lessons[0]);
//     setIsInitialized(true);
//     return;
//   }

//   // 🟢 When user has progress → find next incomplete lesson
//   const completedIds = new Set(progress.completedLessons.map((l: ILesson) => l._id?.toString()));
//   const nextIncompleteLesson = lessons.find(
//     (lesson: ILesson) => !completedIds.has(lesson._id?.toString())
//   );

//   if (nextIncompleteLesson) {
//     setCurrentLesson(nextIncompleteLesson);
//   } else {
//     setCurrentLesson(lessons[lessons.length - 1]);
//   }

//   setIsInitialized(true);
// }, [course, progress, lessons, isInitialized]);

 
 
//   const handleLessonComplete = async () => {
//     if (!currentLesson || !id) return;

//     if (isCurrentLessonCompleted) {
 
//       return;
//     }

//     try {
//       await progressComplete({
//         courseId: id,
//         lessonId: currentLesson._id
//       }).unwrap();



//       // Auto-advance to next lesson after completion
//       const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
//       if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
//         setCurrentLesson(lessons[currentIndex + 1]);
//       }
//     } catch (error) {
//       console.error("Progress save error:", error);

//     }
//   };

//   // 🔹 Navigation
//   const handleNextLesson = () => {
//     if (!currentLesson || lessons.length === 0) return;
//     const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
//     if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
//       setCurrentLesson(lessons[currentIndex + 1]);
//     }
//   };

//   const handlePrevLesson = () => {
//     if (!currentLesson || lessons.length === 0) return;
//     const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
//     if (currentIndex > 0) {
//       setCurrentLesson(lessons[currentIndex - 1]);
//     }
//   };

//   const handleLessonClick = (lesson: ILesson) => {
//     setCurrentLesson(lesson);
//     setCurrentLessonId(lesson._id || null);
//   };

//   // Check if current lesson is completed
//  const isCurrentLessonCompleted =
//   currentLesson && progress?.completedLessons
//     ? progress.completedLessons.some(
//         (lesson: ILesson) => lesson._id?.toString() === currentLesson._id?.toString()
//       )
//     : false;



//   // Loading state
//   if (isLoading || loadingProgress) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center space-y-2">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
//           <p className="text-muted-foreground">Loading course...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !course) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center space-y-2">
//           <p className="text-muted-foreground">
//             {error ? "Failed to load course." : "Course not found."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // No lessons state
//   if (lessons.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-muted-foreground">This course has no lessons yet.</p>
//       </div>
//     );
//   }

//   const currentIndex = currentLesson
//     ? lessons.findIndex((l) => l._id === currentLesson._id)
//     : -1;

//   const isFirstLesson = currentIndex === 0;
//   const isLastLesson = currentIndex === lessons.length - 1;

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full p-4">
//         {/* Left side → current video */}
//         <div className="lg:col-span-2 space-y-4">
//           {currentLesson ? (
//             <>
//               <CoursePlayerContent lesson={currentLesson} />
              
//               {/* Navigation and Complete Button */}
//               <div className="space-y-4">
//                 {/* Complete Button */}
//                 {!isCurrentLessonCompleted && (
//                   <Button
//                     onClick={handleLessonComplete}
//                     disabled={isCompletingProgress}
//                     className="w-full"
//                     size="lg"
//                   >
//                     {isCompletingProgress ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Mark as Complete
//                       </>
//                     )}
//                   </Button>
//                 )}

//                 {isCurrentLessonCompleted && (
//                   <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
//                     <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 inline-block mr-2" />
//                     <span className="text-green-700 dark:text-green-300 font-medium">
//                       Lesson Completed
//                     </span>
//                   </div>
//                 )}

//                 {/* Navigation Controls */}
//                 <div className="flex justify-between items-center">
//                   <Button
//                     onClick={handlePrevLesson}
//                     disabled={isFirstLesson}
//                     variant="outline"
//                     className="flex items-center gap-2"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                     Previous
//                   </Button>

//                   <div className="text-sm text-muted-foreground">
//                     Lesson {currentIndex + 1} of {lessons.length}
//                   </div>

//                   <Button
//                     onClick={handleNextLesson}
//                     disabled={isLastLesson}
//                     className="flex items-center gap-2"
//                   >
//                     Next
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
//               <p className="text-muted-foreground text-center">
//                 Select a lesson to start learning.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Right side → collapsible sidebar */}
//         <div>
//           <CourseSidebar
//           curriculum={curriculumData?.data?.curriculum}
//             milestones={course.milestones || []}
//             onLessonClick={handleLessonClick}
//             currentLessonId={currentLesson?._id}
//              isLoading={curriculumLoading}
//             completedLessons={progress?.completedLessons || []}
//           />



//         </div>
//       </div>
//     </div>
//   );
// }


import { Separator } from "@/components/ui/separator"
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useGetCourseCurriculumQuery, useGetLessonContentQuery } from "@/redux/features/course/course.api";
import { CourseSidebar } from "./CourseSidebar";
import { CoursePlayerContent } from "./CoursePlayerContent";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useCreateProgressMutation } from "@/redux/features/progress/progress.api";

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



console.log(lessonContentData,'lesson data');

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
    <div className="min-h-screen bg-background max-w-6xl mx-auto">


<h2 className="text-2xl font-semibold mt-6 ">
  {
    curriculumData.data?.title || 'Course Player'
  }
</h2>
<p>
  {
    lessonContentData?.data?.title || ''
  }
</p>

 <Separator className="my-1" />


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full p-4">
        {/* Left side → current lesson content */}




        <div className="lg:col-span-2 space-y-4">
          {currentLesson ? (
            <>
              <CoursePlayerContent
              isLoading={lessonContentLoading}
              data={lessonContentData?.data}
              lesson={currentLesson} />
              
              {/* Navigation and Complete Button */}
              <div className="space-y-4">
                {/* Complete Button */}
                {!currentLesson.isCompleted && (
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

                {currentLesson.isCompleted && (
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
                    Lesson {currentIndex + 1} of {allLessons.length}
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