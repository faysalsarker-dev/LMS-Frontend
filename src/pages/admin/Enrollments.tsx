import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Eye, Ban, UserCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Enrollment, PaginatedResponse } from '@/types';
import { mockApi } from '@/services/mockApi';
import { formatDate, getStatusVariant, getInitials, debounce } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<PaginatedResponse<Enrollment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEnrollments = async (page = 1, search = searchQuery) => {
    setLoading(true);
    try {
      const data = await mockApi.getEnrollments(page, 10, { search });
      setEnrollments(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const debouncedSearch = debounce((search: string) => {
    setSearchQuery(search);
    fetchEnrollments(1, search);
  }, 500);

  const handleEnrollmentAction = async (action: string, enrollment: Enrollment) => {
    try {
      switch (action) {
        case 'view':
          console.log('View enrollment:', enrollment.id);
          break;
        case 'cancel':
          if (window.confirm(`Cancel enrollment for ${enrollment.student.name}?`)) {
            await mockApi.cancelEnrollment(enrollment.id);
            toast.success('Enrollment cancelled successfully');
            fetchEnrollments(currentPage);
          }
          break;
        case 'reactivate':
          await mockApi.updateEnrollment(enrollment.id, { status: 'active' });
          toast.success('Enrollment reactivated successfully');
          fetchEnrollments(currentPage);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} enrollment:`, error);
      toast.error(`Failed to ${action} enrollment`);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const activeEnrollments = enrollments?.data.filter(e => e.status === 'active').length || 0;
  const completedEnrollments = enrollments?.data.filter(e => e.status === 'completed').length || 0;
  const totalEnrollments = enrollments?.total || 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">
          Monitor student progress and manage course enrollments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              All time enrollments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Currently learning
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Courses finished
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by student name or course..."
                className="pl-10"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Enrollments</CardTitle>
          <CardDescription>
            Track student progress and manage enrollments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-6 w-[60px]" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : enrollments?.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No enrollments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments?.data.map((enrollment) => (
                  <TableRow key={enrollment.id} className="hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.student.avatarUrl} alt={enrollment.student.name} />
                          <AvatarFallback>{getInitials(enrollment.student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{enrollment.student.name}</div>
                          <div className="text-sm text-muted-foreground">{enrollment.student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enrollment.course.title}</div>
                        <div className="text-sm text-muted-foreground">
                          by {enrollment.course.instructor.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getProgressColor(enrollment.progress)}`}>
                            {enrollment.progress}%
                          </span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(enrollment.status)} className="capitalize">
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(enrollment.purchaseDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {enrollment.lastAccessedAt ? formatDate(enrollment.lastAccessedAt) : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEnrollmentAction('view', enrollment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Progress
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {enrollment.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleEnrollmentAction('cancel', enrollment)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Cancel Enrollment
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleEnrollmentAction('reactivate', enrollment)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {enrollments && enrollments.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, enrollments.total)} of {enrollments.total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchEnrollments(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchEnrollments(currentPage + 1)}
                  disabled={currentPage >= enrollments.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}