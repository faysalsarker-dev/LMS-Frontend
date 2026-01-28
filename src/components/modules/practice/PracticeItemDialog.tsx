import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Pause,
  Play,
  Upload,
  X,
} from 'lucide-react';
import { useAddItemToPracticeMutation } from '@/redux/features/practice/practice.api';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';

const itemSchema = z.object({
  practiceId: z.string().min(1, 'Please select a practice'),
  content: z.string().min(1, 'Content is required'),
  pronunciation: z.string().optional(),
  audioUrl: z.string().min(1, 'Audio is required'),
  imageUrl: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface PracticeItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPracticeId?: string;
  onSuccess?: () => void;
}

export const PracticeItemDialog = ({
  open,
  onOpenChange,
  defaultPracticeId,
  onSuccess,
}: PracticeItemDialogProps) => {

  const [addItemToPractice, { isLoading: isSubmitting }] = useAddItemToPracticeMutation();

  // Local State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioMode, setAudioMode] = useState<'file' | 'url'>('file');
  const [imageMode, setImageMode] = useState<'file' | 'url'>('file');
  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      practiceId: defaultPracticeId || '',
      content: '',
      pronunciation: '',
      audioUrl: '',
      imageUrl: '',
    },
  });

  // Update practiceId when defaultPracticeId changes
  useEffect(() => {
    if (defaultPracticeId) {
      form.setValue('practiceId', defaultPracticeId);
    }
  }, [defaultPracticeId, form]);

  const handleAudioFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload a valid audio file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Audio file size must be less than 10MB');
        return;
      }

      setAudioFile(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue('audioUrl', previewUrl);
      form.clearErrors('audioUrl');
    }
  };

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue('imageUrl', previewUrl);
    }
  };

  const handleAudioRemove = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    if (form.watch('audioUrl')?.startsWith('blob:')) {
      URL.revokeObjectURL(form.watch('audioUrl') || '');
    }
    setAudioFile(null);
    setPlayingAudio(false);
    form.setValue('audioUrl', '');
  };

  const handleImageRemove = () => {
    if (form.watch('imageUrl')?.startsWith('blob:')) {
      URL.revokeObjectURL(form.watch('imageUrl') || '');
    }
    setImageFile(null);
    form.setValue('imageUrl', '');
  };

  const toggleAudioPlay = () => {
    const audioUrl = form.watch('audioUrl');
    if (!audioUrl) return;

    if (!audioElement) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(false);
      audio.onerror = () => {
        setPlayingAudio(false);
        toast.error('Failed to play audio');
      };
      setAudioElement(audio);
      audio.play().catch(() => toast.error('Failed to play audio'));
      setPlayingAudio(true);
    } else {
      if (playingAudio) {
        audioElement.pause();
        setPlayingAudio(false);
      } else {
        audioElement.src = audioUrl;
        audioElement.play().catch(() => toast.error('Failed to play audio'));
        setPlayingAudio(true);
      }
    }
  };

  const handleFormSubmit = async (data: ItemFormData) => {
    try {
      const formData = new FormData();

      formData.append('practiceId', data.practiceId);
      formData.append('content', data.content);

      if (data.pronunciation) {
        formData.append('pronunciation', data.pronunciation);
      }

      // Handle audio
      if (audioFile) {
        formData.append('audio', audioFile);
      } else if (data.audioUrl && !data.audioUrl.startsWith('blob:')) {
        formData.append('audioUrl', data.audioUrl);
      } else {
        toast.error('Please provide audio file or URL');
        return;
      }

      // Handle image
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (data.imageUrl && !data.imageUrl.startsWith('blob:')) {
        formData.append('imageUrl', data.imageUrl);
      }

      await addItemToPractice(formData).unwrap();
      
      toast.success('Item added successfully!');
      handleClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
   handleApiError(error)
    }
  };

  const handleClose = () => {
    // Cleanup
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    if (form.watch('audioUrl')?.startsWith('blob:')) {
      URL.revokeObjectURL(form.watch('audioUrl') || '');
    }
    if (form.watch('imageUrl')?.startsWith('blob:')) {
      URL.revokeObjectURL(form.watch('imageUrl') || '');
    }

    form.reset({
      practiceId: defaultPracticeId || '',
      content: '',
      pronunciation: '',
      audioUrl: '',
      imageUrl: '',
    });
    setAudioFile(null);
    setImageFile(null);
    setPlayingAudio(false);
    setAudioElement(null);
    setAudioMode('file');
    setImageMode('file');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Practice Item</DialogTitle>
          <DialogDescription>
            Select a practice and add a new item to it. Fill in the content and upload media files.
          </DialogDescription>
        </DialogHeader>

  

    

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
       
            <div className="border-t pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter content (e.g., letter, word)..."
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pronunciation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pronunciation</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., həˈloʊ" 
                          disabled={isSubmitting}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Audio Input */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Audio * (File or URL)</Label>
                  <RadioGroup
                    value={audioMode}
                    onValueChange={(value) => {
                      setAudioMode(value as 'file' | 'url');
                      handleAudioRemove();
                    }}
                    disabled={isSubmitting}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="audio-file" />
                      <Label htmlFor="audio-file" className="text-sm font-normal cursor-pointer">
                        <Upload className="h-3 w-3 inline mr-1" />
                        Upload
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="audio-url" />
                      <Label htmlFor="audio-url" className="text-sm font-normal cursor-pointer">
                        <LinkIcon className="h-3 w-3 inline mr-1" />
                        URL
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {audioMode === 'file' ? (
                  <div className="flex gap-2">
                    {form.watch('audioUrl') ? (
                      <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isSubmitting}
                          onClick={toggleAudioPlay}
                        >
                          {playingAudio ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-sm text-muted-foreground flex-1 truncate">
                          {audioFile?.name || 'Uploaded audio file'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isSubmitting}
                          onClick={handleAudioRemove}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Audio File
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          disabled={isSubmitting}
                          onChange={handleAudioFileUpload}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter audio URL (e.g., https://example.com/audio.mp3)"
                      value={form.watch('audioUrl') || ''}
                      onChange={(e) => {
                        form.setValue('audioUrl', e.target.value);
                        form.clearErrors('audioUrl');
                      }}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    {form.watch('audioUrl') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={isSubmitting}
                        onClick={toggleAudioPlay}
                      >
                        {playingAudio ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
                {form.formState.errors.audioUrl && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.audioUrl.message}
                  </p>
                )}
              </div>

              {/* Image Input */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <Label>Image (Optional)</Label>
                  <RadioGroup
                    value={imageMode}
                    onValueChange={(value) => {
                      setImageMode(value as 'file' | 'url');
                      handleImageRemove();
                    }}
                    disabled={isSubmitting}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="image-file" />
                      <Label htmlFor="image-file" className="text-sm font-normal cursor-pointer">
                        <Upload className="h-3 w-3 inline mr-1" />
                        Upload
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="image-url" />
                      <Label htmlFor="image-url" className="text-sm font-normal cursor-pointer">
                        <LinkIcon className="h-3 w-3 inline mr-1" />
                        URL
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {imageMode === 'file' ? (
                  <div className="flex gap-2">
                    {form.watch('imageUrl') ? (
                      <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                        <img
                          src={form.watch('imageUrl')}
                          alt="Preview"
                          className="h-8 w-8 rounded object-cover"
                        />
                        <span className="text-sm text-muted-foreground flex-1 truncate">
                          {imageFile?.name || 'Uploaded image'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isSubmitting}
                          onClick={handleImageRemove}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isSubmitting}
                          onChange={handleImageFileUpload}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      value={form.watch('imageUrl') || ''}
                      onChange={(e) => form.setValue('imageUrl', e.target.value)}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    {form.watch('imageUrl') && (
                      <img
                        src={form.watch('imageUrl')}
                        alt="Preview"
                        className="h-10 w-10 rounded object-cover border"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Item'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};