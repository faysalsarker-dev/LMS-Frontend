import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BookOpen,
  Edit,
  Eye,
  Layers,
  MoreVertical,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router';
import type { Practice } from './practice.types';

interface PracticeCardProps {
  practice: Practice;
  onDelete: (practice: Practice) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  index: number;
}

export const PracticeCard = ({
  practice,
  onDelete,
  onToggleStatus,
  index,
}: PracticeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-0 bg-card shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          {practice.thumbnail ? (
            <img
              src={practice.thumbnail}
              alt={practice.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          )}

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/admin/practices/${practice._id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/admin/practices/${practice._id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Practice
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(practice)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {practice.title}
            </h3>
          </div>
          {practice.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {practice.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">
              {practice.course?.title}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              <span>{practice.totalItems} items</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{practice.usageCount} uses</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Switch
                checked={practice.isActive}
                onCheckedChange={(checked) =>
                  onToggleStatus(practice._id, checked)
                }
              />
              <span className="text-sm text-muted-foreground">
                {practice.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/practices/${practice._id}`}>
                View <Eye className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
