import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { XCircle, RotateCcw, ArrowRight, Receipt, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();

  const transactionId = searchParams.get("transactionId") ?? "TXN-0000000";
  const amount = searchParams.get("amount") ?? "0.00";
  const currency = searchParams.get("currency") ?? "USD";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-red-50 via-rose-50/50 to-orange-50/30 dark:from-red-950/30 dark:via-background dark:to-orange-950/20">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-destructive/8 to-orange-500/5 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-rose-500/6 to-destructive/4 blur-3xl animate-[pulse_8s_ease-in-out_infinite_1s]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="border border-border/50 shadow-card-hover overflow-hidden backdrop-blur-sm bg-card/95">
          <div className="pt-10 pb-6 flex flex-col items-center">
            <div className="relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute inset-0 -m-4 rounded-full border-2 border-destructive/20 animate-[pulse_3s_ease-in-out_infinite]"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="absolute inset-0 -m-8 rounded-full border border-destructive/10 animate-[pulse_3s_ease-in-out_infinite_0.5s]"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-destructive to-rose-600 dark:from-destructive dark:to-rose-500 flex items-center justify-center shadow-lg shadow-destructive/25"
              >
                <XCircle className="h-10 w-10 text-destructive-foreground" strokeWidth={2} />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-5 text-2xl md:text-3xl font-bold text-foreground"
            >
              Payment Failed
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-muted-foreground text-sm mt-1"
            >
              Your transaction could not be processed
            </motion.p>
          </div>

          <CardContent className="px-6 pb-8 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="flex items-start gap-3 rounded-lg bg-destructive/5 border border-destructive/15 p-4"
            >
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Transaction Declined
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  The payment was not completed. Please check your payment details and try again, or use a different payment method.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-widest">
                  Transaction Details
                </span>
              </div>
              <Separator className="opacity-60" />
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium text-foreground text-xs bg-muted px-2 py-1 rounded">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-foreground">
                    {currency} {amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-destructive font-semibold text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    Failed
                  </span>
                </div>
              </div>
            </motion.div>

            <Separator className="opacity-60" />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="flex flex-col gap-2.5"
            >
              <Button asChild size="lg" className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                <Link to="/">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full gap-2 text-muted-foreground">
                <Link to="/">
                  Back to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-xs text-muted-foreground mt-4"
        >
          If the issue persists, please contact support.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
