import { useState } from 'react';
import { Upload, Link, Music, X, Plus, Trash2, Languages } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ITranscript } from '@/interface/lesson.type';

interface AudioModuleProps {
  audioUrl: string;
  audioFile: File | null;
  transcripts: ITranscript[];
  onUrlChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
  onTranscriptsChange: (transcripts: ITranscript[]) => void;

}

type InputMode = 'url' | 'file';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

export function AudioModule({
  audioUrl,
  audioFile,
  transcripts,
  onUrlChange,
  onFileChange,
  onTranscriptsChange,
}: AudioModuleProps) {
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

  const addTranscript = () => {
    onTranscriptsChange([
      ...transcripts,
      { language: 'en', text: '' },
    ]);
  };

  const removeTranscript = (index: number) => {
    onTranscriptsChange(transcripts.filter((_, i) => i !== index));
  };

  const updateTranscript = (index: number, field: keyof ITranscript, value: string) => {
    const updated = [...transcripts];
    updated[index] = { ...updated[index], [field]: value };
    onTranscriptsChange(updated);
  };

  const previewUrl = inputMode === 'url' ? audioUrl : filePreviewUrl;

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
          <Label htmlFor="audioUrl">Audio URL</Label>
          <Input
            id="audioUrl"
            type="url"
            placeholder="https://example.com/audio.mp3"
            value={audioUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* File Upload */}
      {inputMode === 'file' && (
        <div className="space-y-2">
          <Label>Audio File</Label>
          {audioFile ? (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                <Music className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{audioFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
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
              'hover:border-accent hover:bg-accent/5 transition-colors'
            )}>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click to upload audio</span>
              <span className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG up to 100MB</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Audio Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <audio controls className="w-full" src={previewUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Transcripts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Transcripts</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Add transcripts in different languages
            </p>
          </div>
          <Button type="button" onClick={addTranscript} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transcript
          </Button>
        </div>

        {transcripts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Languages className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No transcripts yet. Add transcripts to improve accessibility.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transcripts.map((transcript, index) => (
              <Card key={index} className="animate-slide-up">
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label>Language</Label>
                      <Select
                        value={transcript.language}
                        onValueChange={(value) => updateTranscript(index, 'language', value)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTranscript(index)}
                      className="mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Transcript Text</Label>
                    <Textarea
                      value={transcript.text}
                      onChange={(e) => updateTranscript(index, 'text', e.target.value)}
                      placeholder="Enter the transcript text..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
