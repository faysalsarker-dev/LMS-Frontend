import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { PictureMatchingQuestion }      from "./PictureMatchingQuestion";
import { AudioMCQQuestion }             from "./AudioMCQQuestion";
import { LongDialogueQuestion }         from "./LongDialogueQuestion";
import { SentenceToPictureQuestion }    from "./SentenceToPictureQuestion";
import { FillInTheGapQuestion }         from "./FillInTheGapQuestion";
import { RearrangePassageQuestion }     from "./RearrangePassageQuestion";
import { PassageMCQQuestion }           from "./PassageMCQQuestion";
import { PictureToWordQuestion }        from "./PictureToWordQuestion";
import { WordToSentenceQuestion }       from "./WordToSentenceQuestion";
import { PinyinToCharQuestion }         from "./PinyinToCharQuestion";
import { CompositionPicturesQuestion }  from "./CompositionPicturesQuestion";
import { CompositionTopicQuestion }     from "./CompositionTopicQuestion";
import { RepeatAfterListeningQuestion } from "./RepeatAfterListeningQuestion";
import { SpeakOnPictureQuestion }       from "./SpeakOnPictureQuestion";
import { AnswerQuestionSpeaking }       from "./AnswerQuestionSpeaking";
import { Badge } from "@/components/ui/badge";

interface QuestionRendererProps {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
  index: number;
  total: number;
}

export const QuestionRenderer = ({
  question,
  answer,
  onChange,
  index,
  total,
}: QuestionRendererProps) => {
  const renderQuestion = () => {
    const props = { question, answer, onChange };
    switch (question.type) {
      case "L_PICTURE_MATCHING":       return <PictureMatchingQuestion   {...props} />;
      case "L_AUDIO_MCQ":              return <AudioMCQQuestion           {...props} />;
      case "L_LONG_DIALOGUE_MATCHING": return <LongDialogueQuestion       {...props} />;
      case "R_SENTENCE_TO_PICTURE":    return <SentenceToPictureQuestion  {...props} />;
      case "R_FILL_IN_THE_GAP":        return <FillInTheGapQuestion       {...props} />;
      case "R_REARRANGE_PASSAGE":      return <RearrangePassageQuestion   {...props} />;
      case "R_PASSAGE_MCQ":            return <PassageMCQQuestion         {...props} />;
      case "W_PICTURE_TO_WORD":        return <PictureToWordQuestion      {...props} />;
      case "W_WORD_TO_SENTENCE":       return <WordToSentenceQuestion     {...props} />;
      case "W_PINYIN_TO_CHARACTER":    return <PinyinToCharQuestion       {...props} />;
      case "W_COMPOSITION_PICTURES":   return <CompositionPicturesQuestion {...props} />;
      case "W_COMPOSITION_TOPIC":      return <CompositionTopicQuestion   {...props} />;
      case "S_REPEAT_AFTER_LISTENING": return <RepeatAfterListeningQuestion {...props} />;
      case "S_SPEAK_ON_PICTURE":       return <SpeakOnPictureQuestion     {...props} />;
      case "S_ANSWER_QUESTION":        return <AnswerQuestionSpeaking     {...props} />;
      default:
        return (
          <div className="p-10 text-center bg-muted/20 rounded-3xl border-2 border-dashed">
            <h3 className="text-xl font-bold mb-2">Unknown Question Type</h3>
            <p className="text-muted-foreground">{question.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge className="bg-primary/10 text-primary border-none font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
          Question {index + 1} of {total}
        </Badge>
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider opacity-60">
          {question.marks} {question.marks === 1 ? "mark" : "marks"}
        </span>
      </div>

      {/* Instruction */}
      {question.instruction && (
        <h2 className="text-2xl font-black tracking-tight leading-snug">
          {question.instruction}
        </h2>
      )}

      {/* Question body */}
      <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-primary/5 p-6 md:p-10">
        {renderQuestion()}
      </div>
    </div>
  );
};
