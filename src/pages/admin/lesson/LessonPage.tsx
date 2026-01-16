import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

import { useGetAllLessonsQuery } from '@/redux/features/lesson/lesson.api';
import { useGetAllMilestonesQuery } from '@/redux/features/milestone/milestone.api';
import { LessonFilters } from '@/components/modules/lessonPage/LessonFilters';
import { LessonTable } from '@/components/modules/lessonPage/LessonTable';
import { LessonPagination } from '@/components/modules/lessonPage/LessonPagination';
import { useLessonFilters } from '@/components/modules/lessonPage/hook/useLessonFilters';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';


export default function LessonPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    search,
    status,
    type,
    course,
    milestone,
    setSearch,
    setStatus,
    setType,
    setCourse,
    setMilestone,
    setPage,
    resetFilters,
    hasActiveFilters,
    queryParams,
  } = useLessonFilters();

  // Fetch lessons
  const {
    data: lessonsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllLessonsQuery(queryParams);

  // Fetch courses and milestones for filters
  const { data: courses = [], isLoading: isLoadingCourses } = useGetAllCoursesQuery({});
  const { data: milestones = [], isLoading: isLoadingMilestones } = useGetAllMilestonesQuery(
    course !== 'all' ? course : undefined
  );

  const lessons = lessonsData?.data || [];
  const meta = lessonsData?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("lessonPage.lessons")}
              </h1>
              <p className="text-muted-foreground">
                {t("lessonPage.manageAllLessons")}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/dashboard/lesson-create')}
            className="rounded-xl h-11 px-6 gap-2 gradient-primary shadow-glow hover:shadow-lg transition-shadow"
          >
            <Plus className="h-5 w-5" />
            {t("lessonPage.createLesson")}
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="mb-6">
          <LessonFilters
            search={search}
            status={status}
            type={type}
            course={course}
            milestone={milestone}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onTypeChange={setType}
            onCourseChange={setCourse}
            onMilestoneChange={setMilestone}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
            courses={courses?.data?.data}
            milestones={milestones?.data}
            isLoadingCourses={isLoadingCourses}
            isLoadingMilestones={isLoadingMilestones}
          />
        </div>

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive font-medium">
                {t("lessonPage.failedToLoad")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="h-4 w-4" />
              {t("lessonPage.retry")}
            </Button>
          </motion.div>
        )}

        {/* Loading Indicator for Refetching */}
        {isFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 flex items-center gap-2 text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">{t("lessonPage.updating")}</span>
          </motion.div>
        )}

        {/* Table */}
        <div className="mb-6">
          <LessonTable
            lessons={lessons}
            isLoading={isLoading}
            onRefetch={refetch}
          />
        </div>

        {/* Pagination */}
        <LessonPagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
