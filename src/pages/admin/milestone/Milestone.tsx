
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import MilestoneForm from "@/components/modules/milestone/MilestoneForm";
import {
  useGetAllMilestonesQuery,
  useDeleteMilestoneMutation,
} from "@/redux/features/milestone/milestone.api";
import {  useGetCourseForSelectQuery } from "@/redux/features/course/course.api";
import { Skeleton } from "@/components/ui/skeleton";
import type { IMilestone } from "@/interface/milestone.types";
import { handleApiError } from "@/utils/errorHandler";
import type { ICourse } from "@/interface/course.types";

export default function MilestoneDashboardPage() {
  // Pagination & filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [course, setCourse] = useState("all");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAllMilestonesQuery(
    {
      search: search,
      status: status,
      course: course,
      page: page,
      limit: limit,
    },
    { refetchOnMountOrArgChange: true }
  );
  const { data: courses } = useGetCourseForSelectQuery({});

  const [deleteMilestone] = useDeleteMilestoneMutation();
  const [open, setOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<IMilestone | null>(null);

  const handleCreateNew = () => {
    setSelectedMilestone(null);
    setOpen(true);
  };

  const handleEdit = (milestone: IMilestone) => {
    setSelectedMilestone(milestone);
    setOpen(true);
  };

  const handleDelete = async (milestoneId: string) => {
    try {
      await deleteMilestone(milestoneId).unwrap();
      toast.success("Milestone deleted successfully");
      refetch();
    } catch (error) {
handleApiError(error)
    }
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleCourseChange = (value: string) => {
    setCourse(value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1);
  };

  if (isError) {
    return <p className="text-center text-red-500">Failed to load milestones</p>;
  }

  const milestones = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false };

  return (
    <div className="min-h-screen flex justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Milestones
          </h1>
          <Button onClick={handleCreateNew}>Create New</Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={course} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses?.data?.map((course: ICourse) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Milestones</CardTitle>
            <CardDescription>
              Manage and view all course milestones. Showing {milestones.length} of {meta.total} results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {isLoading ? (
                      [...Array(3)].map((_, idx) => (
                        <motion.tr
                          key={`skeleton-${idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <TableCell className="font-medium">
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-8 w-8 ml-auto" />
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : milestones.length > 0 ? (
                      milestones.map((milestone: IMilestone, idx: number) => (
                        <motion.tr
                          key={milestone._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <TableCell className="font-medium">{milestone.title}</TableCell>
                          <TableCell>
                            {typeof milestone.course === "object" && milestone.course !== null
                              ? milestone.course.title
                              : typeof milestone.course === "string"
                              ? milestone.course
                              : "Unknown"}
                          </TableCell>
                          <TableCell>{milestone.order}</TableCell>
                          <TableCell>
                            <Badge
                              className={`capitalize ${
                                milestone.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {milestone.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  ⋮
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(milestone)}>
                                  Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-red-600 cursor-pointer"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="rounded-2xl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the milestone
                                        <span className="font-semibold text-red-600"> "{milestone.title}"</span>.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(milestone._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                      >
                                        Yes, Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-gray-500 dark:text-gray-400"
                        >
                          No milestones found
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </motion.div>

            {/* Pagination Controls */}
            {milestones.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                  <Select value={limit.toString()} onValueChange={handleLimitChange}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!meta.hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!meta.hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MilestoneForm
        open={open}
        setOpen={setOpen}
        initialData={selectedMilestone || undefined}
        mode={selectedMilestone ? "update" : "create"}
      />
    </div>
  );
}