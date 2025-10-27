import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Users, BookOpen, Crown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { memo, useState } from "react";
import type { ICourse } from "@/interface";
import { Skeleton } from "@/components/ui/skeleton";

const CourseCard = memo(({ course }: { course: ICourse }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    title,
    thumbnail,
    slug,
    averageRating,
    price,
    currency = "USD",
    discountPrice,
    isDiscounted,
    totalEnrolled,
    level,
    duration,
    totalLectures,
    isFeatured,
    description,
  } = course;

  const getLevelBadgeClasses = (level: string) => {
    const base =
      "absolute -top-3 right-4 text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm shadow-sm";
    switch (level) {
      case "Intermediate":
        return `${base} bg-blue-100/60 text-blue-700 border-blue-300/50`;
      case "Advanced":
        return `${base} bg-rose-100/60 text-rose-700 border-rose-300/50`;
      case "Beginner":
      default:
        return `${base} bg-emerald-100/60 text-emerald-700 border-emerald-300/50`;
    }
  };

  const finalPrice = isDiscounted && discountPrice ? discountPrice : price;
  const priceDisplay = finalPrice === 0 ? "Free" : `${currency} ${finalPrice}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        duration: 0.4,
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card className="relative p-0 overflow-hidden bg-card/60 backdrop-blur-lg border border-border/50 shadow-card hover:shadow-lg transition-all duration-500 rounded-2xl">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full w-full p-1"
          >
            {!imageError && (
              <img
                src={
                  thumbnail ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
                }
                alt={title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
                className={`w-full rounded-lg h-full object-cover transition-opacity duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            )}
          </motion.div>

          {/* Featured Badge */}
          {isFeatured && (
            <motion.span
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm"
            >
              <Crown className="h-3.5 w-3.5" />
              Featured
            </motion.span>
          )}

          {/* Play Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 shadow-md">
              <Play className="h-6 w-6 text-white fill-white ml-1" />
            </div>
          </motion.div>
        </div>

        {/* Level Badge */}
  

        {/* Content */}
        <CardContent className="p-6 relative z-20 -mt-2">
                <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={getLevelBadgeClasses(level)}
        >
          {level}
        </motion.span>
          <h3 className="font-bold text-lg md:text-xl mb-2 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-5 border-t border-border/50 pt-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-foreground">
                {averageRating?.toFixed(1) || "N/A"}
              </span>
              <span className="text-xs">({totalEnrolled || 0})</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{duration || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              <span>{totalEnrolled?.toLocaleString() || 0} enrolled</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <BookOpen className="h-4 w-4 text-violet-500" />
              <span>{totalLectures || 0} lessons</span>
            </div>
          </div>

          {/* Price + Button */}
          <div className="flex items-center justify-between">
            <div>
              {isDiscounted && price > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {currency} {price}
                </span>
              )}
              <div
                className={`font-bold text-xl ${
                  isDiscounted ? "text-primary" : "text-foreground"
                }`}
              >
                {priceDisplay}
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-gradient-primary hover:shadow-lg transition-all duration-300"
              >
                View Course
              </Button>
            </motion.div>
          </div>
        </CardContent>

        {/* Clickable overlay link */}
        <Link
          to={`/courses/${slug}`}
          className="absolute inset-0 z-40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={`View course: ${title}`}
        />
      </Card>
    </motion.div>
  );
});

CourseCard.displayName = "CourseCard";
export default CourseCard;





export const CourseCardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-0 shadow-lg">
      <div className="animate-pulse">
        {/* Thumbnail Placeholder */}
     <div className="w-full p-2">
          <div className="aspect-video w-full bg-gradient-to-r from-gray-200/40 to-gray-300/60 rounded-lg" />
  
     </div>
        <CardContent className="p-6 space-y-5">
          {/* Title + Subtitle */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-1/2 rounded-md" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md " />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-14 rounded-md" />
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

