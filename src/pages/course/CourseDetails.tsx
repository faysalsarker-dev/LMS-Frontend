import { motion } from "framer-motion";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,

  CheckCircle,
  PlayCircle,
  Star,
  BookOpen,
  ArrowLeft,
 
  Crown,
  Calendar
} from "lucide-react";
import { useState, memo } from "react";
import { useGetCourseBySlugQuery } from "@/redux/features/course/course.api";
import { LoadingSkeleton } from "@/components/modules/Course/LoadingSkeleton";
import type { IMilestone } from "@/interface";


const CourseDetails = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useGetCourseBySlugQuery(slug!);
  const [activeTab, setActiveTab] = useState("overview");

  const course = data?.data;
  console.log(course,'course');
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
        stiffness: 300,
        damping: 30
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        duration: 0.6
      }
    }
  };

  if (isLoading) {
    return (
    <LoadingSkeleton/>
    );
  }

  if (!course || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <h1 className="text-3xl font-bold mb-4 text-foreground">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button className="bg-gradient-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const finalPrice = course.isDiscounted ? course.discountPrice : course.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <motion.section 
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto p-6 bg-gradient-primary">
          <motion.div variants={heroVariants}>
            <Card className="p-0 overflow-hidden bg-gradient-card backdrop-blur-glass border-glass shadow-glass">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2  gap-0">
                  {/* Left Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <motion.div variants={itemVariants}>
                      <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-primary/20 to-primary-glow/20 text-primary border-primary/30">
                          {course.level}
                        </Badge>
                        {course.isFeatured && (
                          <Badge className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-700 border-amber-200/50">
                            <Crown className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                        {course.title}
                      </h1>
                      
                      {/* Description */}
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {course.description}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-foreground">{course.averageRating}</span>
                          </div>
                          <span className="text-muted-foreground">({course.totalEnrolled.toLocaleString()} students)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-500" />
                          <span>{course.totalLectures} lectures</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-violet-500" />
                          <span>Last updated 2024</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-wrap items-center gap-6 pt-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-3 text-lg font-semibold">
                            Enroll Now
                          </Button>
                        </motion.div>
                        
                        <div className="flex items-center gap-3">
                          {course.isDiscounted ? (
                            <>
                              <span className="text-3xl font-bold text-primary">${finalPrice}</span>
                              <span className="text-xl text-muted-foreground line-through">${course.price}</span>
                              <Badge variant="destructive" className="animate-pulse">
                                {Math.round((1 - finalPrice / course.price) * 100)}% OFF
                              </Badge>
                            </>
                          ) : (
                            <span className="text-3xl font-bold text-foreground">${course.price}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    variants={itemVariants}
                    className="relative overflow-hidden lg:min-h-[500px] order-1 lg:order-2"
                  >
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30 cursor-pointer hover:bg-white/30 transition-colors">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div 
              className="lg:col-span-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <motion.div variants={itemVariants}>
                  <TabsList className="grid w-full grid-cols-2 mb-4  border-glass mt-10 ">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-white p-3"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="curriculum"
                       className="data-[state=active]:bg-primary data-[state=active]:text-white p-3"
                    >
                      Curriculum
                    </TabsTrigger>
                  </TabsList>
                </motion.div>

                <TabsContent value="overview" className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                          What You'll Learn
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {course.skills?.map((skill: string, index: number) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-gradient-glass border border-glass shadow"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{skill}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft">
                      <CardHeader>
                        <CardTitle>Course Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {course.requirements?.map((req: string, index: number) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                              {req}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft">
                      <CardHeader>
                        <CardTitle>Prerequisites</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {course.prerequisites?.map((pre: string, index: number) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                              {pre}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="curriculum">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft">
                      <CardHeader>
                        <CardTitle>Course Curriculum</CardTitle>
                        <p className="text-muted-foreground">
                          {course.totalLectures} lectures • {course.duration} total length
                        </p>
                      </CardHeader>
                   <CardContent>
  {course?.milestones?.length > 0 ? (
    <div className="grid gap-4 ">
      {course.milestones.map((ml: IMilestone) => (
        <Card
          key={ml._id}
          className="hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              {ml.title}
            </CardTitle>
          </CardHeader>
        
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-12 text-muted-foreground">
      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p className="text-base">Curriculum details will be available soon.</p>
    </div>
  )}
</CardContent>

                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="sticky top-24">
                <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-glass overflow-hidden p-0">
                  <CardContent className="p-0">
                    {/* Course Image */}
                    <div className="relative aspect-video">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                      
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Price */}
                      <div className="text-center">
                        {course.isDiscounted ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-3xl font-bold text-primary">${finalPrice}</span>
                              <span className="text-lg text-muted-foreground line-through">${course.price}</span>
                            </div>
                            <Badge variant="destructive" className="animate-pulse">
                              Limited Time Offer
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-3xl font-bold">${course.price}</span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full bg-gradient-primary text-primary-foreground py-3 text-lg font-semibold">
                          Enroll Now
                        </Button>
                      </motion.div>

                      <Separator />

                      {/* Course Features */}
                     
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
});

CourseDetails.displayName = 'CourseDetails';

export default CourseDetails;
