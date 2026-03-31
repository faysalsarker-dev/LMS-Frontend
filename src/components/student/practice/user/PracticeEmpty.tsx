import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import NoDataFound from "@/components/shared/NoDataFound";

export const PracticeEmpty = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <NoDataFound 
        message="No practice items yet" 
        icon={<BookOpen className="w-12 h-12 text-muted-foreground" />}
      >
        <p className="text-muted-foreground max-w-sm mt-2">
          This practice doesn't have any items to learn yet. Check back soon!
        </p>
      </NoDataFound>
    </motion.div>
  );
};
