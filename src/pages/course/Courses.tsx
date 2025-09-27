import { useState, useEffect, useCallback } from "react";
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
import CourseCard, { CourseCardSkeleton } from "@/components/custom/CourseCard";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Courses = () => {
  // Filters + pagination state
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    level: "all",
    sortBy: "newest",
    page: 1,
    limit: 10,
  });

  // Debounced search handler
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 500),
    [setFilters]
  );

  const { data, isLoading } = useGetAllCoursesQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const courses = data?.data?.data || [];
  const meta = data?.data?.meta || { total: 0, page: 1, limit: 6, totalPages: 1 };
console.log(courses);
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-muted-foreground text-lg">
            Choose from thousands of courses designed to help you reach your goals
          </p>
        </div>

     <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  {/* Search Bar */}
  <div className="relative w-full lg:w-1/3">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input
      type="search"
      placeholder="Search for courses..."
      defaultValue={filters.search}
      onChange={(e) => debouncedSetSearch(e.target.value)}
      className="pl-10 bg-card h-10"
    />
  </div>

  {/* Filter Controls */}
  <div className="flex flex-wrap gap-4 items-center">
    {/* Level */}
    <Select
      value={filters.level}
      onValueChange={(val) =>
        setFilters((prev) => ({ ...prev, level: val, page: 1 }))
      }
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

    {/* Sort */}
    <Select
      value={filters.sortBy}
      onValueChange={(val) =>
        setFilters((prev) => ({ ...prev, sortBy: val, page: 1 }))
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="popularity">Most Popular</SelectItem>
        <SelectItem value="rating">Highest Rated</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>



        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {courses.length} of {meta.total} courses
          </p>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">📚</div>
            <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all courses
            </p>
            <Button
              onClick={() =>
                setFilters({
                  search: "",
                  category: "all",
                  level: "all",
                  sortBy: "newest",
                  page: 1,
                  limit: 6,
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(prev.page - 1, 1),
                      }))
                    }
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={filters.page === i + 1}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: i + 1 }))
                      }
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.min(prev.page + 1, meta.totalPages),
                      }))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
