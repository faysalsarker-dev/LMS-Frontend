import { GraduationCap, Flag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { useGetAllMilestonesQuery } from "@/redux/features/milestone/milestone.api";
import type { ICourse, IMilestone } from "@/interface";

interface CourseMilestoneSelectorProps {
  courseId?: string;
  milestoneId?: string;
  onCourseChange: (courseId: string) => void;
  onMilestoneChange: (milestoneId: string) => void;
  errors?: {
    course?: string;
    milestone?: string;
  };
}

export function CourseMilestoneSelector({
  courseId,
  milestoneId,
  onCourseChange,
  onMilestoneChange,
  errors,
}: CourseMilestoneSelectorProps) {
  const { data: coursesData } = useGetAllCoursesQuery({ page: 1, limit: 10000 });
  const { data: milestonesData } = useGetAllMilestonesQuery({});

  const courses = coursesData?.data?.data || [];
  const allMilestones = milestonesData?.data || [];

  // Filter milestones by selected course
  const filteredMilestones = courseId
    ? allMilestones.filter((m: IMilestone) => {
        const mCourseId = typeof m.course === 'string' ? m.course : m.course?._id;
        return mCourseId === courseId;
      })
    : allMilestones;

  const handleCourseChange = (newCourseId: string) => {
    onCourseChange(newCourseId);
    // Reset milestone if it doesn't belong to the new course
    const milestoneValid = filteredMilestones.some(
      (m: IMilestone) => m._id === milestoneId
    );
    if (!milestoneValid) {
      onMilestoneChange("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="course" className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Course
          <span className="text-destructive">*</span>
        </Label>
        <Select value={courseId} onValueChange={handleCourseChange}>
          <SelectTrigger id="course" className="focus-ring">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course: ICourse) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.course && (
          <p className="text-sm text-destructive">{errors.course}</p>
        )}
      </div>

      {/* Milestone Selection */}
      <div className="space-y-2">
        <Label htmlFor="milestone" className="flex items-center gap-2">
          <Flag className="w-4 h-4" />
          Milestone
          <span className="text-destructive">*</span>
        </Label>
        <Select
          value={milestoneId}
          onValueChange={onMilestoneChange}
          disabled={!courseId}
        >
          <SelectTrigger id="milestone" className="focus-ring">
            <SelectValue placeholder="Select a milestone" />
          </SelectTrigger>
          <SelectContent>
            {filteredMilestones.length === 0 && courseId ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No milestones available for this course
              </div>
            ) : (
              filteredMilestones.map((milestone: IMilestone) => (
                <SelectItem key={milestone._id} value={milestone._id}>
                  {milestone.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {!courseId && (
          <p className="text-xs text-muted-foreground">
            Select a course first to view milestones
          </p>
        )}
        {errors?.milestone && (
          <p className="text-sm text-destructive">{errors.milestone}</p>
        )}
      </div>
    </div>
  );
}
