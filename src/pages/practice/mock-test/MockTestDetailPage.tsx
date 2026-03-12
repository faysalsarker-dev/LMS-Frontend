import { useParams, useNavigate } from "react-router";
import { useGetMockTestBySlugQuery } from "@/redux/features/mockTest/mockTest.api";
import { MockTestStepper } from "@/components/student/mock-test/user/MockTestStepper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Info, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { SectionName } from "@/interface/mockTest.types";

const MockTestDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetMockTestBySlugQuery(slug as string, {
        skip: !slug,
    });

    const [completedSections, setCompletedSections] = useState<SectionName[]>([]);

    // Load progress from localStorage (mocking backend for now)
    useEffect(() => {
        if (slug) {
            const saved = localStorage.getItem(`mock_progress_${slug}`);
            if (saved) {
                try {
                    setCompletedSections(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse progress", e);
                }
            }
        }
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background container max-w-4xl py-12 space-y-8">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full rounded-3xl" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-destructive/10 p-4 rounded-full mb-4">
                    <Info className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Mock Test Not Found</h2>
                <p className="text-muted-foreground mb-6">The test you are looking for might have been moved or removed.</p>
                <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </div>
        );
    }

    const test = data.data;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-card border-b">
                <div className="container max-w-5xl py-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/dashboard")}
                        className="mb-6 -ml-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
                            {test.thumbnail ? (
                                <img src={test.thumbnail} alt={test.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-primary/40" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                                {test.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 items-center text-muted-foreground uppercase tracking-widest text-xs font-bold">
                                <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    Official Mock Test
                                </span>
                                <span className="h-1 w-1 rounded-full bg-muted" />
                                <span>{test.course?.title}</span>
                            </div>
                            <p className="text-lg text-muted-foreground">
                                Complete all four sections in sequence to finish the mock test. You cannot jump between sections.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Content */}
            <div className="container max-w-4xl pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold">Test Progress</h2>
                    </div>

                    <MockTestStepper
                        sections={test}
                        completedSections={completedSections}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default MockTestDetailPage;
