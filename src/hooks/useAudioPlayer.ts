import { useState, useRef, useCallback } from "react";

interface UseAudioPlayerReturn {
  playingId: string | null;
  playAudio: (id: string, audioUrl: string) => void;
  stopAudio: () => void;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const playAudio = useCallback((id: string, audioUrl: string) => {
    // Stop any currently playing audio
    stopAudio();

    // Create and play new audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingId(id);

    audio.play().catch((err) => {
      console.error("Audio playback failed:", err);
      setPlayingId(null);
    });

    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };

    audio.onerror = () => {
      console.error("Audio error");
      setPlayingId(null);
      audioRef.current = null;
    };
  }, [stopAudio]);

  return {
    playingId,
    playAudio,
    stopAudio,
  };
};
