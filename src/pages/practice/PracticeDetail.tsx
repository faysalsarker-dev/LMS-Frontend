import { useParams } from "react-router";
import {
  PracticeHeader,
  PracticeItemGrid,
  PracticeSkeleton,
  PracticeError,
  PracticeEmpty,
} from "@/components/modules/practice/user";
import { useGetSinglePracticeForUserQuery } from "@/redux/features/practice/practice.api";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

const PracticeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError, error, refetch } = useGetSinglePracticeForUserQuery(slug || "");
  const { playingId, playAudio } = useAudioPlayer();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-5xl py-6 sm:py-8">
          <PracticeSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-5xl py-6 sm:py-8">
          <PracticeError 
            message={typeof error === 'string' ? error : 'An error occurred'} 
            onRetry={refetch} 
          />
        </div>
      </div>
    );
  }

  const { practice, items } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-6 sm:py-8">
        <PracticeHeader practice={practice} />
        
        {items.length === 0 ? (
          <PracticeEmpty />
        ) : (
          <PracticeItemGrid
            items={items}
            playingId={playingId}
            onPlayItem={playAudio}
          />
        )}
      </div>
    </div>
  );
};

export default PracticeDetail;
