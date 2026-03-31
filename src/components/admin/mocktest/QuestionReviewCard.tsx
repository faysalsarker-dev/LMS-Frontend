import React from "react";
import {
  CheckCircle,
  XCircle,
  Play,
  FileText,
  Image as ImageIcon,
  Headphones,
  Mic,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";
import NoDataFound from "@/components/shared/NoDataFound";

interface QuestionReviewCardProps {
  question: any;
  index: number;
  onGrade?: (question: any) => void;
}

const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({
  question,
  index,
  onGrade,
}) => {
  const checkIsCorrect = () => {
    if (!question.isAutoMarked) return null;
    const {
      type,
      userAnswer,
      correctOptionId,
      correctGaps,
      correctSentence,
      segments,
      subQuestions,
      wordTokens,
    } = question;

    if (!userAnswer) return false;

    switch (type) {
      case "L_PICTURE_MATCHING":
      case "R_SENTENCE_TO_PICTURE":
      case "W_PICTURE_TO_WORD":
      case "W_PINYIN_TO_CHARACTER":
        return String(userAnswer) === String(correctOptionId || "");

      case "L_AUDIO_MCQ":
      case "L_LONG_DIALOGUE_MATCHING":
      case "R_PASSAGE_MCQ":
        const correctMapping = (subQuestions || []).reduce(
          (acc: any, sq: any) => {
            acc[sq.subQuestionId] = sq.correctOptionId;
            return acc;
          },
          {},
        );
        return JSON.stringify(userAnswer) === JSON.stringify(correctMapping);

      case "R_FILL_IN_THE_GAP":
        return JSON.stringify(userAnswer) === JSON.stringify(correctGaps);

      case "R_REARRANGE_PASSAGE":
        const correctSequenceIds = [...(segments || [])]
          .sort((a, b) => a.correctPosition - b.correctPosition)
          .map((s) => s.segmentId);
        return (
          JSON.stringify(userAnswer) === JSON.stringify(correctSequenceIds)
        );

      case "W_WORD_TO_SENTENCE":
        const userStr = Array.isArray(userAnswer)
          ? userAnswer.join(" ")
          : String(userAnswer || "");
        const targetStr =
          correctSentence || (wordTokens && wordTokens.join(" ")) || "";
        return (
          userStr.toLowerCase().trim() ===
          String(targetStr).toLowerCase().trim()
        );

      default:
        return (
          JSON.stringify(userAnswer) ===
          JSON.stringify(correctOptionId || correctGaps || correctSentence)
        );
    }
  };

  const isCorrect = checkIsCorrect();

  const renderContent = () => {
    switch (question.type) {
      case "L_PICTURE_MATCHING":
      case "R_SENTENCE_TO_PICTURE":
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {question.options.map((opt: any) => (
              <div
                key={opt.optionId}
                className={`relative p-2 border-2 rounded-xl transition-all ${
                  question.userAnswer === opt.optionId
                    ? "border-primary bg-primary/5"
                    : "border-transparent"
                }`}
              >
                {opt.imageUrl && (
                  <img
                    src={opt.imageUrl}
                    alt={opt.optionId}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      question.userAnswer === opt.optionId
                        ? "default"
                        : "outline"
                    }
                  >
                    Option {opt.optionId}
                  </Badge>
                  {opt.optionId === question.correctOptionId && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50"
                    >
                      Correct
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "L_AUDIO_MCQ":
      case "L_LONG_DIALOGUE_MATCHING":
      case "R_PASSAGE_MCQ":
        return (
          <div className="space-y-3">
            {question.subQuestions && question.subQuestions.length > 0 ? (
              question.subQuestions.map((sq: any) => (
                <div
                  key={sq.subQuestionId}
                  className="pl-4 border-l-2 border-muted py-2 space-y-2"
                >
                  <p className="font-medium text-sm">{sq.questionText}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sq.options.map((opt: any) => (
                      <div
                        key={opt.optionId}
                        className={`p-3 text-sm rounded-lg border flex items-center justify-between ${
                          question.userAnswer?.[sq.subQuestionId] ===
                          opt.optionId
                            ? "border-primary bg-primary/5 font-bold"
                            : "border-muted"
                        }`}
                      >
                        <span>
                          {opt.optionId}. {opt.text}
                        </span>
                        {opt.optionId === sq.correctOptionId && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((opt: any) => (
                  <div
                    key={opt.optionId}
                    className={`p-3 text-sm rounded-lg border flex items-center justify-between ${
                      question.userAnswer === opt.optionId
                        ? "border-primary bg-primary/5 font-bold"
                        : "border-muted"
                    }`}
                  >
                    <span>
                      {opt.optionId}. {opt.text}
                    </span>
                    {opt.optionId === question.correctOptionId && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "R_FILL_IN_THE_GAP":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl leading-relaxed italic text-muted-foreground border">
              {question.passageText
                ?.split(/\{\{gap_\d+\}\}/)
                .map((part: string, i: number) => (
                  <span key={i}>
                    {part}
                    {i <
                      (question.passageText.match(/\{\{gap_\d+\}\}/g) || [])
                        .length && (
                      <span className="inline-block min-w-[80px] border-b-2 border-primary mx-1 text-center font-bold text-primary not-italic">
                        {question.userAnswer?.[`gap_${i + 1}`] || "____"}
                      </span>
                    )}
                  </span>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-bold w-full uppercase text-muted-foreground">
                Answer Key:
              </span>
              {Object.entries(question.correctGaps || {}).map(
                ([key, val]: [string, any]) => (
                  <Badge
                    key={key}
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    {key}:{" "}
                    {question.wordPool?.find((w: any) => w.optionId === val)
                      ?.text || val}
                  </Badge>
                ),
              )}
            </div>
          </div>
        );

      case "R_REARRANGE_PASSAGE":
      case "W_WORD_TO_SENTENCE":
        const userSequence = Array.isArray(question.userAnswer)
          ? question.userAnswer
          : [];

        return (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Student Sequence:
              </span>
              <div className="flex flex-wrap gap-2">
                {userSequence.map((id: string, i: number) => (
                  <Badge key={id} className="py-1 px-3">
                    {i + 1}.{" "}
                    {question.segments?.find((s: any) => s.segmentId === id)
                      ?.text ||
                      question.wordTokens?.[i] ||
                      id}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-green-600 uppercase">
                Correct Sequence:
              </span>
              {question.type === "W_WORD_TO_SENTENCE" ? (
                <p className="text-sm font-medium text-green-700 bg-green-50 p-2 rounded border border-green-100 italic">
                  "{question.correctSentence}"
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[...(question.segments || [])]
                    .sort(
                      (a: any, b: any) => a.correctPosition - b.correctPosition,
                    )
                    .map((s: any, i: number) => (
                      <Badge
                        key={s.segmentId}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {i + 1}. {s.text}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
        );

      case "W_PICTURE_TO_WORD":
      case "W_PINYIN_TO_CHARACTER":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase mb-1 block">
                  Student Answer
                </span>
                <div className="p-3 bg-muted rounded-lg font-bold text-lg border">
                  {question.userAnswer || "No Answer"}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-green-600 uppercase mb-1 block">
                  Correct Answer
                </span>
                <div className="p-3 bg-green-50 text-green-700 rounded-lg font-bold text-lg border border-green-100">
                  {question.correctOptionId ||
                    question.correctSentence ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>
        );

      case "W_COMPOSITION_PICTURES":
      case "W_COMPOSITION_TOPIC":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 rounded-xl border leading-relaxed whitespace-pre-wrap text-sm">
              {question.userAnswer || "No content submitted."}
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                Word Count: {question.userAnswer?.split(/\s+/).length || 0}{" "}
                words
              </span>
              {question.minWordCount && (
                <span>Requirement: Min {question.minWordCount} words</span>
              )}
            </div>
          </div>
        );

      case "S_REPEAT_AFTER_LISTENING":
      case "S_SPEAK_ON_PICTURE":
      case "S_ANSWER_QUESTION":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 border rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Play className="w-4 h-4" />
                Student Voice Recording
              </div>
              {question.userAnswer ? (
                <audio
                  controls
                  src={question.userAnswer}
                  className="w-full h-10"
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="p-2 border border-dashed rounded-lg bg-background">
                  <NoDataFound 
                    message="No recording found." 
                    icon={<Mic className="w-6 h-6 text-muted-foreground" />}
                    className="min-h-[120px] p-2"
                  />
                </div>
              )}
            </div>
            {question.correctSentence && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <span className="text-[10px] font-black uppercase text-green-600 mb-1 block">
                  Correct Transcript
                </span>
                <p className="text-sm text-green-800 italic">
                  "{question.correctSentence}"
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted/50 rounded-lg border overflow-x-auto">
            <pre className="text-xs">
              {JSON.stringify(question.userAnswer, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-background rounded-2xl border-2 border-muted/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 bg-muted/20 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold tracking-tight">
              Question Details
            </h4>
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              Type: {question.type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {question.isAutoMarked && (
            <Badge
              variant={isCorrect ? "default" : "destructive"}
              className={`flex items-center gap-1.5 px-2.5 py-1 ${isCorrect ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {isCorrect ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {isCorrect ? "Correct" : "Incorrect"}
            </Badge>
          )}
          {!question.isAutoMarked && (
            <div className="flex items-center gap-2">
              {(question.adminScore !== undefined ||
                question.adminFeedback) && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 px-2.5 py-1"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Graded: {question.adminScore || 0} pts
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-primary/30 text-primary hover:bg-primary/5 font-bold text-[10px] uppercase tracking-wider"
                onClick={() => onGrade?.(question)}
              >
                Grade Question
              </Button>
            </div>
          )}
          <Badge variant="secondary" className="font-bold">
            {question.marks} pts
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Instruction & Text */}
        <div className="space-y-3">
          {question.instruction && (
            <div className="flex items-start gap-2 text-primary font-medium text-sm leading-relaxed">
              <FileText className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{question.instruction}</p>
            </div>
          )}

          {question.questionText && (
            <p className="text-lg font-bold leading-snug">
              {question.questionText}
            </p>
          )}

          {question.pinyin && (
            <p className="text-muted-foreground italic text-sm">
              Pinyin: {question.pinyin}
            </p>
          )}

          {(question.passage || question.topic) && (
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
              <span className="text-[10px] font-black uppercase text-amber-600 mb-2 block">
                Context / Passage
              </span>
              <p className="text-sm leading-relaxed">
                {question.passage || question.topic}
              </p>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="flex flex-wrap gap-4">
          {question.audioUrl && (
            <div className="flex items-center gap-2 p-2 px-4 bg-primary/5 rounded-full border border-primary/20">
              <Headphones className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">
                Question Audio
              </span>
              <audio src={question.audioUrl} controls className="h-8 w-40" />
            </div>
          )}

          {question.images && question.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              {question.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden border"
                >
                  <img
                    src={img}
                    alt={`Ref ${i}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        {/* Student Submission Action Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-muted-foreground">
            <UserReviewIcon className="w-4 h-4" />
            Student Answer
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const UserReviewIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

export default QuestionReviewCard;
