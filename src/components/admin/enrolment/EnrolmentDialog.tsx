import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { User, BookOpen, CreditCard, Tag, Calendar, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IEnrolment, PaymentStatus, UpdateEnrolmentData } from '@/interface/enrolment.types';

interface EnrolmentDialogProps {
  enrolment: IEnrolment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: UpdateEnrolmentData) => Promise<void>;
  isSubmitting: boolean;
}

const formatCurrency = (amount: number, currency: string) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
  return `${formatted} ${currency.toUpperCase()}`;
};

export const EnrolmentDialog = ({
  enrolment,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: EnrolmentDialogProps) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  useEffect(() => {
    if (enrolment) {
      setPaymentStatus(enrolment.paymentStatus);
    }
  }, [enrolment]);

  if (!enrolment) return null;

  const handleSubmit = async () => {
    await onSubmit(enrolment._id, {
      paymentStatus,
    });
  };

  const isLocked = enrolment.paymentStatus === 'refunded' || enrolment.status === true;
  const hasChanges = paymentStatus !== enrolment.paymentStatus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl">Enrolment Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* User Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{enrolment.user?.name ?? '—'}</p>
                    <p className="text-sm text-muted-foreground">{enrolment.user?.email ?? '—'}</p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <BookOpen className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{enrolment.course?.title ?? '—'}</p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled {enrolment.createdAt ? format(new Date(enrolment.createdAt), 'MMMM d, yyyy') : '—'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Amount */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Payment Information
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="font-bold text-lg">{formatCurrency(enrolment.amount, enrolment.currency)}</span>
                    </div>
                    {enrolment.promoCode && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Promo Code</span>
                        <span>{enrolment.promoCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Transaction
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Transaction ID</p>
                      <p className="font-mono text-sm break-all bg-muted p-2 rounded">{enrolment.transactionId}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Important Dates
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Created At</p>
                        <p className="font-medium">{enrolment.createdAt ? format(new Date(enrolment.createdAt), 'MMM d, yyyy HH:mm') : '—'}</p>
                      </div>
                      {enrolment.refundDate && (
                        <div>
                          <p className="text-xs text-destructive">Refund Date</p>
                          <p className="font-medium text-destructive">{format(new Date(enrolment.refundDate), 'MMM d, yyyy')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Editable Fields */}
                <div className="space-y-4">
                  <div className="max-w-xs space-y-2">
                    <Label>Payment Status</Label>
                    <Select
                      value={paymentStatus}
                      onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}
                      disabled={isLocked}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={enrolment.paymentStatus}>
                          {enrolment.paymentStatus.charAt(0).toUpperCase() + enrolment.paymentStatus.slice(1)}
                        </SelectItem>
                        {enrolment.paymentStatus !== 'refunded' && (
                          <SelectItem value="refunded">Refunded</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {isLocked && (
                      <p className="text-xs text-muted-foreground italic">
                        This enrolment is locked and cannot be updated.
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Close
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !hasChanges || isLocked}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Update Status
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
