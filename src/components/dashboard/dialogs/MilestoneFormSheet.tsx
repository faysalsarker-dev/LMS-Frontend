import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";



export type MilestoneStatus = "active" | "inactive";

export interface Milestone {
  title: string;
  course: string; // Using string for course ID
  order: number;
  status: MilestoneStatus;
}

export interface Course {
  _id: string;
  title:string;
}





interface MilestoneFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: (Milestone & { _id: string }) | null;
  onSubmit: (data: Milestone) => void;
  courses: Course[] | undefined;
  isLoadingCourses: boolean;
}

export default function MilestoneFormSheet({ open, onOpenChange, initialData, onSubmit, courses, isLoadingCourses }: MilestoneFormSheetProps) {
  const isUpdateMode = useMemo(() => !!initialData, [initialData]);
  const [milestone, setMilestone] = useState<Milestone>({ title: '', course: '', order: 1, status: 'active' });

  useEffect(() => {
    if (open) {
        if (isUpdateMode && initialData) {
            setMilestone({
                title: initialData.title,
                course: initialData.course,
                order: initialData.order,
                status: initialData.status,
            });
        } else {
            // Reset for create mode
            setMilestone({ title: '', course: '', order: 1, status: 'active' });
        }
    }
  }, [initialData, isUpdateMode, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setMilestone(prev => ({ ...prev, [id]: type === 'number' ? parseInt(value, 10) || 0 : value }));
  };
  
  const handleSelectChange = (field: keyof Milestone) => (value: string) => {
      setMilestone(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(milestone);
  };
  
  const isFormInvalid = !milestone.title || !milestone.course || milestone.order < 1;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[50%]">
        <SheetHeader>
          <SheetTitle>{isUpdateMode ? 'Edit Milestone' : 'Create New Milestone'}</SheetTitle>
          <SheetDescription>
            {isUpdateMode ? 'Update the details for this milestone.' : 'Fill out the details below to add a new milestone.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="py-4">
            <div className="grid gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Introduction to React Hooks" value={milestone.title} onChange={handleInputChange} />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="course">Course</Label>
                {isLoadingCourses && <div className="h-10 w-full rounded-md border border-gray-300 bg-gray-100 animate-pulse"></div>}
                {courses && (
                  <Select value={milestone.course} onValueChange={handleSelectChange('course')}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{courses.map(course => (<SelectItem key={course._id} value={course._id}>{course.title}</SelectItem>))}</SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input id="order" type="number" min="1" value={milestone.order} onChange={handleInputChange} />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="status">Status</Label>
                   <Select value={milestone.status} onValueChange={handleSelectChange('status')}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isFormInvalid || isLoadingCourses}>{isUpdateMode ? 'Save Changes' : 'Create Milestone'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}