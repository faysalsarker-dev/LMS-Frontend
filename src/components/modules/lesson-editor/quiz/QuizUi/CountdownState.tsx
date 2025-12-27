
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';



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



export default function CountdownState({ seconds, total }: { seconds: number; total: number }) {
  const circumference = 2 * Math.PI * 45;
  const progress = ((total - seconds) / total) * circumference;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8 sm:p-12 text-center"
    >
      <motion.div variants={itemVariants} className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            className="stroke-muted"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            className="stroke-primary"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={seconds}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-foreground"
          >
            {seconds}
          </motion.span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 text-muted-foreground">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Get ready...</span>
      </motion.div>
    </motion.div>
  );
}