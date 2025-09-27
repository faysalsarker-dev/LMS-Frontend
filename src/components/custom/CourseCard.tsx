import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, Users, BookOpen, Crown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Skeleton } from '@/components/ui/skeleton';
import { memo, useState } from 'react';
import type { ICourse } from "@/interface";

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
    description
  } = course;

  const getLevelBadgeClasses = (level: string) => {
    const baseClasses = "text-xs  font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border";
    switch (level) {
      case "Intermediate":
        return `${baseClasses} bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-800 border-blue-200/30`;
      case "Advanced":
        return `${baseClasses} bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-800 border-red-200/30`;
      case "Beginner":
      default:
        return `${baseClasses} bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-800 border-green-200/30`;
    }
  };

  const finalPrice = isDiscounted && discountPrice ? discountPrice : price;
  const priceDisplay = finalPrice === 0 ? "Free" : `${currency} ${finalPrice}`;

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.4 }
    }
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8, y: -10 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { delay: 0.2, duration: 0.3 }
    }
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="group cursor-pointer"
    >
       <Link 
          to={`/courses/${slug}`} 
          className="absolute h-full inset-0 z-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
          aria-label={`View course: ${title}`}
        />

      <Card className="relative p-0 overflow-hidden bg-card backdrop-blur-glass border-glass shadow-card hover:shadow-hover transition-all duration-500">
 

        <div className="relative aspect-video overflow-hidden">
          <motion.div
            variants={imageVariants}
            className="relative w-full p-2 h-full"
          >
            {!imageError && (
              <img
                src={thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&crop=top`}
                alt={title}
                className={`w-full rounded-lg h-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            )}
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </motion.div>


          
          {/* Play button overlay */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <Play className="h-6 w-6 text-white fill-white ml-1" />
            </div>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <motion.span 
              variants={badgeVariants}
              className={getLevelBadgeClasses(level)}
            >
              {level}
            </motion.span>
            
            {isFeatured && (
              <motion.span 
                variants={badgeVariants}
                className="flex items-center gap-1 bg-gradient-to-r from-amber-400/90 to-orange-400/90 backdrop-blur-sm text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200/50 shadow-lg"
              >
                <Crown className="h-3 w-3" />
                Featured
              </motion.span>
            )}
          </div>
        </div>

        <CardContent className="px-6 pb-6 -pt-1 relative z-20">
          <motion.div variants={contentVariants}>
            {/* Title */}
            <h3 className="font-bold text-xl mb-2 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4 py-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-foreground">{averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
                <span className="text-xs">({totalEnrolled || 0})</span>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{duration || 'TBD'}</span>
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

            {/* Price and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {isDiscounted && price > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${price}
                  </span>
                )}
                <div className={`font-bold text-2xl ${isDiscounted ? 'text-primary' : 'text-foreground'}`}>
                  {priceDisplay}
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-primary hover:shadow-lg relative z-30 transition-all duration-300"
                  size="sm"
                >
                  View Course
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

CourseCard.displayName = 'CourseCard';

export const CourseCardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-card backdrop-blur-glass border-glass shadow-card">
      <div className="animate-pulse">
        <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-t border-border/50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CourseCard;