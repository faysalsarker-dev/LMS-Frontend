import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const PinyinToCharQuestion = ({ question, answer, onChange }: Props) => {
  return (
    <div className="space-y-10 flex flex-col items-center">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Pinyin</span>
        <p className="text-6xl font-black tracking-widest text-foreground">{question.pinyin}</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <label className="text-base font-semibold text-muted-foreground">
          Write the Chinese character:
        </label>
        <input
          type="text"
          value={answer?.textAnswer ?? ""}
          onChange={(e) =>
            onChange({
              questionId: question._id!,
              questionType: question.type,
              textAnswer: e.target.value,
            })
          }
          placeholder="Type here..."
          className="w-full p-5 rounded-2xl border-2 border-muted bg-card text-4xl font-bold text-center focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
        />
      </div>
    </div>
  );
};
