import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetSectionByIdQuery } from "@/redux/features/mockTest/mockTestSection.api";
import { ExamTimer } from "@/components/student/mock-test/user/MockTestTimer";
import { QuestionRenderer } from "@/components/student/mock-test/user/question/QuestionRenderer";
import { QuestionNavigator } from "@/components/student/mock-test/user/QuestionNavigator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
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

const MockTestExamPage = () => {
  const { slug, sectionId } = useParams<{ slug: string; sectionId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSectionByIdQuery(sectionId as string, {
    skip: !sectionId,
  });
  const section = data?.data;
  const questions: IMockQuestion[] = section?.questions ?? [];

  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

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
    ({ autoSubmitted = false }: { autoSubmitted?: boolean } = {}) => {
      if (submitted) return;
      setSubmitted(true);

      const payload = {
        sectionId,
        sectionName:   section?.name,
        autoSubmitted,
        answers: Object.values(answers),
      };
      console.log("Submitting section:", payload);
      // TODO: call API – payload shape ready above

      // Clean up localStorage timer
      localStorage.removeItem(`exam_deadline_${sectionId}`);

      // Mark completed in parent (via localStorage flag)
      localStorage.setItem(`section_submitted_${slug}_${section?.name}`, "true");

      toast.success(
        autoSubmitted ? "Section auto-submitted!" : "Section submitted!",
        { description: `${section?.name} section recorded.` }
      );

      setTimeout(() => {
        navigate(`/my-dashboard/mock-test/${slug}`, { replace: true });
      }, 1500);
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

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 p-8">
        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black">Section Submitted!</h1>
          <p className="text-xl text-muted-foreground capitalize">
            {section.name} section recorded.
          </p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Returning to overview...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const questionIds = questions.map((q) => q._id ?? "");

  return (
    <div className="flex flex-col min-h-[90vh]">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="container max-w-6xl py-3 flex items-center justify-between gap-4">
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
      <div className="flex-1 container max-w-6xl py-10 flex gap-8">
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
        <div className="container max-w-6xl flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="rounded-xl px-6 gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* Mobile navigator */}
          <div className="lg:hidden flex items-center gap-2">
            {questions.slice(0, 10).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                  i === currentIndex
                    ? "bg-primary text-white"
                    : answers[questionIds[i]]
                    ? "bg-green-500/20 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
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
