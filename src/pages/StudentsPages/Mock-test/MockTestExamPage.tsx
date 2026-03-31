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
  Mic,
} from "lucide-react";
import { toast } from "sonner";
import NoDataFound from "@/components/shared/NoDataFound";
import type {
  AnswerState,
  QuestionAnswer,
  IMockQuestion,
} from "@/interface/mockTest.types";
import { motion } from "framer-motion";
import {
  useSubmitMockTestMutation,
  useSubmitSpeakingMockTestMutation,
} from "@/redux/features/mockTestSubmission/mockTestSubmission.api";
import { handleListeningSubmission } from "@/utils/mock-test/listening.utils";
import { handleReadingSubmission } from "@/utils/mock-test/reading.utils";
import { handleWritingSubmission } from "@/utils/mock-test/writing.utils";
import {
  calculateSpeakingResult,
  submitSpeakingQuestion,
} from "@/utils/mock-test/speaking.utils";
import { ListeningResult } from "@/components/student/mock-test/results/ListeningResult";
import { ReadingResult } from "@/components/student/mock-test/results/ReadingResult";
import { WritingResult } from "@/components/student/mock-test/results/WritingResult";
import { SpeakingResult } from "@/components/student/mock-test/results/SpeakingResult";

const MockTestExamPage = () => {
  const { slug, sectionId } = useParams<{ slug: string; sectionId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSectionByIdQuery(sectionId as string, {
    skip: !sectionId,
  });
  const [submitMockTest] = useSubmitMockTestMutation();
  const [submitSpeakingMockTest] = useSubmitSpeakingMockTestMutation();

  const section = data?.data;
  const questions: IMockQuestion[] = section?.questions ?? [];
  const isSpeaking = section?.name === "speaking";

  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  // Track which question indices have had their audio submitted already
  const [submittedQuestionIndices, setSubmittedQuestionIndices] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<any | null>(null);

  // Get or compute the deadline
  const [deadline, setDeadline] = useState<number>(() => {
    const stored = localStorage.getItem(`exam_deadline_${sectionId}`);
    if (stored) return Number(stored);
    return 0;
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

  // ── Submit current speaking question audio, then advance ──────────────────
  const handleSpeakingNext = useCallback(async () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    const alreadySubmitted = submittedQuestionIndices.has(currentIndex);
    const hasAudio = !!answers[currentQuestion._id!]?.audioBlob;

    // Submit audio if not yet submitted
    if (!alreadySubmitted && hasAudio) {
      setIsSubmittingQuestion(true);
      try {
        await submitSpeakingQuestion({
          question: currentQuestion,
          answers,
          sectionId: sectionId!,
          section,
          submitSpeakingMockTest: submitSpeakingMockTest as any,
        });
        setSubmittedQuestionIndices((prev) => new Set(prev).add(currentIndex));
        toast.success(`Q${currentIndex + 1} recording submitted!`);
      } catch (err) {
        console.error("Failed to submit speaking question:", err);
        toast.error("Failed to submit recording. Please try again.");
        setIsSubmittingQuestion(false);
        return;
      }
      setIsSubmittingQuestion(false);
    } else if (!hasAudio) {
      toast.warning("No recording found for this question. Moving on.");
    }

    // Advance to next question or final submit
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
    }
  }, [currentIndex, questions, answers, submittedQuestionIndices, sectionId, section, submitSpeakingMockTest]);

  // ── Final submit for all sections ─────────────────────────────────────────
  const handleSubmit = useCallback(
    async ({ autoSubmitted = false }: { autoSubmitted?: boolean } = {}) => {
      if (submitted) return;
      setSubmitted(true);

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

          case "writing":
            await handleWritingSubmission({
              questions,
              answers,
              sectionId: sectionId!,
              section,
              setResults,
              submitMockTest,
            });
            break;

          case "speaking": {
            // Submit the last question's audio if not yet done
            const lastQuestion = questions[currentIndex];
            if (lastQuestion && !submittedQuestionIndices.has(currentIndex) && answers[lastQuestion._id!]?.audioBlob) {
              try {
                await submitSpeakingQuestion({
                  question: lastQuestion,
                  answers,
                  sectionId: sectionId!,
                  section,
                  submitSpeakingMockTest: submitSpeakingMockTest as any,
                });
                setSubmittedQuestionIndices((prev) => new Set(prev).add(currentIndex));
              } catch (err) {
                console.warn("Last question audio submission failed:", err);
              }
            }
            // Compute the speaking result (for display — all pending manual grading)
            const speakingResult = calculateSpeakingResult(questions, answers);
            setResults(speakingResult);
            break;
          }

         
        }
      } catch (error) {
        console.error("Submission failed:", error);
        toast.error("Failed to submit test. Please try again.");
        setSubmitted(false);
        return;
      }

      // Clean up
      localStorage.removeItem(`exam_deadline_${sectionId}`);
      localStorage.setItem(`section_submitted_${slug}_${section?.name}`, "true");

      toast.success(
        autoSubmitted ? "Section auto-submitted!" : "Section submitted!",
        { description: `${section?.name} section recorded.` }
      );
    },
    [answers, currentIndex, sectionId, section, slug, submitted, submittedQuestionIndices, navigate, submitSpeakingMockTest]
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
    if (section.name === "listening") {
      return <ListeningResult results={results} questions={questions} slug={slug!} />;
    }
    if (section.name === "reading") {
      return <ReadingResult results={results} questions={questions} slug={slug!} />;
    }
    if (section.name === "writing") {
      return <WritingResult results={results} questions={questions} slug={slug!} />;
    }
    if (section.name === "speaking") {
      return <SpeakingResult results={results} questions={questions} slug={slug!} />;
    }
    return <div className="p-8 text-center text-red-500">Unknown section type for results.</div>;
  }

  const currentQuestion = questions[currentIndex];
  const questionIds = questions.map((q) => q._id ?? "");
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentHasAudio = !!answers[currentQuestion?._id ?? ""]?.audioBlob;
  const currentAlreadySubmitted = submittedQuestionIndices.has(currentIndex);

  return (
    <div className="flex flex-col min-h-[90vh]">
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
            {/* Speaking: show submitted count */}
            {isSpeaking && (
              <Badge variant="outline" className="text-green-600 border-green-500/30 gap-1">
                <Mic className="h-3 w-3" />
                {submittedQuestionIndices.size}/{questions.length} submitted
              </Badge>
            )}
          </div>

          <ExamTimer deadline={deadline} onExpire={() => handleSubmit({ autoSubmitted: true })} />

          <div className="flex items-center gap-2">
            {/* For speaking, only show Submit Section on the last question */}
            {(!isSpeaking || isLastQuestion) && (
              <Button
                size="sm"
                onClick={() => handleSubmit()}
                className="rounded-xl bg-green-600 hover:bg-green-700 font-bold gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Submit Section</span>
              </Button>
            )}
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
      <div className="flex-1 container py-10 flex gap-8 max-w-6xl mx-auto">
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
            <div className="w-full">
              <NoDataFound message="No questions in this section." />
            </div>
          )}
        </div>

        {/* Question navigator sidebar (desktop — hidden for speaking since linear) */}
        {!isSpeaking && (
          <div className="hidden lg:block w-52 shrink-0 pt-2">
            <QuestionNavigator
              total={questions.length}
              current={currentIndex}
              answers={answers}
              questionIds={questionIds}
              onChange={setCurrentIndex}
            />
          </div>
        )}
      </div>

      {/* ─── Sticky Footer Nav ─── */}
      <div className="sticky bottom-0 bg-background border-t py-3">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div />

          {/* Mobile navigator (not for speaking) */}
          {!isSpeaking && (
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
          )}

          {/* Footer action button */}
          {isSpeaking ? (
            // Speaking: Next submits current audio, final question shows Submit
            isLastQuestion ? (
              <Button
                onClick={() => handleSubmit()}
                disabled={submitted}
                className="rounded-xl px-8 bg-green-600 hover:bg-green-700 font-bold gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Section
              </Button>
            ) : (
              <Button
                onClick={handleSpeakingNext}
                disabled={isSubmittingQuestion}
                className="rounded-xl px-8 gap-2"
              >
                {isSubmittingQuestion ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {currentHasAudio && !currentAlreadySubmitted
                      ? "Submit & Next"
                      : "Next"}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )
          ) : isLastQuestion ? (
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
