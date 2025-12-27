import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const buttonHoverVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export default function IdleState({ onStart, hasTimer }: { onStart: () => void; hasTimer: boolean }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8 sm:p-12 text-center"
    >
      <motion.div
        variants={itemVariants}
        className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-glow"
      >
        <Play className="w-10 h-10 text-primary-foreground ml-1" />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
      >
        Ready to Test Your Knowledge?
      </motion.h2>

      <motion.p variants={itemVariants} className="text-muted-foreground mb-8 max-w-md mx-auto">
        {hasTimer
          ? "A countdown will begin before the quiz starts. Take your time and think carefully!"
          : "Click the button below to begin the quiz. Good luck!"}
      </motion.p>

      <motion.div variants={itemVariants}>
        <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
          <Button
            onClick={onStart}
            size="lg"
            className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-glow hover:shadow-lg transition-shadow"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 