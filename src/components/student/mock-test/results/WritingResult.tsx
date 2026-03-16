import { CheckCircle, LogOut, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import type { IMockQuestion } from "@/interface/mockTest.types";
import type { IWritingResult } from "@/utils/mock-test/writing.utils";

interface Props {
  results: IWritingResult;
  questions: IMockQuestion[];
  slug: string;
}

export const WritingResult = ({ results, questions, slug }: Props) => {
  const navigate = useNavigate();

  const isFullyAutoGraded = questions.every((q) => q.isAutoMarked);
  const autoMarkedQuestionsCount = questions.filter((q) => q.isAutoMarked).length;

  return (
    <div className="min-h-[80vh] container max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black">Section Complete!</h1>
        <p className="text-muted-foreground">Your performance in the Writing section.</p>
        {!isFullyAutoGraded && (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
            <Clock className="h-4 w-4" />
            <span>Some questions require manual grading. Final score will be updated later.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</p>
          <p className="text-4xl font-black text-primary">
            {results.earnedMarks} {!isFullyAutoGraded && <span className="text-2xl text-amber-500">*</span>} / {results.totalPossibleMarks}
          </p>
        </div>
        <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Correct</p>
          <p className="text-4xl font-black text-green-600">{results.correctCount} / {autoMarkedQuestionsCount}</p>
        </div>
        <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
          <p className="text-4xl font-black text-blue-600">
            {autoMarkedQuestionsCount > 0
              ? Math.round((results.correctCount / autoMarkedQuestionsCount) * 100)
              : 0}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Detailed Review
          <Badge variant="outline">{results.items.length} Questions</Badge>
        </h3>
        <div className="space-y-4">
          {results.items.map((item, idx) => {
            let statusClass = "bg-muted/5 border-muted/20";
            let statusText = "Pending Grading";
            let badgeClass = "bg-amber-500";

            if (item.isAutoMarked) {
              statusClass = item.isCorrect
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20";
              statusText = item.isCorrect ? "Correct" : "Incorrect";
              badgeClass = item.isCorrect ? "bg-green-500" : "bg-red-500";
            }

            return (
              <div key={item.questionId} className={`p-6 rounded-2xl border-2 ${statusClass}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={badgeClass}>
                        Q{idx + 1} {statusText}
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        {item.type.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                      <div className="space-y-1">
                        <p className="font-bold text-muted-foreground">Your Answer:</p>
                        <p className={item.isAutoMarked && item.isCorrect ? "text-green-700 font-semibold" : "text-foreground font-semibold whitespace-pre-wrap"}>
                          {item.studentAnswer}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-muted-foreground">Correct Answer / Info:</p>
                        <p className="text-muted-foreground font-medium">{item.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {item.isAutoMarked ? item.earnedMarks : "?"} / {item.marks} pts
                  </Badge>
                </div>
              </div>
            );
          })}
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
};
