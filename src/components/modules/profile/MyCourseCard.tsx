import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router";
import type { ICourse } from "@/interface";

interface CourseCardProps {
  course: ICourse;
}

const MyCourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="group relative overflow-hidden border border-border bg-gradient-to-br from-background to-muted/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.jpg"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-3">
        <h3 className="font-semibold text-lg leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available."}
        </p>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>33%</span>
          </div>
          <Progress value={33} className="h-2" />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 pt-0">
        <Link to={`/my-course/${course.slug}`} className="w-full">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            size="sm"
          >
            Continue Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MyCourseCard;
