import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateCourse from "./UpdateCourse";
import type { ICourse } from "@/interface";
import { useDeleteCourseMutation } from "@/redux/features/course/course.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

interface Meta {
  page: number;
  limit: number;
  total: number;
}

interface CourseTableProps {
  courses: ICourse[];
  meta: Meta;
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export function CourseTable({
  courses,
  meta,
  loading,
  onPageChange,
}: CourseTableProps) {
  const [currentPage, setCurrentPage] = useState(meta.page || 1);
  const totalPages = Math.ceil(meta.total / meta.limit);

  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCourse(deleteId).unwrap();
      toast.success("Course deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete course.");
    } finally {
      setDeleteId(null);
      setOpen(false);
    }
  };

  const onUpdate = (id: string) => {
    setUpdateOpen(true);
    setSelectedCourseId(id);
  };

  return (
    <div className="w-full space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <Table>
          <TableHeader className="bg-background/95">
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="min-h-12">
            {loading ? (
              Array.from({ length: meta.limit }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-16 rounded-md bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10 bg-gray-200" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <TableRow className="bg-card/80" key={course._id}>
                  <TableCell>
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        width={64}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <Skeleton className="h-12 w-16 rounded-md bg-gray-200" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell>
                    {course.price} {course.currency}
                  </TableCell>
                  <TableCell>{course.totalEnrolled}</TableCell>
                  <TableCell>{course.averageRating.toFixed(1)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      type="button"
                      onClick={() => onUpdate(course.slug)}
                      size="sm"
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => confirmDelete(course._id)}
                      size="sm"
                      variant="destructive"
                      disabled={deleting && deleteId === course._id}
                    >
                      {deleting && deleteId === course._id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Modal */}
      {updateOpen && (
        <UpdateCourse
          onClose={() => setUpdateOpen(false)}
          courseId={selectedCourseId}
          open={updateOpen}
        />
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently remove this
              course and its data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
