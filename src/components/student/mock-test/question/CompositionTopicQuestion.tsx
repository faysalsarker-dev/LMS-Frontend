import { useState } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { cn } from "@/lib/utils";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

export const CompositionTopicQuestion = ({ question, answer, onChange }: Props) => {
  const [text, setText] = useState(answer?.textAnswer ?? "");

  const minWords = question.minWordCount ?? 0;

  const handleChange = (val: string) => {
    setText(val);
    onChange({
      questionId: question._id!,
      questionType: question.type,
      textAnswer: val,
      wordCount: countWords(val),
    });
  };

  const wc = countWords(text);
  const isMet = wc >= minWords;

  return (
    <div className="space-y-6">
      {/* Topic */}
      <div className="text-center space-y-2 p-6 rounded-3xl bg-primary/5 border-2 border-primary/10">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topic</p>
        <p className="text-2xl font-black">&ldquo;{question.topic ?? question.questionText}&rdquo;</p>
        {minWords > 0 && (
          <p className="text-sm text-muted-foreground">
            Write no fewer than <strong>{minWords}</strong> words
          </p>
        )}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your composition here..."
          className="w-full min-h-[220px] p-5 pb-10 rounded-2xl border-2 border-muted bg-card text-base leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
        />
        <div
          className={cn(
            "absolute bottom-3 right-4 text-xs font-semibold",
            isMet ? "text-green-600" : "text-destructive"
          )}
        >
          {wc}{minWords > 0 ? ` / ${minWords}` : ""} words
        </div>
      </div>
    </div>
  );
};
