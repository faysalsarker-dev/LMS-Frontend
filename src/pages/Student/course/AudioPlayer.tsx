
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Languages, Repeat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transcript {
  language: string;
  text: string;
}

interface AudioData {
  url: string;
  transcripts: Transcript[];
}

export default function AudioPlayer({ audio }: { audio: AudioData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLang, setActiveLang] = useState(audio.transcripts[0]?.language || "");
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // 1. Initialize WaveSurfer (Works great in Chinese Browsers)
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#334155",
      progressColor: "#3b82f6",
      cursorColor: "#60a5fa",
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 60,
      url: audio.url,
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));
    ws.on("ready", (duration) => setTotalDuration(duration));

    waveRef.current = ws;

    return () => ws.destroy();
  }, [audio.url]);

  // 2. Logic: Split the long text into "sync-able" chunks
  // Since backend doesn't have timestamps, we calculate progress % per sentence
  const transcriptText = audio.transcripts.find(t => t.language === activeLang)?.text || "";
  const sentences = transcriptText.split(/[。！？.!?;]/).filter(s => s.trim().length > 0);

  const getActiveSentenceIndex = () => {
    if (totalDuration === 0) return 0;
    const progress = currentTime / totalDuration;
    return Math.floor(progress * sentences.length);
  };

  const activeIndex = getActiveSentenceIndex();

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Waveform Visualizer Section */}
      <div className="p-6 bg-slate-900/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Volume2 className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium">Audio Lesson</h3>
              <p className="text-slate-500 text-xs">AI-Synced Transcript</p>
            </div>
          </div>

          <Select value={activeLang} onValueChange={setActiveLang}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {audio.transcripts.map((t) => (
                <SelectItem key={t.language} value={t.language}>
                  {t.language.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div ref={containerRef} className="cursor-pointer transition-opacity hover:opacity-80" />
      </div>

      {/* Transcript Scrolling Area */}
      <div className="relative h-80 bg-slate-950 px-8 py-10 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {sentences.map((sentence, i) => (
            <motion.p
              key={i}
              initial={false}
              animate={{
                opacity: activeIndex === i ? 1 : 0.25,
                scale: activeIndex === i ? 1.02 : 1,
                x: activeIndex === i ? 10 : 0,
              }}
              onClick={() => {
                const targetTime = (i / sentences.length) * totalDuration;
                waveRef.current?.setTime(targetTime);
              }}
              className={`text-xl md:text-2xl leading-relaxed cursor-pointer transition-colors ${
                activeIndex === i ? "text-blue-400 font-semibold" : "text-slate-300"
              }`}
            >
              {sentence}。
            </motion.p>
          ))}
        </div>
        
        {/* Floating Play Button */}
        <div className="absolute bottom-6 right-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => waveRef.current?.playPause()}
            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-900/40"
          >
            {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
          </motion.button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .mask-fade { mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent); }
      `}</style>
    </div>
  );
}