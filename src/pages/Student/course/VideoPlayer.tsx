import { useState, useRef, useEffect, useCallback } from "react";
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

export default function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    showControlsTemporarily();
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    showControlsTemporarily();
  }, [isMuted]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!videoRef.current) return;
    const vol = Math.max(0, Math.min(1, newVolume));
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
    videoRef.current.muted = vol === 0;
    showControlsTemporarily();
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skipTime = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    handleSeek(newTime);
    showControlsTemporarily();
  }, [duration, handleSeek]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    handleSeek(time);
  }, [duration, handleSeek]);

  const handleProgressHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    setHoverTime(time);
    setHoverPosition(e.clientX - rect.left);
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
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
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => {
      setIsBuffering(false);
      setIsReady(true);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(5);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-5);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          break;
        case "KeyJ":
          e.preventDefault();
          skipTime(-10);
          break;
        case "KeyL":
          e.preventDefault();
          skipTime(10);
          break;
        case "Digit0":
        case "Numpad0":
          e.preventDefault();
          handleSeek(0);
          break;
        case "Digit1":
        case "Numpad1":
          e.preventDefault();
          handleSeek(duration * 0.1);
          break;
        case "Digit2":
        case "Numpad2":
          e.preventDefault();
          handleSeek(duration * 0.2);
          break;
        case "Digit3":
        case "Numpad3":
          e.preventDefault();
          handleSeek(duration * 0.3);
          break;
        case "Digit4":
        case "Numpad4":
          e.preventDefault();
          handleSeek(duration * 0.4);
          break;
        case "Digit5":
        case "Numpad5":
          e.preventDefault();
          handleSeek(duration * 0.5);
          break;
        case "Digit6":
        case "Numpad6":
          e.preventDefault();
          handleSeek(duration * 0.6);
          break;
        case "Digit7":
        case "Numpad7":
          e.preventDefault();
          handleSeek(duration * 0.7);
          break;
        case "Digit8":
        case "Numpad8":
          e.preventDefault();
          handleSeek(duration * 0.8);
          break;
        case "Digit9":
        case "Numpad9":
          e.preventDefault();
          handleSeek(duration * 0.9);
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay, toggleMute, toggleFullscreen, skipTime, handleSeek, handleVolumeChange, volume, duration]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden shadow-2xl bg-black group"
          style={{ aspectRatio: "16/9" }}
          onMouseMove={showControlsTemporarily}
          onMouseLeave={() => videoRef.current && !videoRef.current.paused && setShowControls(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "VIDEO") {
              togglePlay();
            }
          }}
        >
          <video
            ref={videoRef}
            src={url}
            className="w-full h-full object-contain"
            playsInline
            preload="metadata"
            onContextMenu={(e) => e.preventDefault()}
          />

          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {!isPlaying && isReady && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-20 transition-opacity duration-300"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play className="h-10 w-10 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          )}

          {(showControls || !isPlaying) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end pointer-events-none z-30 transition-opacity duration-300">
              <div className="pointer-events-auto px-4 pb-4 space-y-2">
                <div
                  ref={progressBarRef}
                  className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer group/progress hover:h-1.5 transition-all"
                  onClick={handleProgressClick}
                  onMouseMove={handleProgressHover}
                  onMouseLeave={() => setHoverTime(null)}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-white/40 rounded-full transition-all"
                    style={{ width: `${buffered}%` }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover/progress:opacity-100 transition-all shadow-lg"
                    style={{ left: `${progress}%`, marginLeft: "-6px" }}
                  />
                  {hoverTime !== null && (
                    <div
                      className="absolute bottom-full mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded pointer-events-none whitespace-nowrap"
                      style={{ left: `${hoverPosition}px`, transform: "translateX(-50%)" }}
                    >
                      {formatTime(hoverTime)}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={togglePlay}
                      className="p-2 hover:bg-white/20 rounded transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>

                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2 hover:bg-white/20 rounded transition-colors"
                      aria-label="Rewind 10 seconds"
                    >
                      <SkipBack className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => skipTime(10)}
                      className="p-2 hover:bg-white/20 rounded transition-colors"
                      aria-label="Forward 10 seconds"
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2 group/volume ml-1">
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>

                      <div className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-200 overflow-hidden">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-full accent-white cursor-pointer"
                          aria-label="Volume"
                        />
                      </div>
                    </div>

                    <span className="text-sm font-medium ml-2 tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        aria-label="Settings"
                      >
                        <Settings className="h-4 w-4" />
                      </button>

                      {showSettings && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur rounded-lg p-3 min-w-[160px] shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-sm font-semibold mb-2">Playback Speed</div>
                          <div className="space-y-1">
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => {
                                  setPlaybackRate(rate);
                                  setShowSettings(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-white/20 transition-colors ${
                                  playbackRate === rate ? "bg-red-600 font-semibold" : ""
                                }`}
                              >
                                {rate === 1 ? "Normal" : `${rate}x`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/20 rounded transition-colors"
                      aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 text-white/50 text-xs font-mono pointer-events-none select-none z-20">
            Protected Content © 2025
          </div>
        </div>

    
      </div>
    </div>
  );
}