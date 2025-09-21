import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Course, PaginatedResponse, CourseFilters, Category } from '@/types';
import { mockApi } from '@/services/mockApi';
import { formatCurrency, formatDate, getStatusVariant, debounce } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function Courses() {
  const [courses, setCourses] = useState<PaginatedResponse<Course> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCourses = async (page = 1, newFilters = filters) => {
    setLoading(true);
    try {
      const data = await mockApi.getCourses(page, 10, newFilters);
      setCourses(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await mockApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchCourses(), fetchCategories()]);
  }, []);

  const debouncedSearch = debounce((search: string) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    fetchCourses(1, newFilters);
  }, 500);

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    fetchCourses(1, newFilters);
  };

  const handleCourseAction = async (action: string, course: Course) => {
    try {
      switch (action) {
        case 'edit':
          // Navigate to edit course page
          console.log('Edit course:', course.id);
          break;
        case 'view':
          // Navigate to course details page
          console.log('View course:', course.id);
          break;
        case 'publish':
          await mockApi.updateCourse(course.id, { status: 'published' });
          toast.success(`${course.title} has been published`);
          fetchCourses(currentPage);
          break;
        case 'unpublish':
          await mockApi.updateCourse(course.id, { status: 'draft' });
          toast.success(`${course.title} has been unpublished`);
          fetchCourses(currentPage);
          break;
        case 'archive':
          await mockApi.updateCourse(course.id, { status: 'archived' });
          toast.success(`${course.title} has been archived`);
          fetchCourses(currentPage);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            await mockApi.deleteCourse(course.id);
            toast.success(`${course.title} has been deleted`);
            fetchCourses(currentPage);
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} course:`, error);
      toast.error(`Failed to ${action} course`);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            Manage course content, pricing, and availability
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time courses created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses?.data.filter(c => c.status === 'published').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Live courses available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses?.data.filter(c => c.status === 'draft').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Courses in development
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses?.data.reduce((sum, course) => sum + course.enrollmentCount, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Students enrolled across all courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <Select value={filters.categoryId || ''} onValueChange={(value) => handleFilterChange('categoryId', value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.level || ''} onValueChange={(value) => handleFilterChange('level', value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            Manage your course catalog and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-24 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-6 w-[60px]" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : courses?.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No courses found matching your criteria</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Enrollments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.data.map((course) => (
                  <TableRow key={course.id} className="hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="h-12 w-16 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {course.duration}h • {course.rating > 0 ? `${course.rating}★` : 'No ratings'}
                          </div>
                          <Badge variant="outline" className={`text-xs ${getLevelColor(course.level)}`}>
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={course.instructor.avatarUrl} alt={course.instructor.name} />
                          <AvatarFallback className="text-xs">{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{course.instructor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: course.category.color }}>
                        {course.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(course.price)}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{course.enrollmentCount}</div>
                        <div className="text-xs text-muted-foreground">students</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(course.status)} className="capitalize">
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(course.createdAt)}
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
                          <DropdownMenuItem onClick={() => handleCourseAction('view', course)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCourseAction('edit', course)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {course.status === 'published' ? (
                            <DropdownMenuItem onClick={() => handleCourseAction('unpublish', course)}>
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleCourseAction('publish', course)}>
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleCourseAction('archive', course)}>
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleCourseAction('delete', course)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {courses && courses.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, courses.total)} of {courses.total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCourses(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCourses(currentPage + 1)}
                  disabled={currentPage >= courses.totalPages}
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