import VideoPlayer from "@/components/VideoPlayer";
import { DocLesson } from "./DocLesson";
import { QuizLesson } from "./QuizLesson";
import type { ILesson } from "@/interface";

type CoursePlayerContentProps = {
  lesson: ILesson;
};  


export function CoursePlayerContent({ lesson ,data}: CoursePlayerContentProps) {
console.log(data  ,'lesson content data');

const url =`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  switch (lesson.contentType) {
    case "video":
      return <VideoPlayer url={url} />;
    case "doc":
      return <DocLesson docContent={lesson.docContent} />;
    case "quiz":
      return <QuizLesson quiz={lesson.quiz} />;
    default:
      return <div>Unsupported lesson type</div>;
  }
}
