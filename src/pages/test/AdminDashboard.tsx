import { useState } from 'react';
import { BookOpen, Target, FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courses, lessons, milestones } from './datas';
import { CourseList } from './comp/CourseList';
import { MilestoneList } from './comp/MilestoneList';
import { LessonList } from './comp/LessonList';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  


  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      description: 'Active course catalog',
      icon: BookOpen,
    },
    {
      title: 'Total Milestones',
      value: milestones.length,
      description: 'Course milestones',
      icon: Target,
    },
    {
      title: 'Total Lessons',
      value: lessons.length,
      description: 'Learning content',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-admin-content">
      {/* Header */}
      <header className="border-b border-admin-border bg-admin-header">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Learning Management System</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <CourseList />
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <MilestoneList />
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <LessonList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}