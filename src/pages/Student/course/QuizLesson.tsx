
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Play, Clock, ArrowRight, Volume2, AlertCircle } from "lucide-react";
import { DownloadQuestionPDFButton } from "@/utils/generateQuestionPDF";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface QuizOption {
  text: string;
}

type QuestionType = "mcq" | "true_false" | "fill_blank" | "short_answer" | "audio";
type QuizState = "idle" | "active" | "answered";

interface QuizQuestion {
  type: QuestionType;
  questionText: string;
  audio?: string | null;
  options?: QuizOption[];
  correctAnswer: string | string[];
  explanation?: string | null;
  timer?: number | null;
}

interface QuizLessonProps {
  questions: QuizQuestion[];
  setQuizResult: (result: boolean) => void;
}

interface IdleStateProps {
  onStart: () => void;
  hasTimer: boolean;
  timerDuration?: number;
}



interface ActiveStateProps {
  question: QuizQuestion;
  selectedAnswer: string;
  timeRemaining: number | null;
  onSelectOption: (option: string) => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

interface MCQOptionsProps {
  options: QuizOption[];
  onSelect: (option: string) => void;
}

interface TrueFalseOptionsProps {
  onSelect: (option: string) => void;
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

interface AudioPlayerProps {
  src: string;
}

interface AnsweredStateProps {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
  isTimeout: boolean;
  onReset: () => void;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

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

// ============================================================================
// MAIN QUIZ COMPONENT
// ============================================================================

export default function QuizLesson({ questions, setQuizResult }: QuizLessonProps) {
  const question = questions[0];

  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const checkAnswer = (answer: string) => {
    if (!answer.trim()) return;

    const normalizedAnswer = answer.toLowerCase().trim();
    const correct = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.some((a) => a.toLowerCase().trim() === normalizedAnswer)
      : question.correctAnswer.toLowerCase().trim() === normalizedAnswer;

    setIsCorrect(correct);
    setQuizResult(correct);
    setQuizState("answered");
    setTimeRemaining(null);
  };

  const handleStartQuiz = () => {
    setSelectedAnswer("");
    setIsCorrect(null);
    setIsTimeout(false);
    setQuizState("active");
    
    if (question.timer && question.timer > 0) {
      setTimeRemaining(question.timer);
    } else {
      setTimeRemaining(null);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedAnswer(option);
    checkAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer.trim()) {
      checkAnswer(selectedAnswer);
    }
  };

  const handleReset = () => {
    setQuizState("idle");
    setSelectedAnswer("");
    setIsCorrect(null);
    setTimeRemaining(null);
    setIsTimeout(false);
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Active quiz timer
  useEffect(() => {
    if (quizState === "active" && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizState === "active" && timeRemaining === 0) {
      setIsCorrect(false);
      setQuizResult(false);
      setIsTimeout(true);
      setQuizState("answered");
    }
  }, [quizState, timeRemaining, setQuizResult]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
          <AnimatePresence mode="wait">
            {quizState === "idle" && (
              <IdleState
                key="idle"
                onStart={handleStartQuiz}
                hasTimer={!!question?.timer && question?.timer > 0}
                timerDuration={question?.timer || undefined}
              />
            )}

            {quizState === "active" && (
              <ActiveState
                key="active"
                question={question}
                selectedAnswer={selectedAnswer}
                timeRemaining={timeRemaining}
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
                isTimeout={isTimeout}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// IDLE STATE COMPONENT
// ============================================================================

function IdleState({ onStart, hasTimer, timerDuration }: IdleStateProps) {
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
        className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30"
      >
        <Play className="w-12 h-12 text-white ml-1" />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4"
      >
        Ready to Test Your Knowledge?
      </motion.h2>

      <motion.p variants={itemVariants} className="text-slate-600 dark:text-slate-300 mb-4 max-w-md mx-auto text-lg">
        {hasTimer
          ? `You'll have ${timerDuration} seconds to answer this question. Good luck!`
          : "Click the button below to begin the quiz."}
      </motion.p>

      {hasTimer && (
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-8"
        >
          <Clock className="w-4 h-4" />
          <span>You'll have {timerDuration} seconds to answer</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-8">
        <motion.button
          onClick={onStart}
          whileHover="hover"
          whileTap="tap"
          variants={buttonHoverVariants}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-shadow inline-flex items-center gap-3"
        >
          <Play className="w-6 h-6" />
          Start Quiz
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ACTIVE STATE COMPONENT
// ============================================================================

function ActiveState({
  question,
  selectedAnswer,
  timeRemaining,
  onSelectOption,
  onInputChange,
  onSubmit,
}: ActiveStateProps) {
  const isTimeLow = timeRemaining !== null && timeRemaining <= 10;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-6 sm:p-8"
    >
      {/* Timer Display */}
      {timeRemaining !== null && (
        <motion.div
          variants={itemVariants}
          className={`mb-6 flex items-center justify-center gap-3 p-4 rounded-2xl ${
            isTimeLow
              ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-400"
              : "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400"
          }`}
          animate={isTimeLow ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: isTimeLow ? Infinity : 0, duration: 1 }}
        >
          <Clock className={`w-6 h-6 ${isTimeLow ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`} />
          <span className={`text-xl font-bold ${isTimeLow ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300"}`}>
            {timeRemaining}s remaining
          </span>
        </motion.div>
      )}

      {/* Question Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
          <span className="capitalize">{question.type.replace("_", " ")}</span>
        </div>

        {question.audio && (
          <motion.div variants={itemVariants} className="mb-6">
            <AudioPlayer src={question.audio} />
          </motion.div>
        )}

        <div
          className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.questionText }}
        />
      </motion.div>

      {/* Answer Options */}
      <motion.div variants={itemVariants} className="space-y-4">
        {question.type === "mcq" && question.options && (
          <MCQOptions options={question.options} onSelect={onSelectOption} />
        )}

        {question.type === "true_false" && <TrueFalseOptions onSelect={onSelectOption} />}

        {(question.type === "fill_blank" || question.type === "audio") && (
          <FillBlankInput
            value={selectedAnswer}
            onChange={onInputChange}
            onSubmit={onSubmit}
            placeholder={question.type === "audio" ? "Type what you heard..." : "Type your answer..."}
          />
        )}

        {question.type === "short_answer" && (
          <ShortAnswerInput value={selectedAnswer} onChange={onInputChange} onSubmit={onSubmit} />
        )}
      
<DownloadQuestionPDFButton
  question={question}
  showAnswer={false}
/>



      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MCQ OPTIONS COMPONENT
// ============================================================================

function MCQOptions({ options, onSelect }: MCQOptionsProps) {
  return (
    <div className="grid gap-4">
      {options.map((option, index) => (
        <motion.button
          key={index}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(option.text)}
          className="w-full p-5 text-left rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        >
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center text-base font-bold text-blue-700 dark:text-blue-300">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-slate-800 dark:text-white font-medium text-lg">{option.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ============================================================================
// TRUE/FALSE OPTIONS COMPONENT
// ============================================================================

function TrueFalseOptions({ onSelect }: TrueFalseOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {["True", "False"].map((option) => (
        <motion.button
          key={option}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(option)}
          className="p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        >
          <span className="text-2xl font-bold text-slate-800 dark:text-white">{option}</span>
        </motion.button>
      ))}
    </div>
  );
}

// ============================================================================
// FILL BLANK INPUT COMPONENT
// ============================================================================

function FillBlankInput({ value, onChange, onSubmit, placeholder = "Type your answer..." }: TextInputProps) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit()}
        placeholder={placeholder}
        className="w-full h-16 text-lg px-6 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all"
        aria-label="Your answer"
      />
      <motion.button
        onClick={onSubmit}
        disabled={!value.trim()}
        whileHover={value.trim() ? "hover" : undefined}
        whileTap={value.trim() ? "tap" : undefined}
        variants={buttonHoverVariants}
        className="w-full h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold text-lg rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3 shadow-lg disabled:shadow-none"
      >
        Submit Answer
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// ============================================================================
// SHORT ANSWER INPUT COMPONENT
// ============================================================================

function ShortAnswerInput({ value, onChange, onSubmit }: Omit<TextInputProps, "placeholder">) {
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your answer here..."
        className="w-full min-h-40 text-base p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 resize-none transition-all"
        aria-label="Your answer"
      />
      <motion.button
        onClick={onSubmit}
        disabled={!value.trim()}
        whileHover={value.trim() ? "hover" : undefined}
        whileTap={value.trim() ? "tap" : undefined}
        variants={buttonHoverVariants}
        className="w-full h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold text-lg rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3 shadow-lg disabled:shadow-none"
      >
        Submit Answer
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// ============================================================================
// AUDIO PLAYER COMPONENT
// ============================================================================

function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
        <Volume2 className="w-7 h-7 text-white" />
      </div>
      <audio controls className="flex-1 h-12" aria-label="Question audio">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

// ============================================================================
// ANSWERED STATE COMPONENT
// ============================================================================

function AnsweredState({ question, selectedAnswer, isCorrect, isTimeout, onReset }: AnsweredStateProps) {
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
        className={`p-6 sm:p-8 rounded-3xl mb-8 ${
          isCorrect
            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500"
            : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-500"
        }`}
      >
        <div className="flex items-center gap-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${
              isCorrect
                ? "bg-gradient-to-br from-green-400 to-emerald-600 shadow-green-500/50"
                : "bg-gradient-to-br from-red-400 to-rose-600 shadow-red-500/50"
            }`}
          >
            {isCorrect ? <CheckCircle2 className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
          </motion.div>
          <div>
            <h3
              className={`text-3xl font-bold mb-1 ${
                isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}
            >
              {isCorrect ? "Correct!" : isTimeout ? "Time's Up!" : "Incorrect"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {isCorrect
                ? "Excellent work! You got it right."
                : isTimeout
                ? "You ran out of time."
                : "Don't worry, keep learning!"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Timeout Warning */}
      {isTimeout && (
        <motion.div
          variants={itemVariants}
          className="mb-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">Time Expired</p>
            <p className="text-amber-600 dark:text-amber-300 text-sm">
              The timer ran out before you could submit your answer.
            </p>
          </div>
        </motion.div>
      )}

      {/* Answer Details */}
      <motion.div variants={itemVariants} className="space-y-5 mb-8">
        {(selectedAnswer || isTimeout) && (
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">
              Your Answer
            </p>
            <p className="text-slate-800 dark:text-white font-medium text-lg">
              {selectedAnswer || "No answer submitted"}
            </p>
          </div>
        )}

        {!isCorrect && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">
              Correct Answer
            </p>
            <p className="text-slate-800 dark:text-white font-medium text-lg">{correctAnswerText}</p>
          </div>
        )}

        {question.explanation && (
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-500"
          >
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
                  Explanation
                </p>
                <div
                  className="text-slate-700 dark:text-slate-300 leading-relaxed"
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
          className="w-full h-14 text-lg font-semibold rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:border-blue-500 transition-all shadow-md hover:shadow-lg"
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}