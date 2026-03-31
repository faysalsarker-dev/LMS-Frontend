import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Eye, CreditCard } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { IEnrolment, PaymentStatus } from '@/interface/enrolment.types';
import NoDataFound from '@/components/shared/NoDataFound';

interface EnrolmentTableProps {
  enrolments: IEnrolment[];
  isLoading: boolean;
  onView: (enrolment: IEnrolment) => void;
}

const paymentStatusVariants: Record<PaymentStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'outline', label: 'Pending' },
  completed: { variant: 'default', label: 'Completed' },
  failed: { variant: 'destructive', label: 'Failed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  refunded: { variant: 'secondary', label: 'Refunded' },
};

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-10 w-40" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-16" /></TableCell>
      </TableRow>
    ))}
  </>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={7}>
      <NoDataFound 
        message="No enrolments found" 
        icon={<CreditCard className="h-8 w-8 text-muted-foreground/50" />} 
      />
    </TableCell>
  </TableRow>
);

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const EnrolmentTable = ({ enrolments, isLoading, onView }: EnrolmentTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Enrolled At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : enrolments?.length === 0 ? (
            <EmptyState />
          ) : (
            enrolments.map((enrolment, index) => {
              /** ---------------- SAFE MAPPINGS ---------------- */
              const paymentStatus =
                paymentStatusVariants[enrolment.paymentStatus as PaymentStatus] ??
                { variant: 'outline', label: enrolment.paymentStatus ?? 'Unknown' };

              /** ---------------- SAFE DATE ---------------- */
              const enrolledDate = enrolment.createdAt
                ? format(new Date(enrolment.createdAt), 'MMM d, yyyy')
                : '—';

              return (
                <motion.tr
                  key={enrolment._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-b hover:bg-muted/50"
                >
                  {/* USER */}
                  <TableCell>
                    <p className="font-medium">{enrolment.user?.name ?? '—'}</p>
                    <p className="text-sm text-muted-foreground">
                      {enrolment.user?.email ?? '—'}
                    </p>
                  </TableCell>

                  {/* COURSE */}
                  <TableCell className="font-medium">
                    {enrolment.course?.title ?? '—'}
                  </TableCell>

                  {/* PAYMENT STATUS */}
                  <TableCell>
                    <Badge variant={paymentStatus.variant}>
                      {paymentStatus.label}
                    </Badge>
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(enrolment.amount ?? 0, enrolment.currency ?? 'USD')}
                    </span>
                  </TableCell>

                  {/* TRANSACTION ID */}
                  <TableCell className="font-mono text-xs">
                    {enrolment.transactionId}
                  </TableCell>

                  {/* DATE */}
                  <TableCell className="text-sm text-muted-foreground">
                    {enrolledDate}
                  </TableCell>

                  {/* ACTION */}
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => onView(enrolment)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};