import { useState, useEffect } from "react";
import { Timer, AlertCircle } from "lucide-react";

interface MockTestTimerProps {
    durationMinutes: number;
    onTimeUp: () => void;
}

export const MockTestTimer = ({ durationMinutes, onTimeUp }: MockTestTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const isLow = timeLeft < 300; // 5 minutes

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-xl font-bold border-2 transition-colors ${isLow
                ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
                : "bg-primary/10 text-primary border-primary/20"
            }`}>
            {isLow ? <AlertCircle className="h-5 w-5" /> : <Timer className="h-5 w-5" />}
            {formatTime(timeLeft)}
        </div>
    );
};
