import { useState, useEffect } from "react";
import { Timer, AlertCircle } from "lucide-react";

interface ExamTimerProps {
  deadline?: number; // epoch ms
  onExpire?: () => void;
  durationMinutes?: number;
  onTimeUp?: () => void;
}

export const ExamTimer = ({
  deadline,
  onExpire,
  durationMinutes,
  onTimeUp,
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

  useEffect(() => {
    if (timeLeft <= 0) {
      handler();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = deadline ? getRemainingSeconds() : prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          handler();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline, durationMinutes]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLow = timeLeft < 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-xl font-bold border-2 transition-colors ${
        isLow
          ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
          : "bg-primary/10 text-primary border-primary/20"
      }`}
    >
      {isLow ? (
        <AlertCircle className="h-5 w-5" />
      ) : (
        <Timer className="h-5 w-5" />
      )}
      {formatTime(timeLeft)}
    </div>
  );
};
