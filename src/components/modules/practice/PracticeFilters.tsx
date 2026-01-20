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
import type { PracticeFilters as PracticeFiltersType, PracticeType, DifficultyLevel } from './practice.types';
import { useGetCategoriesQuery } from '@/hooks/usePracticeApi';

interface PracticeFiltersProps {
  filters: PracticeFiltersType;
  onFiltersChange: (filters: PracticeFiltersType) => void;
}

const practiceTypes: { value: PracticeType; label: string }[] = [
  { value: 'pronunciation', label: 'Pronunciation' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'other', label: 'Other' },
];

const difficultyLevels: { value: DifficultyLevel; label: string }[] = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export const PracticeFilters = ({ filters, onFiltersChange }: PracticeFiltersProps) => {
  const { data: categories } = useGetCategoriesQuery();

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      search: '',
      type: '',
      difficulty: '',
      category: '',
      isActive: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.type ||
    filters.difficulty ||
    filters.category ||
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Search */}
        <div className="relative xl:col-span-2">
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

        {/* Type Filter */}
        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              type: value === 'all' ? '' : (value as PracticeType),
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {practiceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={filters.difficulty || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              difficulty: value === 'all' ? '' : (value as DifficultyLevel),
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {difficultyLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === 'all' ? '' : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
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
