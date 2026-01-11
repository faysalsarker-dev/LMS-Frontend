import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatCurrency } from '@/utils/timezone';
import type { ICourse } from '@/interface/course.types';

interface CoursesTableProps {
  courses: ICourse[];
}

export function CoursesTable({ courses }: CoursesTableProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No courses available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="text-right">Enrolled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course, index) => (
            <motion.tr
              key={course._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail!}
                    alt={course.title}
                    className="h-12 w-20 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {course.slug}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(course.price)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {course.averageRating}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatNumber(course.totalEnrolled)}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
