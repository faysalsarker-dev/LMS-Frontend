import { useState, useEffect, useMemo } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const WordToSentenceQuestion = ({ question, answer, onChange }: Props) => {
  const shuffled = useMemo(() => shuffle(question.wordTokens ?? []), [question._id]);

  const [wordOrder, setWordOrder] = useState<string[]>(answer?.wordOrder ?? []);
  const [bankPool, setBankPool] = useState<string[]>(() => {
    if (answer?.wordOrder && answer.wordOrder.length > 0) {
      // Re-compute remaining bank
      const used = [...answer.wordOrder];
      return shuffled.reduce<string[]>((acc, w) => {
        const idx = used.indexOf(w);
        if (idx !== -1) { used.splice(idx, 1); }
        else { acc.push(w); }
        return acc;
      }, []);
    }
    return shuffled;
  });

  useEffect(() => {
    setWordOrder(answer?.wordOrder ?? []);
    setBankPool(answer?.wordOrder?.length ? 
      shuffled.filter(w => !answer.wordOrder?.includes(w)) : 
      shuffled
    );
  }, [question._id]);

  const addWord = (word: string, bankIdx: number) => {
    const newOrder = [...wordOrder, word];
    const newBank = [...bankPool];
    newBank.splice(bankIdx, 1);
    setWordOrder(newOrder);
    setBankPool(newBank);
    onChange({ questionId: question._id!, questionType: question.type, wordOrder: newOrder });
  };

  const removeWord = (sentenceIdx: number) => {
    const word = wordOrder[sentenceIdx];
    const newOrder = [...wordOrder];
    newOrder.splice(sentenceIdx, 1);
    setWordOrder(newOrder);
    setBankPool((prev) => [...prev, word]);
    onChange({ questionId: question._id!, questionType: question.type, wordOrder: newOrder });
  };

  const clear = () => {
    setWordOrder([]);
    setBankPool(shuffled);
    onChange({ questionId: question._id!, questionType: question.type, wordOrder: [] });
  };

  return (
    <div className="space-y-8">
      <p className="font-semibold text-muted-foreground text-center">
        Arrange the words to form a correct sentence:
      </p>

      {/* Word bank */}
      <div className="p-5 rounded-2xl bg-muted/40 border min-h-[72px]">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Word Bank</p>
        <div className="flex flex-wrap gap-2">
          {bankPool.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => addWord(word, idx)}
              className="px-4 py-2 rounded-xl border-2 bg-primary/5 border-primary/20 hover:border-primary hover:bg-primary/10 text-sm font-semibold transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Sentence builder */}
      <div className="p-5 rounded-2xl bg-card border-2 border-primary/10 min-h-[72px]">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Your Sentence</p>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {wordOrder.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => removeWord(idx)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-all group"
            >
              {word}
              <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
            </button>
          ))}
          {wordOrder.length === 0 && (
            <span className="text-muted-foreground text-sm italic">Click words above to build your sentence...</span>
          )}
        </div>
      </div>

      {wordOrder.length > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clear} className="rounded-xl">
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
