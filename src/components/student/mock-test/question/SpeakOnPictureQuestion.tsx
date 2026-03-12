import { useEffect, useState } from "react";
import type { IMockQuestion, QuestionAnswer } from "@/interface/mockTest.types";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, Square, PlayCircle } from "lucide-react";

interface Props {
  question: IMockQuestion;
  answer: QuestionAnswer | undefined;
  onChange: (answer: QuestionAnswer) => void;
}

export const SpeakOnPictureQuestion = ({ question, answer, onChange }: Props) => {
  const timeLimitSec = question.allowedRecordingTime ?? 120;
  const [hasRecording, setHasRecording] = useState(!!answer?.audioBlob);
  const [started, setStarted] = useState(false);

  const { start, stop, isRecording, elapsed } = useAudioRecorder(timeLimitSec, (blob, duration) => {
    setHasRecording(true);
    onChange({ questionId: question._id!, questionType: question.type, audioBlob: blob, audioDurationSeconds: duration });
  });

  // Auto-start on mount
  useEffect(() => {
    if (!hasRecording && !started) {
      setStarted(true);
      start();
    }
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const imageUrl = question.images?.[0]?.url;

  return (
    <div className="space-y-6">
      {/* Image */}
      {imageUrl && (
        <div className="flex justify-center">
          <div className="max-w-lg w-full rounded-3xl overflow-hidden border-4 border-card shadow-2xl">
            <img src={imageUrl} alt="Speak about this" className="w-full h-auto object-cover" />
          </div>
        </div>
      )}

      <p className="text-center font-semibold text-muted-foreground">
        Look at the picture and speak about what you see.
      </p>

      {/* Recording controls */}
      <div className="flex flex-col items-center gap-4 py-4">
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
      </div>
    </div>
  );
};
