// import { useState } from 'react';
// import { Link } from 'react-router';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { 
//   BookOpen, 
//   Clock, 
//   PlayCircle, 
//   CheckCircle2, 
//   Calendar,
//   Filter,
//   Download,
//   Star,
//   Users,
//   Trophy
// } from 'lucide-react';
// import { mockCourses } from '@/data/mockData';

// const MyCourses = () => {
//   const [sortBy, setSortBy] = useState('recent');

//   // Mock enrolled courses with progress
//   const enrolledCourses = mockCourses.map(course => ({
//     ...course,
//     progress: Math.floor(Math.random() * 100),
//     enrolledDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toLocaleDateString(),
//     lastAccessed: Math.floor(Math.random() * 30) + 1,
//     completed: Math.random() > 0.7,
//     completedDate: Math.random() > 0.5 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toLocaleDateString() : null
//   }));

//   const inProgressCourses = enrolledCourses.filter(course => !course.completed && course.progress > 0);
//   const notStartedCourses = enrolledCourses.filter(course => course.progress === 0);
//   const completedCourses = enrolledCourses.filter(course => course.completed);

//   const sortCourses = (courses: typeof enrolledCourses) => {
//     return [...courses].sort((a, b) => {
//       switch (sortBy) {
//         case 'title':
//           return a.title.localeCompare(b.title);
//         case 'progress':
//           return b.progress - a.progress;
//         case 'enrolled':
//           return new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime();
//         default: // recent
//           return a.lastAccessed - b.lastAccessed;
//       }
//     });
//   };

//   const CourseCard = ({ course, showProgress = true }: { course: typeof enrolledCourses[0], showProgress?: boolean }) => (
//     <Card className="course-card">
//       <CardContent className="p-0">
//         <div className="flex flex-col sm:flex-row">
//           <div className="sm:w-48 aspect-video sm:aspect-auto bg-gradient-card relative overflow-hidden flex-shrink-0">
//             <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
//               <span className="text-2xl font-bold text-primary/60">{course.category.charAt(0)}</span>
//             </div>
//             {course.completed && (
//               <div className="absolute top-2 right-2 bg-success rounded-full p-1">
//                 <CheckCircle2 className="h-4 w-4 text-white" />
//               </div>
//             )}
//           </div>
          
//           <div className="flex-1 p-6">
//             <div className="flex flex-col h-full">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex-1 mr-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Badge variant="secondary">{course.category}</Badge>
//                     <Badge variant="outline">{course.level}</Badge>
//                     {course.completed && <Badge className="bg-success">Completed</Badge>}
//                   </div>
//                   <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
//                   <p className="text-muted-foreground text-sm mb-3">By {course.instructor}</p>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-lg font-bold">${course.price}</div>
//                   <div className="text-xs text-muted-foreground">
//                     Enrolled: {course.enrolledDate}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" />
//                   {course.duration}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Users className="h-4 w-4" />
//                   {course.students.toLocaleString()}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-current text-secondary" />
//                   {course.rating}
//                 </div>
//               </div>

//               {showProgress && (
//                 <div className="mb-4">
//                   <div className="flex justify-between text-sm mb-2">
//                     <span>Progress</span>
//                     <span className="font-medium">{course.progress}%</span>
//                   </div>
//                   <Progress value={course.progress} className="h-2" />
//                 </div>
//               )}

//               <div className="flex items-center justify-between mt-auto">
//                 <div className="text-sm text-muted-foreground">
//                   {course.completed 
//                     ? `Completed on ${course.completedDate}`
//                     : `Last accessed ${course.lastAccessed} days ago`
//                   }
//                 </div>
//                 <div className="flex gap-2">
//                   {course.completed && (
//                     <Button variant="outline" size="sm">
//                       <Download className="h-4 w-4 mr-1" />
//                       Certificate
//                     </Button>
//                   )}
//                   <Link to={`/learn/${course.id}`}>
//                     <Button size="sm">
//                       {course.completed ? (
//                         <>
//                           <Trophy className="h-4 w-4 mr-1" />
//                           Review
//                         </>
//                       ) : course.progress > 0 ? (
//                         <>
//                           <PlayCircle className="h-4 w-4 mr-1" />
//                           Continue
//                         </>
//                       ) : (
//                         <>
//                           <BookOpen className="h-4 w-4 mr-1" />
//                           Start
//                         </>
//                       )}
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">My Learning</h1>
//           <p className="text-muted-foreground">
//             Track your progress and continue your learning journey
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card>
//             <CardContent className="p-4 text-center">
//               <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
//               <div className="text-2xl font-bold">{enrolledCourses.length}</div>
//               <div className="text-sm text-muted-foreground">Total Courses</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <PlayCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
//               <div className="text-2xl font-bold">{inProgressCourses.length}</div>
//               <div className="text-sm text-muted-foreground">In Progress</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
//               <div className="text-2xl font-bold">{completedCourses.length}</div>
//               <div className="text-sm text-muted-foreground">Completed</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <Calendar className="h-8 w-8 text-warning mx-auto mb-2" />
//               <div className="text-2xl font-bold">{notStartedCourses.length}</div>
//               <div className="text-sm text-muted-foreground">Not Started</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold">My Courses</h2>
//           <div className="flex items-center gap-3">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-40">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="recent">Recently Accessed</SelectItem>
//                 <SelectItem value="title">Title A-Z</SelectItem>
//                 <SelectItem value="progress">Progress</SelectItem>
//                 <SelectItem value="enrolled">Enrollment Date</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Course Tabs */}
//         <Tabs defaultValue="all" className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="all">All Courses ({enrolledCourses.length})</TabsTrigger>
//             <TabsTrigger value="inprogress">In Progress ({inProgressCourses.length})</TabsTrigger>
//             <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
//             <TabsTrigger value="notstarted">Not Started ({notStartedCourses.length})</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="all" className="mt-6">
//             <div className="space-y-4">
//               {sortCourses(enrolledCourses).map((course) => (
//                 <CourseCard key={course.id} course={course} />
//               ))}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="inprogress" className="mt-6">
//             <div className="space-y-4">
//               {sortCourses(inProgressCourses).map((course) => (
//                 <CourseCard key={course.id} course={course} />
//               ))}
//               {inProgressCourses.length === 0 && (
//                 <div className="text-center py-12">
//                   <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
//                   <p className="text-muted-foreground mb-4">Start learning to see your progress here</p>
//                   <Link to="/courses">
//                     <Button>Browse Courses</Button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="completed" className="mt-6">
//             <div className="space-y-4">
//               {sortCourses(completedCourses).map((course) => (
//                 <CourseCard key={course.id} course={course} showProgress={false} />
//               ))}
//               {completedCourses.length === 0 && (
//                 <div className="text-center py-12">
//                   <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
//                   <p className="text-muted-foreground mb-4">Keep learning to earn your first completion</p>
//                   <Link to="/courses">
//                     <Button>Browse Courses</Button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="notstarted" className="mt-6">
//             <div className="space-y-4">
//               {sortCourses(notStartedCourses).map((course) => (
//                 <CourseCard key={course.id} course={course} />
//               ))}
//               {notStartedCourses.length === 0 && (
//                 <div className="text-center py-12">
//                   <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">All courses started</h3>
//                   <p className="text-muted-foreground mb-4">Great job! You've started all your enrolled courses</p>
//                   <Link to="/courses">
//                     <Button>Find More Courses</Button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default MyCourses;



const MyCourses = () => {
  return (
    <div>
      MyCourses
    </div>
  );
};

export default MyCourses;