import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  BookOpen,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useGetDashboardQuery } from '@/redux/features/overview/overview.api';
import { StatCard } from '@/components/modules/adminDashboard/StatCard';

import { MonthlyChart } from '@/components/modules/adminDashboard/MonthlyChart';
import { RecentEnrollmentsTable } from '@/components/modules/adminDashboard/RecentEnrollmentsTable';
import { PopularCoursesTable } from '@/components/modules/adminDashboard/PopularCoursesTable';
import type { CurrencyEarnings } from '@/interface/dashboard.types';


const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
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

const OverViewPage = () => {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery({});

  const dashboardData = data?.data;
  const earningsByCurrency = dashboardData?.totalEarningsByCurrency || [];
  const currency = earningsByCurrency[0]?.currency || 'USD';

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
              label="Total Users"
              value={dashboardData?.totalUsers?.toLocaleString() || '—'}
              icon={Users}
              variant="primary"
              index={0}
            />
            <StatCard
              label="Total Courses"
              value={dashboardData?.totalCourses?.toLocaleString() || '—'}
              icon={BookOpen}
              variant="accent"
              index={1}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="h-full sm:col-span-2 lg:col-span-2"
            >
              <Card className="h-full transition-shadow duration-300 hover:shadow-success-glow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                      {earningsByCurrency.length > 0 ? (
                        <div className="space-y-2">
                          {earningsByCurrency.map((item: CurrencyEarnings) => (
                            <div key={item.currency} className="flex items-center justify-between gap-4">
                              <span className="text-2xl font-bold tracking-tight">
                                {formatCurrency(item.total, item.currency)}
                              </span>
                              <Badge variant="outline" className="text-xs font-medium shrink-0">
                                {item.currency}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-2xl font-bold tracking-tight text-muted-foreground">—</p>
                      )}
                    </div>
                    <div className="rounded-xl p-3 bg-success/10 ml-4">
                      <DollarSign className="h-6 w-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

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

export default OverViewPage;
