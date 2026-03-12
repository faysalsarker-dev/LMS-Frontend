import { useState, useEffect, useMemo } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

// Extract gap ids from passageText like "{{gap_1}}"
const GAP_REGEX = /(\{\{gap_\d+\}\})/g;

export const FillInTheGapQuestion = ({ question, answer, onChange }: Props) => {
  const [gapSelections, setGapSelections] = useState<Record<string, string>>(
    answer?.gapSelections ?? {}
  );

  // Sync if external answer changes (e.g. nav back)
  useEffect(() => {
    setGapSelections(answer?.gapSelections ?? {});
  }, [question._id]);

  const parts = useMemo(
    () => (question.passageText ?? "").split(GAP_REGEX),
    [question.passageText]
  );

  const usedOptionIds = Object.values(gapSelections);

  const handleGapSelect = (gapId: string, optionId: string) => {
    const next = { ...gapSelections, [gapId]: optionId };
    setGapSelections(next);
    onChange({ questionId: question._id!, questionType: question.type, gapSelections: next });
  };

  const clearGap = (gapId: string) => {
    const next = { ...gapSelections };
    delete next[gapId];
    setGapSelections(next);
    onChange({ questionId: question._id!, questionType: question.type, gapSelections: next });
  };

  const getOptionText = (optionId: string) =>
    question.wordPool?.find((o) => o.optionId === optionId)?.text ?? optionId;

  return (
    <div className="space-y-8">
      {/* Word bank */}
      <div className="p-5 rounded-2xl bg-muted/40 border">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Word Bank</p>
        <div className="flex flex-wrap gap-2">
          {question.wordPool?.map((opt) => {
            const isUsed = usedOptionIds.includes(opt.optionId);
            return (
              <button
                key={opt.optionId}
                disabled={isUsed}
                onClick={() => {
                  // Find first empty gap and fill it
                  const emptyGap = parts.find(
                    (p) => p.match(/^\{\{gap_\d+\}\}$/) && !gapSelections[p.replace(/[{}]/g, "")]
                  );
                  if (emptyGap) {
                    const gapId = emptyGap.replace(/[{}]/g, ""); // "gap_1"
                    handleGapSelect(gapId, opt.optionId);
                  }
                }}
                className={cn(
                  "px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                  isUsed
                    ? "opacity-40 cursor-not-allowed bg-muted border-muted"
                    : "bg-primary/5 border-primary/20 hover:border-primary hover:bg-primary/10 cursor-pointer"
                )}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Passage with gaps */}
      <div className="p-6 rounded-3xl bg-card border-2 border-primary/10 text-lg leading-relaxed">
        {parts.map((part, i) => {
          const gapMatch = part.match(/^\{\{(gap_\d+)\}\}$/);
          if (gapMatch) {
            const gapId = gapMatch[1];
            const selected = gapSelections[gapId];
            return (
              <span key={i} className="inline-flex items-center mx-1 align-middle">
                {selected ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-xl text-sm font-bold shadow-md">
                    {getOptionText(selected)}
                    <button onClick={() => clearGap(gapId)} className="hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : (
                  <span className="inline-block min-w-[80px] border-b-2 border-primary/50 text-center text-sm text-muted-foreground px-2 pb-0.5">
                    _____
                  </span>
                )}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
};
