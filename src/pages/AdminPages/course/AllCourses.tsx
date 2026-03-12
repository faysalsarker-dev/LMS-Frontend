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
import { CourseTable } from "@/components/admin/course/CourseTable";
import {motion} from "framer-motion"
import { Activity, BookOpen, Layers, RotateCcw, SortAsc } from "lucide-react";
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
   <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Course Management
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-10">
            Manage, filter, and organize your educational catalog.
          </p>
        </div>
      </motion.div>

      {/* 🔹 Filters & Sorting Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 rounded-3xl shadow-xl border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Status
              </Label>
              <Select onValueChange={(v) => setStatus(v)} value={status ?? ""}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Level Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Layers className="w-3 h-3" /> Level
              </Label>
              <Select onValueChange={(v) => setLevel(v)} value={level ?? ""}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <SortAsc className="w-3 h-3" /> Sort By
              </Label>
              <Select onValueChange={(v) => setSortBy(v)} value={sortBy}>
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="price">Course Price</SelectItem>
                  <SelectItem value="averageRating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                 Order
              </Label>
              <Select
                onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
                value={sortOrder}
              >
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="w-full rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all group gap-2"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
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
