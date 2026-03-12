import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import _Rating from "react-rating";
import { User, Star } from "lucide-react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";
import { useCreateTestimonialMutation } from "@/redux/features/testimonial/testimonial.api";

interface CourseReviewFormProps {
  courseId: string;
}

interface ReviewFormValues {
  review: string;
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactRating = _Rating as unknown as React.FC<any>;

const CourseReviewForm: React.FC<CourseReviewFormProps> = ({ courseId }) => {
  const { data } = useUserInfoQuery({});
  const [addReview, { isLoading }] = useCreateTestimonialMutation();
  const { register, handleSubmit, reset } = useForm<ReviewFormValues>();
  const [rating, setRating] = useState<number>(0);
  const userInfo = data?.data;

  const onSubmit = async (data: ReviewFormValues) => {
    if (!userInfo?._id) {
      toast.error("Please login to submit your review.");
      return;
    }

    try {
      const payload = {
        courseId,
        userId: userInfo._id,
        rating,
        review: data.review,
      };

      await addReview(payload).unwrap();
      toast.success("Thank you for your valuable feedback!");
      reset();
      setRating(0);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl p-6"
    >
      <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
        Share Your Experience
      </h3>

      {userInfo ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-4 mb-4 border-b pb-4"
        >
          {userInfo?.profile ? (
            <img
              src={userInfo.profile}
              alt={userInfo.name || "User Avatar"}
              className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              {userInfo.name || "Anonymous"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.email}</p>
          </div>
        </motion.div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 italic mb-4">
          Please login to share your experience.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Review Textarea */}
        <textarea
          {...register("review", { required: "Please write your review" })}
          placeholder="Write your thoughts about this course..."
          rows={4}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-gray-800 dark:text-gray-100 placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Star Rating */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Rate this course:
          </span>
          <ReactRating
            readonly={false}
            initialRating={rating}
            onChange={setRating}

            emptySymbol={<Star className="w-5 h-5 text-gray-300" />}
            fullSymbol={<Star className="w-5 h-5 text-secondary fill-secondary" />}
            fractions={2}
            isHalf={true}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CourseReviewForm;
