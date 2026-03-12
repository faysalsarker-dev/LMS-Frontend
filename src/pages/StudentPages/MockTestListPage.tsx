import { motion } from "framer-motion";
import { MockTestList } from "@/components/student/mock-test/user";
import { ClipboardCheck } from "lucide-react";

const MockTestListPage = () => {
  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <ClipboardCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Tests</h1>
          <p className="text-muted-foreground">
            Test your knowledge with specialized exam simulations
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <MockTestList />
      </motion.div>
    </div>
  );
};

export default MockTestListPage;
