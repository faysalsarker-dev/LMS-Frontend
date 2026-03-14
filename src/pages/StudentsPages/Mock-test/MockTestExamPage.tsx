import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetSectionByIdQuery } from "@/redux/features/mockTest/mockTestSection.api";
import { ExamTimer } from "@/components/student/mock-test/MockTestTimer";
import { QuestionRenderer } from "@/components/student/mock-test/question/QuestionRenderer";
import { QuestionNavigator } from "@/components/student/mock-test/QuestionNavigator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  CheckCircle,
  Loader2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import type {
  AnswerState,
  QuestionAnswer,
  IMockQuestion,
} from "@/interface/mockTest.types";
import { motion } from "framer-motion";
import { useSubmitMockTestMutation } from "@/redux/features/mockTestSubmission/mockTestSubmission.api";
import { handleListeningSubmission } from "@/utils/mock-test/listening.utils";
import { handleReadingSubmission } from "@/utils/mock-test/reading.utils";

const MockTestExamPage = () => {
  const { slug, sectionId } = useParams<{ slug: string; sectionId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSectionByIdQuery(sectionId as string, {
    skip: !sectionId,
  });
const [submitMockTest, { isLoading: isSubmitting }] = useSubmitMockTestMutation();


  const section = data?.data;
  const questions: IMockQuestion[] = section?.questions ?? [];

  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{
    correctCount: number;
    earnedMarks: number;
    totalPossibleMarks: number;
    items: {
      questionId: string;
      isCorrect: boolean;
      marks: number;
      studentAnswer: string;
      correctAnswer: string;
      type: string;
    }[];
  } | null>(null);

  // Get or compute the deadline
  const [deadline, setDeadline] = useState<number>(() => {
    const stored = localStorage.getItem(`exam_deadline_${sectionId}`);
    if (stored) return Number(stored);
    return 0; // will be set once section loads
  });

  useEffect(() => {
    if (section && !deadline) {
      const d = Date.now() + section.timeLimit * 60 * 1000;
      localStorage.setItem(`exam_deadline_${sectionId}`, String(d));
      setDeadline(d);
    }
  }, [section, deadline, sectionId]);

  // Tab visibility → auto-submit
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        handleSubmit({ autoSubmitted: true });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, submitted]);

  const handleSubmit = useCallback(
    async ({ autoSubmitted = false }: { autoSubmitted?: boolean } = {}) => {
      if (submitted) return;
      setSubmitted(true);

      // 1. Calculate Results & Submit based on section type
      try {
        switch (section?.name) {
          case "listening":
            await handleListeningSubmission({
              questions,
              answers,
              sectionId: sectionId!,
              section,
              setResults,
              submitMockTest,
            });
            break;

          case "reading":
            await handleReadingSubmission({
              questions,
              answers,
              sectionId: sectionId!,
              section,
              setResults,
              submitMockTest,
            });
            break;

          default:
            console.warn(`No handler for section: ${section?.name}. Using fallback.`);
            const studentAnswers = Object.entries(answers).reduce((acc, [id, ans]) => {
              acc[id] = ans.selectedOptionId || 
                       ans.gapSelections || 
                       ans.segmentOrder || 
                       ans.subQuestionSelections || 
                       ans.textAnswer || 
                       ans.wordOrder;
              return acc;
            }, {} as Record<string, any>);

            const payload = {
              course: (section?.mockTest as any)?.course?._id || (section?.mockTest as any)?.course,
              mockTest: (section?.mockTest as any)?._id || section?.mockTest,
              sections: [
                {
                  sectionId: sectionId as string,
                  score: 0,
                  isAutoGraded: section?.questions?.[0]?.isAutoMarked || false,
                  studentAnswers,
                },
              ],
            };
            console.log("Submitting section (fallback):", payload);
            // await submitMockTest(payload).unwrap();
            break;
        }
      } catch (error) {
        console.error("Submission failed:", error);
        toast.error("Failed to submit test. Please try again.");
        setSubmitted(false); // Allow retry if submission fails
        return;
      }
      

      // Clean up localStorage timer
      localStorage.removeItem(`exam_deadline_${sectionId}`);

      // Mark completed in parent (via localStorage flag)
      localStorage.setItem(`section_submitted_${slug}_${section?.name}`, "true");

      toast.success(
        autoSubmitted ? "Section auto-submitted!" : "Section submitted!",
        { description: `${section?.name} section recorded.` }
      );

      setTimeout(() => {
        navigate(`/mock-test/${slug}`, { replace: true });
      }, 3000);
    },
    [answers, sectionId, section, slug, submitted, navigate]
  );

  const handleAnswerChange = (answer: QuestionAnswer) => {
    setAnswers((prev) => ({ ...prev, [answer.questionId]: answer }));
  };

  // ----- Render states -----
  if (isLoading || !deadline) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!section) {
    return <div className="p-8 text-center">Section not found.</div>;
  }

  if (submitted && results) {
    return (
      <div className="min-h-[80vh] container max-w-4xl mx-auto py-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-black">Section Complete!</h1>
          <p className="text-muted-foreground">Your performance in the {section.name} section.</p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</p>
            <p className="text-4xl font-black text-primary">{results.earnedMarks} / {results.totalPossibleMarks}</p>
          </div>
          <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Correct</p>
            <p className="text-4xl font-black text-green-600">{results.correctCount} / {questions.length}</p>
          </div>
          <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
            <p className="text-4xl font-black text-blue-600">
              {Math.round((results.correctCount / questions.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            Detailed Review
            <Badge variant="outline">{results.items.length} Questions</Badge>
          </h3>
          <div className="space-y-4">
            {results.items.map((item, idx) => (
              <div key={item.questionId} className={`p-6 rounded-2xl border-2 ${item.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={item.isCorrect ? 'bg-green-500' : 'bg-red-500'}>
                        Q{idx+1} {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground uppercase">{item.type.replace(/_/g, ' ')}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-bold text-muted-foreground">Your Answer:</p>
                        <p className={item.isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{item.studentAnswer}</p>
                      </div>
                      {!item.isCorrect && (
                        <div className="space-y-1">
                          <p className="font-bold text-muted-foreground">Correct Answer:</p>
                          <p className="text-green-700 font-semibold">{item.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-bold">{item.marks} pts</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
           <Button onClick={() => navigate(`/mock-test/${slug}`, { replace: true })} className="rounded-2xl px-8 py-6 text-lg font-bold gap-2">
             <LogOut className="h-5 w-5" />
             Return to Overview
           </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const questionIds = questions.map((q) => q._id ?? "");

  return (
    <div className="flex flex-col min-h-[90vh]  ">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="container max-w-6xl mx-auto py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="uppercase font-bold tracking-tight border-primary/30 text-primary"
            >
              {section.name}
            </Badge>
            <span className="hidden md:block text-sm font-semibold text-muted-foreground">
              Q {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <ExamTimer deadline={deadline} onExpire={() => handleSubmit({ autoSubmitted: true })} />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleSubmit()}
              className="rounded-xl bg-green-600 hover:bg-green-700 font-bold gap-1.5"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Submit Section</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 rounded-xl"
              onClick={() => {
                if (confirm("Exit? Your current section progress will be lost.")) {
                  navigate(`/my-dashboard/mock-test/${slug}`);
                }
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={false}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 container  py-10 flex gap-8  max-w-6xl mx-auto">
        {/* Question area */}
        <div className="flex-1 min-w-0">
          {questions.length > 0 && currentQuestion ? (
            <QuestionRenderer
              key={currentQuestion._id}
              question={currentQuestion}
              answer={answers[currentQuestion._id ?? ""]}
              onChange={handleAnswerChange}
              index={currentIndex}
              total={questions.length}
            />
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No questions in this section.
            </div>
          )}
        </div>

        {/* Question navigator sidebar (desktop) */}
        <div className="hidden lg:block w-52 shrink-0 pt-2">
          <QuestionNavigator
            total={questions.length}
            current={currentIndex}
            answers={answers}
            questionIds={questionIds}
            onChange={setCurrentIndex}
          />
        </div>
      </div>

      {/* ─── Sticky Footer Nav ─── */}
      <div className="sticky bottom-0 bg-background border-t py-3">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div />

          {/* Mobile navigator */}
          <div className="lg:hidden flex items-center gap-2">
            {questions.slice(0, 10).map((_, i) => (
              <button
                key={i}
                onClick={() => i >= currentIndex && setCurrentIndex(i)}
                disabled={i < currentIndex}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                  i === currentIndex
                    ? "bg-primary text-white"
                    : answers[questionIds[i]]
                    ? "bg-green-500/20 text-green-700"
                    : "bg-muted text-muted-foreground"
                } ${i < currentIndex && "opacity-50 cursor-not-allowed"}`}
              >
                {i + 1}
              </button>
            ))}
            {questions.length > 10 && (
              <span className="text-xs text-muted-foreground">...</span>
            )}
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={() => handleSubmit()}
              className="rounded-xl px-8 bg-green-600 hover:bg-green-700 font-bold gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Submit
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
              className="rounded-xl px-8 gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockTestExamPage;
