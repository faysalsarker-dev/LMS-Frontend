import { memo } from "react";
import CustomVideoPlayer from "./CustomVideoPlayer";

interface VideoPlayerProps {
  url: string;
  watermark?: string;
  brandLogo?: string;
  type?: boolean | string | null;
}

const VideoPlayer = memo(function VideoPlayer({
  url,
  watermark = "HLC © ",
  brandLogo,
  type,
}: VideoPlayerProps) {
  if (type === true) {
    return (
      <div className="flex items-center justify-center p-2 md:p-4 bg-background">
        <div className="w-full max-w-6xl">
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={url}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === false) {
    return (
      <div className="flex items-center justify-center p-2 md:p-4 bg-background">
        <div className="w-full max-w-6xl">
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center text-muted-foreground p-8"
            style={{ aspectRatio: "16/9" }}
          >
            <p className="text-lg font-medium">Not supported</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CustomVideoPlayer
      url={url}
      watermark={watermark}
      brandLogo={brandLogo}
    />
  );
});

export default VideoPlayer;
export { CustomVideoPlayer };
