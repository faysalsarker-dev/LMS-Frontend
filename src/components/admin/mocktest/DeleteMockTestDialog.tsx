import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";
import type { IMockTest } from "@/interface/mockTest.types";

interface DeleteMockTestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mockTest: IMockTest | null;
    onConfirm: () => void;
    isDeleting: boolean;
}

export const DeleteMockTestDialog = ({
    open,
    onOpenChange,
    mockTest,
    onConfirm,
    isDeleting,
}: DeleteMockTestDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="p-0 border-0 overflow-hidden max-w-md">
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="rounded-xl bg-card shadow-xl overflow-hidden"
                        >
                            {/* Gradient header */}
                            <div className="relative bg-gradient-to-br from-destructive/20 to-destructive/5 p-6">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--destructive)/0.15),transparent_50%)]" />
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                    className="relative flex justify-center"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 rounded-full bg-destructive/30 blur-xl"
                                        />
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/30">
                                            <Trash2 className="h-10 w-10 text-destructive" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <AlertDialogHeader className="text-center">
                                    <AlertDialogTitle className="text-xl font-semibold">
                                        Delete Mock Test?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground mt-2">
                                        This will permanently delete{" "}
                                        <span className="font-medium text-foreground">
                                            "{mockTest?.title}"
                                        </span>{" "}
                                        and all its sections and questions. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter className="mt-6 flex gap-3 sm:flex-row">
                                    <AlertDialogCancel asChild>
                                        <Button variant="outline" className="flex-1">
                                            Cancel
                                        </Button>
                                    </AlertDialogCancel>
                                    <Button
                                        variant="destructive"
                                        onClick={onConfirm}
                                        disabled={isDeleting}
                                        className="flex-1"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Deleting…
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </>
                                        )}
                                    </Button>
                                </AlertDialogFooter>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AlertDialogContent>
        </AlertDialog>
    );
};
