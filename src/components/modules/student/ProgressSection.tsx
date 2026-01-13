import { motion } from 'framer-motion';
import { Download, Trophy, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { IUserProgressData } from '@/interface/student.types';

interface ProgressSectionProps {
  progress: IUserProgressData | undefined;
  isLoading: boolean;
}

const ProgressSection = ({ progress, isLoading }: ProgressSectionProps) => {
  if (isLoading) {
    return (
      <Card className="stat-card">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }
  if (!progress) {
    return null;
  }

  const handleDownloadCertificate = () => {
    console.log('Downloading certificate:', progress.certificateUrl);
    alert('Certificate download initiated! (Demo)');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="stat-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Course Progress
            </CardTitle>
            {progress.overview.isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              >
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </span>
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {progress?.overview?.totalLessonsCompleted} lessons completed
              </span>
              <span className="font-semibold text-primary">{progress?.overview?.progressPercentage.toFixed()}%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            >
              <Progress 
                value={progress?.overview?.progressPercentage} 

                className="h-3"
              />
            </motion.div>
          </div>

          {progress?.overview?.isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={handleDownloadCertificate}
                className="w-full sm:w-auto animate-pulse-subtle bg-success hover:bg-success/90 text-success-foreground"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressSection;
