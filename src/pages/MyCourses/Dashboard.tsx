import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import type { ICourse } from '@/interface/course.types';
import { BookOpen } from 'lucide-react';

import { motion } from 'framer-motion';
import EnrolledCourseCard, { EnrolledCourseCardLg } from '@/components/shared/EnrolledCourseCard';
import { useGetMyEnrolledCoursesQuery } from '@/redux/features/course/course.api';
import { useTranslation } from 'react-i18next';
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




const Dashboard = () => {
  const { data } = useUserInfoQuery({});
  const { data: enrolledCoursesData } = useGetMyEnrolledCoursesQuery({});
  const { t } = useTranslation()


  const user = data?.data;

  // Animation variants
 


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
                {t('profile.studentsWolcome')}, {user?.name}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-white/90"
              >
                {t('profile.studentsWolcomeDiscription')}
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
   {enrolledCoursesData?.data && enrolledCoursesData?.data?.length > 0 ? (
                        <>

                          <motion.div
                            className=" space-y-4 md:hidden"
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


                          <motion.div
                            className=" space-y-6 md:block hidden "
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
                                <EnrolledCourseCardLg course={course} />
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
       
      </div>
    </div>
  );
};

export default Dashboard;
