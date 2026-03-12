/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/FileUpload";
import { FormSection } from "@/components/form/FormSection";
import { FieldArray } from "@/components/form/FieldArray";
import { BookOpen, Clock, DollarSign, FileText, Save, Tag, Award, CheckSquare, Users, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetCourseBySlugQuery, useUpdateCourseMutation } from "@/redux/features/course/course.api";
import { currencies } from "@/utils/currency";
import { handleApiError } from "@/utils/errorHandler";
import { Skeleton } from "@/components/ui/skeleton";

type FieldObject = { value: string; id: string };

interface UpdateCourseSheetProps {
  courseId: string | null;
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  title: string;
  description: string;
  tags: FieldObject[];
  skills: FieldObject[];
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "draft" | "archived";
  prerequisites: FieldObject[];
  requirements: FieldObject[];
  resources: FieldObject[];
  price: number;
  currency: string;
  isDiscounted: boolean;
  discountPrice: number;
  certificateAvailable: boolean;
  duration: string;
  totalLectures: number;
  isFeatured: boolean;
};

const defaultValues: FormValues = {
  title: "",
  description: "",
  tags: [{ value: "", id: Math.random().toString(36).substring(2, 9) }],
  skills: [{ value: "", id: Math.random().toString(36).substring(2, 9) }],
  level: "Beginner",
  status: "draft",
  prerequisites: [{ value: "", id: Math.random().toString(36).substring(2, 9) }],
  requirements: [{ value: "", id: Math.random().toString(36).substring(2, 9) }],
  resources: [{ value: "", id: Math.random().toString(36).substring(2, 9) }],
  price: 0,
  currency: "USD",
  isDiscounted: false,
  discountPrice: 0,
  certificateAvailable: false,
  duration: "",
  totalLectures: 0,
  isFeatured: false,
};

// Helper function to convert string array to FieldObject array
const convertToFieldObjects = (arr: string[] | undefined): FieldObject[] => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return [{ value: "", id: Math.random().toString(36).substring(2, 9) }];
  }
  return arr.map(item => ({
    value: item,
    id: Math.random().toString(36).substring(2, 9)
  }));
};

// Helper function to convert FieldObject array to string array (filtering empty values)
const convertToStringArray = (arr: FieldObject[]): string[] => {
  return arr.filter(item => item.value.trim() !== "").map(item => item.value.trim());
};

