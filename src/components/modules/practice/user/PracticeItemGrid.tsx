import { motion } from "framer-motion";
import { PracticeItem } from "@/types/practice";
import { PracticeItemCard } from "./PracticeItemCard";

interface PracticeItemGridProps {
  items: PracticeItem[];
  playingId: string | null;
  onPlayItem: (id: string, audioUrl: string) => void;
}

export const PracticeItemGrid = ({
  items,
  playingId,
  onPlayItem,
}: PracticeItemGridProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
        Tap to hear each letter
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <PracticeItemCard
            key={item._id}
            item={item}
            isPlaying={playingId === item._id}
            onPlay={() => onPlayItem(item._id, item.audioUrl)}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
};
