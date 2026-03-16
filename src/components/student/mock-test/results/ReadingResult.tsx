import { CheckCircle, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import type { IMockQuestion } from "@/interface/mockTest.types";
import type { IReadingResult } from "@/utils/mock-test/reading.utils";

interface Props {
  results: IReadingResult;
  questions: IMockQuestion[];
  slug: string;
}

export const ReadingResult = ({ results, questions, slug }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] container max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-4xl font-black">Section Complete!</h1>
        <p className="text-muted-foreground">Your performance in the Reading section.</p>
      </div>

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
            {questions.length > 0 ? Math.round((results.correctCount / questions.length) * 100) : 0}%
          </p>
        </div>
      </div>

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
                      Q{idx + 1} {item.isCorrect ? 'Correct' : 'Incorrect'}
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
                <Badge variant="outline" className="font-bold">{item.earnedMarks} / {item.marks} pts</Badge>
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
};
