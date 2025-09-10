import { useParams, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Download, 
  Award, 
  Globe, 
  Smartphone,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';

const CourseDetails = () => {
  const { id } = useParams();
  const course = mockCourses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link to="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const curriculum = [
    {
      title: "Getting Started",
      lessons: [
        { title: "Course Introduction", duration: "5:30", type: "video" as const },
        { title: "Setting up Development Environment", duration: "12:45", type: "video" as const },
        { title: "Course Resources", duration: "3:20", type: "reading" as const },
      ]
    },
    {
      title: "Fundamentals",
      lessons: [
        { title: "Understanding the Basics", duration: "18:30", type: "video" as const },
        { title: "Hands-on Practice", duration: "25:15", type: "video" as const },
        { title: "Knowledge Check", duration: "10:00", type: "quiz" as const },
      ]
    },
    {
      title: "Advanced Concepts",
      lessons: [
        { title: "Deep Dive into Advanced Topics", duration: "32:45", type: "video" as const },
        { title: "Real-world Project", duration: "45:20", type: "video" as const },
        { title: "Final Assessment", duration: "15:00", type: "quiz" as const },
      ]
    }
  ];

  const features = [
    { icon: <Clock className="h-5 w-5" />, text: `${course.duration} on-demand video` },
    { icon: <Download className="h-5 w-5" />, text: "Downloadable resources" },
    { icon: <Globe className="h-5 w-5" />, text: "Access on web and mobile" },
    { icon: <Award className="h-5 w-5" />, text: "Certificate of completion" },
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent course! Very well structured and easy to follow. The instructor explains everything clearly."
    },
    {
      name: "Mike Chen", 
      rating: 5,
      date: "1 month ago",
      comment: "This course exceeded my expectations. Great practical examples and real-world applications."
    },
    {
      name: "Emily Rodriguez",
      rating: 4,
      date: "2 months ago", 
      comment: "Good course overall. Could use more advanced topics but great for beginners."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                  {course.level}
                </Badge>
                {course.featured && (
                  <Badge className="bg-secondary">Bestseller</Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-primary-foreground/90 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`h-5 w-5 ${star <= course.rating ? 'fill-current text-secondary' : 'text-white/30'}`} />
                  ))}
                  <span className="ml-1 font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              <p className="text-primary-foreground/80">
                Created by <span className="font-semibold text-white">{course.instructor}</span>
              </p>
            </div>
            
            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-0">
                  <div className="aspect-video bg-black/20 rounded-t-xl flex items-center justify-center relative">
                    <Play className="h-16 w-16 text-white/60" />
                    <div className="absolute inset-0 bg-black/20 rounded-t-xl"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-white">${course.price}</div>
                      {course.originalPrice && (
                        <div className="text-white/60 line-through">${course.originalPrice}</div>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <Button className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground">
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                        Add to Cart
                      </Button>
                    </div>
                    
                    <div className="space-y-3 text-sm text-white/80">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {feature.icon}
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>What you'll learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Master the fundamentals",
                          "Build real-world projects", 
                          "Industry best practices",
                          "Advanced techniques",
                          "Professional workflow",
                          "Portfolio development"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• No prior experience required</li>
                        <li>• Computer with internet connection</li>
                        <li>• Willingness to learn and practice</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                          This comprehensive course is designed to take you from beginner to advanced level. 
                          You'll learn through hands-on projects and real-world examples that will help you 
                          build a strong foundation and develop practical skills.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-4">
                          Our experienced instructor will guide you through each concept with clear explanations 
                          and practical demonstrations. By the end of this course, you'll have the confidence 
                          and skills needed to tackle real-world challenges.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="curriculum" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Curriculum</CardTitle>
                      <p className="text-muted-foreground">
                        {curriculum.reduce((acc, section) => acc + section.lessons.length, 0)} lectures • 
                        {course.duration} total length
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {curriculum.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-3">{section.title}</h3>
                          <div className="space-y-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded">
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? (
                                    <PlayCircle className="h-4 w-4 text-primary" />
                                  ) : lesson.type === 'quiz' ? (
                                    <CheckCircle className="h-4 w-4 text-secondary" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className="h-5 w-5 fill-current text-secondary" />
                            ))}
                          </div>
                          <span className="font-semibold">{course.rating}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ({course.students.toLocaleString()} reviews)
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={index} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold text-sm">
                                {review.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{review.name}</span>
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'fill-current text-secondary' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Instructor Info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xl">
                        {course.instructor.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{course.instructor}</h3>
                      <p className="text-muted-foreground text-sm mb-3">Senior Developer & Instructor</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-secondary" />
                          <span>4.7 Instructor Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>543,210 Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-info" />
                          <span>12 Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                    Professional developer with over 10 years of experience in the industry. 
                    Passionate about teaching and helping students achieve their goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;