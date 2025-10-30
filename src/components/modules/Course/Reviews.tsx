import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import CourseReviewForm from "./CourseReviewForm";
import {
  useGetCourseReviewSummaryQuery,
  useGetMyTestimonialsQuery,
} from "@/redux/features/testimonial/testimonial.api";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import _Rating from "react-rating";
import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ITestimonial } from "@/interface";


interface ReviewsProps {
  avRatting?: number;
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactRating = _Rating as unknown as React.FC<any>;

const Reviews = ({ avRatting, courseId }: ReviewsProps) => {
  const { data, isLoading } = useGetCourseReviewSummaryQuery(courseId);
  const {
    data: myReviewRes,
    isLoading: myReviewLoading,
  } = useGetMyTestimonialsQuery(courseId);

  const reviews: ITestimonial[] = data?.data?.topTestimonials || [];
  const totalReviews = data?.data?.totalReviews || 0;
  const myReview = myReviewRes?.data as ITestimonial | undefined;
  console.log(myReview);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Student Reviews</CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ReactRating
                        readonly
                        initialRating={avRatting}
                        emptySymbol={<Star className="w-5 h-5 text-gray-300" />}
                        fullSymbol={
                          <Star className="w-5 h-5 text-secondary fill-secondary" />
                        }
                        fractions={2}
                      />
            </div>
            <span className="font-semibold">
              {avRatting?.toFixed(1) || 0} ({totalReviews}) reviews
            </span>
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
          // Animated Reviews
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="border-b pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {review?.user?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {review?.user?.name || "Anonymous"}
                      </span>
                      <ReactRating
                        readonly
                        initialRating={review.rating}
                        emptySymbol={<Star className="w-4 h-4 text-gray-300" />}
                        fullSymbol={
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                        }
                        fractions={2}
                      />
                      <span className="text-xs text-muted-foreground">
                        {format(review.createdAt, "MMM dd, yyyy")}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {review?.review}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        <hr className="my-4" />

        {/* My Review Section */}
        {myReviewLoading ? (
          <Skeleton className="h-24 rounded-md" />
        ) : myReview ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="border-b pb-6 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  {myReview?.user?.name?.charAt(0) || "A"} 
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold">
                    {myReview?.user?.name || "Anonymous"}
                  </span>
                  <ReactRating
                    readonly
                    initialRating={myReview.rating}
                    emptySymbol={<Star className="w-4 h-4 text-gray-300" />}
                    fullSymbol={
                      <Star className="w-4 h-4 text-secondary fill-secondary" />
                    }
                    fractions={2}
                  />
                  <span className="text-xs text-muted-foreground">
                    {format(myReview.createdAt, "MMM dd, yyyy")}<Badge className="ml-2 bg-green-200 border-green-500 text-green-600">Your Review </Badge>
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {myReview?.review}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6">
            <CourseReviewForm courseId={courseId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Reviews;
