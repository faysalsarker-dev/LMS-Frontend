import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetSectionByIdQuery } from "@/redux/features/mockTest/mockTestSection.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    AlertTriangle,
    ChevronRight,
    Loader2,
    ShieldAlert,
    CheckCircle,
    LogOut,
    ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import type { IMockQuestion } from "@/interface/mockTest.types";
import { Badge } from "@/components/ui/badge";
import { MockQuestionRenderer  } from "./MockQuestionRenderer";
import { ExamTimer  } from "./MockTestTimer";

export const MockTestSectionExecutor = () => {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();
    const { data, isLoading } = useGetSectionByIdQuery(sectionId as string, {
        skip: !sectionId,
    });

    const [step, setStep] = useState<"disclaimer" | "active" | "submitting" | "completed">("disclaimer");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const section = data?.data;
    const questions: IMockQuestion[] = section?.questions || [];

    // --- Restrictions Logic ---
    useEffect(() => {
        if (step === "active") {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault();
                e.returnValue = "You are currently in a test. Progress will be lost if you leave.";
            };

            const handleVisibilityChange = () => {
                if (document.visibilityState === "hidden") {
                    toast.warning("Navigation detected! Stay on the test tab.", {
                        description: "Future versions may automatically disqualify the test.",
                        position: "top-center",
                        duration: 5000,
                    });
                }
            };

            window.addEventListener("beforeunload", handleBeforeUnload);
            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
    }, [step]);

    // --- Handlers ---
    const handleStart = () => setStep("active");

    const handleSubmit = () => {
        setStep("submitting");
        // Mocking submission logic
        setTimeout(() => {
            // Save progress to localStorage (placeholder for backend)
            const mockSlug = (section?.mockTest as any)?.slug || "unknown";
            const saved = localStorage.getItem(`mock_progress_${mockSlug}`);
            let progress = saved ? JSON.parse(saved) : [];
            if (!progress.includes(section?.name)) {
                progress.push(section?.name);
            }
            localStorage.setItem(`mock_progress_${mockSlug}`, JSON.stringify(progress));

            setStep("completed");
            toast.success("Test submitted successfully!");
        }, 1500);
    };

    const setAnswer = (questionId: string, answer: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!section) return <div>Section not found.</div>;

    // --- Disclaimer Step ---
    if (step === "disclaimer") {
        return (
            <div className="max-w-3xl mx-auto py-12">
                <Card className="p-8 space-y-8 rounded-3xl border-2 border-primary/20 shadow-2xl shadow-primary/5">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-primary/10 mb-2">
                            <ShieldAlert className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-extrabold capitalize">{section.name} Test</h1>
                        <p className="text-muted-foreground text-lg">Detailed information and rules before you begin.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/50 border">
                            <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Time Limit</span>
                            <p className="text-2xl font-black">{section.timeLimit} Minutes</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/50 border">
                            <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Questions</span>
                            <p className="text-2xl font-black">{questions.length}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Critical Instructions:
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex gap-3">
                                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-1">1</span>
                                <span>You <b>cannot reload</b> the page or navigate away once the test starts.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-1">2</span>
                                <span>Switching tabs or minimizing the browser will be logged.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-1">3</span>
                                <span>The test will <b>automatically submit</b> when the timer reaches zero.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-1">4</span>
                                <span>Ensure your internet connection is stable.</span>
                            </li>
                        </ul>
                    </div>

                    <Button onClick={handleStart} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 group">
                        I Understand, Start Test
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Card>
            </div>
        );
    }

    // --- Completed Step ---
    if (step === "completed") {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
                <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black">Test Submitted!</h1>
                    <p className="text-xl text-muted-foreground">You have successfully completed the {section.name} part.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate(`/practice/mock-test/${(section.mockTest as any).slug}`)}
                    className="h-12 rounded-xl px-10 border-green-500/50 hover:bg-green-500/5"
                >
                    Return to Test Overview
                </Button>
            </div>
        );
    }

    // --- Active Test Step ---
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col min-h-[90vh]">
            {/* Test Sticky Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="container max-w-6xl py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="h-8 rounded-full border-primary/30 text-primary uppercase font-bold tracking-tighter">
                            {section.name}
                        </Badge>
                        <h2 className="hidden md:block font-bold">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </h2>
                    </div>

                    <ExamTimer durationMinutes={section.timeLimit} onTimeUp={handleSubmit} />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => {
                            if (confirm("Are you sure you want to exit? Your progress for this section will be lost.")) {
                                navigate(`/practice/mock-test/${(section.mockTest as any).slug}`);
                            }
                        }}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Quit Test
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-muted overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container max-w-4xl flex-1 py-12">
                {questions.length > 0 ? (
                    <MockQuestionRenderer
                        question={currentQuestion}
                        index={currentQuestionIndex}
                        total={questions.length}
                        value={answers[currentQuestion._id || '']}
                        onChange={(val) => setAnswer(currentQuestion._id || '', val)}
                    />
                ) : (
                    <div className="text-center py-20">No questions found in this section.</div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="sticky bottom-0 bg-background border-t p-4">
                <div className="container max-w-4xl flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="rounded-xl px-6"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={step === "submitting"}
                            className="rounded-xl px-8 bg-green-600 hover:bg-green-700 font-bold"
                        >
                            {step === "submitting" ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Submit {section.name} Part
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            className="rounded-xl px-8"
                        >
                            Next Question
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
