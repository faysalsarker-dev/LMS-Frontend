import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Users, Clock, ArrowRight, Play, Check } from 'lucide-react';
import { mockCourses } from '@/data/mockData';
import CourseCard from '@/components/custom/CourseCard';
import Testimonial from '@/components/custom/Testimonial';
import HeroSection from '@/components/custom/HeroSection';

const Home = () => {
  const featuredCourses = mockCourses.filter(course => course.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <section className="bg-gradient-hero text-primary-foreground py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn Without Limits
              </h1>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Start, switch, or advance your career with thousands of courses, 
                Professional Certificates, and degrees from world-class universities and companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/courses">
                  <Button size="lg" variant="secondary" className="group">
                    Explore Courses
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>2M+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span>4.8 Average Rating</span>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-up">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-strong">
                  <div className="aspect-video bg-white/20 rounded-xl mb-4 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white/60" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Complete Web Development</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">65 hours • 156K students</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="h-4 w-4 fill-current text-secondary" />
                      ))}
                      <span className="ml-1 text-sm">4.6</span>
                    </div>
                    <Badge variant="secondary">Bestseller</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
<HeroSection/>
      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular courses chosen by millions of learners worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
             <CourseCard key={course.id} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/courses">
              <Button size="lg" variant="outline" className="group">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose EduPlatform?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the best online learning platform with features designed for your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Check className="h-8 w-8 text-success" />,
                title: "Expert-Led Courses",
                description: "Learn from industry professionals with real-world experience"
              },
              {
                icon: <Play className="h-8 w-8 text-primary" />,
                title: "Interactive Learning",
                description: "Engage with hands-on projects and interactive content"
              },
              {
                icon: <Users className="h-8 w-8 text-info" />,
                title: "Community Support",
                description: "Connect with fellow learners and get help when you need it"
              },
              {
                icon: <Star className="h-8 w-8 text-warning" />,
                title: "Certificates",
                description: "Earn industry-recognized certificates upon completion"
              },
              {
                icon: <Clock className="h-8 w-8 text-secondary" />,
                title: "Flexible Schedule",
                description: "Learn at your own pace, anytime and anywhere"
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-primary" />,
                title: "Career Advancement",
                description: "Boost your career with in-demand skills and knowledge"
              }
            ].map((feature, index) => (
              <Card key={index} className={`p-6 text-center hover-lift animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Testimonial />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join millions of learners and start building the skills that will advance your career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Start Learning Now
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;