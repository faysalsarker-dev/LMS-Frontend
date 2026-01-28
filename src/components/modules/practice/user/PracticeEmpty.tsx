import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export const PracticeEmpty = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No practice items yet
      </h2>
      <p className="text-muted-foreground max-w-sm">
        This practice doesn't have any items to learn yet. Check back soon!
      </p>
    </motion.div>
  );
};
