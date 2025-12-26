import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Play, Clock, ArrowRight, Volume2 } from "lucide-react";

// Types
interface QuizQuestion {
  type: "mcq" | "true_false" | "fill_blank" | "short_answer" | "audio";
  questionText: string;
  audio?: string | null;
  options?: { text: string }[];
  correctAnswer: string | string[];
  explanation?: string | null;
  timer?: number | null | undefined;
}

type QuizState = "idle" | "countdown" | "active" | "answered";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const buttonHoverVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

// Main Quiz Component
export default function QuizLesson({question}: {question: QuizQuestion}) {
  // Sample question for demo


  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [countdown, setCountdown] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Check if answer is correct
  const checkAnswer = useCallback(
    (answer: string) => {
      if (!answer.trim()) return;
      
      const correct = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.some(
            (a) => a.toLowerCase().trim() === answer.toLowerCase().trim()
          )
        : question.correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
      
      setIsCorrect(correct);
      setQuizState("answered");
    },
    [question.correctAnswer]
  );

  // Start quiz handler
  const handleStartQuiz = useCallback(() => {
    setSelectedAnswer("");
    setIsCorrect(null);
    
    if (question.timer && question.timer > 0) {
      setCountdown(question.timer);
      setQuizState("countdown");
    } else {
      setQuizState("active");
    }
  }, [question.timer]);

  // Handle MCQ/True-False selection (auto-submit)
  const handleSelectOption = useCallback((option: string) => {
    setSelectedAnswer(option);
    checkAnswer(option);
  }, [checkAnswer]);

  // Handle text input submission
  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer.trim()) {
      checkAnswer(selectedAnswer);
    }
  }, [selectedAnswer, checkAnswer]);

  // Reset quiz
  const handleReset = useCallback(() => {
    setQuizState("idle");
    setSelectedAnswer("");
    setIsCorrect(null);
    setCountdown(0);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (quizState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizState === "countdown" && countdown === 0) {
      setQuizState("active");
    }
  }, [quizState, countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <AnimatePresence mode="wait">
            {quizState === "idle" && (
              <IdleState 
                key="idle" 
                onStart={handleStartQuiz} 
                hasTimer={!!question.timer && question.timer > 0} 
              />
            )}

            {quizState === "countdown" && (
              <CountdownState 
                key="countdown" 
                seconds={countdown} 
                total={question.timer || 0} 
              />
            )}

            {quizState === "active" && (
              <ActiveState
                key="active"
                question={question}
                selectedAnswer={selectedAnswer}
                onSelectOption={handleSelectOption}
                onInputChange={setSelectedAnswer}
                onSubmit={handleSubmitAnswer}
              />
            )}

            {quizState === "answered" && (
              <AnsweredState
                key="answered"
                question={question}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect!}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Idle State Component
function IdleState({ onStart, hasTimer }: { onStart: () => void; hasTimer: boolean }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8 sm:p-12 text-center"
    >
      <motion.div
        variants={itemVariants}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
      >
        <Play className="w-10 h-10 text-white ml-1" />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3"
      >
        Ready to Test Your Knowledge?
      </motion.h2>

      <motion.p variants={itemVariants} className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
        {hasTimer
          ? "A countdown will begin before the quiz starts. Take your time and think carefully!"
          : "Click the button below to begin the quiz. Good luck!"}
      </motion.p>

      <motion.div variants={itemVariants}>
        <motion.button
          onClick={onStart}
          whileHover="hover" 
          whileTap="tap" 
          variants={buttonHoverVariants}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Quiz
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Countdown State Component
function CountdownState({ seconds, total }: { seconds: number; total: number }) {
  const circumference = 2 * Math.PI * 45;
  const progress = ((total - seconds) / total) * circumference;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8 sm:p-12 text-center"
    >
      <motion.div variants={itemVariants} className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            className="stroke-blue-500"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={seconds}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-slate-800 dark:text-white"
          >
            {seconds}
          </motion.span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Get ready...</span>
      </motion.div>
    </motion.div>
  );
}

// Active State Component
function ActiveState({
  question,
  selectedAnswer,
  onSelectOption,
  onInputChange,
  onSubmit,
}: {
  question: QuizQuestion;
  selectedAnswer: string;
  onSelectOption: (option: string) => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-6 sm:p-8"
    >
      {/* Question Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <span className="capitalize">{question.type.replace("_", " ")}</span>
        </div>

        {question.audio && (
          <motion.div variants={itemVariants} className="mb-4">
            <AudioPlayer src={question.audio} />
          </motion.div>
        )}

        <div
          className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.questionText }}
        />
      </motion.div>

      {/* Answer Options */}
      <motion.div variants={itemVariants} className="space-y-3">
        {question.type === "mcq" && question.options && (
          <MCQOptions options={question.options} onSelect={onSelectOption} />
        )}

        {question.type === "true_false" && (
          <TrueFalseOptions onSelect={onSelectOption} />
        )}

        {(question.type === "fill_blank" || question.type === "audio") && (
          <FillBlankInput
            value={selectedAnswer}
            onChange={onInputChange}
            onSubmit={onSubmit}
            placeholder={question.type === "audio" ? "Type what you heard..." : "Type your answer..."}
          />
        )}

        {question.type === "short_answer" && (
          <ShortAnswerInput
            value={selectedAnswer}
            onChange={onInputChange}
            onSubmit={onSubmit}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

// MCQ Options Component
function MCQOptions({
  options,
  onSelect,
}: {
  options: { text: string }[];
  onSelect: (option: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option, index) => (
        <motion.button
          key={index}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(option.text)}
          className="w-full p-4 text-left rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-300">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-slate-800 dark:text-white font-medium">{option.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// True/False Options Component
function TrueFalseOptions({ onSelect }: { onSelect: (option: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {["True", "False"].map((option) => (
        <motion.button
          key={option}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(option)}
          className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="text-lg font-semibold text-slate-800 dark:text-white">{option}</span>
        </motion.button>
      ))}
    </div>
  );
}

// Fill in the Blank Input Component
function FillBlankInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your answer...",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit()}
        placeholder={placeholder}
        className="w-full h-14 text-lg px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Your answer"
      />
      <motion.button
        onClick={onSubmit}
        disabled={!value.trim()}
        whileHover={value.trim() ? "hover" : undefined}
        whileTap={value.trim() ? "tap" : undefined}
        variants={buttonHoverVariants}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        Submit Answer
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// Short Answer Input Component
function ShortAnswerInput({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your answer here..."
        className="w-full min-h-32 text-base p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        aria-label="Your answer"
      />
      <motion.button
        onClick={onSubmit}
        disabled={!value.trim()}
        whileHover={value.trim() ? "hover" : undefined}
        whileTap={value.trim() ? "tap" : undefined}
        variants={buttonHoverVariants}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        Submit Answer
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// Audio Player Component
function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Volume2 className="w-6 h-6 text-white" />
      </div>
      <audio controls className="flex-1 h-10" aria-label="Question audio">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

// Answered State Component
function AnsweredState({
  question,
  selectedAnswer,
  isCorrect,
  onReset,
}: {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
  onReset: () => void;
}) {
  const correctAnswerText = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(" or ")
    : question.correctAnswer;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-6 sm:p-8"
    >
      {/* Result Header */}
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-2xl mb-6 ${
          isCorrect
            ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500"
            : "bg-red-50 dark:bg-red-900/20 border-2 border-red-500"
        }`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isCorrect 
                ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/50" 
                : "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-8 h-8 text-white" />
            ) : (
              <XCircle className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <div>
            <h3 className={`text-2xl font-bold ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {isCorrect ? "Great job! You got it right." : "Don't worry, keep learning!"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Answer Details */}
      <motion.div variants={itemVariants} className="space-y-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Your Answer</p>
          <p className="text-slate-800 dark:text-white font-semibold">{selectedAnswer}</p>
        </div>

        {!isCorrect && (
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-500">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Correct Answer</p>
            <p className="text-slate-800 dark:text-white font-semibold">{correctAnswerText}</p>
          </div>
        )}

        {question.explanation && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-500"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Explanation</p>
                <p
                  className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: question.explanation }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Try Again Button */}
      <motion.div variants={itemVariants}>
        <motion.button
          onClick={onReset}
          whileHover="hover"
          whileTap="tap"
          variants={buttonHoverVariants}
          className="w-full h-12 font-semibold rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}