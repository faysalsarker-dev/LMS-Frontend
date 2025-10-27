import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  UserCheck,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/utils/timezone';
import { useGetDashboardQuery } from '@/redux/features/overview/overview.api';
import { DashboardSkeleton } from '@/components/modules/super_admin/DashboardSkeleton';
import { DashboardCard } from '@/components/modules/super_admin/DashboardCard';
import { ChartCard } from '@/components/modules/super_admin/ChartCard';
import { UserRolesChart } from '@/components/modules/super_admin/charts/UserRolesChart';
import { PaymentMethodChart } from '@/components/modules/super_admin/charts/PaymentMethodChart';
import { CourseStatusChart } from '@/components/modules/super_admin/charts/CourseStatusChart';
import { CourseLevelsChart } from '@/components/modules/super_admin/charts/CourseLevelsChart';
import { CoursesTable } from '@/components/modules/super_admin/CoursesTable';
import { RecentEnrollmentsTable } from '@/components/modules/super_admin/RecentEnrollmentsTable';

const AdminDashboardOverview = () => {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Loading your analytics...</p>
          </div>
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load dashboard data. Please try again.
              <Button onClick={() => refetch()} variant="outline" size="sm" className="ml-4">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const { data: dashboardData } = data;

console.log(dashboardData);


  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome to your learning platform analytics
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total Users"
            value={formatNumber(dashboardData.users.total)}
            icon={Users}
            description={`${formatNumber(dashboardData.users.newThisMonth)} new this month`}
            delay={0}
          />
          <DashboardCard
            title="Total Courses"
            value={formatNumber(dashboardData.courses.total)}
            icon={BookOpen}
            description={`${dashboardData.courses.status.published} published`}
            delay={0.1}
          />
          <DashboardCard
            title="Total Enrollments"
            value={formatNumber(dashboardData.courses.totalEnrollments)}
            icon={UserCheck}
            description={`${formatNumber(dashboardData.enrollments.thisMonth)} this month`}
            delay={0.2}
          />
          <DashboardCard
            title="Average Rating"
            value={dashboardData.courses.averageRating}
            icon={Award}
            description={`${dashboardData.courses.totalRatedCourses} rated courses`}
            delay={0.3}
          />
          <DashboardCard
            title="Active Enrollments"
            value={formatNumber(dashboardData.enrollments.status.active)}
            icon={TrendingUp}
            description={`${dashboardData.enrollments.completionRate}% completion rate`}
            delay={0.4}
          />
          <DashboardCard
            title="Total Revenue"
            value={`$${formatNumber(dashboardData.revenue.totalRevenue)}`}
            icon={DollarSign}
            description={`${dashboardData.revenue.currency} • ${formatNumber(dashboardData.revenue.totalTransactions)} transactions`}
            delay={0.5}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="User Roles Distribution"
            description="Distribution of users by role"
            delay={0.6}
          >
            <UserRolesChart data={dashboardData.users.roles} />
          </ChartCard>

          <ChartCard
            title="Payment Methods"
            description="Preferred payment methods"
            delay={0.7}
          >
            <PaymentMethodChart data={dashboardData.enrollments.paymentMethods} />
          </ChartCard>

          <ChartCard
            title="Course Status"
            description="Courses by publication status"
            delay={0.8}
          >
            <CourseStatusChart data={dashboardData.courses.status} />
          </ChartCard>

          <ChartCard
            title="Course Levels"
            description="Distribution by difficulty level"
            delay={0.9}
          >
            <CourseLevelsChart data={dashboardData.courses.levels} />
          </ChartCard>
        </div>

        {/* Popular Courses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <ChartCard title="Popular Courses" description="Top performing courses by enrollment">
            <CoursesTable courses={dashboardData.popularCourses} />
          </ChartCard>
        </motion.div>

        {/* Recent Enrollments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <ChartCard
            title="Recent Enrollments"
            description="Latest student enrollments with timezone-aware timestamps"
          >
            <RecentEnrollmentsTable enrollments={dashboardData.recentEnrollments} />
          </ChartCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
