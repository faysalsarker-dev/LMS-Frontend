import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import { Eye, GraduationCap, ArrowUpDown, Download } from "lucide-react";
import type { AssignmentSubmission } from "@/data/mockData";

interface SubmissionsTableProps {
  submissions: AssignmentSubmission[];
  onViewSubmission: (submission: AssignmentSubmission) => void;
  onGradeSubmission: (submission: AssignmentSubmission) => void;
  onSort: (key: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const SubmissionsTable = ({
  submissions,
  onViewSubmission,
  onGradeSubmission,
  onSort,
  sortBy,
  sortOrder,
}: SubmissionsTableProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDownload = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const SortButton = ({ column, label }: { column: string; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(column)}
      className="h-8 font-semibold"
    >
      {label}
      <ArrowUpDown
        className={`ml-2 h-4 w-4 transition-transform ${
          sortBy === column && sortOrder === "asc" ? "rotate-180" : ""
        }`}
      />
    </Button>
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead>
                <SortButton column="student.name" label="Student" />
              </TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <SortButton column="submittedAt" label="Submitted" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortButton column="result" label="Score" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {submissions.map((submission) => (
                <motion.tr
                  key={submission.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="group hover:bg-dashboard-hover transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(submission.student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{submission.student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.student.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{submission.course.title}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{submission.lesson.title}</p>
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={submission.submissionType} />
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm cursor-help">
                            {formatDistanceToNow(new Date(submission.submittedAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format(new Date(submission.submittedAt), "PPp")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">
                      {submission.result !== null ? `${submission.result}/100` : "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onGradeSubmission(submission)}
                      >
                        <GraduationCap className="h-4 w-4" />
                      </Button>
                      {submission.submissionType === "file" &&
                        submission.file.url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(submission.file.url)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <AnimatePresence mode="popLayout">
          {submissions.map((submission) => (
            <motion.div
              key={submission.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="border-b border-border p-4 hover:bg-dashboard-hover transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(submission.student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{submission.student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.student.email}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={submission.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Course</p>
                    <p className="font-medium">{submission.course.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Lesson</p>
                    <p>{submission.lesson.title}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <TypeBadge type={submission.submissionType} />
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(submission.submittedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {submission.result !== null && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Score: </span>
                    <span className="font-semibold">{submission.result}/100</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onViewSubmission(submission)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onGradeSubmission(submission)}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Grade
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubmissionsTable;