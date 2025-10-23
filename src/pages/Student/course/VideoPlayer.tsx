import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function VideoPlayer({url}:{url:string}) {
  const playerRef = useRef<{ seekTo: (amount: number, type?: "seconds" | "fraction") => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);



  // ------------------------------
  // 🔹 Play / Pause
  // ------------------------------
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  // ------------------------------
  // 🔹 Volume
  // ------------------------------
  const toggleMute = () => {
    setIsMuted(!isMuted);
    showControlsTemporarily();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    showControlsTemporarily();
  };

  // ------------------------------
  // 🔹 Progress
  // ------------------------------
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setPlayed(state.played);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fraction = Number(e.target.value);
    playerRef.current?.seekTo(fraction);
    setPlayed(fraction);
  };

  const handleDuration = (dur: number) => setDuration(dur);

  const skipTime = (seconds: number) => {
    const currentTime = played * duration;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.current?.seekTo(newTime / duration);
    showControlsTemporarily();
  };

  // ------------------------------
  // 🔹 Fullscreen
  // ------------------------------
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ------------------------------
  // 🔹 Controls Visibility
  // ------------------------------
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // ------------------------------
  // 🔹 Keyboard Shortcuts
  // ------------------------------
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Prevent default for space to avoid page scroll
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      }
      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        skipTime(5);
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        skipTime(-5);
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setVolume((v) => Math.min(1, v + 0.1));
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setVolume((v) => Math.max(0, v - 0.1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying, played, duration]);

  // ------------------------------
  // 🔹 Format Time
  // ------------------------------
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden shadow-2xl bg-black"
          style={{ aspectRatio: "16/9" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Video Player */}
          <ReactPlayer
            ref={playerRef}
            url={url}
            playing={isPlaying}
            muted={isMuted}
            volume={volume}
            width="100%"
            height="100%"
            controls={false}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onBuffer={() => setIsBuffering(true)}
            onBufferEnd={() => setIsBuffering(false)}
            onReady={() => setIsReady(true)}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload nofullscreen noremoteplayback",
                  disablePictureInPicture: true,
                },
              },
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />

          {/* Loading Spinner */}
          <AnimatePresence>
            {isBuffering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
              >
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Play Button Overlay */}
          <AnimatePresence>
            {!isPlaying && isReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                onClick={togglePlay}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
                >
                  <Play className="h-10 w-10 text-black ml-1" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end pointer-events-none"
              >
                <div className="pointer-events-auto p-4 space-y-3">
                  {/* Progress Bar */}
                  <div className="group/progress">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.001}
                      value={played}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer transition-all hover:h-1.5"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 ${played * 100}%, rgba(255,255,255,0.3) ${played * 100}%)`,
                      }}
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-white">
                    {/* Left Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlay}
                        className="hover:bg-white/20 transition-all"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipTime(-10)}
                        className="hover:bg-white/20 transition-all"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipTime(10)}
                        className="hover:bg-white/20 transition-all"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center space-x-2 group/volume">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMute}
                          className="hover:bg-white/20 transition-all"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>

                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-blue-500 cursor-pointer"
                        />
                      </div>

                      <span className="text-sm font-medium">
                        {formatTime(played * duration)} / {formatTime(duration)}
                      </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowSettings(!showSettings)}
                          className="hover:bg-white/20 transition-all"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>

                        <AnimatePresence>
                          {showSettings && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-3 min-w-[150px] shadow-xl"
                            >
                              <div className="text-sm font-semibold mb-2">Playback Speed</div>
                              <div className="space-y-1">
                                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                                  <button
                                    key={rate}
                                    onClick={() => {
                                      setPlaybackRate(rate);
                                      setShowSettings(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-white/20 transition-all ${
                                      playbackRate === rate ? "bg-blue-600" : ""
                                    }`}
                                  >
                                    {rate}x
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="hover:bg-white/20 transition-all"
                      >
                        {isFullscreen ? (
                          <Minimize className="h-5 w-5" />
                        ) : (
                          <Maximize className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Watermark (optional - for course protection) */}
          <div className="absolute top-4 right-4 text-white/60 text-xs font-mono pointer-events-none">
            Course Content © 2025
          </div>
        </motion.div>

        
      </div>
    </div>
  );
}