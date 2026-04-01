import { useState, useEffect, useRef } from "react";
import { Timer, AlertCircle, PauseCircle } from "lucide-react";

interface ExamTimerProps {
  deadline?: number; // epoch ms
  onExpire?: () => void;
  durationMinutes?: number;
  onTimeUp?: () => void;
  /** When true the countdown is frozen (timer does not tick down) */
  paused?: boolean;
}

export const ExamTimer = ({
  deadline,
  onExpire,
  durationMinutes,
  onTimeUp,
  paused = false,
}: ExamTimerProps) => {
  const handler = onExpire || onTimeUp || (() => {});

  const getRemainingSeconds = () => {
    if (deadline) {
      return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    }
    if (durationMinutes) {
      return durationMinutes * 60;
    }
    return 0;
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingSeconds);
  const pausedAtRef = useRef<number | null>(null);
  const deadlineOffsetRef = useRef<number>(0);
  const lastDeadlineRef = useRef<number | undefined>(deadline);

  useEffect(() => {
    if (deadline !== lastDeadlineRef.current) {
      // If the parent explicitly changed the deadline prop, reset internal offset
      deadlineOffsetRef.current = 0;
      lastDeadlineRef.current = deadline;
    }

    if (paused) {
      // Remember when we froze
      pausedAtRef.current = Date.now();
      return;
    }

    // If resuming from pause, push deadline forward by the paused duration
    if (pausedAtRef.current !== null && deadline) {
      const pausedDuration = Date.now() - pausedAtRef.current;
      deadlineOffsetRef.current += pausedDuration;
      pausedAtRef.current = null;
    }

    if (timeLeft <= 0) {
      handler();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(() => {
        const adjusted = deadline
          ? Math.max(0, Math.floor((deadline + deadlineOffsetRef.current - Date.now()) / 1000))
          : timeLeft - 1;

        if (adjusted <= 0) {
          clearInterval(interval);
          handler();
          return 0;
        }
        return adjusted;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, deadline, durationMinutes]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLow = timeLeft < 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-xl font-bold border-2 transition-all duration-300 ${
        paused
          ? "bg-blue-500/10 text-blue-600 border-blue-500/30 scale-105"
          : isLow
          ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
          : "bg-primary/10 text-primary border-primary/20"
      }`}
    >
      {paused ? (
        <PauseCircle className="h-5 w-5 animate-pulse" />
      ) : isLow ? (
        <AlertCircle className="h-5 w-5" />
      ) : (
        <Timer className="h-5 w-5" />
      )}
      {formatTime(timeLeft)}
      {paused && (
        <span className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">
          Paused
        </span>
      )}
    </div>
  );
};
