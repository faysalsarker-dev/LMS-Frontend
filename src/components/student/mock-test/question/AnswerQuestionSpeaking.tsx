import { useState } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, Square, PlayCircle } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const AnswerQuestionSpeaking = ({ question, answer, onChange }: Props) => {
  const [hasRecording, setHasRecording] = useState(!!answer?.audioBlob);

  const { start, stop, isRecording, elapsed } = useAudioRecorder(null, (blob, duration) => {
    setHasRecording(true);
    onChange({ questionId: question._id!, questionType: question.type, audioBlob: blob, audioDurationSeconds: duration });
  });

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      {/* Question text */}
      <div className="p-6 rounded-3xl bg-primary/5 border-2 border-primary/10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Answer the question:</p>
        <p className="text-2xl font-black leading-relaxed">
          &ldquo;{question.questionText}&rdquo;
        </p>
      </div>

      {/* Optional audio */}
      {question.audioUrl && (
        <AudioPlayer
          src={question.audioUrl}
          label="🎧 Listen to the question"
          compact
        />
      )}
      {/* Recording controls */}
      <div className="flex flex-col items-center gap-4 py-4">
        {isRecording && (
          <>
            <div className="flex items-center gap-3 text-destructive font-bold animate-pulse text-lg">
              <span className="h-3 w-3 rounded-full bg-destructive animate-ping" />
              Recording... {formatTime(elapsed)}
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={stop}
              className="rounded-2xl border-destructive text-destructive hover:bg-destructive/5 gap-2"
            >
              <Square className="h-5 w-5" />
              Stop Recording
            </Button>
          </>
        )}

        {hasRecording && !isRecording && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <Mic className="h-5 w-5" />
              Recording saved ({formatTime(answer?.audioDurationSeconds ?? elapsed)})
            </div>
            <Button variant="outline" size="sm" onClick={() => { setHasRecording(false); start(); }} className="rounded-xl gap-2">
              <PlayCircle className="h-4 w-4" /> Re-record
            </Button>
          </div>
        )}

        {!isRecording && !hasRecording && (
          <Button onClick={start} size="lg" className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}
      </div>
    </div>
  );
};
