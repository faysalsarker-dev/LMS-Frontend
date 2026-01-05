import { Search, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IAssignmentFilters, SubmissionStatus, SubmissionType } from '@/interface/assignment.types';

interface AssignmentFiltersProps {
  filters: IAssignmentFilters;
  onFilterChange: (key: keyof IAssignmentFilters, value: string | number) => void;
  onReset: () => void;
  courses: { _id: string; title: string }[];
  lessons: { _id: string; title: string }[];
  isLoadingCourses: boolean;
  isLoadingLessons: boolean;
}

const statusOptions: { value: SubmissionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'graded', label: 'Graded' },
];

const typeOptions: { value: SubmissionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'file', label: 'File' },
  { value: 'text', label: 'Text' },
  { value: 'link', label: 'Link' },
];

export const AssignmentFilters = ({
  filters,
  onFilterChange,
  onReset,
  courses,
  lessons,
  isLoadingCourses,
  isLoadingLessons,
}: AssignmentFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name or email..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'pending'}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={filters.submissionType || 'all'}
          onValueChange={(value) => onFilterChange('submissionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Select
          value={filters.course || 'all'}
          onValueChange={(value) => onFilterChange('course', value)}
          disabled={isLoadingCourses}
        >
          <SelectTrigger>
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Lesson Filter */}
        <Select
          value={filters.lesson || 'all'}
          onValueChange={(value) => onFilterChange('lesson', value)}
          disabled={isLoadingLessons || filters.course === 'all'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Lesson" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lessons</SelectItem>
            {lessons.map((lesson) => (
              <SelectItem key={lesson._id} value={lesson._id}>
                {lesson.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </motion.div>
  );
};
