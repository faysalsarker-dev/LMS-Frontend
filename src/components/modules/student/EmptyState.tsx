import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="p-6 rounded-full bg-primary/5 mb-6"
      >
        <Icon className="h-12 w-12 text-primary" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && (
        <Button>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
