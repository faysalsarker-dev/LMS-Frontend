import { VideoPlayer } from "./VideoPlayer";




export function CoursePlayer() {
  // const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  

  // const handleLessonClick = (lesson: Lesson) => {
  //   if (lesson.status !== "locked") {
  //     setCurrentLesson(lesson);
  //   }
  // };
// console.log(currentLesson);
  // const handlePrevious = () => {
  //   // Logic to navigate to previous lesson
  //   console.log("Previous lesson");
  // };

  // const handleNext = () => {
  //   // Logic to navigate to next lesson
  //   console.log("Next lesson");
  // };


  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
   


<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full h-full p-4">

<div className="lg:col-span-2 ">
    <VideoPlayer
            // currentModule={dummyCourse.currentModule?.title || "Functions and Scope"}
            // progress={75}
            // onPrevious={handlePrevious}
            // onNext={handleNext}
          />


</div>

<div>

     {/* <CourseSidebar
            milestones={dummyCourse.milestones}
            onLessonClick={handleLessonClick}
            currentLessonId={currentLesson?.id}
          /> */}
</div>







</div>


      <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
       
        
      
        
      

     

     
      </div>
    </div>
  );
}