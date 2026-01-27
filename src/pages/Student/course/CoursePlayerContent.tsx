import VideoPlayer from "@/components/VideoPlayer";
import { DocLesson } from "./DocLesson";
import  QuizLesson  from "./QuizLesson";
import type { ILesson } from "@/interface";
import AssignmentLesson from "@/components/modules/lesson-editor/assignment/AssignmentLesson";
import AudioPlayer from "./AudioPlayer";

type CoursePlayerContentProps = {
  lesson?: ILesson;
  isLoading: boolean;
  setQuizResult: (result: boolean) => void;
};  


export function CoursePlayerContent({ lesson ,isLoading , setQuizResult}: CoursePlayerContentProps) {


if(isLoading){
  return <div>Loading...</div>
}

  switch (lesson?.type) {
    case "video":
      return <VideoPlayer url={lesson.video?.url as string} />;
    case "doc":
      return <DocLesson doc={lesson?.doc} />;
    case "audio":
      return lesson?.audio ? <AudioPlayer audio={lesson.audio} /> : <div>No audio available</div>;
   case "quiz":
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <QuizLesson questions={lesson?.questions as any} setQuizResult={setQuizResult} />;
   case "assignment":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return lesson?.assignment ? <AssignmentLesson assignment={lesson.assignment as any} lessonId={lesson._id} /> : <div>No assignment available</div>;
    default:
      return <div>Unsupported lesson type</div>;
  }
}
