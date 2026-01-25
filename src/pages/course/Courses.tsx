
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, BookOpen, GraduationCap, X } from "lucide-react";
import debounce from "lodash.debounce";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import CourseCard, { CourseCardSkeleton } from "@/components/modules/Course/CourseCard";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { useGetAllCategorysQuery } from "@/redux/features/category/category.api";
import { useSearchParams } from "react-router";
import type { Variants } from "framer-motion";
import type { ICategory } from "@/interface/category.types";
import type { ICourse } from "@/interface/course.types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const Courses = () => {
  const [searchParams] = useSearchParams();
  
  // ------------------------------
  // 🔹 State Management
  // ------------------------------
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    level: "all",
    page: 1,
    limit: 9,
    status:'published'
  });

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category,
      }));
    }
  }, [searchParams]);

  // ------------------------------
  // 🔹 Data Fetching
  // ------------------------------
  const { data: categoryData, isLoading: isCategoryLoading } = useGetAllCategorysQuery({});
  const { data, isLoading } = useGetAllCoursesQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const courses = data?.data?.data || [];
  const meta = data?.data?.meta || { total: 0, totalPages: 1 };

  // ------------------------------
  // 🔹 Debounced Search Handler
  // ------------------------------
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }));
      }, 500),
    []
  );

  // ------------------------------
  // 🔹 Handlers
  // ------------------------------
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      level: "all",
      page: 1,
      limit: 9,
    status:'published'

    });
  };

  const handlePagination = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const hasActiveFilters = filters.search || filters.category !== "all" || filters.level !== "all";

  // ------------------------------
  // 🔹 UI
  // ------------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Explore Our Course Library</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Discover Your Next
              <span className="text-primary"> Learning Journey</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose from thousands of expert-led courses designed to help you master new skills and achieve your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        {/* Filters Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Filter Courses</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses by title, topic, or instructor..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-12 h-12 bg-background border-border/50 rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Level Filter */}
              <Select
                value={filters.level}
                onValueChange={(val) => handleFilterChange("level", val)}
              >
                <SelectTrigger className="h-12 w-full sm:w-[180px] bg-background border-border/50 rounded-xl">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select
                value={filters.category}
                onValueChange={(val) => handleFilterChange("category", val)}
              >
                <SelectTrigger className="h-12 w-full sm:w-[200px] bg-background border-border/50 rounded-xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-[300px]">
                  {isCategoryLoading ? (
                    <div className="p-3 text-muted-foreground text-sm">Loading categories...</div>
                  ) : (
                    <>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryData?.data?.map((cat: ICategory) => (
                        <SelectItem key={cat._id} value={cat._id as string}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="h-12 px-4 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{courses.length}</span> of{" "}
            <span className="font-semibold text-foreground">{meta.total}</span> courses
          </p>
        </motion.div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course: ICourse) => (
              <motion.div key={course._id} variants={itemVariants}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button
              onClick={handleClearFilters}
              className="rounded-xl px-6 h-11"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <Pagination>
              <PaginationContent className="bg-card border border-border/50 rounded-xl p-2 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    className={`rounded-lg ${filters.page === 1 ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}
                    onClick={() => handlePagination(Math.max(filters.page - 1, 1))}
                  />
                </PaginationItem>

                {Array.from({ length: meta.totalPages }, (_, i) => {
                  const page = i + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === meta.totalPages ||
                    (page >= filters.page - 1 && page <= filters.page + 1)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={filters.page === page}
                          onClick={() => handlePagination(page)}
                          className={`rounded-lg ${
                            filters.page === page
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "hover:bg-muted"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === filters.page - 2 ||
                    page === filters.page + 2
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    className={`rounded-lg ${filters.page === meta.totalPages ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}
                    onClick={() => handlePagination(Math.min(filters.page + 1, meta.totalPages))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Courses;
