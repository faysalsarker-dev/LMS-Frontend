import { useTranslation } from 'react-i18next';
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

const statusOptions: { value: SubmissionStatus | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'assignment.filters.statusOptions.all' },
  { value: 'pending', labelKey: 'assignment.filters.statusOptions.pending' },
  { value: 'reviewed', labelKey: 'assignment.filters.statusOptions.reviewed' },
  { value: 'graded', labelKey: 'assignment.filters.statusOptions.graded' },
];

const typeOptions: { value: SubmissionType | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'assignment.filters.typeOptions.all' },
  { value: 'file', labelKey: 'assignment.filters.typeOptions.file' },
  { value: 'text', labelKey: 'assignment.filters.typeOptions.text' },
  { value: 'link', labelKey: 'assignment.filters.typeOptions.link' },
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
  const { t } = useTranslation();

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
            placeholder={t('assignment.filters.searchPlaceholder')}
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
            <SelectValue placeholder={t('assignment.filters.status')} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
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
            <SelectValue placeholder={t('assignment.filters.type')} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
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
            <SelectValue placeholder={t('assignment.filters.course')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('assignment.filters.allCourses')}</SelectItem>
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
            <SelectValue placeholder={t('assignment.filters.lesson')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('assignment.filters.allLessons')}</SelectItem>
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
          {t('assignment.filters.reset')}
        </Button>
      </div>
    </motion.div>
  );
};
