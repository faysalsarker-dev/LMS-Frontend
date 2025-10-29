
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router";
// import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  BookOpen,
  ArrowLeft,
  Crown,
  Calendar,
  Bookmark,
  BookmarkCheck,
 
} from "lucide-react";
import { useState, memo } from "react";
import { useGetCourseBySlugQuery } from "@/redux/features/course/course.api";
import { useAddToWishlistMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { LoadingSkeleton } from "@/components/modules/Course/LoadingSkeleton";
import { format } from "date-fns";
import type { IMilestone } from "@/interface";
import CourseReviewForm from "@/components/modules/Course/CourseReviewForm";


const CourseDetails = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useGetCourseBySlugQuery(slug!);
  const {data:uData,isLoading:isUserLoading}=useUserInfoQuery({})
  const [activeTab, setActiveTab] = useState("overview");
const [addToWishlist]=useAddToWishlistMutation()
  const course = data?.data;
const user = uData?.data;


const handleWishlistToggle = async ()=>{
  const courseId = course?._id;
  await addToWishlist({courseId}).unwrap()
}


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




const isInWishlist = !isUserLoading && user.wishlist?.includes(course?._id);





const isEnrolled = !isUserLoading && user.courses?.includes(course?._id);


    const finalPrice = course?.isDiscounted ? course?.discountPrice : course?.price;

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

  const bookmarkVariants = {
    initial: { scale: 1, rotate: 0 },
    tap: { scale: 0.85 },
    hover: { scale: 1.1, rotate: -5 },
    added: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <>
      {/* <Helmet>
        <title>{course.title} | Learn Online</title>
        <meta name="description" content={course.description} />
        <meta property="og:title" content={course.title} />
        <meta property="og:description" content={course.description} />
        <meta property="og:image" content={course.thumbnail} />
        <meta property="og:type" content="website" />
      </Helmet> */}

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
              <Card className="overflow-hidden py-0 border-boder bg-gradient-card backdrop-blur-glass border-glass shadow-glass">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Left Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                      <motion.div variants={itemVariants}>
                        <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 group">
                          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                          Back to Courses
                        </Link>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-6">
                        {/* Badges & Wishlist */}
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 px-3 py-1">
                              {course.level}
                            </Badge>
                            {course.isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-700 dark:text-amber-400 border-amber-200/50 px-3 py-1">
                                <Crown className="mr-1 h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                          </div>

                          <motion.div
                            variants={bookmarkVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            animate={isInWishlist ? "added" : "initial"}
                          >
                            <Button 
                              onClick={handleWishlistToggle}
                              variant="ghost" 
                              size="lg" 
                              className="p-3 rounded-full hover:bg-primary/10 relative overflow-hidden group"
                            >
                              <AnimatePresence mode="wait">
                                {isInWishlist ? (
                                  <motion.div
                                    key="checked"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                  >
                                    <BookmarkCheck className="h-8 w-8 text-primary" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="unchecked"
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: -180 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                  >
                                    <Bookmark className="h-8 w-8" />
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Ripple effect on click */}
                              <motion.span
                                className="absolute inset-0 rounded-full bg-primary/20"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={isInWishlist ? { scale: 2, opacity: 0 } : {}}
                                transition={{ duration: 0.6 }}
                              />
                            </Button>
                          </motion.div>
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
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                            <span>{course.totalLectures} lectures</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-violet-500" />
                            <span>Updated {format(course.updatedAt, "MMMM dd, yyyy")}</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isEnrolled ? (
                              <Link to={`/course/video/${course._id}`}>
                                <Button size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-3 text-lg font-semibold shadow-elevated">
                                  Continue Learning
                                </Button>
                              </Link>
                            ) : (
                              <Link to={`/checkout/${course.slug}`}>
                                <Button size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-3 text-lg font-semibold shadow-elevated hover:shadow-glass transition-all">
                                  Enroll Now
                                </Button>
                              </Link>
                            )}
                          </motion.div>
                          
                          <div className="flex items-center gap-3">
                            {course.isDiscounted ? (
                              <>
                                <span className="text-3xl font-bold text-primary">{course.currency}{finalPrice}</span>
                                <span className="text-xl text-muted-foreground line-through">{course.currency}{course.price}</span>
                                <Badge variant="destructive" className="animate-pulse">
                                  {Math.round((1 - finalPrice / course.price) * 100)}% OFF
                                </Badge>
                              </>
                            ) : (
                              <span className="text-3xl font-bold text-foreground">{course.currency}{course.price}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div 
                      variants={itemVariants}
                      className="relative overflow-hidden lg:min-h-[500px] order-1 lg:order-2 flex justify-center items-center"
                    >
                      <div className="relative w-full  bg-gradient-to-br from-primary/5 to-primary/10">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        
                        {/* Play Button Overlay */}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30 cursor-pointer hover:bg-white/30 transition-all shadow-glass">
                            <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
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
                    <TabsList className="grid w-full grid-cols-2 mb-4 border-glass mt-10 h-12">
                      <TabsTrigger 
                        value="overview" 
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground p-3 font-semibold transition-all"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="curriculum"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground p-3 font-semibold transition-all"
                      >
                        Curriculum
                      </TabsTrigger>
                    </TabsList>
                  </motion.div>

                  <TabsContent value="overview" className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft hover:shadow-elevated transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                            </div>
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
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-soft"
                              >
                                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm leading-relaxed">{skill}</span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft hover:shadow-elevated transition-shadow">
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
                      <Card className="bg-gradient-card backdrop-blur-glass border-glass shadow-soft hover:shadow-elevated transition-shadow">
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
                          <div className="space-y-4">
                            {course.milestones.map((ml:IMilestone, index:number) => (
                              <motion.div
                                key={ml._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                                  <CardHeader className="p-3">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground font-bold text-sm shrink-0 shadow-soft">
                                        {index + 1}
                                      </div>
                                      <CardTitle className="md:text-lg text-sm font-semibold">
                                        {ml.title}
                                      </CardTitle>
                                    </div>
                                  </CardHeader>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>


<CourseReviewForm courseId={course._id} />

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
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Price */}
                        <div className="text-center">
                          {course.isDiscounted ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-3xl font-bold text-primary">{course.currency}{finalPrice}</span>
                                <span className="text-lg text-muted-foreground line-through">{course.currency}{course.price}</span>
                              </div>
                              <Badge variant="destructive" className="animate-pulse">
                                Limited Time Offer
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-3xl font-bold">{course.currency}{course.price}</span>
                          )}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isEnrolled ? (
                            <Link to={`/course/video/${course._id}`} className="block">
                              <Button size="lg" className="w-full bg-gradient-primary text-primary-foreground px-8 py-3 text-lg font-semibold shadow-elevated">
                                Continue Learning
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/checkout/${course.slug}`} className="block">
                              <Button size="lg" className="w-full bg-gradient-primary text-primary-foreground px-8 py-3 text-lg font-semibold shadow-elevated hover:shadow-glass transition-all">
                                Enroll Now
                              </Button>
                            </Link>
                          )}
                        </motion.div>

                        <Separator />

                        {/* Course Features */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">This course includes:</h3>
                          <div className="space-y-3">
                            {[
                              { icon: Clock, text: `${course.duration} on-demand video`, color: "text-blue-500" },
                              { icon: BookOpen, text: `${course.totalLectures} comprehensive lectures`, color: "text-emerald-500" },
                              { icon: CheckCircle, text: "Full lifetime access", color: "text-violet-500" },
                              { icon: CheckCircle, text: "Certificate of completion", color: "text-amber-500" }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-3"
                              >
                                <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                                <span className="text-sm">{item.text}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

CourseDetails.displayName = 'CourseDetails';

export default CourseDetails;
