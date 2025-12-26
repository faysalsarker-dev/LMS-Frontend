import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface CourseHeaderProps {
  title: string;
  currentLessonTitle: string;

}

export function CourseHeader({
  title,
  currentLessonTitle,

}: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      className=" border-b mt-2 bg-background/50 "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0 hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
              <h1 className="font-display text-lg font-semibold text-foreground truncate">
                {title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="truncate">{currentLessonTitle}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Progress */}
        
        </div>

     
      </div>
    </motion.header>
  );
}