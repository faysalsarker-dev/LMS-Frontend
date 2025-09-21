import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LessonForm } from './LessonForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { lessons, milestones, type Lesson } from '../datas';

export function LessonList() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  


  const getMilestoneTitle = (milestoneId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    return milestone?.title || 'Unknown Milestone';
  };

  const handleCreate = () => {
    setSelectedLesson(null);
    setShowForm(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowForm(true);
  };

  const handleDeleteClick = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deleteLesson(lessonToDelete.id).unwrap();
 
    } catch (error) {
console.log(error);
    }
    setShowDeleteDialog(false);
    setLessonToDelete(null);
  };

  const getStatusBadge = (status: Lesson['status']) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getContentTypeBadge = (contentType: Lesson['contentType']) => {
    const colors = {
      video: 'bg-admin-info text-white',
      doc: 'bg-admin-success text-white',
      quiz: 'bg-admin-warning text-white',
    };

    return (
      <Badge className={colors[contentType]}>
        {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Lessons</CardTitle>
            <CardDescription>
              Manage lesson content
            </CardDescription>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lesson
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
                  <TableHead>Milestone</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div className="font-medium">{lesson.title}</div>
                    </TableCell>
                    <TableCell>{getMilestoneTitle(lesson.milestone)}</TableCell>
                    <TableCell>{getContentTypeBadge(lesson.contentType)}</TableCell>
                    <TableCell>{lesson.order}</TableCell>
                    <TableCell>{getStatusBadge(lesson.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(lesson)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(lesson)}
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

      <LessonForm
        lesson={selectedLesson}
        open={showForm}
        onOpenChange={setShowForm}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Lesson"
        description={`Are you sure you want to delete "${lessonToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}