
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import CourseReviewForm from "./CourseReviewForm";
import { useGetCourseReviewSummaryQuery } from "@/redux/features/testimonial/testimonial.api";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { motion } from 'framer-motion';
import _Rating from "react-rating";

interface Review {
  name: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface ReviewsProps {
  avRatting?: number;
  courseId: string;
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactRating = _Rating as unknown as React.FC<any>;


const Reviews = ({ avRatting = 4.8, courseId }: ReviewsProps) => {
  const { data, isLoading } = useGetCourseReviewSummaryQuery(courseId);

  const reviews: Review[] = data?.data?.topTestimonials || [];
  const totalReviews: number = data?.data?.totalReviews || 0;
console.log(reviews);
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Student Reviews </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: avRatting }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 fill-current text-secondary"
                  />
                ))}
              </div>
              <span className="font-semibold">{avRatting.toFixed(1)} ({totalReviews}) reviews</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            // Skeleton Loading
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-md" />
            ))
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            // Animate reviews using Framer Motion
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                     key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                
                 className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {review?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review?.name || "Anonymous"}</span>
                        <div className="flex items-center gap-1">
                         <ReactRating
                               readonly
                               initialRating={review.rating}
                               emptySymbol={<Star className="w-4 h-4 text-gray-300" />}
                               fullSymbol={<Star className="w-4 h-4 text-secondary fill-secondary" />}
                               fractions={2}
                             />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(review?.createdAt,"MMM dd, yyyy")}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review?.review}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <CourseReviewForm courseId={courseId} />
      </div>
    </>
  );
};

export default Reviews;
