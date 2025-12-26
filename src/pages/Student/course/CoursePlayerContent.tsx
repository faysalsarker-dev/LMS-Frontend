import VideoPlayer from "@/components/VideoPlayer";
import { DocLesson } from "./DocLesson";
import  QuizLesson  from "./QuizLesson";
import type { ILesson } from "@/interface";

type CoursePlayerContentProps = {
  lesson?: ILesson;
  isLoading: boolean;
};  


export function CoursePlayerContent({ lesson ,isLoading}: CoursePlayerContentProps) {


if(isLoading){
  return <div>Loading...</div>
}

console.log(lesson.questions,'lesson in player');
const url =`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  switch (lesson?.type) {
    case "video":
      return <VideoPlayer url={url} />;
    case "doc":
      return <DocLesson doc={lesson?.doc} />;
    case "quiz":
      return <QuizLesson question={lesson?.questions?.[0]} />;
    default:
      return <div>Unsupported lesson type</div>;
  }
}
