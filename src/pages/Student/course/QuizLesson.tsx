import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function QuizLesson({
  quiz,
}: {
  quiz?: {
    question: string;
    options: { text: string }[];
    correctAnswer: string;
    explanation?: string;
    timer?: number | null;
  };
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz?.timer ?? null
  );

  useEffect(() => {
    if (!quiz?.timer) return;
    if (timeLeft === 0) return setIsSubmitted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz?.timer]);

  if (!quiz)
    return (
      <div className="text-center text-gray-500 py-10">
        No quiz content available.
      </div>
    );

  const handleSubmit = () => setIsSubmitted(true);

  const isCorrect = selected === quiz.correctAnswer;

  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {quiz.question}
          </h2>
          {quiz.timer && (
            <div className="text-sm text-gray-500">
              ⏳ {timeLeft}s
              <Progress
                className="mt-1 w-24"
                value={
                  timeLeft && quiz.timer
                    ? (timeLeft / quiz.timer) * 100
                    : 0
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {quiz.options.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted || timeLeft === 0}
              onClick={() => setSelected(opt.text)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selected === opt.text
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50 border-gray-200"
              } ${
                isSubmitted &&
                opt.text === quiz.correctAnswer &&
                "border-green-500 bg-green-50"
              } ${
                isSubmitted &&
                selected === opt.text &&
                selected !== quiz.correctAnswer &&
                "border-red-500 bg-red-50"
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitted || !selected || timeLeft === 0}
          >
            Submit
          </Button>
          {isSubmitted && (
            <p
              className={`font-semibold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </p>
          )}
        </div>

        {isSubmitted && quiz.explanation && (
          <div className="p-3 bg-blue-50 rounded-lg text-gray-700 text-sm border border-blue-200">
            💡 Explanation: {quiz.explanation}
          </div>
        )}
      </div>
    </motion.div>
  );
}
