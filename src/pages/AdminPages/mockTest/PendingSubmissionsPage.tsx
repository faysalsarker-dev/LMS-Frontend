import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  ClipboardCheck,
  Eye,
  Loader2,
  User,
  BookOpen,
  FileText,
  Clock,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPendingSubmissionsQuery } from "@/redux/features/mockTestSubmission/mockTestSubmission.api";
import { useGetCourseForSelectQuery } from "@/redux/features/course/course.api";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const SectionBadge = ({ name }: { name: string }) => {
  const colors: Record<string, string> = {
    listening: "bg-blue-100 text-blue-700 border-blue-200",
    reading: "bg-green-100 text-green-700 border-green-200",
    writing: "bg-amber-100 text-amber-700 border-amber-200",
    speaking: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${colors[name] ?? "bg-muted text-muted-foreground"}`}
    >
      {name}
    </span>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const PendingSubmissionsPage = () => {
  const [course, setCourse] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: coursesData } = useGetCourseForSelectQuery({});
  const courses = coursesData?.data || [];

  const { data, isLoading } = useGetPendingSubmissionsQuery({
    course: course === "all" ? undefined : course,
    sortOrder,
    page,
    limit,
  });

  const submissions: any[] = data?.data ?? [];
  const meta: any = data?.meta ?? { totalPages: 1, total: 0 };
  const totalPages = meta.totalPages || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-amber-500" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Pending Submissions
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-10">
              Mock test submissions awaiting manual grading.
            </p>
          </div>

          {!isLoading && (
            <Badge
              variant="outline"
              className="self-start md:self-auto text-amber-600 border-amber-400 font-bold px-4 py-2 text-sm"
            >
              {meta.total || submissions.length} Pending
            </Badge>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Select
            value={course}
            onValueChange={(val: string) => {
              setCourse(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[240px] bg-card rounded-xl">
              <BookOpen className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c: any) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(val: "asc" | "desc") => {
              setSortOrder(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px] bg-card rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Oldest First</SelectItem>
              <SelectItem value="desc">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border bg-card overflow-hidden shadow-sm"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-bold">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" /> Student
                  </span>
                </TableHead>
                <TableHead className="font-bold">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> Course
                  </span>
                </TableHead>
                <TableHead className="font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Mock Test
                  </span>
                </TableHead>
                <TableHead className="font-bold">Score</TableHead>
                <TableHead className="font-bold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Submitted
                  </span>
                </TableHead>
                <TableHead className="font-bold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-24 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading submissions...
                    </p>
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-24 text-center">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-semibold">
                      No pending submissions found.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub, idx) => (
                  <motion.tr
                    key={sub._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    {/* Student */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-sm">
                          {sub.student?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sub.student?.email ?? "—"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Course */}
                    <TableCell className="text-sm font-medium max-w-[150px] truncate">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {sub.course?.title?.length > 20
                                ? `${sub.course?.title.substring(0, 20)}...`
                                : sub.course?.title ?? "—"}
                            </span>
                          </TooltipTrigger>
                          {sub.course?.title?.length > 20 && (
                            <TooltipContent>
                              <p>{sub.course?.title}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                    {/* Mock Test */}
                    <TableCell className="text-sm font-medium max-w-[150px] truncate">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {sub.mockTest?.title?.length > 20
                                ? `${sub.mockTest?.title.substring(0, 20)}...`
                                : sub.mockTest?.title ?? "—"}
                            </span>
                          </TooltipTrigger>
                          {sub.mockTest?.title?.length > 20 && (
                            <TooltipContent>
                              <p>{sub.mockTest?.title}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                  

                    {/* Score */}
                    <TableCell>
                      <span className="font-bold text-primary">
                        {sub.totalScore ?? 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        pts
                      </span>
                    </TableCell>

                    {/* Submitted At */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {sub.createdAt ? formatDate(sub.createdAt) : "—"}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5 font-semibold"
                      >
                        <Link
                          to={`/dashboard/mock-test-submissions/${sub._id}`}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm"
          >
            <p className="text-sm text-muted-foreground hidden sm:block">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, meta.total || submissions.length)}
              </span>{" "}
              of <span className="font-medium">{meta.total || submissions.length}</span> results
            </p>
            <span className="text-sm text-muted-foreground sm:hidden">
              Page {page} of {totalPages}
            </span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                <PaginationItem className="hidden sm:block">
                  <span className="px-4 text-sm font-medium">
                    Page {page} of {totalPages}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PendingSubmissionsPage;
