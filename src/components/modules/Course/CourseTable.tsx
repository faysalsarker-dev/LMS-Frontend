
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

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  currency: string;
  level: string;
  status: string;
  totalEnrolled: number;
  averageRating: number;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

interface CourseTableProps {
  courses: Course[];
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
  const [updateOpen,setUpdateOpen]=useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };


  const onUpdate =(id:string)=>{
    setUpdateOpen(true);
    setSelectedCourseId(id);
  }
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
              // 🔹 Skeleton rows while loading
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
                  <TableCell className="font-medium">
                    {course.title}
                  </TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell>
                    {course.price} {course.currency}
                  </TableCell>
                  <TableCell>{course.totalEnrolled}</TableCell>
                  <TableCell>{course.averageRating.toFixed(1)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button type="button" onClick={() => onUpdate(course._id)} size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>



{
  updateOpen && <UpdateCourse onClose={()=>setUpdateOpen(false)} courseId={selectedCourseId} open={updateOpen} />
}



      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
