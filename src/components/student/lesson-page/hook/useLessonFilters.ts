import type { LessonStatus, LessonType } from '@/interface/lesson.type';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

const DEBOUNCE_MS = 400;

interface UseLessonFiltersOptions {
  defaultLimit?: number;
}

export function useLessonFilters(options: UseLessonFiltersOptions = {}) {
  const { defaultLimit = 10 } = options;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<'all' | LessonStatus>('all');
  const [type, setType] = useState<LessonType | 'all'>('all');
  const [course, setCourse] = useState<string>('all');
  const [milestone, setMilestone] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(defaultLimit);

  // Debounce search
const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [status, type, course, milestone]);

  // Reset milestone when course changes
  useEffect(() => {
    setMilestone('all');
  }, [course]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('all');
    setType('all');
    setCourse('all');
    setMilestone('all');
    setPage(1);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      debouncedSearch !== '' ||
      status !== 'all' ||
      type !== 'all' ||
      course !== 'all' ||
      milestone !== 'all'
    );
  }, [debouncedSearch, status, type, course, milestone]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      page,
      limit,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (status !== 'all') params.status = status;
    if (type !== 'all') params.type = type;
    if (course !== 'all') params.course = course;
    if (milestone !== 'all') params.milestone = milestone;

    return params;
  }, [page, limit, debouncedSearch, status, type, course, milestone]);

  return {
    // Filter values
    search,
    status,
    type,
    course,
    milestone,
    page,
    limit,

    // Setters
    setSearch,
    setStatus,
    setType,
    setCourse,
    setMilestone,
    setPage,

    // Helpers
    resetFilters,
    hasActiveFilters,
    queryParams,
  };
}
