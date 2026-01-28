import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { PracticeItem } from "@/types/practice";
import { cn } from "@/lib/utils";

interface PracticeItemCardProps {
  item: PracticeItem;
  isPlaying: boolean;
  onPlay: () => void;
  index: number;
}

export const PracticeItemCard = ({
  item,
  isPlaying,
  onPlay,
  index,
}: PracticeItemCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onPlay}
      aria-label={`Play pronunciation of letter ${item.content}`}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 sm:p-6",
        "bg-card rounded-2xl border-2 transition-all duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "cursor-pointer group",
        isPlaying
          ? "border-primary shadow-playing"
          : "border-letter-border hover:border-primary/50 shadow-card hover:shadow-card-hover"
      )}
    >
      {/* Playing indicator ring */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* Letter display */}
      <div className="relative mb-2">
        <span
          className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-bold transition-colors duration-300",
            isPlaying ? "text-primary" : "text-letter-text group-hover:text-primary"
          )}
        >
          {item.content}
        </span>
      </div>

      {/* Pronunciation text */}
      {item.pronunciation && (
        <span className="text-xs sm:text-sm text-muted-foreground font-medium mb-2">
          {item.pronunciation}
        </span>
      )}

      {/* Play icon */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300",
          isPlaying
            ? "bg-primary text-primary-foreground animate-bounce-soft"
            : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </motion.button>
  );
};
