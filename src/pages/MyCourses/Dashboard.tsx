import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import type { ICourse } from '@/interface';
import { PlayCircle, BookOpen, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import EnrolledCourseCard from '@/components/shared/EnrolledCourseCard';
import { useGetMyEnrolledCoursesQuery } from '@/redux/features/course/course.api';

const Dashboard = () => {
  const { data } = useUserInfoQuery({});
  const { data: enrolledCoursesData , isLoading: isEnrolledCoursesLoading} = useGetMyEnrolledCoursesQuery({});



  const user = data?.data;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12">
        {/* Hero Section with Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-primary p-8 lg:p-12 shadow-glow"
        >
          <div className="relative z-10  items-center">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl lg:text-5xl font-bold text-white"
              >
                Welcome back, {user?.name}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-white/90"
              >
                Ready to continue your learning journey? Let's pick up where you left off.
              </motion.p>
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-6 pt-4"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <BookOpen className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold">{user?.courses?.length || 0} Courses</span>
                </div>
          
              </motion.div>
            </div>
            
    
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Tabs defaultValue="courses" >
            <TabsList className="w-full bg-background lg:w-auto backdrop-blur-sm border shadow-sm p-1 h-14">
              <TabsTrigger 
                value="courses" 
                className="p-3  data-[state=active]:bg-primary/30 data-[state=active]:text-primary transition-all duration-300"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My Courses
              </TabsTrigger>
              <TabsTrigger 
                value="practices"
                className="p-3 data-[state=active]:bg-primary/30 data-[state=active]:text-primary transition-all duration-300"
              >
                <Trophy className="h-4 w-4 mr-2" />
                My Practices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={cardVariants}>
                  <Card className="border-0 shadow-lg card-elevated bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                          <PlayCircle className="h-5 w-5 text-white" />
                        </div>
                        Continue Learning
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {enrolledCoursesData?.data && enrolledCoursesData?.data?.length > 0 ? (
                        <>
                      
                          <motion.div 
                            className=" space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {enrolledCoursesData?.data?.map((course: ICourse, index: number) => (
                              <motion.div
                                key={course._id}
                                variants={itemVariants}
                                custom={index}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                              >
                                <EnrolledCourseCard course={course} />
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-center py-12"
                        >
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">No courses enrolled yet. Start your learning journey today!</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="practices">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-0 shadow-lg card-elevated bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-accent">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      Practice Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center py-12"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-accent/10 mb-4">
                        <Trophy className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground">Practice sessions will be available here to test your knowledge!</p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
