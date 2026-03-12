import { useState } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

export const CompositionPicturesQuestion = ({ question, answer, onChange }: Props) => {
  const [text, setText] = useState(answer?.textAnswer ?? "");

  const handleChange = (val: string) => {
    setText(val);
    onChange({
      questionId: question._id!,
      questionType: question.type,
      textAnswer: val,
      wordCount: countWords(val),
    });
  };

  const images = question.images ?? [];
  const wc = countWords(text);

  return (
    <div className="space-y-6">
      {/* Image grid */}
      {images.length > 0 && (
        <div className={`grid gap-3 ${images.length > 2 ? "grid-cols-2" : "grid-cols-2 max-w-lg mx-auto"}`}>
          {images.slice(0, 4).map((img, i) => (
            <div key={i} className="aspect-video rounded-2xl overflow-hidden border-2 border-muted shadow">
              <img src={img.url} alt={img.alt ?? `Picture ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <p className="text-muted-foreground font-semibold text-center">
        Look at the pictures and write a composition:
      </p>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your composition here..."
          className="w-full min-h-[200px] p-5 rounded-2xl border-2 border-muted bg-card text-base leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
        />
        <div className="absolute bottom-3 right-4 text-xs text-muted-foreground font-semibold">
          Word count: {wc}
        </div>
      </div>
    </div>
  );
};
