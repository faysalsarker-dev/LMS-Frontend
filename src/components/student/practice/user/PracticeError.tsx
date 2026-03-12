import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PracticeErrorProps {
  message: string;
  onRetry: () => void;
}

export const PracticeError = ({ message = "Failed to load practice", onRetry }: PracticeErrorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {message}
      </p>
      <Button onClick={onRetry} variant="default" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </motion.div>
  );
};
