import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { User, BookOpen, CreditCard,  Tag, RefreshCcw, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IEnrolment, EnrolmentStatus, PaymentStatus, UpdateEnrolmentData } from '@/interface/enrolment.types';

interface EnrolmentDialogProps {
  enrolment: IEnrolment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: UpdateEnrolmentData) => Promise<void>;
  isSubmitting: boolean;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const EnrolmentDialog = ({
  enrolment,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: EnrolmentDialogProps) => {
  const [status, setStatus] = useState<EnrolmentStatus>('active');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (enrolment) {
      setStatus(enrolment.status);
      setPaymentStatus(enrolment.paymentStatus);
      setRefundReason(enrolment.refundReason || '');
    }
  }, [enrolment]);

  if (!enrolment) return null;

  const handleSubmit = async () => {
    await onSubmit(enrolment._id, {
      status,
      paymentStatus,
      refundReason: refundReason || undefined,
    });
  };

  const hasChanges =
    status !== enrolment.status ||
    paymentStatus !== enrolment.paymentStatus ||
    refundReason !== (enrolment.refundReason || '');

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
                    <p className="font-medium">{enrolment.user.name}</p>
                    <p className="text-sm text-muted-foreground">{enrolment.user.email}</p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <BookOpen className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{enrolment.course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled {format(new Date(enrolment.enrolledAt), 'MMMM d, yyyy')}
                    </p>
                    {enrolment.completedAt && (
                      <p className="text-sm text-muted-foreground">
                        Completed {format(new Date(enrolment.completedAt), 'MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Pricing
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Original Price</span>
                      <span>{formatCurrency(enrolment.originalPrice, enrolment.currency)}</span>
                    </div>
                    {enrolment.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount {enrolment.promoCodeUsed && `(${enrolment.promoCodeUsed})`}</span>
                        <span>-{formatCurrency(enrolment.discountAmount, enrolment.currency)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Final Amount</span>
                      <span>{formatCurrency(enrolment.finalAmount, enrolment.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Method</p>
                      <p className="font-medium capitalize">{enrolment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transaction ID</p>
                      <p className="font-medium font-mono text-xs">{enrolment.transactionId || '-'}</p>
                    </div>
                    {enrolment.paymentDate && (
                      <div>
                        <p className="text-muted-foreground">Payment Date</p>
                        <p className="font-medium">
                          {format(new Date(enrolment.paymentDate), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Refund Info */}
                {(enrolment.refundDate || paymentStatus === 'refunded') && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Refund Information
                    </h4>
                    <div className="bg-destructive/10 rounded-lg p-4 space-y-2">
                      {enrolment.refundDate && (
                        <div className="flex justify-between text-sm">
                          <span>Refund Date</span>
                          <span>{format(new Date(enrolment.refundDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {enrolment.refundReason && (
                        <div>
                          <p className="text-sm text-muted-foreground">Reason</p>
                          <p className="text-sm">{enrolment.refundReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Editable Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Enrolment Status</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as EnrolmentStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Status</Label>
                      <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(paymentStatus === 'refunded' || status === 'cancelled') && (
                    <div className="space-y-2">
                      <Label>Refund Reason</Label>
                      <Textarea
                        placeholder="Enter reason for refund..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !hasChanges}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
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
