
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";


import type { ICourse, IMilestone } from "@/interface";
import { handleApiError } from "@/utils/errorHandler";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { useCreateMilestoneMutation, useUpdateMilestoneMutation } from "@/redux/features/milestone/milestone.api";

type MilestoneFormValues = {
  title: string;
  course: string;
  order: number;
  status: "active" | "inactive";
};

interface MilestoneFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "update";
  initialData?: Partial<IMilestone>;
}

export default function MilestoneForm({
  open,
  setOpen,
  mode,
  initialData,
}: MilestoneFormProps) {
  const { data, isLoading } = useGetAllCoursesQuery({ page: 1, limit: 100000 });
  const [createMilestone ,{isLoading: isCreating}] = useCreateMilestoneMutation();
  const [updateMilestone] = useUpdateMilestoneMutation();

  // 📝 Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MilestoneFormValues>({
    defaultValues: {
      title: "",
      course: "",
      order: 1,
      status: "active",
    },
  });

  // Reset form whenever sheet opens or initialData changes
  useEffect(() => {
    if (mode === "update" && initialData) {
      reset({
        title: initialData.title || "",
        course:
          typeof initialData.course === "string"
            ? initialData.course
            : initialData.course?._id || "",
        order: initialData.order || 1,
        status: initialData.status || "active",
      });
    } else {
      reset({
        title: "",
        course: "",
        order: 1,
        status: "active",
      });
    }
  }, [initialData, reset, mode, open]);

  // 🟢 Submit handler
  const submitHandler = async (values: MilestoneFormValues) => {
    try {
      if (mode === "create") {
        await createMilestone(values).unwrap();
        toast.success("✨ Milestone created successfully!");
      } else if (mode === "update" && initialData?._id) {
        console.log(values,'values');
await updateMilestone({ id: initialData._id, ...values }).unwrap();
        toast.success("✅ Milestone updated successfully!");
      }
      setOpen(false);
    } catch (error) {
     
        handleApiError(error)
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[500px] p-4">
        <SheetHeader>
          <SheetTitle>
            {mode === "update" ? "Update Milestone" : "Create Milestone"}
          </SheetTitle>
          <SheetDescription>
            {mode === "update"
              ? "Edit the milestone details and click save to update."
              : "Fill in the milestone details and click save to create."}
          </SheetDescription>
        </SheetHeader>

        <motion.form
          onSubmit={handleSubmit(submitHandler)}
          className="mt-6 space-y-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter milestone title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label>Course</Label>
            <Select
              defaultValue={typeof initialData?.course === "string" ? initialData.course : initialData?.course?._id || ""}
              onValueChange={(val) => setValue("course", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <p className="text-sm p-2">Loading courses...</p>
                ) : (
                  data?.data?.data?.map((course: ICourse) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.course && (
              <p className="text-sm text-red-500">{errors.course.message}</p>
            )}
          </div>

   <div className="grid gap-3 grid-cols-2">
              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  type="number"
                  id="order"
                  {...register("order"
                  )}
                />
                {errors.order && (
                  <p className="text-sm text-red-500">{errors.order.message}</p>
                )}
              </div>
    
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={initialData?.status || "active"}
                  onValueChange={(val) =>
                    setValue("status", val as "active" | "inactive")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
    
   </div>
          <SheetFooter>
            <Button disabled={isCreating || isLoading} type="submit" className="w-full rounded-xl">
              {mode === "update" ? "Update Milestone" : "Save Milestone"}
            </Button>
          </SheetFooter>
        </motion.form>
      </SheetContent>
    </Sheet>
  );
}
