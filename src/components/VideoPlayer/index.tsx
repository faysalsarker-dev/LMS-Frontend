import { useState, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";


import { Skeleton } from "@/components/ui/skeleton";
import { ProgressBar } from "./ProgressBar";
import { Controls } from "./Controls";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useVideoControls } from "@/hooks/useVideoControls";
import { useFullscreen } from "@/hooks/useFullscreen";

interface VideoPlayerProps {
  url: string;
  watermark?: string;
  brandLogo?: string;
}

const VideoPlayer = memo(function VideoPlayer({
  url,
  watermark = "HLC © 2025",
  brandLogo,
}: VideoPlayerProps) {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    buffered,
    isBuffering,
    playbackRate,
    isReady,
    togglePlay,
    toggleMute,
    setVolume,
    seek,
    skipTime,
    setPlaybackRate,
    videoRef,
  } = useVideoControls();

  const { isFullscreen, toggleFullscreen, containerRef } = useFullscreen();

  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3000);
  }, [videoRef]);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      showControlsTemporarily();
    },
    [setVolume, showControlsTemporarily]
  );

  const handleSkipForward = useCallback(() => {
    skipTime(10);
    showControlsTemporarily();
  }, [skipTime, showControlsTemporarily]);

  const handleSkipBackward = useCallback(() => {
    skipTime(-10);
    showControlsTemporarily();
  }, [skipTime, showControlsTemporarily]);

  const handleTogglePlay = useCallback(() => {
    togglePlay();
    showControlsTemporarily();
  }, [togglePlay, showControlsTemporarily]);

  const handleToggleMute = useCallback(() => {
    toggleMute();
    showControlsTemporarily();
  }, [toggleMute, showControlsTemporarily]);

  const handleToggleFullscreen = useCallback(() => {
    toggleFullscreen();
    showControlsTemporarily();
  }, [toggleFullscreen, showControlsTemporarily]);

  const handlePlaybackRateChange = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      showControlsTemporarily();
    },
    [setPlaybackRate, showControlsTemporarily]
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTogglePlay: handleTogglePlay,
    onToggleMute: handleToggleMute,
    onToggleFullscreen: handleToggleFullscreen,
    onSkipForward: (seconds) => {
      skipTime(seconds);
      showControlsTemporarily();
    },
    onSkipBackward: (seconds) => {
      skipTime(-seconds);
      showControlsTemporarily();
    },
    onVolumeUp: () => {
      setVolume(Math.min(1, volume + 0.1));
      showControlsTemporarily();
    },
    onVolumeDown: () => {
      setVolume(Math.max(0, volume - 0.1));
      showControlsTemporarily();
    },
    onSeekToPercent: (percent) => {
      seek(duration * percent);
      showControlsTemporarily();
    },
  });

  return (
    <div className="flex items-center justify-center p-2 md:p-4 bg-background">
      <div className="w-full max-w-6xl">
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden shadow-2xl bg-black group"
          style={{ aspectRatio: "16/9" }}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => videoRef.current && !videoRef.current.paused && setShowControls(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "VIDEO") {
              handleTogglePlay();
            }
          }}
        >
          {/* Video element with security features */}
          <video
            ref={videoRef}
            src={url}
            className="w-full h-full object-contain select-none"
            playsInline
            preload="metadata"
            onContextMenu={(e) => e.preventDefault()}
            controlsList="nodownload nopictureinpicture"
            disablePictureInPicture
            disableRemotePlayback
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Buffering indicator */}
          <AnimatePresence>
            {isBuffering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-primary rounded-full animate-spin" />
                  <Skeleton className="h-4 w-32 bg-white/20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Play button overlay */}
          <AnimatePresence>
            {!isPlaying && isReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-20"
                onClick={handleTogglePlay}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-2xl"
                >
                  <Play className="h-10 w-10 text-black ml-1" fill="currentColor" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls overlay */}
          <AnimatePresence>
            {(showControls || !isPlaying) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end pointer-events-none z-30"
              >
                <div className="pointer-events-auto px-4 pb-4 space-y-2">
                  <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    buffered={buffered}
                    onSeek={seek}
                    formatTime={formatTime}
                  />
                  <Controls
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    volume={volume}
                    currentTime={currentTime}
                    duration={duration}
                    isFullscreen={isFullscreen}
                    playbackRate={playbackRate}
                    onTogglePlay={handleTogglePlay}
                    onToggleMute={handleToggleMute}
                    onVolumeChange={handleVolumeChange}
                    onSkipForward={handleSkipForward}
                    onSkipBackward={handleSkipBackward}
                    onToggleFullscreen={handleToggleFullscreen}
                    onPlaybackRateChange={handlePlaybackRateChange}
                    formatTime={formatTime}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Watermark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-4 right-4 text-primary/50 text-xs font-mono pointer-events-none select-none z-20"
          >
            {watermark}
          </motion.div>

          {/* Brand logo (optional) */}
          {brandLogo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-4 left-4 pointer-events-none select-none z-20"
            >
              <img src={brandLogo} alt="Brand" className="h-8 w-auto opacity-80" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;
