import { motion } from 'framer-motion';
import { Clock, BookOpen, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CheckoutCourse } from '@/interface/checkout.types';

interface CourseCardProps {
  course: CheckoutCourse;
}

export function CourseCard({ course }: CourseCardProps) {


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-md">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          {course.isDiscounted && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-destructive text-destructive-foreground font-semibold">
                Sale
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Level Badge */}
          {/* {course.level && (
            <Badge 
              variant="secondary" 
              className={levelColors[course.level]}
            >
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          )} */}

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          )}


          {/* Course Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            {course.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{course.duration}h</span>
              </div>
            )}
            {course.totalLectures && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>{course.totalLectures} lectures</span>
              </div>
            )}
            {course.certificateAvailable && (
              <div className="flex items-center gap-1.5 text-success">
                <Award className="h-4 w-4" />
                <span>Certificate</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
