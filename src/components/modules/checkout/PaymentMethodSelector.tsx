import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '@/interface/enrolment.types';

 const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; available: boolean }[] = [
  { id: 'alipay', label: 'Alipay', icon: 'alipay', available: true },
  { id: 'wechat', label: 'WeChat Pay', icon: 'wechat', available: true },
  { id: 'stripe', label: 'Credit Card', icon: 'credit-card', available: false },
  { id: 'paypal', label: 'PayPal', icon: 'paypal', available: false },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
}

// Custom icons for payment methods
function PaymentIcon({ method }: { method: string }) {
  switch (method) {
    case 'alipay':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#1677FF] flex items-center justify-center text-white font-bold text-xs">
          A
        </div>
      );
    case 'wechat':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#07C160] flex items-center justify-center">
          <Smartphone className="h-4 w-4 text-white" />
        </div>
      );
    case 'stripe':
    case 'credit-card':
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635BFF] to-[#8E85FF] flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-white" />
        </div>
      );
    case 'paypal':
      return (
        <div className="w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white font-bold text-xs">
          PP
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
      );
  }
}

export function PaymentMethodSelector({ 
  selected, 
  onSelect, 
  disabled 
}: PaymentMethodSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Payment Method
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {PAYMENT_METHODS.map((method, index) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => method.available && onSelect(method.id)}
              disabled={disabled || !method.available}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                selected === method.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 hover:border-border',
                (!method.available || disabled) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <PaymentIcon method={method.icon} />
              
              <div className="flex-1 text-left">
                <span className="font-medium text-foreground">{method.label}</span>
              </div>
              
              {!method.available && (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              )}
              
              {selected === method.id && method.available && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}

          {/* Security Note */}
          <div className="flex items-center gap-2 pt-3 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
