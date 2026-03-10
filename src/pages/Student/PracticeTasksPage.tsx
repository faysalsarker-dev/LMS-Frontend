import { motion } from "framer-motion";
import { useGetUserPracticesQuery } from "@/redux/features/practice/practice.api";
import { PracticeCard } from "@/components/modules/practice/PracticeCard";
import type { Practice } from "@/components/modules/practice";
import { Trophy, Loader2, BookOpen } from "lucide-react";

const PracticeTasksPage = () => {
    const { data: userPracticesData, isLoading } = useGetUserPracticesQuery({});

    return (
        <div className="p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Trophy className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Practice Tasks</h1>
                    <p className="text-muted-foreground">Review your past practice sessions and improve your skills</p>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading practices...</p>
                </div>
            ) : userPracticesData?.data && userPracticesData?.data.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {userPracticesData?.data.map((practice: Practice) => (
                        <PracticeCard key={practice._id} data={practice} />
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-16 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Practice History</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Complete lessons and exercises to see your practice history here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PracticeTasksPage;
