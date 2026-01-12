import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RecentEnrollment, EnrolmentStatus, PaymentStatus } from '@/interface/dashboard.types';

interface RecentEnrollmentsTableProps {
  enrollments: RecentEnrollment[] | undefined;
  isLoading: boolean;
}

const statusVariants: Record<EnrolmentStatus, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
  active: { variant: 'default', label: 'Active' },
  completed: { variant: 'secondary', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
};

const paymentStatusVariants: Record<PaymentStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'outline', label: 'Pending' },
  completed: { variant: 'default', label: 'Completed' },
  failed: { variant: 'destructive', label: 'Failed' },
  refunded: { variant: 'secondary', label: 'Refunded' },
};

// const formatCurrency = (amount: number, currency: string = 'USD') => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: currency,
//   }).format(amount);
// };

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-14 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      </TableRow>
    ))}
  </>
);

export const RecentEnrollmentsTable = ({ enrollments, isLoading }: RecentEnrollmentsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : !enrollments || enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <p className="text-muted-foreground">No recent enrollments</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment, index) => {
                    const status = statusVariants[enrollment.status];
                    const paymentStatus = paymentStatusVariants[enrollment.paymentStatus];

                    return (
                      <motion.tr
                        key={enrollment._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={enrollment.user.avatar} alt={enrollment.user.name} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(enrollment.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{enrollment.user.name}</p>
                              <p className="text-xs text-muted-foreground">{enrollment.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {enrollment.course.thumbnail && (
                              <img
                                src={enrollment.course.thumbnail}
                                alt={enrollment.course.title}
                                className="h-10 w-14 rounded object-cover"
                              />
                            )}
                            <span className="text-sm font-medium line-clamp-1 max-w-[180px]">
                              {enrollment.course.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={paymentStatus.variant}>{paymentStatus.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {/* <span className="font-semibold text-sm">
                            {formatCurrency(enrollment.finalAmount, enrollment.currency)}
                          </span> */}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(enrollment.enrolledAt), 'MMM d, yyyy')}
                          </span>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
