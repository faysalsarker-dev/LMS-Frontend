import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import type { Practice } from './practice.types';

interface PracticeTableProps {
  practices: Practice[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onDelete: (practice: Practice) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

const typeColors: Record<string, string> = {
  pronunciation: 'bg-primary/10 text-primary',
  vocabulary: 'bg-accent/10 text-accent',
  grammar: 'bg-success/10 text-success',
  exercise: 'bg-warning/10 text-warning',
  quiz: 'bg-destructive/10 text-destructive',
  other: 'bg-muted text-muted-foreground',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-success/10 text-success',
  Intermediate: 'bg-warning/10 text-warning',
  Advanced: 'bg-destructive/10 text-destructive',
};

export const PracticeTable = ({
  practices,
  selectedIds,
  onSelectChange,
  onDelete,
  onToggleStatus,
}: PracticeTableProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(practices.map((p) => p._id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter((i) => i !== id));
    }
  };

  const allSelected = practices.length > 0 && selectedIds.length === practices.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < practices.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border bg-card overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-center">Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {practices.map((practice, index) => (
            <motion.tr
              key={practice._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="group hover:bg-muted/30"
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(practice._id)}
                  onCheckedChange={(checked) =>
                    handleSelectOne(practice._id, checked as boolean)
                  }
                  aria-label={`Select ${practice.title}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    to={`/admin/practices/${practice._id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {practice.title}
                  </Link>
                  {practice.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                      {practice.description}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${typeColors[practice.type]} border-0`}>
                  {practice.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${difficultyColors[practice.difficulty]} border-0`}>
                  {practice.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {practice.category?.name || '-'}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-medium">{practice.totalItems}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-medium">{practice.usageCount}</span>
              </TableCell>
              <TableCell>
                <Switch
                  checked={practice.isActive}
                  onCheckedChange={(checked) =>
                    onToggleStatus(practice._id, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(practice.createdAt), 'MMM d, yyyy')}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
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
                        Edit
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
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};
