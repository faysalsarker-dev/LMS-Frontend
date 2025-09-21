import type { Course, MilestoneStatus } from "@/components/dashboard/dialogs/MilestoneFormSheet";
import MilestoneFormSheet from "@/components/dashboard/dialogs/MilestoneFormSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export interface Milestone {
  title: string;
  course: string; // Using string for course ID
  order: number;
  status: MilestoneStatus;
}

// --- MOCK DATA & SIMULATED RTK HOOK ---
const mockCourses: Course[] = [
  { _id: 'course_1', title: 'Introduction to React' },
  { _id: 'course_2', title: 'Advanced TypeScript' },
  { _id: 'course_3', title: 'Node.js for Beginners' },
  { _id: 'course_4', title: 'Full-Stack Web Development' },
  { _id: 'course_5', title: 'UI/UX Design Principles' },
];

const mockExistingMilestones: (Milestone & { _id: string })[] = [
    { _id: 'milestone_1', title: 'Setup Project and Tooling', course: 'course_4', order: 1, status: 'active' },
    { _id: 'milestone_2', title: 'Understanding JSX and Components', course: 'course_1', order: 2, status: 'active' },
    { _id: 'milestone_3', title: 'Advanced Generics', course: 'course_2', order: 1, status: 'inactive' },
];







export default function MilestoneDashboardPage() {
//   const { data: courses, isLoading: isLoadingCourses, isError } = useGetCoursesQuery();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<(Milestone & { _id: string }) | null>(null);

  const handleEdit = (milestone: Milestone & { _id: string }) => {
    setEditingMilestone(milestone);
    setSheetOpen(true);
  };

  const handleCreateNew = () => {
    setEditingMilestone(null);
    setSheetOpen(true);
  };

  const handleSubmit = (milestoneData: Milestone) => {
    if (editingMilestone) {
        console.log('Updating milestone:', { ...milestoneData, _id: editingMilestone._id });
        alert(`Milestone "${milestoneData.title}" updated! Check console for data.`);
    } else {
        console.log('Creating new milestone:', milestoneData);
        alert(`Milestone "${milestoneData.title}" created! Check console for data.`);
    }
    setSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Milestones</h1>
            <Button onClick={handleCreateNew}>Create New</Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Existing Milestones</CardTitle>
                <CardDescription>Manage and view all course milestones.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {mockExistingMilestones.map(milestone => (
                        <div key={milestone._id} className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{milestone.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {mockCourses?.find(c => c._id === milestone.course)?.title || '...'} | Order: {milestone.order}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${milestone.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                    {milestone.status}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(milestone)}>Edit</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      <MilestoneFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialData={editingMilestone}
        onSubmit={handleSubmit}
        // courses={courses}
        // isLoadingCourses={isLoadingCourses}
      />
    </div>
  );
}