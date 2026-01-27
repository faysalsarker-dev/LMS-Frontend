import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  GripVertical,
  ImageIcon,
  Link as LinkIcon,
  Music,
  Pause,
  Play,
  Plus,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';
import type { PracticeItem } from './practice.types';

interface PracticeItemManagerProps {
  items: PracticeItem[];
  onChange: (items: PracticeItem[]) => void;
  onFilesChange: (files: { [key: number]: { audio?: File; image?: File } }) => void;
  itemFiles: { [key: number]: { audio?: File; image?: File } };
}

type InputMode = 'file' | 'url';

interface ItemInputModes {
  audio: InputMode;
  image: InputMode;
}

export const PracticeItemManager = ({
  items,
  onChange,
  onFilesChange,
  itemFiles,
}: PracticeItemManagerProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [inputModes, setInputModes] = useState<Map<number, ItemInputModes>>(new Map());
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  const getInputMode = (index: number, type: 'audio' | 'image'): InputMode => {
    return inputModes.get(index)?.[type] || 'file';
  };

  const setInputMode = (index: number, type: 'audio' | 'image', mode: InputMode) => {
    setInputModes(prev => {
      const newModes = new Map(prev);
      const current = newModes.get(index) || { audio: 'file', image: 'file' };
      newModes.set(index, { ...current, [type]: mode });
      return newModes;
    });
  };

  const handleAddItem = () => {
    const newItem: PracticeItem = {
      content: '',
      pronunciation: '',
      audioUrl: '',
      order: items.length + 1,
    };
    onChange([...items, newItem]);
    setExpandedItems(new Set([...expandedItems, items.length]));
  };

  const handleUpdateItem = (index: number, updates: Partial<PracticeItem>) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    // Stop audio if playing
    if (playingAudio === index) {
      const audio = audioRefs.current.get(index);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingAudio(null);
    }
    
    const newItems = items
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i + 1 }));
    onChange(newItems);
    
    // Clean up refs, modes, and files
    audioRefs.current.delete(index);
    setInputModes(prev => {
      const newModes = new Map(prev);
      newModes.delete(index);
      return newModes;
    });
    
    // Remove files for this item and reindex
    const newFiles = { ...itemFiles };
    delete newFiles[index];
    
    // Reindex remaining files
    const reindexedFiles: { [key: number]: { audio?: File; image?: File } } = {};
    Object.keys(newFiles).forEach(key => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedFiles[newIndex] = newFiles[oldIndex];
    });
    
    onFilesChange(reindexedFiles);
  };

  const handleReorder = (newItems: PracticeItem[]) => {
    const reorderedItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
    onChange(reorderedItems);
    
    // Reorder files to match new item positions
    const reorderedFiles: { [key: number]: { audio?: File; image?: File } } = {};
    newItems.forEach((item, newIndex) => {
      const oldIndex = items.findIndex(i => i === item);
      if (itemFiles[oldIndex]) {
        reorderedFiles[newIndex] = itemFiles[oldIndex];
      }
    });
    onFilesChange(reorderedFiles);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleFileUpload = (
    index: number,
    type: 'audio' | 'image',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the actual file
      const newFiles = { ...itemFiles };
      if (!newFiles[index]) {
        newFiles[index] = {};
      }
      newFiles[index][type] = file;
      onFilesChange(newFiles);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      handleUpdateItem(index, {
        [type === 'audio' ? 'audioUrl' : 'imageUrl']: previewUrl,
      });
    }
  };

  const handleFileRemove = (index: number, type: 'audio' | 'image') => {
    // Remove file from storage
    const newFiles = { ...itemFiles };
    if (newFiles[index]) {
      delete newFiles[index][type];
      if (!newFiles[index].audio && !newFiles[index].image) {
        delete newFiles[index];
      }
    }
    onFilesChange(newFiles);
    
    // Remove URL from item
    handleUpdateItem(index, {
      [type === 'audio' ? 'audioUrl' : 'imageUrl']: type === 'audio' ? '' : undefined,
    });
  };

  const handleUrlChange = (
    index: number,
    type: 'audio' | 'image',
    url: string
  ) => {
    // When using URL mode, clear any stored file
    const newFiles = { ...itemFiles };
    if (newFiles[index]) {
      delete newFiles[index][type];
      if (!newFiles[index].audio && !newFiles[index].image) {
        delete newFiles[index];
      }
    }
    onFilesChange(newFiles);
    
    handleUpdateItem(index, {
      [type === 'audio' ? 'audioUrl' : 'imageUrl']: url,
    });
  };

  const toggleAudioPlay = (index: number, audioUrl: string) => {
    if (!audioUrl) return;

    let audio = audioRefs.current.get(index);
    
    if (!audio) {
      audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(null);
      audio.onerror = () => setPlayingAudio(null);
      audioRefs.current.set(index, audio);
    }

    if (playingAudio === index) {
      audio.pause();
      audio.currentTime = 0;
      setPlayingAudio(null);
    } else {
      // Stop any other playing audio
      if (playingAudio !== null) {
        const prevAudio = audioRefs.current.get(playingAudio);
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
      }
      audio.src = audioUrl;
      audio.play().catch(() => setPlayingAudio(null));
      setPlayingAudio(index);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Practice Items</CardTitle>
        <Button onClick={handleAddItem} size="sm" type="button">
          <Plus className="mr-1 h-4 w-4" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              No items yet. Add your first practice item.
            </p>
            <Button onClick={handleAddItem} type="button">
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </motion.div>
        ) : (
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <Reorder.Item
                  key={item._id || `item-${index}`}
                  value={item}
                  className="list-none"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Collapsible
                      open={expandedItems.has(index)}
                      onOpenChange={() => toggleExpanded(index)}
                    >
                      <div className="rounded-lg border bg-card overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-muted-foreground">
                                #{item.order}
                              </span>
                              <span className="mx-2 text-muted-foreground">—</span>
                              <span className="font-medium truncate">
                                {item.content || 'Untitled Item'}
                              </span>
                              {!item.audioUrl && (
                                <span className="ml-2 inline-flex items-center text-xs text-destructive">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Audio required
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.audioUrl && (
                                <Music className="h-4 w-4 text-primary" />
                              )}
                              {item.imageUrl && (
                                <ImageIcon className="h-4 w-4 text-accent" />
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(index);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform ${
                                  expandedItems.has(index) ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 pt-0 space-y-4 border-t"
                          >
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`content-${index}`}>
                                  Content *
                                </Label>
                                <Input
                                  id={`content-${index}`}
                                  value={item.content}
                                  onChange={(e) =>
                                    handleUpdateItem(index, {
                                      content: e.target.value,
                                    })
                                  }
                                  placeholder="Enter content (e.g., letter, word)..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`pronunciation-${index}`}>
                                  Pronunciation
                                </Label>
                                <Input
                                  id={`pronunciation-${index}`}
                                  value={item.pronunciation || ''}
                                  onChange={(e) =>
                                    handleUpdateItem(index, {
                                      pronunciation: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., həˈloʊ"
                                />
                              </div>
                            </div>

                            {/* Audio Input - File or URL */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Audio * (File or URL)</Label>
                                <RadioGroup
                                  value={getInputMode(index, 'audio')}
                                  onValueChange={(value) => setInputMode(index, 'audio', value as InputMode)}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="file" id={`audio-file-${index}`} />
                                    <Label htmlFor={`audio-file-${index}`} className="text-sm font-normal cursor-pointer">
                                      <Upload className="h-3 w-3 inline mr-1" />
                                      Upload
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="url" id={`audio-url-${index}`} />
                                    <Label htmlFor={`audio-url-${index}`} className="text-sm font-normal cursor-pointer">
                                      <LinkIcon className="h-3 w-3 inline mr-1" />
                                      URL
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {getInputMode(index, 'audio') === 'file' ? (
                                <div className="flex gap-2">
                                  {item.audioUrl ? (
                                    <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => toggleAudioPlay(index, item.audioUrl)}
                                      >
                                        {playingAudio === index ? (
                                          <Pause className="h-4 w-4" />
                                        ) : (
                                          <Play className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <span className="text-sm text-muted-foreground flex-1 truncate">
                                        {itemFiles[index]?.audio?.name || 
                                         (item.audioUrl.startsWith('blob:') ? 'Uploaded audio file' : item.audioUrl)}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleFileRemove(index, 'audio')}
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
                                        onChange={(e) =>
                                          handleFileUpload(index, 'audio', e)
                                        }
                                      />
                                    </label>
                                  )}
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter audio URL (e.g., https://example.com/audio.mp3)"
                                    value={item.audioUrl || ''}
                                    onChange={(e) => handleUrlChange(index, 'audio', e.target.value)}
                                    className="flex-1"
                                  />
                                  {item.audioUrl && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => toggleAudioPlay(index, item.audioUrl)}
                                    >
                                      {playingAudio === index ? (
                                        <Pause className="h-4 w-4" />
                                      ) : (
                                        <Play className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Image Input - File or URL */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Image (Optional)</Label>
                                <RadioGroup
                                  value={getInputMode(index, 'image')}
                                  onValueChange={(value) => setInputMode(index, 'image', value as InputMode)}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="file" id={`image-file-${index}`} />
                                    <Label htmlFor={`image-file-${index}`} className="text-sm font-normal cursor-pointer">
                                      <Upload className="h-3 w-3 inline mr-1" />
                                      Upload
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="url" id={`image-url-${index}`} />
                                    <Label htmlFor={`image-url-${index}`} className="text-sm font-normal cursor-pointer">
                                      <LinkIcon className="h-3 w-3 inline mr-1" />
                                      URL
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {getInputMode(index, 'image') === 'file' ? (
                                <div className="flex gap-2">
                                  {item.imageUrl ? (
                                    <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                                      <img
                                        src={item.imageUrl}
                                        alt="Preview"
                                        className="h-8 w-8 rounded object-cover"
                                      />
                                      <span className="text-sm text-muted-foreground flex-1 truncate">
                                        {itemFiles[index]?.image?.name || 
                                         (item.imageUrl.startsWith('blob:') ? 'Uploaded image' : item.imageUrl)}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleFileRemove(index, 'image')}
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
                                        onChange={(e) =>
                                          handleFileUpload(index, 'image', e)
                                        }
                                      />
                                    </label>
                                  )}
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                    value={item.imageUrl || ''}
                                    onChange={(e) => handleUrlChange(index, 'image', e.target.value)}
                                    className="flex-1"
                                  />
                                  {item.imageUrl && (
                                    <img
                                      src={item.imageUrl}
                                      alt="Preview"
                                      className="h-10 w-10 rounded object-cover border"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </CardContent>
    </Card>
  );
};