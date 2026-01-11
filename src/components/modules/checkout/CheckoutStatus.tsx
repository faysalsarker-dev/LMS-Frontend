import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CheckoutStep } from '@/interface/checkout.types';

interface CheckoutStatusProps {
  step: CheckoutStep;
  courseName: string;
  onRetry?: () => void;
  onGoToCourse?: () => void;
}

export function CheckoutStatus({ 
  step, 
  courseName, 
  onRetry, 
  onGoToCourse 
}: CheckoutStatusProps) {
  if (step === 'processing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <Card className="w-full max-w-md mx-4 border-border/50 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-flex"
            >
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary-foreground" />
              </div>
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Processing Payment
              </h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we process your payment...
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <Card className="w-full max-w-md mx-4 border-border/50 shadow-xl overflow-hidden">
          {/* Success Banner */}
          <div className="h-2 gradient-success" />
          
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
              className="inline-flex"
            >
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h3 className="text-2xl font-bold text-foreground">
                Enrollment Successful!
              </h3>
              <p className="text-muted-foreground">
                You are now enrolled in
              </p>
              <p className="font-semibold text-foreground">
                {courseName}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={onGoToCourse}
                className="gap-2 gradient-primary text-primary-foreground shadow-glow"
                size="lg"
              >
                <BookOpen className="h-4 w-4" />
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (step === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <Card className="w-full max-w-md mx-4 border-border/50 shadow-xl overflow-hidden">
          {/* Error Banner */}
          <div className="h-2 gradient-error" />
          
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Payment Failed
              </h3>
              <p className="text-muted-foreground">
                We couldn't process your payment. Please try again or use a different payment method.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={onRetry}
                className="gap-2"
                size="lg"
              >
                Try Again
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
}
