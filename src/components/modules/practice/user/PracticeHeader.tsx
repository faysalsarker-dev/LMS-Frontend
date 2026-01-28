import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Practice } from "@/types/practice";

interface PracticeHeaderProps {
  practice: Practice;
}

export const PracticeHeader = ({ practice }: PracticeHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video sm:aspect-[3/1] rounded-2xl overflow-hidden mb-6 shadow-card">
        <img
          src={practice.thumbnail}
          alt={practice.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium text-muted-foreground mb-2">
            <BookOpen className="w-3 h-3" />
            {practice.course.title}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          {practice.title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
          {practice.description}
        </p>
      </div>
    </motion.header>
  );
};
