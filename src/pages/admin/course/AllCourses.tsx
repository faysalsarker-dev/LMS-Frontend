import { useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CourseTable } from "@/components/modules/Course/CourseTable";

const AllCourses = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // 🔹 Filters
  const [status, setStatus] = useState<string>('all');
  const [level, setLevel] = useState<string>('all');


  // 🔹 Sorting
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, refetch } = useGetAllCoursesQuery({
    page,
    limit,
    status,
    level,
    sortBy,
    sortOrder,
  });


  const handleReset = () => {
    setStatus('all');
    setLevel('all');
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight text-gray-800">
        📚 All Courses
      </h1>

      {/* 🔹 Filters & Sorting */}
      <Card className="p-4 rounded-2xl shadow-md border bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {/* Status Filter */}
          <div>
            <Label>Status</Label>
            <Select onValueChange={(v) => setStatus(v)} value={status ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div>
            <Label>Level</Label>
            <Select onValueChange={(v) => setLevel(v)} value={level ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

      

          {/* Sort By */}
          <div>
            <Label>Sort By</Label>
            <Select onValueChange={(v) => setSortBy(v)} value={sortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="averageRating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Label>Order</Label>
            <Select
              onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
              value={sortOrder}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <div className="pt-6">
            <Button variant="outline" className="w-full" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* 🔹 Course Table */}
      <CourseTable
        courses={data?.data?.data || []}
        meta={data?.data?.meta || { page: 1, limit: 10, total: 0 }}
        loading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default AllCourses;
