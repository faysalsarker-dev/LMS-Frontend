import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryDialog } from "@/components/modules/Category/CategoryDialog";
import {
  useDeleteCategoryMutation,
  useGetAllCategorysQuery,
} from "@/redux/features/category/category.api";
import type { ICategory } from "@/interface/category.types";
import { handleApiError } from "@/utils/errorHandler";

 const CategoryPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllCategorysQuery({});
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const categories = data?.data as ICategory[];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      setConfirmDeleteId(null);
      refetch();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your course categories.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="rounded-full px-6 shadow-sm"
        >
          + New Category
        </Button>
      </div>

      {/* Table Section */}
     <Card className="border border-border/60 shadow-sm">
  <CardHeader className="border-b border-border/50 pb-3">
    <CardTitle className="text-lg font-semibold">All Categories</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // 👇 fixed height + scrollable table body
        className="overflow-hidden"
      >
        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Total Courses</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : categories && categories.length > 0 ? (
                categories.map((c: ICategory) => (
                  <TableRow
                    key={c._id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-center">
                      {c.thumbnail ? (
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="h-12 w-20 object-cover rounded-md border border-border/40 shadow-sm "
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No image
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {c.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {c.description || "-"}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {c.totalCourse ?? 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-4"
                          onClick={() => {
                            setEditing(c);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>

                        <AlertDialog
                          open={confirmDeleteId === c._id}
                          onOpenChange={(v) => !v && setConfirmDeleteId(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-full px-4"
                              disabled={isDeleting}
                              onClick={() => setConfirmDeleteId(c._id!)}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-[400px]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <p className="text-sm text-muted-foreground mt-2">
                                Are you sure you want to delete{" "}
                                <strong>{c.title}</strong>? This action cannot be undone.
                              </p>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-full">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(c._id!)}
                                className="rounded-full"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </AnimatePresence>
  </CardContent>
</Card>


      {/* Dialog for Create/Edit */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        refetch={refetch}
      />
    </div>
  );
};

export default CategoryPage;