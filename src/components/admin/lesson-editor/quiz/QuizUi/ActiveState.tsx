import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight, Volume2 } from 'lucide-react';






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





export interface QuizQuestion {
  type: "mcq" | "true_false" | "fill_blank" | "short_answer" | "audio";
  questionText: string;
  audio?: string | null;
  options?: { text: string }[];
  correctAnswer: string | string[];
  explanation?: string | null;
  timer?: number | null | undefined;
}

interface ActiveStateProps {
  question: QuizQuestion;
  selectedAnswer: string;
  onSelectOption: (option: string) => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}




















export default function ActiveState({
  question,
  selectedAnswer,
  onSelectOption,
  onInputChange,
  onSubmit,
}: ActiveStateProps) {


console.log(question,'question');


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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="capitalize">{question?.type?.replace("_", " ")}</span>
        </div>

        {question.audio && (
          <motion.div variants={itemVariants} className="mb-4">
            <AudioPlayer src={question.audio} />
          </motion.div>
        )}

        <div
          className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.questionText }}
        />
      </motion.div>

      {/* Answer Options */}
      <motion.div variants={itemVariants} className="space-y-3">
        {question.type === "mcq" ? (
         <>
              <MCQOptions options={question?.options} onSelect={onSelectOption} />
         </>
        ) : null}

        {question.type === "true_false" && (
          <TrueFalseOptions onSelect={onSelectOption} />
        )}

        {question.type === "fill_blank" && (
          <FillBlankInput
            value={selectedAnswer}
            onChange={onInputChange}
            onSubmit={onSubmit}
          />
        )}

        {question.type === "short_answer" && (
          <ShortAnswerInput
            value={selectedAnswer}
            onChange={onInputChange}
            onSubmit={onSubmit}
          />
        )}

        {question.type === "audio" && (
          <FillBlankInput
            value={selectedAnswer}
            onChange={onInputChange}
            onSubmit={onSubmit}
            placeholder="Type what you heard..."
          />
        )}
      </motion.div>
    </motion.div>
  );
}







function MCQOptions({
  options,
  onSelect,
}: {
  options?: { text: string }[];
  onSelect: (option: string) => void;
}) {







  return (
    <div className="grid gap-3">
      {options?.map((option, index) => (
        <motion.button
          key={index}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onSelect(option.text)}
          className="w-full p-4 text-left rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-semibold text-secondary-foreground">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-foreground font-medium">{option.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

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
          className="p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span className="text-lg font-semibold text-foreground">{option}</span>
        </motion.button>
      ))}
    </div>
  );
}


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
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder={placeholder}
        className="h-14 text-lg px-4 rounded-xl border-2 focus:border-primary"
        aria-label="Your answer"
      />
      <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
        <Button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl"
        >
          Submit Answer
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

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
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your answer here..."
        className="min-h-32 text-base p-4 rounded-xl border-2 focus:border-primary resize-none"
        aria-label="Your answer"
      />
      <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
        <Button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl"
        >
          Submit Answer
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
        <Volume2 className="w-6 h-6 text-primary-foreground" />
      </div>
      <audio controls className="flex-1 h-10" aria-label="Question audio">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}