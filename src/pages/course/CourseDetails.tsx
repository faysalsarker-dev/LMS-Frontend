import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Clock,
  Download,
  Award,
  Globe,
  CheckCircle,
  PlayCircle,
  Star,
} from 'lucide-react'
import { mockCourses } from '@/data/mockData'

const CourseDetails = () => {
  const id = '1'
  const course = mockCourses.find((c) => c.id === id)

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Link to="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    )
  }

  const curriculum = [
    {
      title: 'Getting Started',
      lessons: [
        { title: 'Course Introduction', duration: '5:30', type: 'video' as const },
        { title: 'Setup Development Environment', duration: '12:45', type: 'video' as const },
        { title: 'Course Resources', duration: '3:20', type: 'reading' as const },
      ],
    },
    {
      title: 'Fundamentals',
      lessons: [
        { title: 'Understanding the Basics', duration: '18:30', type: 'video' as const },
        { title: 'Hands-on Practice', duration: '25:15', type: 'video' as const },
        { title: 'Knowledge Check', duration: '10:00', type: 'quiz' as const },
      ],
    },
    {
      title: 'Advanced Concepts',
      lessons: [
        { title: 'Deep Dive into Advanced Topics', duration: '32:45', type: 'video' as const },
        { title: 'Real-world Project', duration: '45:20', type: 'video' as const },
        { title: 'Final Assessment', duration: '15:00', type: 'quiz' as const },
      ],
    },
  ]

  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Excellent course! Very well structured and easy to follow. The instructor explains everything clearly.',
    },
    {
      name: 'Mike Chen',
      rating: 5,
      date: '1 month ago',
      comment:
        'This course exceeded my expectations. Great practical examples and real-world applications.',
    },
    {
      name: 'Emily Rodriguez',
      rating: 4,
      date: '2 months ago',
      comment:
        'Good course overall. Could use more advanced topics but great for beginners.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/90 to-primary-dark/90 text-white p-10"
      >



        <div className="rounded-lg bg-card p-4 container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center text-black ">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground/90">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
              <div>
                ⭐ <span className="font-semibold">{course.rating}</span> rating
              </div>
              <div>{course.level}</div>
              <div>{course.duration} of content</div>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <Button size="lg" className="rounded-full px-8">
                Enroll Now
              </Button>
              <span className="text-xl font-bold">${course.price}</span>
            </div>
          </div>

          {/* Right Thumbnail */}
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Left Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-lg">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        'Master the fundamentals',
                        'Build real-world projects',
                        'Industry best practices',
                        'Advanced techniques',
                        'Professional workflow',
                        'Portfolio development',
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      This comprehensive course is designed to take you from
                      beginner to advanced. Learn through hands-on projects and
                      real-world examples that will help you build a strong
                      foundation and practical skills.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      Our experienced instructor guides you with clear
                      explanations and practical demos. By the end, you’ll have
                      the confidence to tackle real-world challenges.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Curriculum */}
              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {curriculum.reduce(
                        (acc, section) => acc + section.lessons.length,
                        0,
                      )}{' '}
                      lectures • {course.duration} total length
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {curriculum.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className="border rounded-lg p-4 bg-muted/30"
                      >
                        <h3 className="font-semibold mb-3">{section.title}</h3>
                        <div className="space-y-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded"
                            >
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
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({course.students.toLocaleString()} students)
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b pb-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {review.name}
                              </span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? 'fill-current text-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-24 shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">${course.price}</h3>
                <Button className="w-full rounded-full">Enroll Now</Button>
                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {course.duration} on-demand video
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Downloadable resources
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Access on web and mobile
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certificate of completion
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetails
