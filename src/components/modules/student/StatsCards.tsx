import { motion } from 'framer-motion';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CourseProgress } from '@/interface/student.types';

interface StatsCardsProps {
  progress: CourseProgress | undefined;
  isLoading: boolean;
}

const StatsCards = ({ progress, isLoading }: StatsCardsProps) => {
  const stats = [
    {
      label: 'Lessons Completed',
      value: progress ? `${progress?.overview?.totalLessonsCompleted}` : '—',
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Quiz Performance',
      value: progress ? `${progress.quizStats.passed} Passed / ${progress.quizStats.failed} Failed` : '—',
      icon: Award,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Average Marks',
      value: progress ? `${progress.assignmentStats?.avgMarks}%` : '—',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="stat-card h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold mt-1">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
