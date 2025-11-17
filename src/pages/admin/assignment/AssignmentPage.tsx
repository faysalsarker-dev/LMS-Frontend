/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";







import {  useCallback } from "react";

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((pageNum: number) => {
    setPage(pageNum);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
  };
};





interface Filters {
  search: string;
  status: SubmissionStatus | "";
  submissionType: SubmissionType | "";
  course: string;
  lesson: string;
  sortBy: "submittedAt" | "student.name" | "result";
  sortOrder: "asc" | "desc";
}

const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    submissionType: "",
    course: "",
    lesson: "",
    sortBy: "submittedAt",
    sortOrder: "desc",
  });

  const updateFilter = useCallback(<K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      submissionType: "",
      course: "",
      lesson: "",
      sortBy: "submittedAt",
      sortOrder: "desc",
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};







import { toast } from "sonner";
import {
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mockSubmissionService, type AssignmentSubmission, type GradeFormData, type SubmissionStatus, type SubmissionType } from "@/data/mockData";
import GradeDialog from "@/components/modules/assignment/GradeDialog";
import SubmissionDetailModal from "@/components/modules/assignment/SubmissionDetailModal";
import SubmissionsTable from "@/components/modules/assignment/SubmissionsTable";

const AssignmentPage = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<AssignmentSubmission | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);

  const { page, limit, nextPage, prevPage, goToPage, changeLimit } = usePagination(1, 10);
  const { filters, updateFilter, resetFilters } = useFilters();

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    graded: 0,
  });

  // Fetch submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await mockSubmissionService.getAllSubmissions({
        page,
        limit,
        ...filters,
      });
      setSubmissions(response.submissions);
      setTotalCount(response.pagination.total);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = async () => {
    const allData = await mockSubmissionService.getAllSubmissions({ limit: 1000 });
    const all = allData.submissions;

    setStats({
      total: all.length,
      pending: all.filter((s) => s.status === "pending").length,
      reviewed: all.filter((s) => s.status === "reviewed").length,
      graded: all.filter((s) => s.status === "graded").length,
    });
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, limit, filters]);

  useEffect(() => {
    calculateStats();
  }, []);

  const handleViewSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setDetailModalOpen(true);
  };

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setGradeDialogOpen(true);
  };

  const handleGradeSubmit = async (data: GradeFormData) => {
    if (!selectedSubmission) return;

    const updated = await mockSubmissionService.updateSubmission(
      selectedSubmission.id,
      data
    );

    if (updated) {
      // Optimistic update
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === updated.id ? updated : sub))
      );
      calculateStats();
    }
  };

  const handleSort = (key: string) => {
    if (filters.sortBy === key) {
      updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      updateFilter("sortBy", key as any);
      updateFilter("sortOrder", "desc");
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-2">Assignment Submissions</h1>
          <p className="text-muted-foreground">
            Review and grade student submissions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-status-pending/10 p-3">
                <Clock className="h-5 w-5 text-status-pending" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-status-reviewed/10 p-3">
                <CheckCircle className="h-5 w-5 text-status-reviewed" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold">{stats.reviewed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-status-graded/10 p-3">
                <GraduationCap className="h-5 w-5 text-status-graded" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold">{stats.graded}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or email..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? "" : value as any)}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.submissionType || "all"}
              onValueChange={(value) => updateFilter("submissionType", value === "all" ? "" : value as any)}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            {(filters.search ||
              filters.status ||
              filters.submissionType) && (
              <Button variant="outline" onClick={resetFilters}>
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading submissions...</p>
            </Card>
          ) : submissions.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No submissions found</p>
              <p className="text-muted-foreground">
                Try adjusting your filters
              </p>
            </Card>
          ) : (
            <SubmissionsTable
              submissions={submissions}
              onViewSubmission={handleViewSubmission}
              onGradeSubmission={handleGradeSubmission}
              onSort={handleSort}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
            />
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && submissions.length > 0 && (
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalCount)} of {totalCount} results
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={limit.toString()}
                onValueChange={(value) => changeLimit(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onGrade={(sub) => {
          setDetailModalOpen(false);
          handleGradeSubmission(sub);
        }}
      />

      <GradeDialog
        submission={selectedSubmission}
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
        onSubmit={handleGradeSubmit}
      />
    </div>
  );
};

export default AssignmentPage;