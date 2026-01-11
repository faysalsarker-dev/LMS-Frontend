import type { ICourse } from "./course.types";
import type { IUser } from "./user.types";

export interface ITestimonial {
  _id: string;
  user: IUser;
  course: ICourse;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}