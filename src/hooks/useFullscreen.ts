/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";

// ==================== useFullscreen Hook ====================
export interface UseFullscreenReturn {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useFullscreen(): UseFullscreenReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      const element = containerRef.current as any;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const doc = document as any;
    const isCurrentlyFullscreen = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isCurrentlyFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners for all vendor prefixes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    containerRef,
  };
}

// ==================== useKeyboardShortcuts Hook ====================
export interface KeyboardShortcutHandlers {
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSkipForward: (seconds: number) => void;
  onSkipBackward: (seconds: number) => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onSeekToPercent: (percent: number) => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Prevent default for all our shortcuts
      const shouldPreventDefault = [
        "Space",
        "KeyK",
        "KeyM",
        "KeyF",
        "ArrowRight",
        "ArrowLeft",
        "KeyJ",
        "KeyL",
        "ArrowUp",
        "ArrowDown",
      ].includes(e.code) || e.code.startsWith("Digit") || e.code.startsWith("Numpad");

      if (shouldPreventDefault) {
        e.preventDefault();
      }

      switch (e.code) {
        case "Space":
        case "KeyK":
          handlers.onTogglePlay();
          break;
        case "KeyM":
          handlers.onToggleMute();
          break;
        case "KeyF":
          handlers.onToggleFullscreen();
          break;
        case "ArrowRight":
          handlers.onSkipForward(5);
          break;
        case "ArrowLeft":
          handlers.onSkipBackward(5);
          break;
        case "KeyJ":
          handlers.onSkipBackward(10);
          break;
        case "KeyL":
          handlers.onSkipForward(10);
          break;
        case "ArrowUp":
          handlers.onVolumeUp();
          break;
        case "ArrowDown":
          handlers.onVolumeDown();
          break;
        case "Digit0":
        case "Numpad0":
          handlers.onSeekToPercent(0);
          break;
        case "Digit1":
        case "Numpad1":
          handlers.onSeekToPercent(0.1);
          break;
        case "Digit2":
        case "Numpad2":
          handlers.onSeekToPercent(0.2);
          break;
        case "Digit3":
        case "Numpad3":
          handlers.onSeekToPercent(0.3);
          break;
        case "Digit4":
        case "Numpad4":
          handlers.onSeekToPercent(0.4);
          break;
        case "Digit5":
        case "Numpad5":
          handlers.onSeekToPercent(0.5);
          break;
        case "Digit6":
        case "Numpad6":
          handlers.onSeekToPercent(0.6);
          break;
        case "Digit7":
        case "Numpad7":
          handlers.onSeekToPercent(0.7);
          break;
        case "Digit8":
        case "Numpad8":
          handlers.onSeekToPercent(0.8);
          break;
        case "Digit9":
        case "Numpad9":
          handlers.onSeekToPercent(0.9);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}

// ==================== useVideoControls Hook ====================
export interface UseVideoControlsReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  isBuffering: boolean;
  playbackRate: number;
  isReady: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  skipTime: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useVideoControls(): UseVideoControlsReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const play = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.play().catch((err) => {
      console.error("Error playing video:", err);
    });
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    if (!videoRef.current) return;
    const vol = Math.max(0, Math.min(1, newVolume));
    videoRef.current.volume = vol;
    setVolumeState(vol);
    if (vol === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  }, [isMuted]);

  const seek = useCallback((time: number) => {
    if (!videoRef.current || !duration) return;
    const clampedTime = Math.max(0, Math.min(duration, time));
    videoRef.current.currentTime = clampedTime;
  }, [duration]);

  const skipTime = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    seek(newTime);
  }, [duration, seek]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };
    const handleProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => {
      setIsBuffering(false);
      setIsReady(true);
    };
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Initialize volume on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  return {
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
    play,
    pause,
    toggleMute,
    setVolume,
    seek,
    skipTime,
    setPlaybackRate,
    videoRef,
  };
}
