import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Eye, CreditCard, Wallet } from 'lucide-react';
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
import type { IEnrolment, EnrolmentStatus, PaymentStatus, PaymentMethod } from '@/interface/enrolment.types';

interface EnrolmentTableProps {
  enrolments: IEnrolment[];
  isLoading: boolean;
  onView: (enrolment: IEnrolment) => void;
}

const statusVariants: Record<EnrolmentStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
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

const paymentMethodIcons: Record<PaymentMethod, { icon: typeof CreditCard; label: string }> = {
  stripe: { icon: CreditCard, label: 'Stripe' },
  paypal: { icon: Wallet, label: 'PayPal' },
  alipay: { icon: Wallet, label: 'Alipay' },
  wechat: { icon: Wallet, label: 'WeChat' },
};

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-10 w-40" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-16" /></TableCell>
      </TableRow>
    ))}
  </>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={8} className="h-32 text-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <CreditCard className="h-8 w-8" />
        <p>No enrolments found</p>
      </div>
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
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Enrolled</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : enrolments.length === 0 ? (
            <EmptyState />
          ) : (
            enrolments?.map((enrolment, index) => {
              const status = statusVariants[enrolment.status] || { variant: 'default', label: 'Cancelled' };
              const paymentStatus = paymentStatusVariants[enrolment.paymentStatus];
              const methodInfo = paymentMethodIcons[enrolment.paymentMethod];
              // const MethodIcon = methodInfo.icon;

              const MethodIcon = paymentMethodIcons[enrolment.paymentMethod]?.icon || CreditCard;


              return (
                <motion.tr
                  key={enrolment._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{enrolment?.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{enrolment?.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{enrolment?.course?.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status?.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={paymentStatus.variant}>{paymentStatus?.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(enrolment?.finalAmount, enrolment?.currency)}
                    </span>
                    {enrolment?.discountAmount > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(enrolment?.originalPrice, enrolment?.currency)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MethodIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{methodInfo?.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(enrolment?.enrolledAt), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(enrolment)}
                    >
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