const UpdateCourse: React.FC<UpdateCourseSheetProps> = ({ courseId, open, onClose }) => {
  const { data, isLoading } = useGetCourseBySlugQuery(courseId, { skip: !courseId });
  const course = data?.data;
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { register, handleSubmit, control, reset, watch } = useForm<FormValues>({ defaultValues });

  // Field arrays
  const tagFieldArray = useFieldArray({ control, name: "tags" });
  const skillFieldArray = useFieldArray({ control, name: "skills" });
  const prereqFieldArray = useFieldArray({ control, name: "prerequisites" });
  const reqFieldArray = useFieldArray({ control, name: "requirements" });
  const resourcesFieldArray = useFieldArray({ control, name: "resources" });

  const isDiscounted = watch("isDiscounted");

  useEffect(() => {
    if (course && open) {
      // Small delay to ensure form is ready
      setTimeout(() => {
        reset({
          title: course.title || "",
          description: course.description || "",
          tags: convertToFieldObjects(course.tags),
          skills: convertToFieldObjects(course.skills),
          level: course.level || "Beginner",
          status: course.status || "draft",
          prerequisites: convertToFieldObjects(course.prerequisites),
          requirements: convertToFieldObjects(course.requirements),
          resources: convertToFieldObjects(course.resources),
          price: course.price || 0,
          currency: course.currency || "USD",
          isDiscounted: course.isDiscounted || false,
          discountPrice: course.discountPrice || 0,
          certificateAvailable: course.certificateAvailable || false,
          duration: course.duration || "",
          totalLectures: course.totalLectures || 0,
          isFeatured: course.isFeatured || false,
        });
        // Reset thumbnail file when course changes
        setThumbnailFile(null);
      }, 0);
    }
  }, [course, open, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append("title", data.title.trim());
      formData.append("description", data.description.trim());
      formData.append("level", data.level);
      formData.append("status", data.status);

      // Convert field arrays to string arrays and append
      const tags = convertToStringArray(data.tags);
      const skills = convertToStringArray(data.skills);
      const prerequisites = convertToStringArray(data.prerequisites);
      const requirements = convertToStringArray(data.requirements);
      const resources = convertToStringArray(data.resources);

      tags.forEach(tag => formData.append("tags", tag));
      skills.forEach(skill => formData.append("skills", skill));
      prerequisites.forEach(prereq => formData.append("prerequisites", prereq));
      requirements.forEach(req => formData.append("requirements", req));
      resources.forEach(res => formData.append("resources", res));

      // Pricing and other fields
      formData.append("price", data.price.toString());
      formData.append("currency", data.currency);
      formData.append("isDiscounted", data.isDiscounted.toString());
      formData.append("discountPrice", data.discountPrice.toString());
      formData.append("isFeatured", data.isFeatured.toString());
      formData.append("duration", data.duration.trim());
      formData.append("totalLectures", data.totalLectures.toString());
      formData.append("certificateAvailable", data.certificateAvailable.toString());
      
      // Append thumbnail if changed
      if (thumbnailFile) {
        formData.append("file", thumbnailFile);
      }

      const courseId = course._id;
      await updateCourse({ courseId, formData }).unwrap();
      toast.success("✅ Course updated successfully!");
      onClose();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto max-h-screen w-full sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Update Course</SheetTitle>
        </SheetHeader>

        {isLoading || !course ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6 text-sm">
            {/* Fundamentals */}
            <FormSection title="Course Fundamentals" description="Update course basics" icon={<BookOpen className="h-6 w-6" />}>
              <div className="space-y-3">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" disabled={isUpdating} {...register("title", { required: true })} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="description">Course Description</Label>
                <Textarea id="description" disabled={isUpdating} {...register("description", { required: true })} rows={5} />
              </div>
              <div className="space-y-3">
                <Label>Thumbnail</Label>
                {(thumbnailFile || course?.thumbnail) && (
                  <div className="relative w-48 h-28 rounded-md overflow-hidden border">
                    <img
                      src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : course?.thumbnail}
                      alt="Course thumbnail"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <FileUpload onChange={setThumbnailFile} />
              </div>
            </FormSection>

            {/* Configuration */}
            <FormSection title="Course Configuration" description="Update details" icon={<Clock className="h-6 w-6" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 4 weeks" disabled={isUpdating} {...register("duration")} />
                </div>
                <div>
                  <Label htmlFor="lectures">Total Lectures</Label>
                  <Input id="lectures" type="number" disabled={isUpdating} {...register("totalLectures", { valueAsNumber: true })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>Course Level</Label>
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select disabled={isUpdating} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Course Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select disabled={isUpdating} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Controller name="isFeatured" control={control} render={({ field }) => (
                  <Checkbox disabled={isUpdating} checked={field.value} onCheckedChange={field.onChange} />
                )}/>
                <Label>Feature this course</Label>
              </div>
            </FormSection>

            {/* Tags & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormSection title="Tags" description="Update course tags" icon={<Tag className="h-6 w-6" />}>
                <FieldArray label="Tags" placeholder="React, JS" fieldArray={tagFieldArray} register={register} fieldName="tags" />
              </FormSection>
              <FormSection title="Skills" description="Update course skills" icon={<Award className="h-6 w-6" />}>
                <FieldArray label="Skills" placeholder="Components, Hooks" fieldArray={skillFieldArray} register={register} fieldName="skills" />
              </FormSection>
            </div>

            {/* Pre/Reqs/Resources */}
            <FormSection title="Prerequisites" description="What students should know" icon={<CheckSquare className="h-6 w-6" />}>
              <FieldArray label="Prerequisites" placeholder="Basic HTML" fieldArray={prereqFieldArray} register={register} fieldName="prerequisites" />
            </FormSection>
            <FormSection title="Requirements" description="What students need" icon={<FileText className="h-6 w-6" />}>
              <FieldArray label="Requirements" placeholder="Computer, internet" fieldArray={reqFieldArray} register={register} fieldName="requirements" />
            </FormSection>
            <FormSection title="Resources" description="What students get" icon={<Copy className="h-6 w-6" />}>
              <FieldArray label="Resources" placeholder="Docs, videos" fieldArray={resourcesFieldArray} register={register} fieldName="resources" />
            </FormSection>

            {/* Pricing */}
            <FormSection title="Pricing" description="Update price & discounts" icon={<DollarSign className="h-6 w-6" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>Currency</Label>
                  <Controller name="currency" control={control} render={({ field }) => (
                    <Select disabled={isUpdating} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}/>
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" step="0.01" disabled={isUpdating} {...register("price", { valueAsNumber: true })} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Controller name="isDiscounted" control={control} render={({ field }) => (
                  <Checkbox disabled={isUpdating} checked={field.value} onCheckedChange={field.onChange} />
                )}/>
                <Label>Discount Available</Label>
              </div>

              {isDiscounted && (
                <div className="mt-3 transition-all">
                  <Label>Discount Price</Label>
                  <Input type="number" step="0.01" disabled={isUpdating} {...register("discountPrice", { valueAsNumber: true })} />
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Controller name="certificateAvailable" control={control} render={({ field }) => (
                  <Checkbox disabled={isUpdating} checked={field.value} onCheckedChange={field.onChange} />
                )}/>
                <Label>Provide Certificate</Label>
              </div>
            </FormSection>

            {/* Enrolled Students */}
            <FormSection title="Enrolled Students" description="List of enrolled students" icon={<Users className="h-6 w-6" />}>
              {course?.enrolledStudents?.length ? (
                <ul className="list-disc pl-6 space-y-1">
                  {course.enrolledStudents.map((s: any) => (
                    <li key={s._id}>
                      {s.name} <span className="text-muted-foreground">({s.email})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No students enrolled yet.</p>
              )}
            </FormSection>

            <Button type="submit" disabled={isUpdating} className="w-full h-12">
              {isUpdating ? "Updating..." : <><Save className="mr-2 h-4 w-4" /> Update Course</>}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UpdateCourse;