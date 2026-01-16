import { motion, type Variants } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CourseCard, { CourseCardSkeleton } from "@/components/modules/Course/CourseCard";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import type { ICourse } from "@/interface/course.types";
import { useTranslation } from "react-i18next";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }, // ✅ Fixed easing
  },
};

const FeaturedCourses = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetAllCoursesQuery({
    limit: 3,
    page: 1,
    isFeatured: true,
  });

  const featuredCourses = data?.data?.data || [];

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className=" px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t("home.featuredCourses.featured")}{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t("home.featuredCourses.courses")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.featuredCourses.description")}
          </p>
        </motion.div>

        {/* Course Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <CourseCardSkeleton />
                </motion.div>
              ))
            : featuredCourses.map((course: ICourse) => (
                <motion.div key={course._id} variants={cardVariants}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
        </motion.div>

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <Link to="/courses">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow group"
            >
              {t("home.featuredCourses.exploreAllCourses")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
