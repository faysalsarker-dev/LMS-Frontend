import { motion, AnimatePresence } from 'framer-motion';
import { Video, FileText, HelpCircle, Headphones, ClipboardList, BookOpen } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonActions } from './LessonActions';
import type {  LessonType } from '@/interface/lesson.type';
import type { ILesson } from '@/interface';

interface LessonTableProps {
  lessons: ILesson[];
  isLoading: boolean;
  onRefetch: () => void;
}

const typeConfig: Record<LessonType, { icon: typeof Video; label: string; className: string }> = {
  video: {
    icon: Video,
    label: 'Video',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  doc: {
    icon: FileText,
    label: 'Document',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  quiz: {
    icon: HelpCircle,
    label: 'Quiz',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  audio: {
    icon: Headphones,
    label: 'Audio',
    className: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  assignment: {
    icon: ClipboardList,
    label: 'Assignment',
    className: 'bg-success/10 text-success border-success/20',
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-5 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-lg" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No lessons found
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            No lessons match your current filters. Try adjusting your search or filters.
          </p>
        </motion.div>
      </TableCell>
    </TableRow>
  );
}

export function LessonTable({ lessons, isLoading, onRefetch }: LessonTableProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Order</TableHead>
            <TableHead className="font-semibold">Milestone</TableHead>
            <TableHead className="font-semibold w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : lessons.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {lessons.map((lesson:ILesson, index) => {
                const TypeIcon = typeConfig[lesson.type]?.icon || FileText;
                const typeInfo = typeConfig[lesson.type];

                return (
                  <motion.tr
                    key={lesson._id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">
                          {lesson.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full ${typeInfo?.className || ''}`}
                      >
                        {typeInfo?.label || lesson.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={lesson.status === 'published' ? 'default' : 'secondary'}
                        className={`rounded-full ${
                          lesson.status === 'archived'
                            ? 'bg-secondary/10 text-secondary border-secondary/20'
                            : 'bg-muted text-muted-foreground'
                        }
                        ${
                          lesson.status === 'published'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-muted text-muted-foreground'
                        }
                        
                        
                        `}
                      >
                        {lesson.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground font-mono text-sm">
                        #{lesson.order}
                      </span>
                    </TableCell>
                    <TableCell>
                   <span className="text-muted-foreground">
  {typeof lesson.milestone === "string"
    ? "—"
    : lesson.milestone?.title}
</span>


                    </TableCell>
                    <TableCell>
                      <LessonActions lesson={lesson} onDeleteSuccess={onRefetch} />
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
