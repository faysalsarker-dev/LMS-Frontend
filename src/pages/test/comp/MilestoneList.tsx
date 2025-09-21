import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { courses, milestones, type Milestone } from '../datas';
import { MilestoneForm } from './MilestoneForm';

export function MilestoneList() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(null);
  


  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  const handleCreate = () => {
    setSelectedMilestone(null);
    setShowForm(true);
  };

  const handleEdit = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowForm(true);
  };

  const handleDeleteClick = (milestone: Milestone) => {
    setMilestoneToDelete(milestone);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!milestoneToDelete) return;
    
    try {
      await deleteMilestone(milestoneToDelete.id).unwrap();
  
    } catch (error) {
console.log(error);
    }
    setShowDeleteDialog(false);
    setMilestoneToDelete(null);
  };

  const getStatusBadge = (status: Milestone['status']) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Milestones</CardTitle>
            <CardDescription>
              Manage course milestones
            </CardDescription>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </CardHeader>
        <CardContent>
          {
          
          
        //   isLoading ? (
        //     <div className="space-y-3">
        //       {Array.from({ length: 5 }).map((_, i) => (
        //         <Skeleton key={i} className="h-12 w-full" />
        //       ))}
        //     </div>
        //   ) :
           
           (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map((milestone) => (
                  <TableRow key={milestone.id}>
                    <TableCell>
                      <div className="font-medium">{milestone.title}</div>
                    </TableCell>
                    <TableCell>{getCourseTitle(milestone.course)}</TableCell>
                    <TableCell>{milestone.order}</TableCell>
                    <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(milestone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(milestone)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MilestoneForm
        milestone={selectedMilestone}
        open={showForm}
        onOpenChange={setShowForm}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Milestone"
        description={`Are you sure you want to delete "${milestoneToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}