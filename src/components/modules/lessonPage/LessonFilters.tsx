import { Search, X, Filter } from 'lucide-react';
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
import type { LessonType, LessonStatus } from '@/interface/lesson.type';
import type { ICourse } from '@/interface/course.types';
import type { IMilestone } from '@/interface/milestone.types';

interface LessonFiltersProps {
  search: string;
  status: 'all' | LessonStatus;
  type: LessonType | 'all';
  course: string;
  milestone: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | LessonStatus) => void;
  onTypeChange: (value: LessonType | 'all') => void;
  onCourseChange: (value: string) => void;
  onMilestoneChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  courses: ICourse[];
  milestones: IMilestone[];
  isLoadingCourses?: boolean;
  isLoadingMilestones?: boolean;
}

const lessonTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'video', label: 'Video' },
  { value: 'doc', label: 'Document' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'audio', label: 'Audio' },
  { value: 'assignment', label: 'Assignment' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'draft', label: 'Draft' },
];

export function LessonFilters({
  search,
  status,
  type,
  course,
  milestone,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onCourseChange,
  onMilestoneChange,
  onReset,
  hasActiveFilters,
  courses,
  milestones,
  isLoadingCourses,
  isLoadingMilestones,
}: LessonFiltersProps) {

  console.log(milestones);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-background border-border focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 rounded-xl bg-background border-border">
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
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="h-10 rounded-xl bg-background border-border">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {lessonTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Select value={course} onValueChange={onCourseChange} disabled={isLoadingCourses}>
          <SelectTrigger className="h-10 rounded-xl bg-background border-border">
            <SelectValue placeholder={isLoadingCourses ? 'Loading...' : 'All Courses'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses?.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Milestone Filter */}
       <Select
          value={milestone}
          onValueChange={onMilestoneChange}
          disabled={isLoadingMilestones || course === 'all'}
        >
          <SelectTrigger className="h-10 rounded-xl bg-background border-border">
            <SelectValue
              placeholder={
                course === 'all'
                  ? 'Select course first'
                  : isLoadingMilestones
                  ? 'Loading...'
                  : 'All Milestones'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Milestones</SelectItem>
            {milestones?.map((m) => (
              <SelectItem key={m._id} value={m._id}>
                {m.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> 
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex justify-end"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <X className="h-4 w-4" />
            Reset Filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
