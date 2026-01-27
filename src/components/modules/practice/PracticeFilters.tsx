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
import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { PracticeFilters as PracticeFiltersType } from './practice.types';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import type { ICourse } from '@/interface/course.types';

interface PracticeFiltersProps {
  filters: PracticeFiltersType;
  onFiltersChange: (filters: PracticeFiltersType) => void;
}

export const PracticeFilters = ({ filters, onFiltersChange }: PracticeFiltersProps) => {
  const { data: courses } = useGetAllCoursesQuery({
    page: 1,
    limit: 100,
  });

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      search: '',
      course: '',
      isActive: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.course ||
    filters.isActive !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search practices..."
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value, page: 1 })
            }
            className="pl-10"
          />
        </div>

        {/* Course Filter */}
        <Select
          value={filters.course || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              course: value === 'all' ? '' : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses?.data?.data?.map((course:ICourse) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.isActive === '' ? 'all' : String(filters.isActive)}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              isActive: value === 'all' ? '' : value === 'true',
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort and Clear */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={filters.sortBy || 'createdAt'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                sortBy: value as 'createdAt' | 'title' | 'usageCount',
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="usageCount">Usage Count</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortOrder || 'desc'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                sortOrder: value as 'asc' | 'desc',
              })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
