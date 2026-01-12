import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { EnrolledCourse } from '@/interface/student.types';

interface CourseSelectorProps {
  courses: EnrolledCourse[] | undefined;
  selectedCourseId: string | undefined;
  onCourseChange: (courseId: string) => void;
  isLoading: boolean;
}

const CourseSelector = ({ courses, selectedCourseId, onCourseChange, isLoading }: CourseSelectorProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>
    );
  }
  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <label className="text-sm font-medium text-muted-foreground">Select Course</label>
      <Select value={selectedCourseId} onValueChange={onCourseChange}>
        <SelectTrigger className="w-full max-w-xs bg-card">
          <SelectValue placeholder="Choose a course..." />
        </SelectTrigger>
        <SelectContent>
          {courses?.map((course) => (
            <SelectItem key={course._id} value={course._id}>
              {course?.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default CourseSelector;
