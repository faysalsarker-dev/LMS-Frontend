import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import type { ICourse } from "@/interface";

const EnrolledCourseCard = ({ course }: { course: ICourse  }) => {

  const progress = course.progress  || 0;

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail || '/placeholder.svg'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Badge className="absolute top-3 right-3" variant={progress === 100 ? "default" : "secondary"}>
          {progress === 100 ? 'Completed' : 'In Progress'}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-4">
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
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full rounded-xl gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
          asChild
        >
          <Link to={`/course/video/${course._id}`}>
            {progress === 100 ? 'Review Course' : 'Continue Learning'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnrolledCourseCard;