import React, { useState } from "react";

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
import { toast } from "react-hot-toast";
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
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteCategoryMutation ,useGetAllCategorysQuery} from "@/redux/features/category/category.api";
import type { ICategory } from "@/interface";
import { CategoryDialog } from "@/components/modules/Category/CategoryDialog";
import { handleApiError } from "@/utils/errorHandler";
import { Skeleton } from "@/components/ui/skeleton";

export const CategoryPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllCategorysQuery({});
  const [deleteCategory , {isLoading:isDeleting}] = useDeleteCategoryMutation();
const categories = data?.data as ICategory[]


  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
      setConfirmDeleteId(null);
      refetch();
    } catch (err) {
handleApiError(err)
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage categories for your platform.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          + New Category
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Total Courses</TableHead>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}><Skeleton className="w-full h-8"/></TableCell>
                    </TableRow>
                  ) : categories && categories?.length > 0 ? (
                    categories?.map((c: ICategory) => (
                      <TableRow key={c._id}>
                        <TableCell>{c.title}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {c.description || "-"}
                        </TableCell>
                        <TableCell>{c.totalCourse ?? 0}</TableCell>
                        <TableCell>
                          {c.thumbnail ? (
                            <img
                              src={c.thumbnail}
                              alt={c.title}
                              className="h-12 w-20 object-cover rounded"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No image
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditing(c);
                                setDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>

                            <AlertDialog
                              open={confirmDeleteId === c._id}
                              onOpenChange={(v) =>
                                !v && setConfirmDeleteId(null)
                              }
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={isDeleting}
                                  onClick={() => setConfirmDeleteId(c._id!)}
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirm delete
                                  </AlertDialogTitle>
                                  <div className="text-sm text-muted-foreground mt-2">
                                    Are you sure you want to delete{" "}
                                    <strong>{c.title}</strong>?
                                  </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(c._id!)}
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
                      <TableCell colSpan={5}>No categories found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        refetch={refetch}
      />
    </div>
  );
};
