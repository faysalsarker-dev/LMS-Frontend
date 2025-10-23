import  VideoPlayer  from "./VideoPlayer";
import { DocLesson } from "./DocLesson";
import { QuizLesson } from "./QuizLesson";
import type { ILesson } from "@/interface";

type CoursePlayerContentProps = {
  lesson: ILesson;
};  


export function CoursePlayerContent({ lesson }: CoursePlayerContentProps) {


  switch (lesson.contentType) {
    case "video":
      return <VideoPlayer url={lesson.videoUrl!} />;
    case "doc":
      return <DocLesson docContent={lesson.docContent} />;
    case "quiz":
      return <QuizLesson quiz={lesson.quiz} />;
    default:
      return <div>Unsupported lesson type</div>;
  }
}
