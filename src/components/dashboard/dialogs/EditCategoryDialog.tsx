import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'react-hot-toast';

interface EditCategoryDialogProps {
  category: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryUpdated: () => void;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export function EditCategoryDialog({ category, open, onOpenChange, onCategoryUpdated }: EditCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(category.color);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>();

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description || '');
      setSelectedColor(category.color);
    }
  }, [category, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
  
      onCategoryUpdated();
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update category information and settings.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="Enter category name"
              {...register('name', { required: 'Category name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description (optional)"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Choose a color to represent this category
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}