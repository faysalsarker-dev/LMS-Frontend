import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ICourse } from "@/interface";
import { CoursesTabSkeleton } from "./ProfileSkeleton";

interface CoursesTabProps {
  courses: ICourse[];
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 }
  }
};

export const CoursesTab = ({ courses, isLoading }: CoursesTabProps) => {
  if (isLoading) {
    return <CoursesTabSkeleton />;
  }

  if (!courses?.length) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                No Courses Yet
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                You haven't enrolled in any courses yet. Start your learning journey today!
              </p>
            </div>
            <Button asChild className="rounded-xl gap-2">
              <Link to="/courses">
                <BookOpen className="w-4 h-4" />
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            My Courses
            <Badge variant="secondary" className="ml-2">
              {courses.length}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/courses">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {courses.map((course) => (
            <motion.div key={course._id} variants={cardVariants}>
              <EnrolledCourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

const EnrolledCourseCard = ({ course }: { course: ICourse }) => {
  const progress = course.progress || Math.floor(Math.random() * 100);

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
          {course.instructor && (
            <p className="text-sm text-muted-foreground mt-1">
              by {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
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
          <Link to={`/courses/${course.slug || course._id}/learn`}>
            {progress === 100 ? 'Review Course' : 'Continue Learning'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
