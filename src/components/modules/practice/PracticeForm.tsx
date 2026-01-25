import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
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
import { PracticeItemManager } from './PracticeItemManager';
import type { PracticeFormData, PracticeItem, Course } from './practice.types';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import { useCreatePracticeMutation } from '@/redux/features/practice/practice.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const practiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  course: z.string().optional(),
  thumbnail: z.string().optional(),
  isActive: z.boolean().default(true),
  items: z.array(
    z.object({
      content: z.string().min(1, 'Content is required'),
      pronunciation: z.string().optional(),
      audioUrl: z.string().optional(),
      imageUrl: z.string().optional(),
      description: z.string().max(500, 'Description must be 500 characters or less').optional(),
      order: z.number().default(0),
    })
  ).default([]),
});

export const PracticeForm = () => {
  const navigate = useNavigate();
  const { data: coursesResponse } = useGetAllCoursesQuery({ page: 1, limit: 1000 });
  const [createPractice, { isLoading }] = useCreatePracticeMutation();

  const form = useForm<PracticeFormData>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      title: '',
      description: '',
      course: '',
      thumbnail: '',
      isActive: true,
      items: [],
    },
  });

  const items = form.watch('items') || [];
  const thumbnail = form.watch('thumbnail');

  const handleItemsChange = (newItems: PracticeItem[]) => {
    const itemsWithOrder = newItems.map((item, index) => ({
      ...item,
      order: index
    }));
    form.setValue('items', itemsWithOrder);
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('thumbnail', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: PracticeFormData) => {
    try {
      const payload = {
        ...data,
        course: data.course === 'none' || !data.course ? undefined : data.course,
      };

      await createPractice(payload).unwrap();
      toast.success('Practice created successfully');
      navigate('/practices');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create practice');
    }
  };

  const courses = coursesResponse?.data?.data || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
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
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Slug will be auto-generated from the title
                        </FormDescription>
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
                            maxLength={2000}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {field.value?.length || 0} / 2000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || 'none'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {courses.map((course: Course) => (
                              <SelectItem key={course._id} value={course._id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Associate this practice with a course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Practice Items</CardTitle>
                  <FormDescription>
                    Total items: {items.length}
                  </FormDescription>
                </CardHeader>
                <CardContent>
                  <PracticeItemManager items={items} onChange={handleItemsChange} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Practice
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                  {thumbnail ? (
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => form.setValue('thumbnail', '')}
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