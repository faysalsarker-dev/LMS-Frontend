import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
// import { VideoProgressBar } from "./video/VideoProgressBar";
// import { VideoControls } from "./video/VideoControls";
// import { ModuleProgress } from "./video/ModuleProgress";

// interface VideoPlayerProps {
//   currentModule: string;
//   progress: number;
//   onPrevious: () => void;
//   onNext: () => void;
// }


  // currentModule,
  // progress,
  // onPrevious,
  // onNext,

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTime, setCurrentTime] = useState(0);
  // const [duration] = useState(900); // 15 minutes in seconds
  // const [volume, setVolume] = useState([80]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // const handleTimeUpdate = (newTime: number[]) => {
  //   setCurrentTime(newTime[0]);
  // };

  // const handleVolumeChange = (newVolume: number[]) => {
  //   setVolume(newVolume);
  // };

  // const toggleFullscreen = () => {
  //   if (videoRef.current) {
  //     if (document.fullscreenElement) {
  //       document.exitFullscreen();
  //     } else {
  //       videoRef.current.requestFullscreen();
  //     }
  //   }
  // };

  return (
    <div className="flex flex-col space-y-6">
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/placeholder.svg"
        >
          <source src="/placeholder-video.mp4" type="video/mp4" />
        </video>

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
              onClick={togglePlay}
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Video Controls */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <VideoProgressBar
            currentTime={currentTime}
            duration={duration}
            onTimeUpdate={handleTimeUpdate}
          />
          <VideoControls
            isPlaying={isPlaying}
            volume={volume}
            onTogglePlay={togglePlay}
            onVolumeChange={handleVolumeChange}
            onToggleFullscreen={toggleFullscreen}
          />
        </div> */}
      </div>

      {/* Module Progress */}
      {/* <ModuleProgress
        currentModule={currentModule}
        progress={progress}
        onPrevious={onPrevious}
        onNext={onNext}
      /> */}
    </div>
  );
}