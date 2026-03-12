import { useState, useEffect, useCallback } from 'react';
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
import { Separator } from '@/components/ui/separator';
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
  Loader2,
  Pause,
  Play,
  Upload,
  X,
  Music,
} from 'lucide-react';
import { useUpdatePracticeItemMutation } from '@/redux/features/practice/practice.api';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandler';

// Constants
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const AUDIO_ACCEPT = 'audio/*';
const IMAGE_ACCEPT = 'image/*';

// Types
type MediaMode = 'file' | 'url';

// Schema
const itemSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  pronunciation: z.string().optional(),
  audioUrl: z.string().min(1, 'Audio is required'),
  imageUrl: z.string().optional(),
  order: z.number().min(0, 'Order must be a positive number'),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface PracticeItem {
  _id: string;
  content: string;
  pronunciation?: string;
  audioUrl: string;
  imageUrl?: string;
  order: number;
}

interface PracticeItemUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  practiceId: string;
  item: PracticeItem | null;
  onSuccess?: () => void;
}

export const PracticeItemUpdateDialog = ({
  open,
  onOpenChange,
  practiceId,
  item,
  onSuccess,
}: PracticeItemUpdateDialogProps) => {
  // API
  const [updatePracticeItem, { isLoading: isSubmitting }] = useUpdatePracticeItemMutation();

  // Media State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioMode, setAudioMode] = useState<MediaMode>('url');
  const [imageMode, setImageMode] = useState<MediaMode>('url');

  // Audio Player State
  const [playingAudio, setPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Form
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      content: '',
      pronunciation: '',
      audioUrl: '',
      imageUrl: '',
      order: 0,
    },
  });

  // Populate form when item changes
  useEffect(() => {
    if (item && open) {
      form.reset({
        content: item.content,
        pronunciation: item.pronunciation || '',
        audioUrl: item.audioUrl,
        imageUrl: item.imageUrl || '',
        order: item.order,
      });
      // Reset to URL mode when opening with existing item
      setAudioMode('url');
      setImageMode('url');
      setAudioFile(null);
      setImageFile(null);
    }
  }, [item, open, form]);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  // Audio Handlers
  const handleAudioFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('audio/')) {
        toast.error('Invalid audio file');
        return;
      }

      if (file.size > MAX_AUDIO_SIZE) {
        toast.error('Max size 10MB');
        return;
      }

      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      form.setValue('audioUrl', audioUrl);
      form.clearErrors('audioUrl');
    },
    [form]
  );

  const handleAudioRemove = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(null);
    }
    setAudioFile(null);
    setPlayingAudio(false);
    form.setValue('audioUrl', '');
  }, [audioElement, form]);

  const toggleAudioPlay = useCallback(() => {
    const url = form.getValues('audioUrl');
    if (!url) return;

    if (!audioElement) {
      const audio = new Audio(url);
      audio.onended = () => setPlayingAudio(false);
      audio.onerror = () => {
        toast.error('Failed to load audio');
        setPlayingAudio(false);
      };
      setAudioElement(audio);
      audio.play().catch(() => {
        toast.error('Failed to play audio');
        setPlayingAudio(false);
      });
      setPlayingAudio(true);
    } else {
      if (playingAudio) {
        audioElement.pause();
      } else {
        audioElement.play().catch(() => {
          toast.error('Failed to play audio');
        });
      }
      setPlayingAudio(!playingAudio);
    }
  }, [form, audioElement, playingAudio]);

  const handleAudioModeChange = useCallback(
    (mode: string) => {
      const newMode = mode as MediaMode;
      setAudioMode(newMode);
      
      if (newMode === 'url' && item) {
        // Restore original audio URL when switching back to URL mode
        form.setValue('audioUrl', item.audioUrl);
        setAudioFile(null);
      } else if (newMode === 'file') {
        handleAudioRemove();
      }
    },
    [handleAudioRemove, item, form]
  );

  // Image Handlers
  const handleImageFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Invalid image file');
        return;
      }

      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      form.setValue('imageUrl', imageUrl);
    },
    [form]
  );

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    form.setValue('imageUrl', '');
  }, [form]);

  const handleImageModeChange = useCallback(
    (mode: string) => {
      const newMode = mode as MediaMode;
      setImageMode(newMode);
      
      if (newMode === 'url' && item) {
        // Restore original image URL when switching back to URL mode
        form.setValue('imageUrl', item.imageUrl || '');
        setImageFile(null);
      } else if (newMode === 'file') {
        handleImageRemove();
      }
    },
    [handleImageRemove, item, form]
  );

  // Form Handlers
  const handleFormSubmit = async (data: ItemFormData) => {
    if (!item) return;

    try {
      const formData = new FormData();

      // Append regular fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'audioUrl' && key !== 'imageUrl') {
          formData.append(key, String(value));
        }
      });

      // Append audio
      if (audioFile) {
        formData.append('audio', audioFile);
      } else {
        formData.append('audioUrl', data.audioUrl);
      }

      // Append image
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
      }

      await updatePracticeItem({
        practiceId,
        itemId: item._id,
        data: formData,
      }).unwrap();

      toast.success('Item updated successfully!');
      handleClose();
      onSuccess?.();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleClose = useCallback(() => {
    form.reset();
    setAudioFile(null);
    setImageFile(null);
    setAudioMode('url');
    setImageMode('url');
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(null);
    }
    setPlayingAudio(false);
    onOpenChange(false);
  }, [form, audioElement, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Update Practice Item</DialogTitle>
          <DialogDescription>
            Modify the content and media for this practice item.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-6 pt-0">
            {/* Content Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Apple" {...field} />
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
                      <Input placeholder="/ˈæp.əl/" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Audio Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Audio Resource *
                </Label>
                <RadioGroup
                  value={audioMode}
                  onValueChange={handleAudioModeChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="file" id="a-f" />
                    <Label htmlFor="a-f" className="text-xs cursor-pointer">
                      Upload New
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="url" id="a-u" />
                    <Label htmlFor="a-u" className="text-xs cursor-pointer">
                      URL
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {audioMode === 'file' ? (
                <div className="flex gap-2">
                  {form.watch('audioUrl') && audioFile ? (
                    <div className="flex-1 flex items-center justify-between p-2 border rounded-md bg-secondary/20">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={toggleAudioPlay}
                          aria-label={playingAudio ? 'Pause audio' : 'Play audio'}
                        >
                          {playingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-xs truncate max-w-[150px]">
                          {audioFile?.name || 'Audio Preview'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleAudioRemove}
                        aria-label="Remove audio"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Label className="flex-1 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/10 transition-colors">
                      <Upload className="h-4 w-4 mb-1" />
                      <span className="text-xs">Upload MP3/WAV</span>
                      <input
                        type="file"
                        accept={AUDIO_ACCEPT}
                        className="hidden"
                        onChange={handleAudioFileUpload}
                      />
                    </Label>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="https://..."
                    value={form.watch('audioUrl')}
                    onChange={(e) => form.setValue('audioUrl', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleAudioPlay}
                    aria-label={playingAudio ? 'Pause audio' : 'Play audio'}
                  >
                    {playingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              )}
              {form.formState.errors.audioUrl && (
                <p className="text-sm text-destructive">{form.formState.errors.audioUrl.message}</p>
              )}
            </div>

            <Separator />

            {/* Image Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image (Optional)
                </Label>
                <RadioGroup
                  value={imageMode}
                  onValueChange={handleImageModeChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="file" id="i-f" />
                    <Label htmlFor="i-f" className="text-xs cursor-pointer">
                      Upload New
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="url" id="i-u" />
                    <Label htmlFor="i-u" className="text-xs cursor-pointer">
                      URL
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {imageMode === 'file' ? (
                <div className="flex gap-2">
                  {form.watch('imageUrl') && imageFile ? (
                    <div className="relative h-20 w-20 group">
                      <img
                        src={form.watch('imageUrl')}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Label className="flex-1 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/10 transition-colors">
                      <ImageIcon className="h-4 w-4 mb-1" />
                      <span className="text-xs">Upload Photo</span>
                      <input
                        type="file"
                        accept={IMAGE_ACCEPT}
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </Label>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Image URL..."
                    value={form.watch('imageUrl')}
                    onChange={(e) => form.setValue('imageUrl', e.target.value)}
                  />
                  {form.watch('imageUrl') && (
                    <div className="relative h-20 w-20 group">
                      <img
                        src={form.watch('imageUrl')}
                        alt="Current preview"
                        className="h-full w-full object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Item'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};