import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { Edit, Layers, Music, TrendingUp, Play, Pause, ImageIcon } from 'lucide-react';
import { useGetPracticeByIdQuery } from '@/hooks/usePracticeApi';
import { format } from 'date-fns';
import { useState, useRef } from 'react';

const ViewPracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: practice, isLoading } = useGetPracticeByIdQuery(id || '');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (audioUrl: string, index: number) => {
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setPlayingIndex(null);
      audioRef.current.play();
      setPlayingIndex(index);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Practice not found</h2>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{practice.title}</h1>
            <p className="text-muted-foreground mt-1">{practice.description}</p>
          </div>
          <Button asChild><Link to={`/admin/practices/${practice._id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Layers className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{practice.totalItems}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Usage Count</p>
                <p className="text-2xl font-bold">{practice.usageCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Music className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="text-lg font-semibold truncate">{practice.course?.title || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Practice Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {practice.items.map((item, i) => (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg border bg-muted/30 flex items-center gap-4"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-muted-foreground w-8">#{item.order}</span>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{item.content}</p>
                    {item.pronunciation && (
                      <p className="text-sm text-muted-foreground">/{item.pronunciation}/</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.imageUrl && (
                    <div className="relative group">
                      <img src={item.imageUrl} alt={item.content} className="h-10 w-10 rounded object-cover" />
                      <ImageIcon className="h-3 w-3 absolute -top-1 -right-1 text-accent" />
                    </div>
                  )}
                  {item.audioUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayAudio(item.audioUrl, i)}
                    >
                      {playingIndex === i ? (
                        <><Pause className="h-4 w-4 mr-1" /> Playing</>
                      ) : (
                        <><Play className="h-4 w-4 mr-1" /> Test Audio</>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
            {practice.items.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No items in this practice</p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{practice.course?.title}</Badge>
          <Badge variant={practice.isActive ? 'default' : 'destructive'}>
            {practice.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Created: {format(new Date(practice.createdAt), 'PPP')}
        </p>
      </div>
    </motion.div>
  );
};

export default ViewPracticePage;
