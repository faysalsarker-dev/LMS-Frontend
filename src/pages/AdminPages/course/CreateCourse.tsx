import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  Save,
  Sparkles,
  Target,
  Users,
  Clock,
  Timer,
  List,
  Copy,
  TagIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { handleApiError } from "@/utils/errorHandler";
import { currencies } from "@/utils/currency";
import { useCreateCourseMutation } from "@/redux/features/course/course.api";
import { useGetAllCategorysQuery } from "@/redux/features/category/category.api";
import type { ICategory } from "@/interface/category.types";
import { useNavigate } from "react-router";

type FormValues = {
  title: string;
  description: string;
  tags: { value: string }[];
  skills: { value: string }[];
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "draft" | "archived";
  prerequisites: { value: string }[];
  requirements: { value: string }[];
  resources: { value: string }[];
  price: number;
  currency: string;
  isDiscounted: boolean;
  discountPrice: number;
  certificateAvailable: boolean;
  duration: string;
  totalLectures: number;
  isFeatured: boolean; 
  category:string;
};


const CreateCourse: React.FC = () => {
  const { t } = useTranslation();
    const { data, isLoading:categoryLoading} = useGetAllCategorysQuery({});
  const category = data?.data 
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const navigate = useNavigate()
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
  resources: [{ value: "" }],
  price: 0,
  currency: "USD",
  isDiscounted: false,
  discountPrice: 0,
  certificateAvailable: false,
  duration: "",
  totalLectures: 0,
  isFeatured: false,
  category:""
},

  });

  // Field Arrays
  const tagFieldArray = useFieldArray({ control, name: "tags" });
  const skillFieldArray = useFieldArray({ control, name: "skills" });
  const prereqFieldArray = useFieldArray({ control, name: "prerequisites" });
  const reqFieldArray = useFieldArray({ control, name: "requirements" });
  const resourcesFieldArray = useFieldArray({ control, name: "resources" });

  const isDiscounted = watch("isDiscounted");

 const onSubmit = async (data: FormValues) => {
  try {
    const formData = new FormData();
console.log(data.category);
    formData.append("title", String(data.title));
    formData.append("description", String(data.description));

    // ✅ Send arrays properly
    data.tags.forEach(tag => formData.append("tags", tag.value));
    data.skills.forEach(skill => formData.append("skills", skill.value));
    data.prerequisites.forEach(prereq => formData.append("prerequisites", prereq.value));
    data.requirements.forEach(req => formData.append("requirements", req.value));
    data.resources.forEach(res => formData.append("resources", res.value));

    formData.append("level", data.level);
    formData.append("status", data.status);

    formData.append("price", data.price.toString());
    formData.append("currency", data.currency);
    formData.append("category", data.category);
    formData.append("isDiscounted", data.isDiscounted.toString());
    formData.append("discountPrice", data.discountPrice.toString());
    formData.append("isFeatured", data.isFeatured.toString());
    formData.append("duration", data.duration);
    formData.append("totalLectures", data.totalLectures.toString());
    formData.append("certificateAvailable", data.certificateAvailable.toString());

    if (thumbnailFile) {
      formData.append("file", thumbnailFile);
    }

    await createCourse(formData);

    toast.success(t("course.courseCreatedSuccessfully"));
    navigate('/dashboard/courses')
    reset();
    setThumbnailFile(null);
  } catch (err) {
    handleApiError(err);
  }
};



  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Modern Header */}
        <div className="text-center space-y-6">
        
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              {t("course.createNewCourse")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("course.buildEngagingExperience")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Basic Information */}
          <FormSection
            title={t("course.courseFundamentals")}
            description={t("course.essentialDetails")}
            icon={<BookOpen className="h-6 w-6" />}
          >
   <div className="grid gap-6 mb-6">




    
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-medium">{t("course.courseTitle")}</Label>
                    </div>
                    <Input
                      {...register("title", { required: true })}
                      placeholder={t("course.courseTitlePlaceholder")}
                      className="h-12  border-border focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <FileUpload onChange={setThumbnailFile} />
             
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">{t("course.courseDescription")}</Label>
                  </div>
                  <Textarea
                    {...register("description")}
                    placeholder={t("course.courseDescriptionPlaceholder")}
                    className=" border-border min-h-[220px] focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Course Configuration */}
          <FormSection
            title={t("course.courseConfiguration")}
            description={t("course.defineStructure")}
            icon={<Settings className="h-6 w-6" />}
          >
            <div className="grid grid-cols-2 gap-8">

  <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">{t("course.courseDuration")}</Label>
                  </div>
                  <Input
                    {...register("duration")}
                    placeholder={t("course.durationPlaceholder")}
                    className=" border-border  focus:border-primary/50 transition-colors resize-none"
                  />
                </div>


  <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-medium">{t("course.totalLectures")}</Label>
                  </div>
                              <Input
                  {...register("totalLectures", { required: true })}
                  placeholder={t("course.totalLecturesPlaceholder")}
                  type="number"
                  className="h-12 border-border focus:border-primary/50 transition-colors"
                />
                </div>






         




              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-medium">{t("course.difficultyLevel")}</Label>
                    </div>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 w-full  border-border hover:border-primary/50">
                        <SelectValue placeholder={t("course.selectDifficultyLevel")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">🌱 {t("course.beginner")}</SelectItem>
                        <SelectItem value="Intermediate">⚡ {t("course.intermediate")}</SelectItem>
                        <SelectItem value="Advanced">🚀 {t("course.advanced")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-medium">{t("course.courseStatus")}</Label>
                    </div>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 w-full border-border hover:border-primary/50">
                        <SelectValue placeholder={t("course.selectCourseStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t("lesson.draft")}</SelectItem>
                        <SelectItem value="archived">{t("lesson.archived")}</SelectItem>
                        <SelectItem value="published">{t("lesson.published")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-primary" />
                      <Label className="text-sm font-medium">{t("course.category")}</Label>
                    </div>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 w-full border-border hover:border-primary/50">
                        <SelectValue placeholder={t("course.selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        
{categoryLoading ? (
                  <p className="text-sm p-2">{t("course.loadingCategories")}</p>
                ) : (
                  category?.map((c:ICategory) => (
                    <SelectItem key={c._id} value={c._id!}>
                      {c.title}
                    </SelectItem>
                  ))
                )}


                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

  


<div className="flex items-center gap-4">
  <Controller
    name="isFeatured"
    control={control}
    render={({ field }) => (
      <Checkbox
        id="isFeatured"
        checked={field.value}
        onCheckedChange={field.onChange}
        className="data-[state=checked]:bg-primary bg-gray-300 data-[state=checked]:border-primary"
      />
    )}
  />
  <Label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer flex items-center gap-2">
    <Sparkles className="h-4 w-4 text-primary" />
    Feature this course
  </Label>
</div>




            </div>
          </FormSection>

          {/* Tags & Skills Grid */}
          <div className="grid lg:grid-cols-2 gap-10">
            <FormSection
              title="Course Tags"
              description="Help students discover your course with relevant tags"
              icon={<Tag className="h-6 w-6" />}
            >
              <FieldArray
                label="Tags"
                placeholder="e.g., React, JavaScript, Web Development"
                fieldArray={tagFieldArray}
                register={register}
                fieldName="tags"
              />
            </FormSection>

            <FormSection
              title="Skills Taught"
              description="What specific skills will students master?"
              icon={<Award className="h-6 w-6" />}
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

          {/* Prerequisites & Requirements Grid */}
          <div className="grid lg:grid-cols-2 gap-10">
            <FormSection
              title="Prerequisites"
              description="What knowledge should students have beforehand?"
              icon={<CheckSquare className="h-6 w-6" />}
            >
              <FieldArray
                label="Prerequisites"
                placeholder="e.g., Basic HTML and CSS knowledge"
                fieldArray={prereqFieldArray}
                register={register}
                fieldName="prerequisites"
              />
            </FormSection>

            <FormSection
              title="Requirements"
              description="What do students need to participate successfully?"
              icon={<FileText className="h-6 w-6" />}
            >
              <FieldArray
                label="Requirements"
                placeholder="e.g., Computer with internet access"
                fieldArray={reqFieldArray}
                register={register}
                fieldName="requirements"
              />
            </FormSection>
            <FormSection
              title="Resources"
              description="What resources students will get?"
              icon={<Copy className="h-6 w-6" />}
            >
              <FieldArray
                label="resources"
                placeholder="e.g., Doc Video premium access"
                fieldArray={resourcesFieldArray}
                register={register}
                fieldName="resources"
              />
            </FormSection>
          </div>

          {/* Pricing & Certification */}
          <FormSection
            title="Pricing & Certification"
            description="Configure pricing options and completion rewards"
            icon={<DollarSign className="h-6 w-6" />}
          >
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">

 <div className="space-y-3">
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Currency</Label>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-12  border-border hover:border-primary/50">
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



                <div className="space-y-3">
                  <Label className="text-sm font-medium">Course Price</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      {...register("price")} 
                      step="0.01" 
                      min="0"
                      className="h-12  border-border focus:border-primary/50 transition-colors pl-8"
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

               
              </div>

              <Separator className="bg-border" />

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Controller
                    name="isDiscounted"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="isDiscounted"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    )}
                  />
                  <Label htmlFor="isDiscounted" className="text-sm font-medium cursor-pointer">
                    Offer a promotional discount
                  </Label>
                </div>

                {isDiscounted && (
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-base">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium text-primary">Discount Price</Label>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          {...register("discountPrice")}
                          step="0.01"
                          min="0"
                          className="h-12 bg-surface border-primary/30 focus:border-primary pl-8"
                        />
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex items-center gap-4">
                  <Controller
                    name="certificateAvailable"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="certificateAvailable"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    )}
                  />
                  <Label htmlFor="certificateAvailable" className="text-sm font-medium cursor-pointer">
                    Provide certificate of completion
                  </Label>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Sticky Submit Button */}
          <div className="sticky bottom-6 z-10">
            <Card className="p-6 bg-gradient-card backdrop-blur-sm border border-glass-border shadow-xl">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                    {t("course.creatingYourCourse")}
                  </> 
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-3" />
                    {t("course.createCourse")}
                  </>
                )}
              </Button>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;