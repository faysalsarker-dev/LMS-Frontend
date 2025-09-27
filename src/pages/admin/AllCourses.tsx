import { useState } from "react";
import { CourseTable } from "@/components/dashboard/CourseTable";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AllCourses = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // 🔹 Filters
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [isDiscounted, setIsDiscounted] = useState<boolean | undefined>(
    undefined
  );
  const [certificateAvailable, setCertificateAvailable] = useState<
    boolean | undefined
  >(undefined);

  // 🔹 Sorting
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 🔹 API Call (filters trigger refetch automatically)
  const { data, isLoading, refetch } = useGetAllCoursesQuery({
    page,
    limit,
    status,
    level,
    isDiscounted,
    certificateAvailable,
    sortBy,
    sortOrder,
  });


console.log(data);
  const handleReset = () => {
    setStatus(undefined);
    setLevel(undefined);
    setIsDiscounted(undefined);
    setCertificateAvailable(undefined);
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
            <Select onValueChange={(v) => setStatus(v || undefined)} value={status ?? ""}>
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
            <Select onValueChange={(v) => setLevel(v || undefined)} value={level ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Toggle */}
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              checked={isDiscounted === true}
              onCheckedChange={(checked) =>
                setIsDiscounted(checked ? true : undefined)
              }
            />
            <Label>Discounted</Label>
          </div>

          {/* Certificate Toggle */}
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              checked={certificateAvailable === true}
              onCheckedChange={(checked) =>
                setCertificateAvailable(checked ? true : undefined)
              }
            />
            <Label>Certificate</Label>
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
