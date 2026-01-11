import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Percent, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PricingBreakdown } from '@/interface/checkout.types';
import type { PromoCode } from '@/interface/checkout.types';

interface PricingSummaryProps {
  pricing: PricingBreakdown;
  appliedPromo: PromoCode | null;
  originalPrice: number;
  isDiscounted: boolean;
}

export function PricingSummary({ 
  pricing, 
  appliedPromo, 
  originalPrice,
  isDiscounted 
}: PricingSummaryProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing.currency,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Original Price */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Course Price</span>
            <span className={isDiscounted ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}>
              {formatPrice(originalPrice)}
            </span>
          </div>

          {/* Course Discount */}
          <AnimatePresence>
            {isDiscounted && pricing.discountAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  Sale Discount
                </span>
                <span className="text-success font-medium">
                  -{formatPrice(pricing.discountAmount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Promo Discount */}
          <AnimatePresence>
            {appliedPromo && pricing.promoDiscount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5" />
                  Promo: {appliedPromo.code}
                </span>
                <span className="text-success font-medium">
                  -{formatPrice(pricing.promoDiscount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator className="my-4" />

          {/* Final Amount */}
          <motion.div 
            className="flex justify-between items-center"
            key={pricing.finalAmount}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-base font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(pricing.finalAmount)}
            </span>
          </motion.div>

          {/* Savings Banner */}
          <AnimatePresence>
            {(pricing.discountAmount > 0 || pricing.promoDiscount > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm font-medium"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  You save {formatPrice(pricing.discountAmount + pricing.promoDiscount)}!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
