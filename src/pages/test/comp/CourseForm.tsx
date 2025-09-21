import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';




type CourseFormData = z.infer<typeof any>;

interface CourseFormProps {
  course?: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseForm({ course, open, onOpenChange }: CourseFormProps) {


  const form = useForm<CourseFormData>({

    defaultValues: {
      title: '',
      slug: '',
      description: '',
      instructor: '',
      thumbnail: null,
      tags: [],
      skills: [],
      level: 'Beginner',
      prerequisites: [],
      requirements: [],
      price: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        slug: course.slug,
        description: course.description,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        tags: course.tags,
        skills: course.skills,
        level: course.level,
        prerequisites: course.prerequisites,
        requirements: course.requirements,
        price: course.price,
        status: course.status,
      });
    } else {
      form.reset({
        title: '',
        slug: '',
        description: '',
        instructor: '',
        thumbnail: null,
        tags: [],
        skills: [],
        level: 'Beginner',
        prerequisites: [],
        requirements: [],
        price: 0,
        status: 'draft',
      });
    }
  }, [course, form]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      const courseData = {
        ...data,
        milestones: course?.milestones || [],
      } as CreateCourseData;

      if (course) {
        await updateCourse({
          id: course.id,
          data: courseData,
        }).unwrap();
      
      } else {
        await createCourse(courseData).unwrap();
     
      }
      onOpenChange(false);
    } catch (error) {
  console.log(error);
    }
  };

  const addArrayItem = (fieldName: keyof Pick<CourseFormData, 'tags' | 'skills' | 'prerequisites' | 'requirements'>, value: string) => {
    if (!value.trim()) return;
    const currentValues = form.getValues(fieldName) || [];
    if (!currentValues.includes(value.trim())) {
      form.setValue(fieldName, [...currentValues, value.trim()]);
    }
  };

  const removeArrayItem = (fieldName: keyof Pick<CourseFormData, 'tags' | 'skills' | 'prerequisites' | 'requirements'>, index: number) => {
    const currentValues = form.getValues(fieldName) || [];
    form.setValue(fieldName, currentValues.filter((_, i) => i !== index));
  };

  const ArrayInput = ({ 
    label, 
    fieldName, 
    placeholder 
  }: { 
    label: string; 
    fieldName: keyof Pick<CourseFormData, 'tags' | 'skills' | 'prerequisites' | 'requirements'>; 
    placeholder: string;
  }) => {
    const values = form.watch(fieldName) || [];
    
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                addArrayItem(fieldName, target.value);
                target.value = '';
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              addArrayItem(fieldName, input.value);
              input.value = '';
            }}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {values.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {item}
              <button
                type="button"
                onClick={() => removeArrayItem(fieldName, index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {course ? 'Edit Course' : 'Create Course'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Course title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register('slug')}
                placeholder="course-slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Course description"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input
                id="instructor"
                {...form.register('instructor')}
                placeholder="Instructor name"
              />
              {form.formState.errors.instructor && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.instructor.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={form.watch('level')}
                onValueChange={(value) => form.setValue('level', value as CourseFormData['level'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as CourseFormData['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ArrayInput
            label="Tags"
            fieldName="tags"
            placeholder="Add tag (press Enter)"
          />

          <ArrayInput
            label="Skills"
            fieldName="skills"
            placeholder="Add skill (press Enter)"
          />

          <ArrayInput
            label="Prerequisites"
            fieldName="prerequisites"
            placeholder="Add prerequisite (press Enter)"
          />

          <ArrayInput
            label="Requirements"
            fieldName="requirements"
            placeholder="Add requirement (press Enter)"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? (course ? 'Updating...' : 'Creating...')
                : (course ? 'Update Course' : 'Create Course')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}