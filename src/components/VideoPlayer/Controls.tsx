import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  playbackRate: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onToggleFullscreen: () => void;
  onPlaybackRateChange: (rate: number) => void;
  formatTime: (seconds: number) => string;
}

export const Controls = memo(function Controls({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  isFullscreen,
  playbackRate,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSkipForward,
  onSkipBackward,
  onToggleFullscreen,
  onPlaybackRateChange,
  formatTime,
}: ControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-between text-white">
        {/* Left controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePlay}
                className="h-9 w-9 hover:bg-white/20 text-white transition-colors"
                aria-label={isPlaying ? "Pause (k)" : "Play (k)"}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/95 text-white border-none">
              {isPlaying ? "Pause (k)" : "Play (k)"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkipBackward}
                className="h-9 w-9 hover:bg-white/20 text-white transition-colors"
                aria-label="Rewind 10 seconds (j)"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/95 text-white border-none">
              Rewind 10s (j)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkipForward}
                className="h-9 w-9 hover:bg-white/20 text-white transition-colors"
                aria-label="Forward 10 seconds (l)"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/95 text-white border-none">
              Forward 10s (l)
            </TooltipContent>
          </Tooltip>

          {/* Volume controls with integrated skip buttons */}
          <div
            className="flex items-center gap-1 ml-1"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleMute}
                  className="h-9 w-9 hover:bg-white/20 text-white transition-colors"
                  aria-label={isMuted ? "Unmute (m)" : "Mute (m)"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/95 text-white border-none">
                {isMuted ? "Unmute (m)" : "Mute (m)"}
              </TooltipContent>
            </Tooltip>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 80, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Slider
                    value={[volume * 100]}
                    onValueChange={(value: number[]) => onVolumeChange(value[0] / 100)}
                    max={100}
                    step={1}
                    className="w-20"
                    aria-label="Volume"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Small skip buttons next to volume control */}
          <div className="flex items-center gap-0.5 ml-1 border-l border-white/20 pl-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSkipBackward}
                  className="h-7 w-7 hover:bg-white/20 text-white transition-colors"
                  aria-label="Skip back 10 seconds"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/95 text-white border-none">
                -10s
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSkipForward}
                  className="h-7 w-7 hover:bg-white/20 text-white transition-colors"
                  aria-label="Skip forward 10 seconds"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/95 text-white border-none">
                +10s
              </TooltipContent>
            </Tooltip>
          </div>

          <span className="text-sm font-medium ml-2 tabular-nums select-none">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-white/20 text-white transition-colors"
                    aria-label="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/95 text-white border-none">
                Settings
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              align="end"
              className="bg-black/95 backdrop-blur-md border-white/10 text-white min-w-[160px]"
            >
              <div className="px-2 py-1.5 text-sm font-semibold opacity-70">Playback Speed</div>
              {playbackRates.map((rate) => (
                <DropdownMenuItem
                  key={rate}
                  onClick={() => onPlaybackRateChange(rate)}
                  className={`cursor-pointer hover:bg-white/20 focus:bg-white/20 ${
                    playbackRate === rate ? "bg-primary text-white font-semibold" : ""
                  }`}
                >
                  {rate === 1 ? "Normal" : `${rate}x`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFullscreen}
                className="h-9 w-9 hover:bg-white/20 text-white transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/95 text-white border-none">
              {isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
});