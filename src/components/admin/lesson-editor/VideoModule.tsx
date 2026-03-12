import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Upload, Link, Play, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoModuleProps {
  videoUrl: string;
  videoFile: File | null;
  videoDuration: number;
  onUrlChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
  onDurationChange: (duration: number) => void;
}

type InputMode = 'url' | 'file';

export function VideoModule({
  videoUrl,
  videoFile,
  videoDuration,
  onUrlChange,
  onFileChange,
  onDurationChange,
}: VideoModuleProps) {
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
      onUrlChange('');
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const clearFile = () => {
    onFileChange(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    if (mode === 'url') {
      clearFile();
    } else {
      onUrlChange('');
    }
  };

  const previewUrl = inputMode === 'url' ? videoUrl : filePreviewUrl;
  const canPlay = !!previewUrl;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={inputMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeChange('url')}
          className="gap-2"
        >
          <Link className="w-4 h-4" />
          External URL
        </Button>
        <Button
          type="button"
          variant={inputMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeChange('file')}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* URL Input */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            value={videoUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Supports YouTube, Vimeo, Wistia, SoundCloud, Facebook, and direct video URLs
          </p>
        </div>
      )}

      {/* File Upload */}
      {inputMode === 'file' && (
        <div className="space-y-2">
          <Label>Video File</Label>
          {videoFile ? (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{videoFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className={cn(
              'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer',
              'hover:border-primary hover:bg-primary/5 transition-colors'
            )}>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload video</span>
              <span className="text-xs text-muted-foreground mt-1">MP4, WebM, MOV up to 500MB</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="videoDuration">Duration (seconds)</Label>
        <Input
          id="videoDuration"
          type="number"
          min={0}
          placeholder="Auto-detected or enter manually"
          value={videoDuration || ''}
          onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Video Preview */}
      {canPlay && previewUrl && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative aspect-video bg-foreground/5 rounded-lg overflow-hidden shadow-lg">
            <ReactPlayer
              src={previewUrl}
              width="100%"
              height="100%"
              controls
              onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                const video = e.currentTarget;
                if (video.duration && !isNaN(video.duration)) {
                  onDurationChange(Math.round(video.duration));
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
