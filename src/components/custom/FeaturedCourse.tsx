
import  CourseCard  from '@/components/custom/CourseCard';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
const FeaturedCourse = () => {
  const {data }= useGetAllCoursesQuery({limit:3, page:1,isFeatured:true});
  const FeaturedCourse   = data?.data?.data || [];
    return (
            <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular courses chosen by millions of learners worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {FeaturedCourse?.map((course) => (
             <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/courses">
              <Button size="lg" variant="outline" className="group">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
};

export default FeaturedCourse;