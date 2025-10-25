import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router";
import type { ICourse } from "@/interface";
import { useGetProgressQuery } from "@/redux/features/progress/progress.api";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCardProps {
  course: ICourse;
}

const MyCourseCard = ({ course }: CourseCardProps) => {
  const courseId = course?._id
const {data,isLoading}=useGetProgressQuery(courseId)



  return (
    <Card className="group p-0 relative overflow-hidden border border-border bg-gradient-to-br from-background to-muted/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden p-2">
        <img
          src={course.thumbnail || "/placeholder.jpg"}
          alt={course.title}
          className="w-full h-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <CardContent className="p-5 pt-0 space-y-3">
        <h3 className="font-semibold text-lg leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available."}
        </p>

{
isLoading?(
   <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <Skeleton className="w-full"/>
           
          </div>
                     <Skeleton className="w-full"/>

        </div>
):(

    <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{data?.data?.progressPercentage}%</span>
          </div>
          <Progress value={data?.data?.progressPercentage} className="h-2" />
        </div>
)
}


      
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 pt-0">
        <Link to={`/course/video/${course._id}`} className="w-full">
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



export const MyCourseCardLg = ({ course }: CourseCardProps) => {
  const courseId = course?._id
const {data,isLoading}=useGetProgressQuery(courseId)


  return (
    <Card className="group p-3 relative overflow-hidden border border-border bg-gradient-to-br from-background to-muted/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl grid grid-cols-2 ">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden p-2">
        <img
          src={course.thumbnail || "/placeholder.jpg"}
          alt={course.title}
          className="w-full h-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
  <div>
        <CardContent className="p-5  space-y-3">
          <h3 className="font-semibold text-lg leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {course.title}
          </h3>
  <p>
          {course.description?.slice(0,400) || "No description available."}.....
  </p>

  {
  isLoading?(
     <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <Skeleton className="w-full"/>
             
            </div>
                       <Skeleton className="w-full"/>
  
          </div>
  ):(
  
      <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{data?.data?.progressPercentage}%</span>
            </div>
            <Progress value={data?.data?.progressPercentage} className="h-2" />
          </div>
  )
  }
  
  
        
        </CardContent>
    <CardFooter className="p-5 pt-0">
          <Link to={`/course/video/${course._id}`} className="w-full">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              size="sm"
            >
              Continue Course
            </Button>
          </Link>
        </CardFooter>
  </div>
      {/* Footer */}
    
    </Card>
  );
};