

import { useState, useRef, useEffect } from 'react';
import { Upload, Link, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface IQuestion {
  audioFile?: File | null;
  audioUrl?: string;
  correctAnswer?: string;
}

interface AudioAnswerSectionProps {
  question: IQuestion;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateField: (field: 'audioFile' | 'audioUrl' | 'correctAnswer', value: any) => void;
}

export function AudioAnswerSection({
  question,
  onUpdateField,
}: AudioAnswerSectionProps) {
  const [audioMode, setAudioMode] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  // Initialize audio mode based on existing data
  useEffect(() => {
    if (question.audioUrl) {
      setAudioMode('url');
      setAudioPreview(question.audioUrl);
    } else if (question.audioFile) {
      setAudioMode('file');
      setAudioPreview(URL.createObjectURL(question.audioFile));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear URL when file is uploaded
      onUpdateField('audioUrl', '');
      onUpdateField('audioFile', file);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (url: string) => {
    // Clear file when URL is provided
    onUpdateField('audioFile', null);
    onUpdateField('audioUrl', url);
    setAudioPreview(url || null);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModeChange = (mode: 'file' | 'url') => {
    setAudioMode(mode);
    
    // Clear the opposite mode when switching
    if (mode === 'file') {
      onUpdateField('audioUrl', '');
      setAudioPreview(question.audioFile ? URL.createObjectURL(question.audioFile) : null);
    } else {
      onUpdateField('audioFile', null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setAudioPreview(question.audioUrl || null);
    }
  };

  const clearAudio = () => {
    onUpdateField('audioFile', null);
    onUpdateField('audioUrl', '');
    setAudioPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentAudioSrc = audioMode === 'file' 
    ? (question.audioFile ? (audioPreview || URL.createObjectURL(question.audioFile)) : null)
    : (question.audioUrl || null);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Question Audio</Label>
        <Tabs value={audioMode} onValueChange={(mode) => handleModeChange(mode as 'file' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              Audio URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-3">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                'hover:border-primary hover:bg-primary/5',
                question.audioFile && 'border-green-500 bg-green-50'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Volume2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              {question.audioFile ? (
                <p className="text-sm text-green-600 font-medium">{question.audioFile.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to upload audio file
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-3">
            <Input
              type="url"
              value={question.audioUrl || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/audio.mp3"
            />
          </TabsContent>
        </Tabs>

        {currentAudioSrc && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <audio controls src={currentAudioSrc} className="flex-1 h-10" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearAudio}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Expected Answer</Label>
        <Input
          value={question.correctAnswer || ''}
          onChange={(e) => onUpdateField('correctAnswer', e.target.value)}
          placeholder="Enter the expected response to the audio..."
        />
        <p className="text-xs text-muted-foreground">
          What the learner should answer after listening
        </p>
      </div>
    </div>
  );
}