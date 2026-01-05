import VideoPlayer from "@/components/VideoPlayer";
import { DocLesson } from "./DocLesson";
import  QuizLesson  from "./QuizLesson";
import type { ILesson } from "@/interface";

type CoursePlayerContentProps = {
  lesson?: ILesson;
  isLoading: boolean;
  setQuizResult: (result: boolean) => void;
};  


export function CoursePlayerContent({ lesson ,isLoading , setQuizResult}: CoursePlayerContentProps) {


if(isLoading){
  return <div>Loading...</div>
}


const url =`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  switch (lesson?.type) {
    case "video":
      return <VideoPlayer url={url} />;
    case "doc":
      return <DocLesson doc={lesson?.doc} />;
   case "quiz":
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <QuizLesson questions={lesson?.questions as any} setQuizResult={setQuizResult} />;
   case "assignment":
  return <QuizLesson questions={lesson?.questions as any} setQuizResult={setQuizResult} />;
    default:
      return <div>Unsupported lesson type</div>;
  }
}
