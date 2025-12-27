
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Search,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// import {
//   LessonForm,
//   ContentTypeBadge,
//   StatusBadge,
// } from "@/components/modules/Lesson";
// import { useDeleteLessonMutation, useGetAllLessonsQuery } from "@/redux/features/lesson/lesson.api";
// import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
// import { useGetAllMilestonesQuery } from "@/redux/features/milestone/milestone.api";
// import type { ICourse, ILesson, IMilestone } from "@/interface";
// import toast from "react-hot-toast";
// import { handleApiError } from "@/utils/errorHandler";

// export default function LessonPage() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingLesson, setEditingLesson] = useState<ILesson | undefined>();
//   const [formMode, setFormMode] = useState<"create" | "edit">("create");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//     const [searchTitle, setSearchTitle] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [selectedContentType, setSelectedContentType] = useState("all");
//   const [selectedCourse, setSelectedCourse] = useState("all");
//   const [selectedMilestone, setSelectedMilestone] = useState("all");

//   const { data } = useGetAllLessonsQuery({ page, limit ,status:selectedStatus , course:selectedCourse, milestone:selectedMilestone ,search : searchTitle ,type:selectedContentType},{ refetchOnMountOrArgChange: true });
//   const { data: courses } = useGetAllCoursesQuery({ page: 1, limit: 10000 });
//   const { data: milestones } = useGetAllMilestonesQuery({});
//   const [deleteLesson]=useDeleteLessonMutation()

//   const lessons = data?.data || [];
//   const meta = data?.meta;

//   // Filters


//   // Delete handling
//   const [deleteId, setDeleteId] = useState<string | null>(null);

//   const handleCreateLesson = () => {
//     setEditingLesson(undefined);
//     setFormMode("create");
//     setIsFormOpen(true);
//   };

//   const handleEditLesson = (lesson: ILesson) => {
//     setEditingLesson(lesson);
//     setFormMode("edit");
//     setIsFormOpen(true);
//   };

//   const confirmDeleteLesson = (lessonId: string) => {
//     setDeleteId(lessonId);
//   };

//   const handleDeleteConfirmed = async () => {

// if(!deleteId) return toast.error('Item id is reqired')

//     try {
// await deleteLesson(deleteId).unwrap()
//       setDeleteId(null);
//       toast.success('Lesson delete successfully')
//     }catch(err){
//       handleApiError(err)
//     }

//   };

//   console.log(selectedContentType,'types');
//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center justify-between mb-8"
//         >
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Lesson Management
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Manage your course lessons, content, and status
//             </p>
//           </div>
//           <Button onClick={handleCreateLesson} className="shadow-glow">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Lesson
//           </Button>
//         </motion.div>

//         {/* Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <Card className="p-6 border-border/50 shadow-xl bg-card">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               {/* Title Search */}
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                 <Input
//                   placeholder="Search lessons..."
//                   value={searchTitle}
//                   onChange={(e) => setSearchTitle(e.target.value)}
//                   className="pl-10 focus-ring"
//                 />
//               </div>

//               {/* Status Filter */}
//               <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                 <SelectTrigger className="focus-ring">
//                   <SelectValue placeholder="All Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Content Type Filter */}
//               <Select
//                 value={selectedContentType}
//                 onValueChange={setSelectedContentType}
//               >
//                 <SelectTrigger className="focus-ring">
//                   <SelectValue placeholder="All Types" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="video">Video</SelectItem>
//                   <SelectItem value="doc">Document</SelectItem>
//                   <SelectItem value="quiz">Quiz</SelectItem>
//                   <SelectItem value="assignment">Assignment</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Course Filter */}
//               <Select value={selectedCourse} onValueChange={setSelectedCourse}>
//                 <SelectTrigger className="focus-ring">
//                   <SelectValue placeholder="All Courses" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Courses</SelectItem>
//                   {courses?.data?.data?.map((course: ICourse) => (
//                     <SelectItem key={course._id} value={course._id}>
//                       {course.title}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Milestone Filter */}
//               <Select
//                 value={selectedMilestone}
//                 onValueChange={setSelectedMilestone}
//               >
//                 <SelectTrigger className="focus-ring">
//                   <SelectValue placeholder="All Milestones" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Milestones</SelectItem>
//                   {milestones?.data?.map((milestone: IMilestone) => (
//                     <SelectItem key={milestone._id} value={milestone._id}>
//                       {milestone.title}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </Card>
//         </motion.div>

//         {/* Lessons Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <Card className="border-border/50 shadow-xl bg-card">
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-border/50">
//                   <TableHead className="w-12 text-center">#</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Content Type</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-center">
//                     <div className="flex items-center justify-center">
//                       <Eye className="w-4 h-4 mr-1" />
//                       Views
//                     </div>
//                   </TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {lessons.map((lesson: ILesson, index: number) => (
//                   <motion.tr
//                     key={lesson._id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="table-row-hover border-border/30"
//                   >
//                     <TableCell className="text-center text-muted-foreground font-medium">
//                       {lesson.order}
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">{lesson.title}</div>
//                         <div className="text-sm text-muted-foreground font-mono">
//                           {lesson.slug}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <ContentTypeBadge type={lesson.contentType} />
//                     </TableCell>
//                     <TableCell>
//                       <StatusBadge status={lesson.status || "inactive"} />
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <span className="font-medium">
//                         {lesson.viewCount?.toLocaleString() || 0}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end space-x-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleEditLesson(lesson)}
//                           className="hover:bg-primary/10 hover:text-primary"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="hover:bg-destructive/10 hover:text-destructive"
//                               onClick={() => confirmDeleteLesson(lesson._id)}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>
//                                 Delete this lesson?
//                               </AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This action cannot be undone. It will
//                                 permanently remove this lesson.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 className="bg-destructive text-white hover:bg-destructive/90"
//                                 onClick={handleDeleteConfirmed}
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </motion.tr>
//                 ))}
//               </TableBody>
//             </Table>

//             {lessons.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-muted-foreground">
//                   <p className="text-lg font-medium mb-2">No lessons yet</p>
//                   <p>Create your first lesson to get started</p>
//                 </div>
//               </div>
//             )}

//             {lessons.length > 0 && (
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     Rows per page:
//                   </span>
//                   <Select
//                     value={limit.toString()}
//                     onValueChange={(val) => setLimit(Number(val))}
//                   >
//                     <SelectTrigger className="w-[70px]">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="5">5</SelectItem>
//                       <SelectItem value="10">10</SelectItem>
//                       <SelectItem value="20">20</SelectItem>
//                       <SelectItem value="50">50</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     Page {meta?.page || 1} of {meta?.totalPages || 1}
//                   </span>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setPage(page - 1)}
//                       disabled={!meta?.hasPrevPage}
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setPage(page + 1)}
//                       disabled={!meta?.hasNextPage}
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </Card>
//         </motion.div>

//         {/* Lesson Form Modal */}
//         <LessonForm
//           isOpen={isFormOpen}
//           onClose={() => setIsFormOpen(false)}
//           lesson={editingLesson}
//           mode={formMode}
//         />
//       </div>
//     </div>
//   );
// }


const LessonPage = () => {
  return (
    <div>
      LessonPage
    </div>
  );
};

export default LessonPage;