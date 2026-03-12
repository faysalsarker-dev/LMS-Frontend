import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageIcon, Loader2, Save, X } from 'lucide-react';
import type { Practice } from './practice.types';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import type { ICourse } from '@/interface/course.types';

const practiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  course: z.string().min(1, 'Course is required'),
  thumbnail: z.string().optional(),
  isActive: z.boolean(),
});

type PracticeFormData = z.infer<typeof practiceSchema>;

interface PracticeFormProps {
  initialData?: Practice;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export const PracticeForm = ({
  initialData,
  onSubmit,
  isSubmitting,
}: PracticeFormProps) => {
  const { data: courses, isLoading: isLoadingCourses } = useGetAllCoursesQuery({
    page: 1,
    limit: 1000,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<PracticeFormData>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      course: initialData?.course?._id || '',
      thumbnail: initialData?.thumbnail || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue('thumbnail', previewUrl);
    }
  };

  const handleThumbnailRemove = () => {
    if (form.watch('thumbnail')?.startsWith('blob:')) {
      URL.revokeObjectURL(form.watch('thumbnail') || '');
    }
    setThumbnailFile(null);
    form.setValue('thumbnail', '');
  };

  const handleFormSubmit = async (data: PracticeFormData) => {
    const formData = new FormData();

    // Append basic fields
    formData.append('title', data.title);
    formData.append('course', data.course);
    formData.append('isActive', String(data.isActive));

    if (data.description) {
      formData.append('description', data.description);
    }

    if (thumbnailFile) {
      formData.append('file', thumbnailFile);
    } else if (data.thumbnail && !data.thumbnail.startsWith('blob:')) {
      formData.append('file', data.thumbnail);
    }

    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter practice title..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe this practice..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingCourses}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isLoadingCourses
                                    ? 'Loading courses...'
                                    : 'Select a course'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses?.data?.data?.map((course: ICourse) => (
                              <SelectItem key={course._id} value={course._id}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The course this practice belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription className="text-xs">
                            Make this practice visible to users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {initialData ? 'Update Practice' : 'Create Practice'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Thumbnail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                  {form.watch('thumbnail') ? (
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={form.watch('thumbnail')}
                        alt="Thumbnail preview"
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleThumbnailRemove}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </Form>
  );
};