import { motion } from 'framer-motion';
import { Clock, CreditCard } from 'lucide-react';
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
import type { RecentEnrollment, PaymentStatus } from '@/interface/dashboard.types';

interface RecentEnrollmentsTableProps {
  enrollments: RecentEnrollment[] | undefined;
  isLoading: boolean;
}


const paymentStatusVariants: Record<PaymentStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'outline', label: 'Pending' },
  completed: { variant: 'default', label: 'Completed' },
  failed: { variant: 'destructive', label: 'Failed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  refunded: { variant: 'secondary', label: 'Refunded' },
};

const getInitials = (name: string) => {
  return name
    ?.split(' ')
    ?.map((n) => n[0])
    ?.join('')
    ?.toUpperCase()
    ?.slice(0, 2);
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
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      </TableRow>
    ))}
  </>
);

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const RecentEnrollmentsTable = ({ enrollments, isLoading }: RecentEnrollmentsTableProps) => {

console.log(enrollments)

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
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : !enrollments || enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-muted-foreground">No recent enrollments</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments?.map((enrollment, index) => {
                    const paymentStatus = paymentStatusVariants[enrollment.paymentStatus] || { variant: 'outline', label: enrollment.paymentStatus };

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
                            <Avatar className="h-9 w-9 border">
                              <AvatarImage src={enrollment?.user?.profile} alt={enrollment?.user?.name} />
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                                {getInitials(enrollment?.user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm leading-tight">{enrollment?.user?.name}</span>
                              <span className="text-xs text-muted-foreground">{enrollment?.user?.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium line-clamp-1 max-w-[200px]" title={enrollment?.course?.title}>
                            {enrollment?.course?.title}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={paymentStatus.variant} className="capitalize px-2 py-0 text-[10px] font-medium">
                            {paymentStatus?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-sm">
                            {formatCurrency(enrollment.amount, enrollment.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CreditCard className="h-3 w-3" />
                            <span className="font-mono text-[10px]">{enrollment?.transactionId}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {/* {format(new Date(enrollment?.enrolledAt), 'MMM d, yyyy')} */}
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
