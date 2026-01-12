import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import {
  StatsCards,
  CourseSelector,
  ProgressSection,
  AssignmentsTable,
  ErrorState,
  EmptyState,
} from '@/components/modules/student';
import { useGetMyEnrolledCoursesQuery } from '@/redux/features/course/course.api';
import { useGetProgressQuery } from '@/redux/features/progress/progress.api';

const StudentDashboard = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();

  // Fetch enrolled courses
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    isError: isCoursesError,
    refetch: refetchCourses,
  } = useGetMyEnrolledCoursesQuery({});

  // Auto-select last course when courses are loaded
  useEffect(() => {
    if (coursesData?.data && coursesData?.data?.length > 0 && !selectedCourseId) {
      const lastCourse = coursesData.data[coursesData.data.length - 1];
      setSelectedCourseId(lastCourse._id);
    }
  }, [coursesData, selectedCourseId]);

  // Fetch progress for selected course
  const {
    data: progressData,
    isLoading: isLoadingProgress,
    isFetching: isFetchingProgress,
    isError: isProgressError,
    refetch: refetchProgress,
  } = useGetProgressQuery(selectedCourseId ?? '', {
    skip: !selectedCourseId,
  });
  const isLoadingProgressState = isLoadingProgress || isFetchingProgress;

  // Handle course change
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    console.log('Selected Course ID changed to:', courseId);
  };

  // Error state for courses
  if (isCoursesError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState
            title="Failed to load courses"
            message="We couldn't fetch your enrolled courses. Please check your connection and try again."
            onRetry={refetchCourses}
          />
        </div>
      </div>
    );
  }

  // Empty state - no courses
  if (!isLoadingCourses && coursesData?.courses?.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <EmptyState type="courses" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Track your learning progress and achievements</p>
          </div>
          <CourseSelector
            courses={coursesData?.data}
            selectedCourseId={selectedCourseId}
            onCourseChange={handleCourseChange}
            isLoading={isLoadingCourses}
          />
        </motion.header>

        {/* Error state for progress */}
        {isProgressError && selectedCourseId && (
          <ErrorState
            title="Failed to load progress"
            message="We couldn't fetch the progress for this course."
            onRetry={refetchProgress}
          />
        )}

        {/* Stats Cards */}
        <StatsCards progress={progressData?.data} isLoading={isLoadingProgressState} />

        {/* Progress Section */}
        <ProgressSection progress={progressData?.data} isLoading={isLoadingProgressState} />

        {/* Assignments Table */}
        <AssignmentsTable progress={progressData?.data} isLoading={isLoadingProgressState} />
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
