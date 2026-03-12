import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  MockTestFiltersBar,
  MockTestTable,
  DeleteMockTestDialog,
  UpdateMockTestDialog,
  type MockTestFilters,
} from "@/components/admin/mocktest";
import type { IMockTest } from "@/interface/mockTest.types";
import {
  useGetAllMockTestsQuery,
  useDeleteMockTestMutation,
} from "@/redux/features/mockTest/mockTest.api";
import { toast } from "sonner";

const MockTestsPage = () => {
  const [filters, setFilters] = useState<MockTestFilters>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [editItem, setEditItem] = useState<IMockTest | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<IMockTest | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAllMockTestsQuery(filters);
  const [deleteMockTest, { isLoading: isDeleting }] =
    useDeleteMockTestMutation();

  const mockTests: IMockTest[] = data?.data?.data ?? data?.data ?? [];
  const meta = data?.data?.meta;

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteMockTest(deleteItem._id).unwrap();
      toast.success("Mock test deleted");
      setDeleteOpen(false);
      setDeleteItem(null);
      refetch();
    } catch {
      toast.error("Failed to delete mock test");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Mock Test Management
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-10">
              Create, manage, and organise all mock tests.
            </p>
          </div>

          <Button asChild className="rounded-xl gap-2">
            <Link to="/dashboard/mock-tests/create">
              <Plus className="h-4 w-4" />
              Create Mock Test
            </Link>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MockTestFiltersBar filters={filters} onFiltersChange={setFilters} />
        </motion.div>

        {/* Table / Grouped View */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-8"
        >
          {isLoading ? (
            <MockTestTable
              data={[]}
              isLoading={true}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : (
            Object.entries(
              mockTests.reduce(
                (acc, test) => {
                  const courseTitle = test.course?.title || "Uncategorized";
                  if (!acc[courseTitle]) acc[courseTitle] = [];
                  acc[courseTitle].push(test);
                  return acc;
                },
                {} as Record<string, IMockTest[]>,
              ),
            ).map(([courseTitle, tests]) => (
              <div key={courseTitle} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold tracking-tight text-slate-800">
                    {courseTitle}
                    <Badge
                      variant="secondary"
                      className="ml-3 font-mono text-[10px]"
                    >
                      {tests.length} {tests.length === 1 ? "Test" : "Tests"}
                    </Badge>
                  </h2>
                </div>
                <MockTestTable
                  data={tests}
                  isLoading={false}
                  onEdit={(item) => {
                    setEditItem(item);
                    setEditOpen(true);
                  }}
                  onDelete={(item) => {
                    setDeleteItem(item);
                    setDeleteOpen(true);
                  }}
                />
              </div>
            ))
          )}

          {!isLoading && mockTests.length === 0 && (
            <MockTestTable
              data={[]}
              isLoading={false}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
        </motion.div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      page: Math.max(1, (f.page || 1) - 1),
                    }))
                  }
                  className={
                    filters.page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: meta.totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                    isActive={filters.page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      page: Math.min(meta.totalPages, (f.page || 1) + 1),
                    }))
                  }
                  className={
                    filters.page === meta.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Dialogs */}
      <UpdateMockTestDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mockTest={editItem}
        onSuccess={refetch}
      />
      <DeleteMockTestDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        mockTest={deleteItem}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
};

export default MockTestsPage;
