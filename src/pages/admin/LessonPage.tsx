import { useState} from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentTypeBadge } from "@/components/modules/Lesson/content-type-badge";
import { StatusBadge } from "@/components/modules/Lesson/badge-status";
import { LessonForm } from "@/components/modules/Lesson/LessonForm";
import { useGetAllLessonsQuery } from "@/redux/features/lesson/lesson.api";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import type { ICourse, ILesson, IMilestone } from "@/interface";
import { useGetAllMilestonesQuery } from "@/redux/features/milestone/milestone.api";

export default function LessonPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState();
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const {data}=useGetAllLessonsQuery({});
  const {data:courses}=useGetAllCoursesQuery({page:1,limit:10000});
  const {data:milestones}=useGetAllMilestonesQuery({});
 const lesson = data?.data 


  // Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedMilestone, setSelectedMilestone] = useState("all");
  

  const handleCreateLesson = () => {
    setEditingLesson(undefined);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
  console.log("Delete lesson with ID:", lessonId);

  };

  const handleFormSubmit = (data: any) => {
    if (formMode === "create") {
  console.log('Creating lesson:', data);
    } else if (editingLesson) {
    console.log('Updating lesson:', editingLesson.id, data);
 
    }
  };


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lesson Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your course lessons, content, and status
            </p>
          </div>
          <Button onClick={handleCreateLesson} className="shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </motion.div>

     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-6 border-border/50 shadow-xl bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Title Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search lessons..."
              value={searchTitle}
              className="pl-10 focus-ring"
            />
          </div>

          {/* Status Filter */}
          <Select value={selectedStatus} >
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Content Type Filter */}
          <Select value={selectedContentType}>
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="doc">Document</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
            </SelectContent>
          </Select>

          {/* Course Filter */}
          <Select value={selectedCourse} onValueChange={(value) => {
           
          }}>
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses?.data?.data?.map((course: ICourse) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Milestone Filter */}
          <Select value={selectedMilestone} >
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder="All Milestones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Milestones</SelectItem>
              {milestones?.data?.map((milestone: IMilestone) => (
                <SelectItem key={milestone._id} value={milestone._id}>
                  {milestone.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </motion.div>

        {/* Lessons Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 shadow-xl bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Views
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lesson?.map((lesson: ILesson, index: number) => (
                  <motion.tr
                    key={lesson._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-row-hover border-border/30"
                  >
                    <TableCell className="text-center text-muted-foreground font-medium">
                      {lesson.order}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {lesson.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ContentTypeBadge type={lesson.contentType} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lesson.status || "inactive"} />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{lesson.viewCount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLesson(lesson)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            {data?.data?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium mb-2">
                    {data?.data?.length === 0 ? "No lessons yet" : "No lessons match your filters"}
                  </p>
                  <p>
                    {data?.data?.length === 0 
                      ? "Create your first lesson to get started" 
                      : "Try adjusting your search criteria"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Lesson Form Modal */}
        <LessonForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          lesson={editingLesson}
          mode={formMode}
        />
      </div>
    </div>
  );
}