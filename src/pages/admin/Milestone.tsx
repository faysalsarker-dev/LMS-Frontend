import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

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

import { Search } from "lucide-react";

import MilestoneForm from "@/components/modules/milestone/MilestoneForm";
import {
  useGetAllMilestonesQuery,
  useDeleteMilestoneMutation,
  
} from "@/redux/features/milestone/milestone.api";
import type { ICourse, IMilestone } from "@/interface";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function MilestoneDashboardPage() {
  // filters
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
      search: search ,
      status: status,
      course: course ,
    },
    { refetchOnMountOrArgChange: true }
  );
  const { data: courses } = useGetAllCoursesQuery({ page: 1, limit: 100000 });

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
    } catch {
      toast.error("Failed to delete milestone");
    }
  };



  if (isError) {
    return <p className="text-center text-red-500">Failed to load milestones</p>;
  }

  const milestones = data?.data || [];
  return (
    <div className="min-h-screen  flex justify-center p-4 sm:p-6 lg:p-8 font-sans">
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
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
        


{
  courses?.data?.data?.map((course: ICourse) => (
    <SelectItem key={course._id} value={course._id}>
      {course.title}
    </SelectItem>
  ))
}

              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Milestones</CardTitle>
            <CardDescription>
              Manage and view all course milestones.
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
    // Skeleton loading rows
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Skeleton className="h-4 w-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Skeleton className="h-4 w-32" />
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </motion.tr>
    ))
  ) : milestones.length > 0 ? (
    // Render milestones
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
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(milestone._id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </motion.tr>
    ))
  ) : (
    // Empty state
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
          </CardContent>
        </Card>
      </div>

      {/* Sheet for create/update */}
      <MilestoneForm
        open={open}
        setOpen={setOpen}
        initialData={selectedMilestone || undefined}
        mode={selectedMilestone ? "update" : "create"}
      />
    </div>
  );
}
