import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";
import { handleApiError } from "@/utils/errorHandler";
import FileUpload from "@/components/ui/FileUpload";
import type { ICategory } from "@/interface/category.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ICategory | null;
  refetch: () => void;
};

type FormValues = {
  title: string;
  description?: string;
  totalCourse?: number;
  thumbnail?: FileList;
};

export const CategoryDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  initial,
  refetch,
}) => {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickedFile, setPickedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initial?.title || "",
      description: initial?.description || "",
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title,
        description: initial.description || "",
      });
    } else {
      reset({ title: "", description: "", totalCourse: 0 });
    }
    setPickedFile(null);
  }, [initial, reset, open]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    if (pickedFile) formData.append("file", pickedFile);

    setIsSubmitting(true);
    try {
      if (initial?._id) {
        await updateCategory({ id: initial._id, body: formData }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully");
      }
      refetch();
      onOpenChange(false);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[550px] w-[95%] rounded-xl border border-border bg-background p-0 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-border">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {initial?._id ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-6 p-6"
        >
          {/* Image Upload */}
          <div className="">
            <Label className="text-sm font-medium text-muted-foreground">
              Thumbnail
            </Label>
            <FileUpload onChange={setPickedFile} />
            {initial?.thumbnail && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border/30 shadow-sm">
                <img
                  src={initial.thumbnail}
                  alt={initial.title}
                  className="h-24 w-24 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Title
            </Label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter category title"
              className="rounded-lg focus-visible:ring-primary/70"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Description
            </Label>
            <Textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              placeholder="Write a short description..."
              className="rounded-lg resize-none focus-visible:ring-primary/70"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-5 text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-6 font-medium"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
