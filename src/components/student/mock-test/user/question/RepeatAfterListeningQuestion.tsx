import { useEffect, useRef, useState } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, Square, PlayCircle } from "lucide-react";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const RepeatAfterListeningQuestion = ({ question, answer, onChange }: Props) => {
  const timeLimitSec = question.allowedRecordingTime ?? 60;
  const [audioEnded, setAudioEnded] = useState(false);
  const [hasRecording, setHasRecording] = useState(!!answer?.audioBlob);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { start, stop, isRecording, elapsed } = useAudioRecorder(timeLimitSec, (blob, duration) => {
    setHasRecording(true);
    onChange({ questionId: question._id!, questionType: question.type, audioBlob: blob, audioDurationSeconds: duration });
  });

  // Auto-start recording when audio ends
  useEffect(() => {
    if (audioEnded && !isRecording && !hasRecording) {
      start();
    }
  }, [audioEnded]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      {/* Audio player */}
      {question.audioUrl && (
        <div className="flex flex-col items-center gap-4 p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            🔊 Listen first, then repeat
          </span>
          <audio
            ref={audioRef}
            controls
            src={question.audioUrl}
            autoPlay
            onEnded={() => setAudioEnded(true)}
            className="w-full max-w-sm"
          />
        </div>
      )}

      {/* Recording state */}
      <div className="flex flex-col items-center gap-6 py-8">
        {!audioEnded && !hasRecording && (
          <p className="text-muted-foreground text-center animate-pulse">
            Waiting for audio to finish...
          </p>
        )}

        {isRecording && (
          <>
            <div className="flex items-center gap-3 text-destructive font-bold animate-pulse text-lg">
              <span className="h-3 w-3 rounded-full bg-destructive animate-ping" />
              Recording... {formatTime(elapsed)} / {formatTime(timeLimitSec)}
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={stop}
              className="rounded-2xl border-destructive text-destructive hover:bg-destructive/5 gap-2"
            >
              <Square className="h-5 w-5" />
              Stop &amp; Save Recording
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

        {audioEnded && !isRecording && !hasRecording && (
          <Button onClick={start} size="lg" className="rounded-2xl gap-2">
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}
      </div>
    </div>
  );
};
