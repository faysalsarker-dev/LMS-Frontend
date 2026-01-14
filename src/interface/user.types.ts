import type { ICourse } from "./course.types";

export type UserRole = "admin" | "instructor" | "super_admin" | "student";
export interface IUser {
  _id:string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  profile?: string;
  courses: ICourse[] | string[];

  address: {
    country?: string;
    city?: string;
  };
  createdAt:Date;
  updatedAt:string;
}

