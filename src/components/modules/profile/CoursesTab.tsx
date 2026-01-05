import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ICourse } from "@/interface";
import { CoursesTabSkeleton } from "./ProfileSkeleton";
import EnrolledCourseCard from "@/components/shared/EnrolledCourseCard";

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


