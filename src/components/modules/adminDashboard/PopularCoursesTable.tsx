import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { PopularCourse } from '@/interface/dashboard.types';

interface PopularCoursesTableProps {
  courses: PopularCourse[] | undefined;
  isLoading: boolean;
}

// const formatCurrency = (amount: number, currency: string) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: currency,
//   }).format(amount);
// };

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-16 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      </TableRow>
    ))}
  </>
);

export const PopularCoursesTable = ({ courses, isLoading }: PopularCoursesTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            Popular Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : !courses || courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <p className="text-muted-foreground">No courses available</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses?.map((course, index) => (
                    <motion.tr
                      key={course._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {course?.thumbnail && (
                            <img
                              src={course?.thumbnail}
                              alt={course?.title}
                              className="h-12 w-16 rounded object-cover"
                            />
                          )}
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium line-clamp-1 max-w-[220px]">
                              {course?.title}
                            </span>
                            {course?.isDiscounted && (
                              <Badge variant="secondary" className="w-fit text-xs">
                                On Sale
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{course?.totalEnrolled?.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs ml-1">students</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium">{course?.averageRating?.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {formatCurrency(
                              course.isDiscounted && course.discountPrice
                                ? course.discountPrice
                                : course.price,
                              course.currency
                            )}
                          </span>
                          {course.isDiscounted && course.discountPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(course.price, course.currency)}
                            </span>
                          )}
                        </div> */}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
