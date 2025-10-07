import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ClipboardCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { QuizData, QuizOption } from "@/interface";

interface QuizFieldProps {
  value: QuizData;
  onChange: (value: QuizData) => void;
  errors?: {
    question?: string;
    options?: string;
    correctAnswer?: string;
  };
}

export function QuizField({ value, onChange, errors }: QuizFieldProps) {
  const [options, setOptions] = useState<QuizOption[]>(
    value.options || [{ text: "" }, { text: "" }]
  );

  const handleQuestionChange = (question: string) => {
    onChange({ ...value, question });
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { text };
    setOptions(newOptions);
    onChange({ ...value, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...options, { text: "" }];
    setOptions(newOptions);
    onChange({ ...value, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange({ ...value, options: newOptions });
  };

  const handleCorrectAnswerChange = (correctAnswer: string) => {
    onChange({ ...value, correctAnswer });
  };

  const handleExplanationChange = (explanation: string) => {
    onChange({ ...value, explanation });
  };

  const handleTimerChange = (timer: number) => {
    onChange({ ...value, timer });
  };

  return (
    <div className="space-y-6">
      {/* Quiz Question */}
      <div className="space-y-2">
        <Label htmlFor="quiz-question" className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4" />
          Quiz Question
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="quiz-question"
          value={value.question || ""}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="Enter your quiz question"
          className="focus-ring"
        />
        {errors?.question && (
          <p className="text-sm text-destructive">{errors.question}</p>
        )}
      </div>

      {/* Quiz Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Answer Options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Option
          </Button>
        </div>

        <AnimatePresence>
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 focus-ring"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {errors?.options && (
          <p className="text-sm text-destructive">{errors.options}</p>
        )}
      </div>

      {/* Correct Answer Selection */}
      <div className="space-y-2">
        <Label htmlFor="correct-answer">
          Correct Answer
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Select
          value={value.correctAnswer || ""}
          onValueChange={handleCorrectAnswerChange}
        >
          <SelectTrigger id="correct-answer" className="focus-ring">
            <SelectValue placeholder="Select the correct answer" />
          </SelectTrigger>
          <SelectContent>
            {options
              .filter((opt) => opt.text.trim())
              .map((opt, index) => (
                <SelectItem key={index} value={opt.text}>
                  {String.fromCharCode(65 + index)}. {opt.text}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors?.correctAnswer && (
          <p className="text-sm text-destructive">{errors.correctAnswer}</p>
        )}
      </div>

      {/* Explanation (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <Input
          id="explanation"
          value={value.explanation || ""}
          onChange={(e) => handleExplanationChange(e.target.value)}
          placeholder="Provide an explanation for the correct answer"
          className="focus-ring"
        />
      </div>

      {/* Timer */}
      <div className="space-y-2">
        <Label htmlFor="timer" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Timer (seconds)
        </Label>
        <Input
          id="timer"
          type="number"
          value={value.timer || ""}
          onChange={(e) => handleTimerChange(parseInt(e.target.value) || 0)}
          placeholder="e.g., 60"
          min={0}
          className="focus-ring"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty for no time limit
        </p>
      </div>
    </div>
  );
}
