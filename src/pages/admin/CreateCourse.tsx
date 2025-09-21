import React, { useState } from "react";
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
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/ui/FileUpload";
import { FormSection } from "@/components/form/FormSection";
import { FieldArray } from "@/components/form/FieldArray";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Settings,
  Tag,
  Award,
  CheckSquare,
  DollarSign,
  FileText,
  Upload,
  Save,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleApiError } from "@/utils/errorHandler";
import { useCreateCourseMutation } from "@/redux/features/auth/course.api";
import { currencies } from "@/utils/currency";

type FormValues = {
  title: string;
  description: string;
  tags: { value: string }[];
  skills: { value: string }[];
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "draft"  | "archived";
  prerequisites: { value: string }[];
  requirements: { value: string }[];
  price: number;
  currency: string;
  isDiscounted: boolean;
  discountPrice: number;
  certificateAvailable: boolean;
};

const CreateCourse: React.FC = () => {
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      tags: [{ value: "" }],
      skills: [{ value: "" }],
      level: "Beginner",
      status: "draft",
      prerequisites: [{ value: "" }],
      requirements: [{ value: "" }],
      price: 0,
      currency: "USD",
      isDiscounted: false,
      discountPrice: 0,
      certificateAvailable: false,
    },
  });

  // Field Arrays
  const tagFieldArray = useFieldArray({ control, name: "tags" });
  const skillFieldArray = useFieldArray({ control, name: "skills" });
  const prereqFieldArray = useFieldArray({ control, name: "prerequisites" });
  const reqFieldArray = useFieldArray({ control, name: "requirements" });

  const isDiscounted = watch("isDiscounted");

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
    formData.append("title", String(data.title));
formData.append("description", String(data.description));

     
      formData.append(
        "tags",
        JSON.stringify(data.tags.map((t) => t.value).filter(Boolean))
      );
      formData.append(
        "skills",
        JSON.stringify(data.skills.map((s) => s.value).filter(Boolean))
      );
      formData.append("level", data.level);
      formData.append("status", data.status);
      formData.append(
        "prerequisites",
        JSON.stringify(data.prerequisites.map((p) => p.value).filter(Boolean))
      );
      formData.append(
        "requirements",
        JSON.stringify(data.requirements.map((r) => r.value).filter(Boolean))
      );
      formData.append("price", data.price.toString());
      formData.append("currency", data.currency);
      formData.append("isDiscounted", data.isDiscounted.toString());
      formData.append("discountPrice", data.discountPrice.toString());
      formData.append("certificateAvailable", data.certificateAvailable.toString());
       if (thumbnailFile) formData.append("file", thumbnailFile);


      await createCourse(formData).unwrap();
      toast.success("✅ Course created successfully!");
      reset();
      setThumbnailFile(null);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
 
    <div className="min-h-screen bg-admin-content">
  <div className="max-w-6xl mx-auto p-8 space-y-10">
    {/* Page Header */}
    <div className="space-y-3 text-center">
      <h1 className="text-4xl font-bold text-foreground">Create New Course</h1>
      <p className="text-muted-foreground text-lg">
        Build an engaging learning experience for your students
      </p>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 divide-y divide-border">
      {/* Basic Information */}
      <FormSection
        title="Basic Information"
        description="Essential details about your course"
        icon={<BookOpen className="h-6 w-6 text-primary" />}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <FileUpload onChange={setThumbnailFile} />
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input
                {...register("title", { required: true })}
                placeholder="Enter an engaging course title"
              />
            </div>
            <div className="space-y-2">
              <Label>Course Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Describe what students will learn"
                rows={6}
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Course Details */}
      <FormSection
        title="Course Details"
        description="Define the specifics of your course"
        icon={<Settings className="h-6 w-6 text-primary" />}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Course Status</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select course status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
      </FormSection>

      {/* Tags & Skills */}
      <div className="grid lg:grid-cols-2 gap-10">
        <FormSection
          title="Tags"
          description="Help students discover your course"
          icon={<Tag className="h-6 w-6 text-primary" />}
        >
          <FieldArray
            label="Tags"
            placeholder="e.g., React, JavaScript"
            fieldArray={tagFieldArray}
            register={register}
            fieldName="tags"
          />
        </FormSection>

        <FormSection
          title="Skills Taught"
          description="What skills will students gain?"
          icon={<Award className="h-6 w-6 text-primary" />}
        >
          <FieldArray
            label="Skills"
            placeholder="e.g., React components, State management"
            fieldArray={skillFieldArray}
            register={register}
            fieldName="skills"
          />
        </FormSection>
      </div>

      {/* Prerequisites & Requirements */}
      <div className="grid lg:grid-cols-2 gap-10">
        <FormSection
          title="Prerequisites"
          description="What should students know beforehand?"
          icon={<CheckSquare className="h-6 w-6 text-primary" />}
        >
          <FieldArray
            label="Prerequisites"
            placeholder="e.g., Basic HTML and CSS"
            fieldArray={prereqFieldArray}
            register={register}
            fieldName="prerequisites"
          />
        </FormSection>

        <FormSection
          title="Requirements"
          description="What do students need to participate?"
          icon={<FileText className="h-6 w-6 text-primary" />}
        >
          <FieldArray
            label="Requirements"
            placeholder="e.g., Computer with internet access"
            fieldArray={reqFieldArray}
            register={register}
            fieldName="requirements"
          />
        </FormSection>
      </div>

      {/* Pricing & Certification */}
      <FormSection
        title="Pricing & Certification"
        description="Set your course pricing and certification options"
        icon={<DollarSign className="h-6 w-6 text-primary" />}
      >
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" {...register("price")} step="0.01" min="0" />
            </div>
            <div className="space-y-2">
              <Controller
  name="currency"
  control={control}
  render={({ field }) => (
    <div className="space-y-2 w-full">
      <Label>Currency</Label>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )}
/>

            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Controller
                name="isDiscounted"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isDiscounted"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isDiscounted" className="cursor-pointer">
                Offer a discount
              </Label>
            </div>

            {isDiscounted && (
              <Card className="p-6 bg-accent/30 border border-primary/20 rounded-xl">
                <Label>Discount Price</Label>
                <Input
                  type="number"
                  {...register("discountPrice")}
                  step="0.01"
                  min="0"
                />
              </Card>
            )}

            <div className="flex items-center gap-3">
              <Controller
                name="certificateAvailable"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="certificateAvailable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="certificateAvailable"
                className="cursor-pointer"
              >
                Provide certificate of completion
              </Label>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Sticky Submit */}
      <div className="sticky bottom-0 bg-admin-content/95 backdrop-blur p-6 border-t border-border">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-lg font-semibold transition hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Upload className="h-5 w-5 mr-2 animate-spin" />
              Creating Course...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Create Course
            </>
          )}
        </Button>
      </div>
    </form>
  </div>
</div>

  );
};

export default CreateCourse;
