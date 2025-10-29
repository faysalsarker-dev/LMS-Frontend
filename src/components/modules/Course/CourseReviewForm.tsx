import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import toast from "react-hot-toast";
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { User } from "lucide-react";
import { useAddToWishlistMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";

interface CourseReviewFormProps {
  courseId: string;
}

interface ReviewFormValues {
  review: string;
}

const CourseReviewForm: React.FC<CourseReviewFormProps> = ({ courseId }) => {
  const { data } = useUserInfoQuery({});
  const [addReview, { isLoading }] = useAddToWishlistMutation();
  const { register, handleSubmit, reset } = useForm<ReviewFormValues>();
  const [rating, setRating] = useState<number>(0);
const userInfo = data.data;
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
handleApiError(err)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl p-6 max-w-2xl w-full mx-auto"
    >
      <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
        Share Your Experience
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* User Info */}
        {userInfo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            {userInfo?.profile ? (
              <img
                src={userInfo.profile}
                alt={userInfo.name || "User Avatar"}
                className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {userInfo.name || "Anonymous User"}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.email}
              </p>
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 italic">
            Please login to share your experience.
          </p>
        )}

        {/* Review Input */}
        <div className="space-y-2">
          <label
            htmlFor="review"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Your Review
          </label>
          <textarea
            {...register("review", { required: "Please write your review" })}
            placeholder="Write your thoughts about this course..."
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
            rows={4}
          />
        </div>

        {/* Star Rating */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Rate this course:</span>
          <Rating
            style={{ maxWidth: 250 }}
            value={rating}
            onChange={setRating}
            itemStyles={{
              itemShapes: 'star',
              activeFillColor: '#facc15',
              inactiveFillColor: '#cbd5e1'
            }}
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
