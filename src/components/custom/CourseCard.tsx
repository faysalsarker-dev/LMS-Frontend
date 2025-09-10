import { Card, CardContent } from '@/components/ui/card';
import { Clock, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const CourseCard = () => {
  return (
    <Card
      className="py-0 group overflow-hidden rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image */}
      <div className="relative p-3">
        <img
          src={"https://s.udemycdn.com/career-academies/product-cards/career-card-fswd.png"}
          alt={"Course Image"}
          className="w-full h-48 object-cover rounded-lg"
        />
        {/* Badge (optional - trending/new etc) */}
        {/* {course.badge && (
          <span className="absolute top-3 left-3 bg-gradient-primary text-white text-xs font-medium px-2 py-1 rounded-full shadow">
            {course.badge}
          </span>
        )} */}
      </div>

      {/* Card Content */}
      <CardContent className="p-5 -mt-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition">
         iOS 16 & Swift 5 - The Complete iOS App Development
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            98,543
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
6 month          </div>
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mb-4">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(4.8)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{4.8}</span>
          </div>

          {/* Price */}
          <div className="text-right">
            {/* {course.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ${course.originalPrice}
              </div>
            )} */}
            <div className="font-bold text-lg text-foreground">
              $30
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/courses/dfhasidufrrer`} className="block">
          <Button className="w-full bg-gradient-primary hover:opacity-90">
            View Course
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
