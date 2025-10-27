import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatToDhaka, formatRelative, formatToISO } from '@/utils/timezone';
import type { IEnrollment } from '@/interface';

interface RecentEnrollmentsTableProps {
  enrollments: IEnrollment[];
}

const statusColors = {
  active: 'bg-green-100 text-green-700 border-green-300',
  completed: 'bg-blue-100 text-blue-700 border-blue-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  paid: 'bg-green-100 text-green-700 border-green-300',
  failed: 'bg-red-100 text-red-700 border-red-300',
};

export function RecentEnrollmentsTable({ enrollments }: RecentEnrollmentsTableProps) {
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent enrollments
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Enrolled</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {enrollments.map((enrollment, index) => {
            const user =
              typeof enrollment.user === 'string' || !enrollment.user
                ? { name: 'Unknown', email: 'N/A', profile: null }
                : enrollment.user;

            const course =
              typeof enrollment.course === 'string' || !enrollment.course
                ? { title: 'Unknown Course', price: 0 }
                : enrollment.course;

            const profileImg = user?.profile ?? undefined;
            const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';

            return (
              <motion.tr
                key={enrollment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-muted/50 transition-colors"
              >
                {/* Student Info */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {profileImg ? (
                        <AvatarImage src={profileImg} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {userInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Course Info */}
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    <p className="font-medium text-sm">{course.title}</p>
                    {course.price && (
                      <p className="text-xs text-muted-foreground">
                        ${course.price}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Payment Method */}
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {enrollment.method || 'N/A'}
                  </Badge>
                </TableCell>

                {/* Enrollment Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      statusColors[
                        enrollment.status as keyof typeof statusColors
                      ] || statusColors.active
                    }
                  >
                    {enrollment.status}
                  </Badge>
                </TableCell>

                {/* Payment Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      paymentColors[
                        enrollment.paymentStatus as keyof typeof paymentColors
                      ] || paymentColors.pending
                    }
                  >
                    {enrollment.paymentStatus}
                  </Badge>
                </TableCell>

                {/* Enrollment Date */}
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-end gap-1 cursor-help">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatRelative(enrollment.enrolledAt)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {formatToDhaka(enrollment.enrolledAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ISO: {formatToISO(enrollment.enrolledAt)}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
