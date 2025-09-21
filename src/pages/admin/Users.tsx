import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import toast from "react-hot-toast";
import UserTable from "@/components/dashboard/UserTable";
import { useGetAllQuery } from "@/redux/features/auth/auth.api";
import { UserDialog } from "@/components/dashboard/dialogs/UserDialog";
import type { IUser } from "@/interface";

export default function Users() {
  const [filters, setFilters] = useState<{
    search?: string;
    role?: string;
    isActive?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
    search: "",
    role: "",
    isActive: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const { data, isLoading, isError } = useGetAllQuery(filters);

  const handleUserAction = (action: string, user: IUser) => {
    switch (action) {
      case "edit":
        setEditingUser(user);
        break;
      case "block":
        toast.success(`${user.name} has been blocked`);
        break;
      case "unblock":
        toast.success(`${user.name} has been unblocked`);
        break;
      case "delete":
        if (window.confirm(`Delete ${user.name}?`)) {
          toast.success(`${user.name} has been deleted`);
        }
        break;
    }
  };

  // ✅ Pagination change handler
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-4 flex justify-between items-center">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
            />
          </div>

          {/* Role Filter */}
          <Select
            value={filters.role || ""}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                role: value === "all" ? "" : value,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.isActive || ""}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                isActive: value === "all" ? "" : value,
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <UserTable
        data={data?.data?.data || []}
        isLoading={isLoading}
        isError={isError}
        handleUserAction={handleUserAction}
      />

      {/* ✅ Pagination */}
      {data?.data?.data?.meta && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                  className={filters.page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: data.meta.totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={filters.page === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(data.meta.totalPages, filters.page + 1)
                    )
                  }
                  className={
                    filters.page === data.meta.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <UserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        editingUser={editingUser}
      />
    </div>
  );
}
