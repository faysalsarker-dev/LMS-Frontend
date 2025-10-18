import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import type { ICategory } from "@/interface";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/redux/features/category/category.api";


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ICategory | null;
  refetch: () => void;
  ImageUploader?: React.FC<{ onFile: (file: File | null) => void; initialUrl?: string }>;
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
  ImageUploader,
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
      totalCourse: initial?.totalCourse || 0,
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title,
        description: initial.description || "",
        totalCourse: initial.totalCourse || 0,
      });
    } else {
      reset({ title: "", description: "", totalCourse: 0 });
    }
    setPickedFile(null);
  }, [initial, reset, open]);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    formData.append("totalCourse", String(data.totalCourse ?? 0));
    if (data.thumbnail?.[0]) formData.append("thumbnail", data.thumbnail[0]);
    if (pickedFile) formData.append("thumbnail", pickedFile);

    setIsSubmitting(true);
    try {
      if (initial?._id) {
        await updateCategory({ id: initial._id, body: formData }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created");
      }
      refetch();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95%]">
        <DialogHeader>
          <DialogTitle>
            {initial?._id ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="space-y-4 mt-4"
        >
          <div>
            <Label>Title</Label>
            <Input {...register("title", { required: "Title is required" })} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} rows={4} />
          </div>

          <div>
            <Label>Total Courses</Label>
            <Input
              type="number"
              {...register("totalCourse", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label>Thumbnail</Label>
            {ImageUploader ? (
              <ImageUploader
                onFile={(f) => setPickedFile(f)}
                initialUrl={initial?.thumbnail ?? undefined}
              />
            ) : (
              <input type="file" accept="image/*" {...register("thumbnail")} />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
