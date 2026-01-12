import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useGetDashboardQuery } from '@/redux/features/overview/overview.api';
import { StatCard } from '@/components/modules/adminDashboard/StatCard';
import { UserStatsSection } from '@/components/modules/adminDashboard/UserStatsSection';
import { MonthlyChart } from '@/components/modules/adminDashboard/MonthlyChart';
import { RecentEnrollmentsTable } from '@/components/modules/adminDashboard/RecentEnrollmentsTable';
import { PopularCoursesTable } from '@/components/modules/adminDashboard/PopularCoursesTable';


const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const AdminDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery({});

  const dashboardData = data?.data;
  const currency = dashboardData?.summary.currency || 'USD';

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Failed to load dashboard</h2>
          <p className="text-muted-foreground max-w-sm">
            There was an error loading your dashboard data. Please try again.
          </p>
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's what's happening with your platform.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2 self-start"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>

          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Courses"
              value={dashboardData?.summary?.totalCourses?.toLocaleString() || '—'}
              icon={BookOpen}
              variant="primary"
              index={0}
            />
            <StatCard
              label="Total Enrollments"
              value={dashboardData?.summary?.totalEnrolments?.toLocaleString() || '—'}
              icon={GraduationCap}
              variant="accent"
              index={1}
            />
            <StatCard
              label="Total Earnings"
              value={
                dashboardData
                  ? formatCurrency(dashboardData?.summary?.totalEarnings, currency)
                  : '—'
              }
              icon={DollarSign}
              variant="success"
              index={2}
            />
            <StatCard
              label="Total Students"
              value={dashboardData?.summary?.totalStudents?.toLocaleString() || '—'}
              icon={Users}
              variant="warning"
              index={3}
            />
          </div>

          {/* User Stats Section */}
          <UserStatsSection userStats={dashboardData?.userStats} isLoading={isLoading} />

          {/* Monthly Chart */}
          <MonthlyChart
            data={dashboardData?.monthlyChart}
            currency={currency}
            isLoading={isLoading}
          />

          {/* Tables Grid */}
          <div className="grid gap-6">
            <PopularCoursesTable
              courses={dashboardData?.popularCourses}
              isLoading={isLoading}
            />
            <RecentEnrollmentsTable
              enrollments={dashboardData?.recentEnrollments}
              isLoading={isLoading}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
