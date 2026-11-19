import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PracticeItem } from "../practice.types";

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
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onPlay}
      aria-label={`Play pronunciation of letter ${item.content}`}
      className={cn(
        "group relative flex aspect-square w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border p-3 sm:gap-2 sm:p-4",
        "bg-gradient-to-br from-card via-card to-primary/5 text-card-foreground shadow-sm transition-all duration-300",
        "hover:border-primary/50 hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isPlaying
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border"
      )}
    >
      {/* Playing indicator ring */}
      {isPlaying && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* Letter display */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <span
          className={cn(
            "break-words text-4xl font-bold leading-none tracking-tight transition-colors duration-300 sm:text-5xl lg:text-6xl",
            isPlaying
              ? "text-primary"
              : "text-foreground group-hover:text-primary"
          )}
        >
          {item.content}
        </span>
      </div>

      {/* Pronunciation text */}
      {item.pronunciation && (
        <span className="line-clamp-2 w-full break-words px-1 text-center text-sm font-medium leading-tight text-muted-foreground sm:text-base">
          {item.pronunciation}
        </span>
      )}

      {/* Play icon */}
      <div
        className={cn(
          "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300",
          isPlaying
            ? "bg-primary text-primary-foreground"
            : "bg-muted/80 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        <Volume2 aria-hidden="true" className="h-3.5 w-3.5" />
      </div>
    </motion.button>
  );
};
