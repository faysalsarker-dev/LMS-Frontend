import { Mic, LogOut, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import type { IMockQuestion } from "@/interface/mockTest.types";
import type { ISpeakingResult } from "@/utils/mock-test/speaking.utils";

interface Props {
  results: ISpeakingResult;
  questions: IMockQuestion[];
  slug: string;
}

const formatTime = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export const SpeakingResult = ({ results, questions, slug }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] container max-w-4xl mx-auto py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mic className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black">Section Complete!</h1>
        <p className="text-muted-foreground">Your recordings for the Speaking section have been submitted.</p>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
          <Clock className="h-4 w-4" />
          <span>Speaking is manually graded. Your score will be updated by the examiner.</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Marks</p>
          <p className="text-4xl font-black text-primary">— / {results.totalPossibleMarks}</p>
        </div>
        <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Submitted</p>
          <p className="text-4xl font-black text-green-600">
            {results.submittedCount} / {questions.length}
          </p>
        </div>
        <div className="bg-card border rounded-3xl p-6 text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Status</p>
          <p className="text-2xl font-black text-amber-500">Pending Review</p>
        </div>
      </div>

      {/* Per-question list */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Recording Summary
          <Badge variant="outline">{results.items.length} Questions</Badge>
        </h3>
        <div className="space-y-4">
          {results.items.map((item, idx) => {
            const q = questions[idx];
            return (
              <div
                key={item.questionId}
                className={`p-6 rounded-2xl border-2 ${
                  item.hasRecording
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-red-500/5 border-red-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={item.hasRecording ? "bg-green-500" : "bg-red-500"}>
                        Q{idx + 1} {item.hasRecording ? "Recorded" : "No Recording"}
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground uppercase">
                        {item.type.replace(/_/g, " ")}
                      </span>
                    </div>

                    {q?.questionText && (
                      <p className="text-sm text-muted-foreground">"{q.questionText}"</p>
                    )}

                    {item.hasRecording && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                        <CheckCircle className="h-4 w-4" />
                        Recording submitted · {formatTime(item.audioDurationSeconds)}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {item.marks} pts
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Button
          onClick={() => navigate(`/mock-test/${slug}`, { replace: true })}
          className="rounded-2xl px-8 py-6 text-lg font-bold gap-2"
        >
          <LogOut className="h-5 w-5" />
          Return to Overview
        </Button>
      </div>
    </div>
  );
};
