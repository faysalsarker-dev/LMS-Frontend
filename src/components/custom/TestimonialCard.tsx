import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import _Rating from "react-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import React from "react";
import type { ITestimonial } from "@/interface";




// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactRating = _Rating as unknown as React.FC<any>;

const TestimonialCard = ({ testimonial }: { testimonial: ITestimonial }) => {
  const { review, user, course, rating } = testimonial || {};
  const displayName = user?.name || "Anonymous";
  const displayCourse = course?.title || "Unknown Course";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="flex justify-center"
    >
      <Card className="p-6 w-80 shadow-lg hover:shadow-xl transition-all bg-card/70 backdrop-blur-lg border border-border/30 rounded-2xl">
        {/* Rating */}
        <div className="flex items-center justify-center mb-3">
          <ReactRating
            readonly
            initialRating={rating}
            emptySymbol={<Star className="w-5 h-5 text-gray-300" />}
            fullSymbol={<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
            fractions={2}
          />
        </div>

        {/* Review */}
        <p className="text-muted-foreground text-center mb-6 italic line-clamp-3 leading-relaxed">
          “{review}”
        </p>

        {/* User Info */}
        <div className="flex items-center gap-3 mt-auto justify-center">
          <Avatar className="w-10 h-10 ring-2 ring-primary/30">
            {user?.profile ? (
              <AvatarImage src={user.profile} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-center">
            <div className="font-semibold text-foreground">{displayName}</div>
            <div className="text-sm text-muted-foreground">
              {displayCourse}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
