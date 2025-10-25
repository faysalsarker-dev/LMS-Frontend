import { useEffect } from "react";

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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          handlers.onTogglePlay();
          break;
        case "KeyM":
          e.preventDefault();
          handlers.onToggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          handlers.onToggleFullscreen();
          break;
        case "ArrowRight":
          e.preventDefault();
          handlers.onSkipForward(5);
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlers.onSkipBackward(5);
          break;
        case "KeyJ":
          e.preventDefault();
          handlers.onSkipBackward(10);
          break;
        case "KeyL":
          e.preventDefault();
          handlers.onSkipForward(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handlers.onVolumeUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          handlers.onVolumeDown();
          break;
        case "Digit0":
        case "Numpad0":
          e.preventDefault();
          handlers.onSeekToPercent(0);
          break;
        case "Digit1":
        case "Numpad1":
          e.preventDefault();
          handlers.onSeekToPercent(0.1);
          break;
        case "Digit2":
        case "Numpad2":
          e.preventDefault();
          handlers.onSeekToPercent(0.2);
          break;
        case "Digit3":
        case "Numpad3":
          e.preventDefault();
          handlers.onSeekToPercent(0.3);
          break;
        case "Digit4":
        case "Numpad4":
          e.preventDefault();
          handlers.onSeekToPercent(0.4);
          break;
        case "Digit5":
        case "Numpad5":
          e.preventDefault();
          handlers.onSeekToPercent(0.5);
          break;
        case "Digit6":
        case "Numpad6":
          e.preventDefault();
          handlers.onSeekToPercent(0.6);
          break;
        case "Digit7":
        case "Numpad7":
          e.preventDefault();
          handlers.onSeekToPercent(0.7);
          break;
        case "Digit8":
        case "Numpad8":
          e.preventDefault();
          handlers.onSeekToPercent(0.8);
          break;
        case "Digit9":
        case "Numpad9":
          e.preventDefault();
          handlers.onSeekToPercent(0.9);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
