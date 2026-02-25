import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, ArrowRight, Receipt, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const transactionId = searchParams.get("transactionId") ?? "TXN-0000000";
  const amount = searchParams.get("amount") ?? "0.00";
  const currency = searchParams.get("currency") ?? "USD";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-background dark:to-cyan-950/30">
      {/* Subtle animated gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-success/10 to-primary/5 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/8 to-success/5 blur-3xl animate-[pulse_8s_ease-in-out_infinite_1s]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="border border-border/50 shadow-card-hover overflow-hidden backdrop-blur-sm bg-card/95">
          {/* Icon section */}
          <div className="pt-10 pb-6 flex flex-col items-center">
            <div className="relative">
              {/* Animated rings */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 -m-4 rounded-full border-2 border-success/20 animate-[pulse_3s_ease-in-out_infinite]"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="absolute inset-0 -m-8 rounded-full border border-success/10 animate-[pulse_3s_ease-in-out_infinite_0.5s]"
              />
              {/* Icon with gradient bg */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-success to-emerald-600 dark:from-success dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-success/25"
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <CheckCircle className="h-10 w-10 text-success-foreground" strokeWidth={2} />
                </motion.div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-5 text-2xl md:text-3xl font-bold text-foreground"
            >
              Payment Successful
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-muted-foreground text-sm mt-1"
            >
              Your enrollment has been confirmed
            </motion.p>
          </div>

          <CardContent className="px-6 pb-8 space-y-5">
            {/* Enrollment banner */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="flex items-start gap-3 rounded-lg bg-secondary/60 border border-secondary p-4"
            >
              <GraduationCap className="h-5 w-5 text-secondary-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-secondary-foreground text-sm">
                  Enrollment Complete
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  You now have full access to the course. Start learning at your own pace — your journey begins now!
                </p>
              </div>
            </motion.div>

            {/* Transaction details */}
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
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-foreground">
                    {currency} {amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-success font-semibold text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-[pulse_2s_ease-in-out_infinite]" />
                    Completed
                  </span>
                </div>
              </div>
            </motion.div>

            <Separator className="opacity-60" />

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="flex flex-col gap-2.5"
            >
              <Button asChild size="lg" className="w-full gap-2">
                <Link to="/">
                  <BookOpen className="h-4 w-4" />
                  Start Learning
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full gap-2 text-muted-foreground">
                <Link to="/">
                  Go to Dashboard
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
          A confirmation receipt has been sent to your email.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
