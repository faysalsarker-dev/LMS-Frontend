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
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="flex justify-center"
    >
      <Card className="relative w-80 sm:w-96 bg-card/80 backdrop-blur-lg border border-border/20 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
        {/* Header - User info and rating */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            {user?.profile ? (
              <AvatarImage src={user.profile} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm sm:text-base">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground italic">
              {displayCourse}
            </span>
            <div className="flex items-center mt-1">
              <ReactRating
                readonly
                initialRating={rating}
                emptySymbol={<Star className="w-4 h-4 text-muted" />}
                fullSymbol={
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                }
                fractions={2}
              />
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-2">
          <p className="italic border-l-2 border-primary/30 pl-3 text-foreground/80 line-clamp-4">
            “{review}”
          </p>
        </div>

        {/* Decorative Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
