

import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Layers, Music, TrendingUp, Play, Pause, 
 Plus, Settings, Volume2 
} from 'lucide-react';
import { format } from 'date-fns';
import { useState, useRef } from 'react';
import { useGetSinglePracticeQuery } from '@/redux/features/practice/practice.api';

// Components

import { PracticeItemDialog } from '@/components/modules/practice/PracticeItemDialog';
import { UpdatePracticeDialog } from '@/components/modules/practice/UpdatePracticeDialog';
import type { PracticeItem } from '@/components/modules/practice';

const ViewPracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: practiceResponse, isLoading, refetch } = useGetSinglePracticeQuery(id, {
    skip: !id,
  });
  
  const practice = practiceResponse?.data;
  
  // States for Dialogs
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  
  // Audio State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (audioUrl: string, itemId: string) => {
    if (playingId === itemId) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(itemId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Practice not found</h2>
        <Button asChild className="mt-4"><Link to="/admin/practices">Back to List</Link></Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-10">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{practice.title}</h1>
              <Badge variant={practice.isActive ? 'default' : 'destructive'}>
                {practice.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl">{practice.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button onClick={() => setIsItemDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<Layers className="text-primary" />} label="Total Items" value={practice.items?.length || 0} />
          <StatCard icon={<TrendingUp className="text-blue-500" />} label="Usage Count" value={practice.usageCount} />
          <StatCard icon={<Music className="text-orange-500" />} label="Course" value={practice.course?.title || 'N/A'} isSmall />
        </div>

        {/* Practice Items List */}
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-xl">Practice Content</CardTitle>
            <span className="text-xs text-muted-foreground italic">Click content to play pronunciation</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {practice.items?.map((item: PracticeItem, i: number) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => item.audioUrl && handlePlayAudio(item.audioUrl, item._id)}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover border bg-white" />
                    )}

                    <div className="flex-1">
                      <p className="font-semibold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.content}
                        {item.audioUrl && <Volume2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </p>
                      {item.pronunciation && (
                        <p className="text-sm font-mono text-muted-foreground">[{item.pronunciation}]</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                     {playingId === item._id ? (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <Pause className="h-4 w-4 fill-current" />
                          <span>Playing</span>
                        </div>
                     ) : (
                       item.audioUrl && <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                     )}
                  </div>
                </motion.div>
              ))}
              
              {(!practice.items || practice.items.length === 0) && (
                <div className="py-20 text-center space-y-3">
                   <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                     <Plus className="text-muted-foreground" />
                   </div>
                   <p className="text-muted-foreground">This practice is empty. Start by adding items.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground">
          Last updated: {format(new Date(practice?.updatedAt), 'PPP p')}
        </div>
      </div>

      {/* Dialogs */}
      <PracticeItemDialog
        open={isItemDialogOpen} 
        onOpenChange={setIsItemDialogOpen} 
        defaultPracticeId={practice._id}
        onSuccess={() => refetch()} 
      />
      
      <UpdatePracticeDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        practice={practice}
        onSuccess={() => refetch()}
      />
    </motion.div>
  );
};

// Helper Sub-component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ icon, label, value, isSmall = false }: any) => (
  <Card>
    <CardContent className="pt-6 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-muted">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={isSmall ? "text-lg font-semibold truncate max-w-[150px]" : "text-2xl font-bold"}>
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default ViewPracticePage;