import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Layers, ArrowRight } from "lucide-react";
import type { Practice } from "./practice.types";

interface PracticeCardProps {
  data: Practice;
}

export const PracticeCard = ({ data }: PracticeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all">
        
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={data.thumbnail || "/api/placeholder/400/225"}
            alt={data.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />


          {/* Items badge */}
          <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-slate-950/90 text-primary border-none flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {data.totalItems} Items
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary text-left">
            {data.course.title}
          </p>

          <h3 className="text-lg font-bold leading-tight line-clamp-1 text-left">
            {data.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] text-left">
            {data.description ||
              "Start practicing your skills with this curated set of exercises."}
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pt-1">
            <PlayCircle className="h-3 w-3" />
            {data.usageCount.toLocaleString()} plays
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-5 pt-0">
          <Button
            size="lg"
            className="relative w-full rounded-xl font-semibold overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue Practice
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </span>

            {/* Button glow */}
            <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
