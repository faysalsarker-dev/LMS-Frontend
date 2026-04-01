import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipBack,
  SkipForward,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  /** URL of the audio file to play */
  src: string;
  /** Optional label shown above the player */
  label?: string;
  /** Auto-play when the component mounts (default: false) */
  autoPlay?: boolean;
  /** Callback fired when audio finishes playing */
  onEnded?: () => void;
  /** Extra class names for the wrapper */
  className?: string;
  /** Compact mode – smaller height, fewer controls (default: false) */
  compact?: boolean;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

/** Format seconds → MM:SS */
const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const AudioPlayer = ({
  src,
  label = "🔊 Listen carefully",
  autoPlay = false,
  onEnded,
  className,
  compact = false,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1×
  const [playCount, setPlayCount] = useState(0);

  /* ── progress RAF loop ── */
  const tick = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    setCurrent(el.currentTime);
    animRef.current = requestAnimationFrame(tick);
  }, []);

  /* ── mount / src change ── */
  useEffect(() => {
    const el = new Audio(src);
    el.preload = "metadata";
    // Prevent context-menu download
    el.oncontextmenu = (e) => e.preventDefault();

    el.addEventListener("loadedmetadata", () => {
      setDuration(el.duration);
      setIsLoading(false);
    });
    el.addEventListener("canplay", () => setIsLoading(false));
    el.addEventListener("waiting", () => setIsLoading(true));
    el.addEventListener("ended", () => {
      setIsPlaying(false);
      cancelAnimationFrame(animRef.current);
      setPlayCount((c) => c + 1);
      onEnded?.();
    });
    el.addEventListener("pause", () => {
      setIsPlaying(false);
      cancelAnimationFrame(animRef.current);
    });
    el.addEventListener("play", () => {
      setIsPlaying(true);
      animRef.current = requestAnimationFrame(tick);
    });

    const handleStopAudio = () => {
      el.pause();
    };
    window.addEventListener("stopAudio", handleStopAudio);

    el.volume = volume;
    el.muted = muted;
    el.playbackRate = SPEEDS[speedIdx];
    audioRef.current = el;

    if (autoPlay) {
      el.play().catch(() => {});
    }

    return () => {
      el.pause();
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("stopAudio", handleStopAudio);
      el.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  /* ── helpers ── */
  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }
  };

  const seek = (val: number[]) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = val[0];
    setCurrent(val[0]);
  };

  const skip = (sec: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.currentTime + sec, duration));
  };

  const restart = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  };

  const changeVolume = (val: number[]) => {
    const el = audioRef.current;
    const v = val[0];
    setVolume(v);
    setMuted(v === 0);
    if (el) {
      el.volume = v;
      el.muted = v === 0;
    }
  };

  const toggleMute = () => {
    const el = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (el) el.muted = next;
  };

  const cycleSpeed = () => {
    const nextIdx = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(nextIdx);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[nextIdx];
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border-2 border-primary/15 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10",
        compact && "gap-2 p-3",
        className
      )}
      // Prevent right-click download on the entire player
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── Label ── */}
      {label && (
        <p
          className={cn(
            "text-center text-xs font-bold uppercase tracking-widest text-primary",
            compact && "text-[10px]"
          )}
        >
          {label}
        </p>
      )}

      {/* ── Waveform / visualizer bar (decorative) ── */}
      {!compact && (
        <div className="flex items-end justify-center gap-[3px] h-8">
          {Array.from({ length: 28 }).map((_, i) => {
            const active = progress > (i / 28) * 100;
            const h = 20 + Math.sin(i * 0.8) * 12 + Math.cos(i * 1.3) * 8;
            return (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-75",
                  active ? "bg-primary" : "bg-primary/20",
                  isPlaying && active && "animate-[pulse_0.8s_ease-in-out_infinite]"
                )}
                style={{ height: `${h}px`, animationDelay: `${i * 30}ms` }}
              />
            );
          })}
        </div>
      )}

      {/* ── Progress slider ── */}
      <div className="flex items-center gap-2">
        <span className="w-9 text-right text-[11px]  font-mono text-muted-foreground tabular-nums">
          {fmt(current)}
        </span>
        <Slider
          min={0}
          max={duration || 100}
          step={0.1}
          value={[current]}
          onValueChange={seek}
          disabled={isLoading}
          className="flex-1 border-2 rounded-full"
        />
        <span className="w-9 text-left  text-[11px] font-mono text-muted-foreground tabular-nums">
          {fmt(duration)}
        </span>
      </div>

      {/* ── Controls row ── */}
      <div className={cn("flex items-center justify-between gap-2", compact && "gap-1")}>
        {/* Left: speed */}
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleSpeed}
          className="h-8 rounded-lg px-2 text-xs font-bold text-muted-foreground hover:text-primary"
          title="Change speed"
        >
          {SPEEDS[speedIdx]}×
        </Button>

        {/* Center: skip-back, play/pause, skip-fwd, restart */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
            onClick={() => skip(-5)}
            disabled={isLoading}
            title="Back 5s"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={togglePlay}
            disabled={isLoading}
            className={cn(
              "h-10 w-10 rounded-full shadow-md transition-all duration-200",
              compact && "h-9 w-9"
            )}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-[1px]" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
            onClick={() => skip(5)}
            disabled={isLoading}
            title="Skip 5s"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
            onClick={restart}
            disabled={isLoading}
            title="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: volume */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
            onClick={toggleMute}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          {!compact && (
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[muted ? 0 : volume]}
              onValueChange={changeVolume}
              className="w-20"
            />
          )}
        </div>
      </div>

      {/* ── Play-count badge ── */}
      {playCount > 0 && (
        <p className="text-center text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
          Played {playCount} time{playCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};
