import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { useGetAllMilestonesQuery } from "@/redux/features/milestone/milestone.api";
import type { ICourse, IMilestone } from "@/interface";
import { useCreateLessonMutation, useUpdateLessonMutation } from "@/redux/features/lesson/lesson.api";
import FileUpload from "@/components/ui/FileUpload";

interface LessonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data:any) => void;
  lesson?: any;
  mode: "create" | "edit";
}

export function LessonForm({ isOpen, onClose, onSubmit, lesson, mode }: LessonFormProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null);

 const {data:courses}=useGetAllCoursesQuery({page:1,limit:10000});
  const {data:milestones}=useGetAllMilestonesQuery({});
  const [createLesson]=useCreateLessonMutation();
  const [updateLesson]=useUpdateLessonMutation();

  const form = useForm<any>({
      defaultValues: {
        title: "",
        order: 1,
        contentType: "video",
        status: "active",
        docContent: "",
        courseId: "",
        milestoneId: "",
      },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const watchedContentType = watch("contentType");
  const watchedDocContent = watch("docContent");
  const watchedCourseId = watch("courseId");

  useEffect(() => {
    if (lesson && mode === "edit") {
      reset({
        title: lesson.title,
        order: lesson.order,
        contentType: lesson.contentType,
        videoUrl: lesson.videoUrl || "",
        docContent: lesson.docContent || "",
        status: lesson.status,
        courseId: lesson.courseId,
        milestoneId: lesson.milestoneId,
      });
    } else if (mode === "create") {
      reset({
        title: "",
        order: 1,
        contentType: "video",
        status: "active",
        docContent: "",
        courseId: "",
        milestoneId: "",
      });
    }
  }, [lesson, mode, reset]);





  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    setPreviewFile(null);
    reset();
    onClose();
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      setValue("videoUrl", `fake-upload://${file.name}`);
    }
  };

  const removeVideoPreview = () => {
    setPreviewFile(null);
    setValue("videoUrl", "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {mode === "create" ? "Create New Lesson" : "Edit Lesson"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter lesson title"
                className="focus-ring"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

        

            {/* Order and Content Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  min={1}
                  className="focus-ring"
                />
                {errors.order && (
                  <p className="text-destructive text-sm mt-1">{errors.order.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={watchedContentType}
                  onValueChange={(value) => setValue("contentType", value as any)}
                >
                  <SelectTrigger className="focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Video Upload */}
            {watchedContentType === "video" && (
              <div>
                <Label>Video Upload</Label>
                {!previewFile ? (
                  <div className="mt-2">
                    <FileUpload onChange={handleVideoUpload} />
                  </div>
                ) : (
                  <Card className="mt-2 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{previewFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeVideoPreview}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Document Content */}
            {watchedContentType === "doc" && (
              <div>
                <Label>Document Content</Label>
                <div className="mt-2">
                  {/* <LexicalEditor
                    value={watchedDocContent}
                    onChange={(content) => setValue("docContent", content)}
                    placeholder="Enter document content..."
                  /> */}
                </div>
              </div>
            )}

            {/* Course and Milestone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseId">Course</Label>
                <Select
                  value={watchedCourseId}
                  onValueChange={(value) => {
                    setValue("courseId", value);
                    setValue("milestoneId", ""); // Reset milestone when course changes
                  }}
                >
                  <SelectTrigger className="focus-ring">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.data?.data?.map((course: ICourse) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.courseId && (
                  <p className="text-destructive text-sm mt-1">{errors.courseId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="milestoneId">Milestone</Label>
                <Select
                  value={watch("milestoneId")}
                  onValueChange={(value) => setValue("milestoneId", value)}
                  disabled={!watchedCourseId}
                >
                  <SelectTrigger className="focus-ring">
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {milestones?.data?.map((milestone: IMilestone) => (
                      <SelectItem key={milestone._id} value={milestone._id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.milestoneId && (
                  <p className="text-destructive text-sm mt-1">{errors.milestoneId.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "create" ? "Create Lesson" : "Update Lesson"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}