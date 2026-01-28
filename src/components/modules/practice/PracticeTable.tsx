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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import type { Practice } from './practice.types';

interface PracticeTableProps {
  practices: Practice[];
  onDelete: (practice: Practice) => void;
}

export const PracticeTable = ({
  practices,
  onDelete,
}: PracticeTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border bg-card overflow-hidden shadow-sm"
    >
      <Table>
        {/* ---------- Header ---------- */}
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-6">Practice</TableHead>
            <TableHead>Course</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-center">Usage</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {/* ---------- Body ---------- */}
        <TableBody>
          {practices.map((practice, index) => (
            <motion.tr
              key={practice._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              {/* Title */}
              <TableCell className="pl-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <Link
                    to={`/admin/practices/${practice._id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {practice.title}
                  </Link>
                  {practice.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">
                      {practice.description}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Course */}
              <TableCell>
                {practice.course?.title ? (
                  <Badge variant="secondary" className="font-normal">
                    {practice.course.title}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>

              {/* Items */}
              <TableCell className="text-center">
                <span className="inline-flex min-w-[32px] justify-center rounded-md bg-muted px-2 py-0.5 text-sm font-medium">
                  {practice.totalItems}
                </span>
              </TableCell>

              {/* Usage */}
              <TableCell className="text-center">
                <span className="inline-flex min-w-[32px] justify-center rounded-md bg-muted px-2 py-0.5 text-sm font-medium">
                  {practice.usageCount}
                </span>
              </TableCell>

              {/* Created */}
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(practice.createdAt), 'MMM d, yyyy')}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-60 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/practice/view/${practice._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
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
