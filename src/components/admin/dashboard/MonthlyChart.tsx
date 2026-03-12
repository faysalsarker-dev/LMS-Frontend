import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, BarChart3, Wallet } from 'lucide-react';
import type { MonthlyChartData } from '@/interface/dashboard.types';

interface MonthlyChartProps {
  data: MonthlyChartData[] | undefined;
  currency: string;
  isLoading: boolean;
}


const COLORS = {
  enrollments: {
    stroke: '#6366f1',
    gradientStart: '#818cf8',
    gradientEnd: '#6366f1',
  },
  earnings: {
    stroke: '#10b981',
    gradientStart: '#34d399',
    gradientEnd: '#10b981',
  },
};

const formatCurrency = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
};

const formatCompact = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-md p-4 shadow-xl min-w-[200px]">
      <p className="mb-3 text-sm font-semibold text-foreground border-b border-border/40 pb-2">
        {label}
      </p>
      <div className="space-y-2.5">
        {payload.map((entry: { dataKey: string; value: number; color: string }) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-popover"
                style={{ backgroundColor: entry.color, '--tw-ring-color': `${entry.color}40` } as React.CSSProperties}
              />
              <span className="text-xs font-medium capitalize text-muted-foreground">
                {entry.dataKey}
              </span>
            </div>
            <span className="text-sm font-bold tabular-nums text-foreground">
              {entry.dataKey === 'earnings'
                ? formatCurrency(entry.value, currency)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDot = (props: any) => {
  const { cx, cy, dataKey } = props;
  const color = dataKey === 'enrollments' ? COLORS.enrollments.stroke : COLORS.earnings.stroke;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="hsl(var(--card))" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.15} />
    </g>
  );
};

export const MonthlyChart = ({ data, currency, isLoading }: MonthlyChartProps) => {
  // Calculate summary stats from the chart data
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const totalEnrollments = data.reduce((sum, d) => sum + d.enrollments, 0);
    const totalEarnings = data.reduce((sum, d) => sum + d.earnings, 0);
    const avgEnrollments = Math.round(totalEnrollments / data.length);
    return { totalEnrollments, totalEarnings, avgEnrollments };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex gap-6 mb-6">
            <Skeleton className="h-16 w-40 rounded-xl" />
            <Skeleton className="h-16 w-40 rounded-xl" />
            <Skeleton className="h-16 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Monthly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[350px] items-center justify-center">
          <p className="text-muted-foreground">No chart data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Monthly Enrollments & Earnings
              </CardTitle>
              <CardDescription className="mt-1">
                Performance overview for the last {data.length} months
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Mini Summary Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-3 mb-6"
            >
              <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-medium text-muted-foreground">Total Enrollments</span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {stats.totalEnrollments.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-muted-foreground">Total Earnings</span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {formatCurrency(stats.totalEarnings, currency)}
                </p>
              </div>
              <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-xs font-medium text-muted-foreground">Avg / Month</span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {stats.avgEnrollments}
                  <span className="text-xs font-normal text-muted-foreground ml-1">enrollments</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Chart */}
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="enrollmentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.enrollments.gradientStart} stopOpacity={0.4} />
                    <stop offset="50%" stopColor={COLORS.enrollments.gradientEnd} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={COLORS.enrollments.gradientEnd} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.earnings.gradientStart} stopOpacity={0.4} />
                    <stop offset="50%" stopColor={COLORS.earnings.gradientEnd} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={COLORS.earnings.gradientEnd} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 6"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.12}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                  tickFormatter={(v: string) => {
                    const parts = v.split(' ');
                    return parts[0]?.substring(0, 3) || v;
                  }}
                />

                <YAxis
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tickFormatter={(value) => formatCompact(value)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                  tickFormatter={(value) => `$${formatCompact(value)}`}
                />

                <Tooltip
                  content={<CustomTooltip currency={currency} />}
                  cursor={{
                    stroke: 'hsl(var(--muted-foreground))',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                    strokeOpacity: 0.4,
                  }}
                />

                <Legend
                  wrapperStyle={{ paddingTop: '16px' }}
                  formatter={(value: string) => (
                    <span className="text-xs font-medium capitalize text-muted-foreground ml-1">
                      {value}
                    </span>
                  )}
                  iconType="circle"
                  iconSize={8}
                />

                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="enrollments"
                  stroke={COLORS.enrollments.stroke}
                  strokeWidth={2.5}
                  fill="url(#enrollmentsGradient)"
                  activeDot={<CustomDot dataKey="enrollments" />}
                  dot={false}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="earnings"
                  stroke={COLORS.earnings.stroke}
                  strokeWidth={2.5}
                  fill="url(#earningsGradient)"
                  activeDot={<CustomDot dataKey="earnings" />}
                  dot={false}
                  animationDuration={1400}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
