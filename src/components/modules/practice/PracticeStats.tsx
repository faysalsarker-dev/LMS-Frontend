import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, CheckCircle, Layers, TrendingUp } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const StatCardSkeleton = () => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PracticeStats = () => {
  const { data: stats, isLoading } = useGetPracticeStatsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Practices',
      value: stats?.totalPractices ?? 0,
      icon: BookOpen,
      gradient: 'from-primary to-accent',
      bgClass: 'bg-primary/10',
    },
    {
      label: 'Active Practices',
      value: stats?.activePractices ?? 0,
      icon: CheckCircle,
      gradient: 'from-success to-accent',
      bgClass: 'bg-success/10',
    },
    {
      label: 'Total Items',
      value: stats?.totalItems ?? 0,
      icon: Layers,
      gradient: 'from-accent to-primary',
      bgClass: 'bg-accent/10',
    },
    {
      label: 'Most Used',
      value: stats?.mostUsedPractice?.usageCount ?? 0,
      icon: TrendingUp,
      gradient: 'from-warning to-destructive',
      bgClass: 'bg-warning/10',
      subtitle: stats?.mostUsedPractice?.title?.slice(0, 20),
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {statItems.map((stat, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="relative overflow-hidden border-0 bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
            />
            <CardContent className="relative p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgClass}`}
                >
                  <stat.icon className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
