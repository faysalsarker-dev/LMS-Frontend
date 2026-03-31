import { memo } from "react";
import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import type { ICourse } from "@/interface/course.types";

const EnrolledCourseCard = memo(({ course }: { course: ICourse }) => {
  const progress = course.progress || 0;

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group pt-0 md:p-3 relative">
      
      {/* clickable overlay */}
      <Link to={`/my-dashboard/course/video/${course._id}`} className="absolute inset-0 z-20" />

      {/* container (responsive layout switch) */}
      <div className="flex flex-col md:flex-row">
        
        {/* IMAGE */}
        <div className="relative h-40 md:h-auto md:w-1/2 overflow-hidden rounded-lg px-2 md:px-0">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          <Badge
            className="absolute top-3 right-3"
            variant={progress === 100 ? "default" : "secondary"}
          >
            {progress === 100 ? "Completed" : "In Progress"}
          </Badge>
        </div>

        {/* CONTENT */}
        <CardContent className="p-4 space-y-4 w-full">
          <div>
            <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h4>

            {course.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {course.description}
              </p>
            )}
          </div>

          {/* PROGRESS */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* BUTTON */}
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
            asChild
          >
            <Link to={`/my-dashboard/course/video/${course._id}`}>
              {progress === 100 ? "Review Course" : "Continue Learning"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
});

export default EnrolledCourseCard;