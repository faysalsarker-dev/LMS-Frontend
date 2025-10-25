import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
}

export const ProgressBar = memo(function ProgressBar({
  currentTime,
  duration,
  buffered,
  onSeek,
  formatTime,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const time = pos * duration;
      onSeek(time);
    },
    [duration, onSeek]
  );

  const handleProgressHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const time = pos * duration;
      setHoverTime(time);
      setHoverPosition(e.clientX - rect.left);
    },
    [duration]
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer group hover:h-1.5 transition-all duration-200"
      onClick={handleProgressClick}
      onMouseMove={handleProgressHover}
      onMouseLeave={() => setHoverTime(null)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="slider"
      aria-label="Video progress"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
    >
      {/* Buffered progress */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-white/40 rounded-full pointer-events-none"
        initial={{ width: 0 }}
        animate={{ width: `${buffered}%` }}
        transition={{ duration: 0.3 }}
      />

      {/* Current progress */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-primary rounded-full pointer-events-none"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Progress handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isDragging ? 1 : 0,
          scale: isDragging ? 1.2 : 1,
          left: `${progress}%`,
        }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{ marginLeft: "-6px" }}
      />

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoverTime !== null && (
          <TooltipProvider delayDuration={0}>
            <Tooltip open={true}>
              <TooltipTrigger asChild>
                <motion.div
                  className="absolute bottom-full"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  style={{ left: `${hoverPosition}px`, transform: "translateX(-50%)" }}
                >
                  <TooltipContent
                    side="top"
                    className="bg-black/95 text-white border-none px-2 py-1 text-xs font-medium backdrop-blur-sm"
                  >
                    {formatTime(hoverTime)}
                  </TooltipContent>
                </motion.div>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        )}
      </AnimatePresence>
    </div>
  );
});
