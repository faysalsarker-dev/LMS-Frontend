/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Percent, 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useGetAnalyticsQuery } from '@/redux/features/promo/promo.api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  usage: {
    label: "Redemptions",
    color: "hsl(var(--primary))",
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Stat card component for reusability
const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  gradient,
  isLoading 
}: any) => (
  <Card className={`relative overflow-hidden border-none bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 group`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-foreground/80">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${gradient.replace('from-', 'bg-').split(' ')[0]}/10 group-hover:${gradient.replace('from-', 'bg-').split(' ')[0]}/20 transition-colors`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <>
          <Skeleton className="h-9 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </>
      ) : (
        <>
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </>
      )}
    </CardContent>
  </Card>
);

const StateAndChart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Build query params
  const queryParams = useMemo(() => ({
    year: selectedYear,
    isActive: filterStatus === "all" ? undefined : filterStatus === "active",
  }), [selectedYear, filterStatus]);

  // Fetch analytics data
  const { data, isLoading, isError, refetch } = useGetAnalyticsQuery(queryParams);

  // Extract data safely
  const stats = data?.data || {
    totalCodes: 0,
    activeCodes: 0,
    totalUsage: 0,
    avgDiscount: 0,
  };



  const chartData = data?.meta?.chartData || [];

console.log(chartData);


  // Generate year options (last 5 years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // Stats configuration
  const statsConfig = [
    {
      title: "Total Codes",
      value: stats.totalCodes,
      description: "All promo codes",
      icon: Percent,
      gradient: "from-primary/10 via-primary/5 to-background",
      iconColor: "text-primary",
    },
    {
      title: "Active Codes",
      value: stats.activeCodes,
      description: "Currently available",
      icon: TrendingUp,
      gradient: "from-green-500/10 via-green-500/5 to-background",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Usage",
      value: stats.totalUsage.toLocaleString(),
      description: "Total redemptions",
      icon: Users,
      gradient: "from-blue-500/10 via-blue-500/5 to-background",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Avg Discount",
      value: `${stats.avgDiscount}%`,
      description: "Average value",
      icon: Calendar,
      gradient: "from-purple-500/10 via-purple-500/5 to-background",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <>
      {/* Error Alert */}
      {isError && (
        <motion.div variants={item}>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Failed to load analytics data.{' '}
              </span>
              <button
                onClick={() => refetch()}
                className="text-sm underline hover:no-underline ml-4"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            gradient={stat.gradient}
            isLoading={isLoading}
          />
        ))}
      </motion.div>

      {/* Usage Chart */}
      <motion.div variants={item}>
        <Card className="border-none shadow-xl bg-gradient-to-br from-card via-card to-muted/10">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Usage Trends</CardTitle>
                  <CardDescription>Monthly promo code redemption statistics</CardDescription>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(Number(val))}>
                  <SelectTrigger className="w-[120px] bg-background/50 border-border/50">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="h-[350px] w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading chart data...</p>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[350px] w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Activity className="h-12 w-12 opacity-20" />
                  <p className="text-sm">No usage data available for {selectedYear}</p>
                </div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="stroke-border/50" 
                      vertical={false} 
                    />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs" 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      className="text-xs" 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [value.toLocaleString(), "Redemptions"]}
                      />} 
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorUsage)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default StateAndChart;