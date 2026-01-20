import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  GripVertical,
  ImageIcon,
  Music,
  Pause,
  Play,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { PracticeItem } from './practice.types';

interface PracticeItemManagerProps {
  items: PracticeItem[];
  onChange: (items: PracticeItem[]) => void;
}

export const PracticeItemManager = ({
  items,
  onChange,
}: PracticeItemManagerProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const handleAddItem = () => {
    const newItem: PracticeItem = {
      content: '',
      pronunciation: '',
      description: '',
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
    const newItems = items
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i + 1 }));
    onChange(newItems);
  };

  const handleReorder = (newItems: PracticeItem[]) => {
    const reorderedItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
    onChange(reorderedItems);
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
      // In a real app, you'd upload to a server and get a URL back
      const fakeUrl = URL.createObjectURL(file);
      handleUpdateItem(index, {
        [type === 'audio' ? 'audioUrl' : 'imageUrl']: fakeUrl,
      });
    }
  };

  const toggleAudioPlay = (index: number) => {
    if (playingAudio === index) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(index);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Practice Items</CardTitle>
        <Button onClick={handleAddItem} size="sm">
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
            <Button onClick={handleAddItem}>
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
                                  placeholder="Enter content..."
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

                            <div className="space-y-2">
                              <Label htmlFor={`description-${index}`}>
                                Description
                              </Label>
                              <Textarea
                                id={`description-${index}`}
                                value={item.description || ''}
                                onChange={(e) =>
                                  handleUpdateItem(index, {
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Additional notes or context..."
                                rows={2}
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              {/* Audio Upload */}
                              <div className="space-y-2">
                                <Label>Audio File</Label>
                                <div className="flex gap-2">
                                  {item.audioUrl ? (
                                    <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => toggleAudioPlay(index)}
                                      >
                                        {playingAudio === index ? (
                                          <Pause className="h-4 w-4" />
                                        ) : (
                                          <Play className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <span className="text-sm text-muted-foreground flex-1 truncate">
                                        audio-file.mp3
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          handleUpdateItem(index, {
                                            audioUrl: undefined,
                                          })
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                                      <Upload className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">
                                        Upload Audio
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
                              </div>

                              {/* Image Upload */}
                              <div className="space-y-2">
                                <Label>Image</Label>
                                <div className="flex gap-2">
                                  {item.imageUrl ? (
                                    <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                                      <img
                                        src={item.imageUrl}
                                        alt="Preview"
                                        className="h-8 w-8 rounded object-cover"
                                      />
                                      <span className="text-sm text-muted-foreground flex-1 truncate">
                                        image-file.jpg
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          handleUpdateItem(index, {
                                            imageUrl: undefined,
                                          })
                                        }
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
                              </div>
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
