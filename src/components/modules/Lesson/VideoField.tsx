import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link as LinkIcon, X, Play, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { VideoMeta, VideoSourceType } from "@/interface";

interface VideoFieldProps {
  value?: {
    url?: string;
    sourceType?: VideoSourceType;
    file?: string | File | null;
    meta?: VideoMeta;
  };
  onChange: (data: {
    url?: string;
    sourceType: VideoSourceType;
    file?: string | File | null;
    meta?: VideoMeta;
  }) => void;
  error?: string;
}

export function VideoField({ value, onChange, error }: VideoFieldProps) {
  const [sourceType, setSourceType] = useState<VideoSourceType>(
    value?.sourceType || "link"
  );
  const [linkUrl, setLinkUrl] = useState(value?.url || "");
  const [uploadedFile, setUploadedFile] = useState<File | null  | string>(value?.file || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.url || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and normalize video URLs (YouTube, Vimeo, mp4)
  const normalizeVideoUrl = (url: string): string => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct mp4 or other valid URLs
    return url;
  };

  const handleSourceTypeChange = (newType: VideoSourceType) => {
    // Confirm if switching and data exists
    if (
      sourceType !== newType &&
      ((sourceType === "upload" && uploadedFile) ||
        (sourceType === "link" && linkUrl))
    ) {
      const confirmSwitch = window.confirm(
        sourceType === "upload"
          ? "Switching to link will remove the uploaded file. Continue?"
          : "Switching to upload will clear the link. Continue?"
      );
      if (!confirmSwitch) return;
    }

    setSourceType(newType);
    setLinkUrl("");
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setUploadError(null);
    onChange({ sourceType: newType });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("video/")) {
      setUploadError("Please select a valid video file");
      return;
    }

    const maxSizeMB = 300;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploadedFile(file);
    setUploadError(null);
    
    // Create local preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Pass file to parent component for multipart upload
    onChange({
      url: preview,
      sourceType: "upload",
      file: file,

    });
  };

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) return;

    // Validate URL
    try {
      new URL(linkUrl);
      const normalizedUrl = normalizeVideoUrl(linkUrl);
      setPreviewUrl(normalizedUrl);
      onChange({
        url: normalizedUrl,
        sourceType: "link",
        meta: { storage: "external" },
      });
    } catch {
      setUploadError("Invalid URL. Please enter a valid video URL.");
      return;
    }
  };

  const handleRemove = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    setLinkUrl("");
    setUploadProgress(0);
    setUploadError(null);
    onChange({ sourceType });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isYouTubeOrVimeo = (url: string) => {
    return url.includes("youtube.com") || url.includes("vimeo.com");
  };

  return (
    <div className="space-y-4">
      {/* Source Type Toggle */}
      <div>
        <Label className="mb-2 block">Video Source</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={sourceType === "link" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSourceTypeChange("link")}
            className="flex-1"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Link
          </Button>
          <Button
            type="button"
            variant={sourceType === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSourceTypeChange("upload")}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Link Mode */}
        {sourceType === "link" && (
          <motion.div
            key="link"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div>
              <Label htmlFor="videoLink">Video URL</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Paste a YouTube, Vimeo, or direct mp4 URL
              </p>
              <div className="flex gap-2">
                <Input
                  id="videoLink"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onBlur={handleLinkSubmit}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLinkSubmit}
                  disabled={!linkUrl.trim()}
                >
                  Preview
                </Button>
              </div>
            </div>

            {/* Link Preview */}
            {previewUrl && (
              <Card className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Video Preview</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="video-preview-container aspect-video">
                  {isYouTubeOrVimeo(previewUrl) ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video preview"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Upload Mode */}
        {sourceType === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 bg-card p-3 rounded-lg hover:border transition transform ease-in hover:border-dashed hover:border-blue-800"
          >
            <div>
              <Label>Video File</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Upload a lesson video (mp4, webm, mov). Max 300MB.
              </p>

              {!uploadedFile ? (
                <div
                  className="upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, WEBM, MOV up to 300MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload video file"
                  />
                </div>
              ) : (
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">

{uploadedFile instanceof File ? uploadedFile.name : "Uploaded Video"}

                        </p>
                        <p className="text-xs text-muted-foreground">
                          
   {uploadedFile instanceof File && (
      <p>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
    )}

                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemove}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Uploading...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}

                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing video...
                    </div>
                  )}

                  {/* Video Preview */}
                  {previewUrl && !isUploading && (
                    <div className="video-preview-container aspect-video">
                      <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {(error || uploadError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}