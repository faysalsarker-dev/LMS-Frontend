import {  useGetStudentMockTestQuery } from "@/redux/features/mockTest/mockTest.api";

import { MockTestCard } from "./MockTestCard";
import { Loader2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { IMockTest } from "@/interface/mockTest.types";

export const MockTestList = () => {
   
    const { data: studentMockTestsData, isLoading } = useGetStudentMockTestQuery({});

 




    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading mock tests...</p>
            </div>
        );
    }


    if (studentMockTestsData?.data?.length === 0) {
        return (
            <div className="text-center py-16 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Mock Tests Available</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Enroll in courses to unlock their specialized mock tests and track your progress.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentMockTestsData?.data?.map((test: IMockTest, index: number) => (
                <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <MockTestCard test={test} />
                </motion.div>
            ))}
        </div>
    );
};
