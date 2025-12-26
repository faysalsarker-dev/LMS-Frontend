import { useState, useRef } from 'react';
import { Upload, Link, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { IQuestion } from '@/interface/lesson.type';

interface AudioAnswerSectionProps {
  question: IQuestion;
  onUpdateField: (field: 'audioFile' | 'audioUrl' | 'correctAnswer', value: any) => void;
}

export function AudioAnswerSection({
  question,
  onUpdateField,
}: AudioAnswerSectionProps) {
  const [audioMode, setAudioMode] = useState<'file' | 'url'>(question.audioUrl ? 'url' : 'file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdateField('audioFile', file);
      onUpdateField('audioUrl', '');
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (url: string) => {
    onUpdateField('audioUrl', url);
    onUpdateField('audioFile', null);
    setAudioPreview(url);
  };

  const clearAudio = () => {
    onUpdateField('audioFile', null);
    onUpdateField('audioUrl', '');
    setAudioPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentAudioSrc = audioPreview || question.audioUrl || (question.audioFile ? URL.createObjectURL(question.audioFile) : null);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Question Audio</Label>
        <Tabs value={audioMode} onValueChange={(v) => setAudioMode(v as 'file' | 'url')}>
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
                question.audioFile && 'border-success bg-success/5'
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
                <p className="text-sm text-success">{question.audioFile.name}</p>
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
