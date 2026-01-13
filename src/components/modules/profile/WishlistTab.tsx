import { motion } from "framer-motion";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ICourse } from "@/interface/course.types";
import { CoursesTabSkeleton } from "./ProfileSkeleton";

interface WishlistTabProps {
  wishlist: ICourse[];
  isLoading: boolean;
  onRemoveFromWishlist?: (courseId: string) => void;
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

export const WishlistTab = ({ wishlist, isLoading }: WishlistTabProps) => {
  if (isLoading) {
    return <CoursesTabSkeleton />;
  }

  if (!wishlist?.length) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Your Wishlist is Empty
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Save courses you're interested in to your wishlist for easy access later.
              </p>
            </div>
            <Button asChild className="rounded-xl gap-2">
              <Link to="/courses">
                <Heart className="w-4 h-4" />
                Explore Courses
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
            <Heart className="w-5 h-5 text-rose-500" />
            My Wishlist
            <Badge variant="secondary" className="ml-2">
              {wishlist.length}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/courses">
              Browse More
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
          {wishlist.map((course) => (
            <motion.div key={course._id} variants={cardVariants}>
              <WishlistCourseCard 
                course={course} 
              />
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

const WishlistCourseCard = ({
  course,
}: {
  course: ICourse;
}) => {
  const finalPrice =
    course.isDiscounted && course.discountPrice
      ? course.discountPrice
      : course.price;

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Discount badge */}
        {course.isDiscounted && (
          <Badge className="absolute top-3 left-3 bg-rose-500 text-white">
            {Math.round(
              ((course.price - (course.discountPrice ?? 0)) /
                course.price) *
                100
            )}
            % OFF
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h4>

        {/* Rating */}
        {course.averageRating && (
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <span>★</span>
            <span className="font-medium">
              {course.averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({course.totalEnrolled})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {finalPrice === 0 ? "Free" : `$${finalPrice}`}
          </span>

          {course.isDiscounted && (
            <span className="text-sm line-through text-muted-foreground">
              ${course.price}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button asChild size="sm" className="w-full rounded-xl gap-2">
          <Link to={`/courses/${course.slug}`}>
            <ShoppingCart className="w-4 h-4" />
            View Course
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
