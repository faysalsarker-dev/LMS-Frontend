import { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Save, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { DocField } from "./DocField";
import { CourseMilestoneSelector } from "./CourseMilestoneSelector";

import { useCreateLessonMutation, useUpdateLessonMutation } from "@/redux/features/lesson/lesson.api";
import { StatusAndOrder } from "./StatusAndOrder";
import { VideoField } from "./VideoField";
import type { ContentType, ILesson, LessonFormData, VideoSourceType } from "@/interface";
import { QuizField } from "./QuizField";
import { useConfirmOnLeave } from "@/hooks/useConfirmOnLeave";

interface LessonFormProps {
  isOpen: boolean;
  onClose: () => void;
 lesson?: Partial<ILesson>;
  mode: "create" | "edit";
}

export function LessonForm({ isOpen, onClose, lesson, mode }: LessonFormProps) {
  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<LessonFormData>({
    defaultValues: {
      title: "",
      order: 1,
      contentType: "video",
      status: "active",
      course: "",
      milestone: "",
      videoUrl: "",
      videoSourceType: "link",
      docContent: "",
      quiz: {
        question: "",
        options: [{ text: "" }, { text: "" }],
        correctAnswer: "",
        explanation: "",
        timer: 0,
      },
    },
  });

  const contentType = watch("contentType");
  const isLoading = isCreating || isUpdating || isSubmitting;

  // Confirm before leaving with unsaved changes
  const { confirmLeave } = useConfirmOnLeave({
    when: isDirty && isOpen,
    message: "You have unsaved changes. Are you sure you want to close?",
  });

  // Populate form when editing
  useEffect(() => {
    if (lesson && mode === "edit") {
      reset({
        title: lesson.title || "",
        order: lesson.order || 1,
        contentType: lesson.contentType || "video",
        status: lesson.status || "active",
        course: typeof lesson.course === "string" ? lesson.course : lesson.course || "",
        milestone: typeof lesson.milestone === "string" ? lesson.milestone : lesson.milestone || "",
        videoUrl: lesson.videoUrl || "",
        videoSourceType: lesson.videoSourceType || "link",
        docContent: lesson.docContent || "",
        quiz: lesson.quiz || {
          question: "",
          options: [{ text: "" }, { text: "" }],
          correctAnswer: "",
          explanation: "",
          timer: 0,
        },
      });
    } else {
      reset();
    }
  }, [lesson, mode, reset, isOpen]);



  const createFormDataPayload = (data: LessonFormData): FormData => {

    const formData = new FormData();

formData.append("title", data.title ?? "");
formData.append("order", String(data.order ?? 0));
formData.append("contentType", data.contentType ?? "video");
formData.append("status", data.status ?? "active");
formData.append("course", data.course ?? "");
formData.append("milestone", data.milestone ?? "");
formData.append("videoSourceType", data.videoSourceType ?? "link");


    // Add content based on type
    if (data.contentType === "video") {
      formData.append("videoUrl", data.videoUrl || "");
      
      // If file is present, append it for multer
//    if (data.videoFile) {
//   formData.append("video", data.videoFile, data.videoFile.name );
// }

if (data.videoFile instanceof File) {
  formData.append("video", data.videoFile, data.videoFile.name);
} else if (typeof data.videoFile === "string") {
  formData.append("video", data.videoFile);
}


    }

    if (data.contentType === "doc") {
      formData.append("docContent", data.docContent || "");
    }

    if (data.contentType === "quiz" && data.quiz) {
      formData.append("quiz", JSON.stringify({
        question: data.quiz.question,
        options: data.quiz.options,
        correctAnswer: data.quiz.correctAnswer,
        explanation: data.quiz.explanation,
        timer: data.quiz.timer,
      }));
    }




    return formData;
  };

  const onFormSubmit = async (data: LessonFormData) => {
    try {
      // Validate content type specific requirements
      if (data.contentType === "video" && !data.videoUrl) {
        toast.error("Video URL is required for video lessons");
        return;
      }

      if (data.contentType === "doc" && (!data.docContent || data.docContent.length < 50)) {
        toast.error("Document content must be at least 50 characters");
        return;
      }

      if (data.contentType === "quiz") {
        if (!data.quiz?.question) {
          toast.error("Quiz question is required");
          return;
        }
        if (!data.quiz?.correctAnswer) {
          toast.error("Please select the correct answer");
          return;
        }
      }

      if (!data.course) {
        toast.error("Please select a course");
        return;
      }

      if (!data.milestone) {
        toast.error("Please select a milestone");
        return;
      }

      // Create FormData payload for multipart upload
      const payload = createFormDataPayload(data);

      // Call API with FormData
      if (mode === "create") {
        await createLesson(payload).unwrap();
        toast.success("Lesson created successfully!");
      } else {
        // For update, include the lesson ID
        const updatePayload = new FormData();
        
        // Copy all FormData entries
        payload.forEach((value, key) => {
          updatePayload.append(key, value);
        });
        
        await updateLesson({ id: lesson!._id, data: updatePayload }).unwrap();
        toast.success("Lesson updated successfully!");
      }

      handleClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(mode === "create" ? "Failed to create lesson" : "Failed to update lesson");
    }
  };

  const handleClose = () => {
    if (isDirty && !confirmLeave()) {
      return;
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass max-w-3xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {mode === "create" ? "Create New Lesson" : "Edit Lesson"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Fill in the details to create a new lesson for your course"
                : "Update lesson information and content"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 mt-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Lesson Title
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" },
                  maxLength: { value: 100, message: "Title must not exceed 100 characters" },
                })}
                placeholder="Enter lesson title"
                className="focus-ring"
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Order & Content Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="order"
                control={control}
                rules={{ required: "Order is required", min: 1 }}
                render={({ field }) => (
                  <StatusAndOrder
                    order={field.value as number}
                    status={watch("status")}
                    onOrderChange={field.onChange}
                    onStatusChange={(status) => setValue("status", status)}
                    errors={{
                      order: errors.order?.message,
                    }}
                  />
                )}
              />
            </div>

            <Separator />

            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="contentType">
                Content Type
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Controller
                name="contentType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v as ContentType)}>
                    <SelectTrigger id="contentType" className="focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">📹 Video</SelectItem>
                      <SelectItem value="doc">📄 Document</SelectItem>
                      <SelectItem value="quiz">✅ Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Content Type Specific Fields */}
            <motion.div
              key={contentType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* {contentType === "video" && (
                <Controller
                  name="videoUrl"
                  control={control}
                  rules={{ required: "Video is required" }}
                  render={({ field }) => (
                    <VideoField
                      value={{
                        url: field.value,
                        sourceType: watch("videoSourceType"),
                        file: watch("videoFile"),
                      }}
                      onChange={(data) => {
                        field.onChange(data.url);
                        if (data.sourceType) setValue("videoSourceType", data.sourceType);
                     
                      }}
                      error={errors.videoUrl?.message}
                    />
                  )}
                />
              )} */}



{contentType === "video" && (
  <Controller
    name="videoUrl"
    control={control}
    rules={{ required: "Video is required" }}
    render={({ field }) => (
      <VideoField
        value={{
          url: field.value || "",
          sourceType: watch("videoSourceType") as VideoSourceType,
          file: watch("videoFile") as File | null,
        }}
        onChange={(data) => {
          // Update URL
          field.onChange(data.url || "");

          // Update source type
          if (data.sourceType) setValue("videoSourceType", data.sourceType);

          // Update file only if it’s a File
          if (data.file instanceof File) {
            setValue("videoFile", data.file);
          } else {
            setValue("videoFile", null);
          }
        }}
        error={errors.videoUrl?.message}
      />
    )}
  />
)}







              {contentType === "doc" && (
                <Controller
                  name="docContent"
                  control={control}
                  rules={{
                    required: "Document content is required",
                    minLength: { value: 50, message: "Content must be at least 50 characters" },
                  }}
                  render={({ field }) => (
                    <DocField
                      value={field.value || ""}
                      onChange={field.onChange}
                      error={errors.docContent?.message}
                    />
                  )}
                />
              )}

              {contentType === "quiz" && (
                <Controller
                  name="quiz"
                  control={control}
                  render={({ field }) => (
                    <QuizField
                      value={field.value || {
                        question: "",
                        options: [{ text: "" }, { text: "" }],
                        correctAnswer: "",
                        explanation: "",
                        timer: 0,
                      }}
                      onChange={field.onChange}
                      errors={{
                        question: errors.quiz?.question?.message,
                        correctAnswer: errors.quiz?.correctAnswer?.message,
                      }}
                    />
                  )}
                />
              )}
            </motion.div>

            <Separator />

            {/* Course & Milestone */}
            <Controller
              name="course"
              control={control}
              rules={{ required: "Course is required" }}
              render={({ field: courseField }) => (
                <Controller
                  name="milestone"
                  control={control}
                  rules={{ required: "Milestone is required" }}
                  render={({ field: milestoneField }) => (
                    <CourseMilestoneSelector
                      courseId={courseField.value}
                      milestoneId={milestoneField.value}
                      onCourseChange={courseField.onChange}
                      onMilestoneChange={milestoneField.onChange}
                      errors={{
                        course: errors.course?.message,
                        milestone: errors.milestone?.message,
                      }}
                    />
                  )}
                />
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="shadow-glow">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === "create" ? "Create Lesson" : "Update Lesson"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}