import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lesson {
  _id: string;
  title: string;
  isCompleted: boolean;
}

interface LessonNavigationProps {
  currentLesson: Lesson;
  currentIndex: number;
  totalLessons: number;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  isCompletingProgress: boolean;
  onComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function LessonNavigation({
  currentLesson,
  currentIndex,
  totalLessons,
  isFirstLesson,
  isLastLesson,
  isCompletingProgress,
  onComplete,
  onPrevious,
  onNext,
}: LessonNavigationProps) {
  return (
    <motion.div
      className="glass rounded-2xl p-4 mt-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Complete Button */}
      {!currentLesson.isCompleted ? (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            onClick={onComplete}
            disabled={isCompletingProgress}
            size="lg"
            className="w-full gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold h-14 text-base rounded-xl"
          >
            {isCompletingProgress ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving Progress...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark as Complete
              </>
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center justify-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <CheckCircle className="h-6 w-6 text-success" />
          </motion.div>
          <span className="text-success font-semibold">
            Lesson Completed
          </span>
          <Sparkles className="h-4 w-4 text-success" />
        </motion.div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={onPrevious}
          disabled={isFirstLesson}
          variant="outline"
          className={cn(
            "flex-1 h-12 rounded-xl font-medium transition-all",
            isFirstLesson ? "opacity-50" : "hover:bg-secondary"
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2 px-4">
          {Array.from({ length: Math.min(5, totalLessons) }).map((_, i) => {
            const lessonIndex = Math.max(0, Math.min(currentIndex - 2, totalLessons - 5)) + i;
            const isCurrentDot = lessonIndex === currentIndex;
            
            return (
              <motion.div
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  isCurrentDot 
                    ? "w-8 h-2 gradient-primary" 
                    : "w-2 h-2 bg-muted-foreground/30"
                )}
                animate={isCurrentDot ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            );
          })}
        </div>

        <Button
          onClick={onNext}
          disabled={isLastLesson}
          className={cn(
            "flex-1 h-12 rounded-xl font-medium",
            isLastLesson 
              ? "opacity-50 bg-primary" 
              : "gradient-primary hover:opacity-90"
          )}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Lesson Counter */}
      <p className="text-center text-sm text-muted-foreground">
        Lesson{" "}
        <span className="font-semibold text-foreground">
          {currentIndex + 1}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">{totalLessons}</span>
      </p>
    </motion.div>
  );
}