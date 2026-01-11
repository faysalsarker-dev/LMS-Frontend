import type { ILesson } from ".";
import type { ICourse } from "./course.types";

export interface IMilestone extends Document {
    _id: string;
  title: string;
  course: ICourse;
  lesson: ILesson[];
  order: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}