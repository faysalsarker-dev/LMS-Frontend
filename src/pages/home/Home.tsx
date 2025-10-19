import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Users, Clock, ArrowRight, Play, Check } from 'lucide-react';
import Testimonial from '@/components/custom/Testimonial';
import HeroSection from '@/components/modules/home/HeroSection';
import FeaturedCourse from '@/components/modules/home/FeaturedCourse';
import LearningPaths from '@/components/modules/home/LearningPaths';
import TrustBar from '@/components/modules/home/TrustBar';
import InstructorSpotlight from '@/components/modules/home/InstructorSpotlight';
import FaqSection from '@/components/modules/home/FaqSection';

const Home = () => {

  return (
    <div className="min-h-screen">
 
<HeroSection/>
<TrustBar/>
<LearningPaths/>
      {/* Featured Courses */}
 <FeaturedCourse/>
<InstructorSpotlight/>
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



<FaqSection/>
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