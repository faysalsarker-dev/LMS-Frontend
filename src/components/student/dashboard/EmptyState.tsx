import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoDataFound from '@/components/shared/NoDataFound';

interface EmptyStateProps {
  type: 'courses' | 'assignments';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const content = {
    courses: {
      icon: GraduationCap,
      title: 'No Courses Enrolled',
      description: 'You haven\'t enrolled in any courses yet. Explore our catalog to find courses that interest you.',
      actionLabel: 'Browse Courses',
    },
    assignments: {
      icon: BookOpen,
      title: 'No Assignments',
      description: 'No assignments or quizzes are available for this course yet. Check back later!',
      actionLabel: null,
    },
  };

  const { icon: Icon, title, description, actionLabel } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <NoDataFound 
        message={title}
        icon={
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="p-6 rounded-full bg-primary/5 shadow-sm"
          >
            <Icon className="h-12 w-12 text-primary" />
          </motion.div>
        }
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground max-w-md">{description}</p>
          {actionLabel && (
            <Button>
              {actionLabel}
            </Button>
          )}
        </div>
      </NoDataFound>
    </motion.div>
  );
};

export default EmptyState;
