import { useState, useEffect } from "react";
import { Timer, AlertCircle } from "lucide-react";

interface ExamTimerProps {
  deadline: number;        // epoch ms — stored in localStorage for refresh survival
  onExpire: () => void;
}

export const ExamTimer = ({ deadline, onExpire }: ExamTimerProps) => {
  const getRemainingSeconds = () =>
    Math.max(0, Math.floor((deadline - Date.now()) / 1000));

  const [timeLeft, setTimeLeft] = useState(getRemainingSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      const remaining = getRemainingSeconds();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

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
