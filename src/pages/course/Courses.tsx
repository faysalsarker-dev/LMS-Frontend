import { useState,  useMemo, useEffect } from "react";
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
import { Search } from "lucide-react";
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
import type { ICategory, ICourse } from "@/interface";
import { useSearchParams } from "react-router";

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
    });
  };

  const handlePagination = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // ------------------------------
  // 🔹 UI
  // ------------------------------
  return (
    <motion.div
      className="min-h-screen py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">All Courses</h1>
          <p className="text-muted-foreground text-lg">
            Choose from thousands of courses designed to help you reach your goals.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for courses..."
              defaultValue={filters.search}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10 bg-card h-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Level Filter */}
            <Select
              value={filters.level}
              onValueChange={(val) => handleFilterChange("level", val)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {isCategoryLoading ? (
                  <p className="text-sm p-2 text-muted-foreground">Loading categories...</p>
                ) : (
                  <>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryData?.data?.map((cat:ICategory) => (
                      <SelectItem key={cat._id} value={cat._id!}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result Count */}
        <p className="text-muted-foreground mb-6">
          Showing {courses.length} of {meta.total} courses
        </p>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            transition={{ duration: 0.3 }}
          >
            {courses.map((course: ICourse) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">📚</div>
            <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search criteria.
            </p>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePagination(Math.max(filters.page - 1, 1))}
                  />
                </PaginationItem>

                {Array.from({ length: meta.totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={filters.page === i + 1}
                      onClick={() => handlePagination(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePagination(Math.min(filters.page + 1, meta.totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Courses;
