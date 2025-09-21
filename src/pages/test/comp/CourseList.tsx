import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseForm } from './CourseForm';
import type { ICourse } from '@/interface';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useGetAllCoursesQuery } from '@/redux/features/course/course.api';
import { courses } from '../datas';

export function CourseList() {
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);
  
  const { data, isLoading } = useGetAllCoursesQuery({});
//   const [deleteCourse] = useDeleteCourseMutation();

  const handleCreate = () => {
    setSelectedCourse(null);
    setShowForm(true);
  };

  const handleEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setShowForm(true);
  };

  const handleDeleteClick = (course: ICourse) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      await deleteCourse(courseToDelete._id).unwrap();
  
    } catch (error) {
 console.log(error);
    }
    setShowDeleteDialog(false);
    setCourseToDelete(null);
  };

  const getStatusBadge = (status: ICourse['status']) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLevelBadge = (level: ICourse['level']) => {
    const colors = {
      Beginner: 'bg-admin-success text-white',
      Intermediate: 'bg-admin-warning text-white',
      Advanced: 'bg-destructive text-white',
    };

    return (
      <Badge className={colors[level]}>
        {level}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Courses</CardTitle>
            <CardDescription>
              Manage your course catalog
            </CardDescription>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>${course.price}</TableCell>
                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(course)}
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

      <CourseForm
        course={selectedCourse}
        open={showForm}
        onOpenChange={setShowForm}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}