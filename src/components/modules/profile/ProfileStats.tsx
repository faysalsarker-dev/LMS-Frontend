import { motion } from "framer-motion";
import { BookOpen, Heart, Award, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  enrolledCourses: number;
  wishlistCount: number;
  completedCourses?: number;
  hoursLearned?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const stats = [
  {
    key: 'enrolled',
    label: 'Enrolled Courses',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'wishlist',
    label: 'Wishlist Items',
    icon: Heart,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500/10',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: Award,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
  },
  {
    key: 'hours',
    label: 'Hours Learned',
    icon: Clock,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
  },
];

export const ProfileStats = ({ 
  enrolledCourses, 
  wishlistCount, 
  completedCourses = 0, 
  hoursLearned = 0 
}: ProfileStatsProps) => {
  const values: Record<string, number> = {
    enrolled: enrolledCourses,
    wishlist: wishlistCount,
    completed: completedCourses,
    hours: hoursLearned,
  };

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      variants={itemVariants}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.bgColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('rose') ? '#f43f5e' : stat.color.includes('emerald') ? '#10b981' : '#f59e0b' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {values[stat.key]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
