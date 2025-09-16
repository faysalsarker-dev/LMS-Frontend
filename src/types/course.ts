export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "in-progress" | "locked";
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  isCompleted: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  modules: Module[];
  progress: number;
}

export interface Course {
  id: string;
  title: string;
  milestones: Milestone[];
  currentLesson?: Lesson;
  currentModule?: Module;
}