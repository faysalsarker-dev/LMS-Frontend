import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateMockTestDialog } from "@/components/admin/mocktest";

const CreateMockTestPage = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) navigate("/dashboard/mock-tests");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="p-6 space-y-4">
        {/* Breadcrumb-style header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/mock-tests")}
            className="rounded-xl gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Create Mock Test</h1>
          </div>
        </div>

        {/* The dialog opens immediately on mount */}
        <CreateMockTestDialog
          open={open}
          onOpenChange={handleOpenChange}
          onSuccess={() => navigate("/dashboard/mock-tests")}
        />
      </div>
    </motion.div>
  );
};

export default CreateMockTestPage;
