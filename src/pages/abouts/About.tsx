import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Heart, GraduationCap, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router';

const About = () => {
  const stats = [
    { icon: <Users className="h-8 w-8 text-primary" />, number: "2M+", label: "Active Learners" },
    { icon: <GraduationCap className="h-8 w-8 text-secondary" />, number: "50K+", label: "Courses" },
    { icon: <Globe className="h-8 w-8 text-info" />, number: "190+", label: "Countries" },
    { icon: <Award className="h-8 w-8 text-success" />, number: "1M+", label: "Certificates Issued" }
  ];

  const values = [
    {
      icon: <Target className="h-12 w-12 text-primary" />,
      title: "Excellence",
      description: "We strive for the highest quality in everything we do, from course content to user experience."
    },
    {
      icon: <Heart className="h-12 w-12 text-secondary" />,
      title: "Accessibility",
      description: "Education should be available to everyone, everywhere. We break down barriers to learning."
    },
    {
      icon: <Zap className="h-12 w-12 text-warning" />,
      title: "Innovation",
      description: "We constantly evolve our platform with cutting-edge technology and learning methodologies."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former VP of Education at Google with 15+ years in EdTech innovation.",
      initial: "S"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder", 
      bio: "Ex-Netflix engineer passionate about scalable learning platforms.",
      initial: "M"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      bio: "Former curriculum designer at MIT with expertise in online pedagogy.",
      initial: "E"
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      bio: "Full-stack developer with experience at top Silicon Valley companies.",
      initial: "D"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">About EduPlatform</h1>
          <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            We're democratizing education by making world-class learning accessible to everyone, anywhere.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 shadow-medium hover-lift animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                At EduPlatform, we believe that education is the most powerful tool for personal and professional 
                transformation. Our mission is to make high-quality education accessible to everyone, regardless 
                of their background, location, or financial situation.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We partner with world-class instructors and industry experts to create courses that are not only 
                educational but also practical and immediately applicable in the real world.
              </p>
              <Link to="/courses">
                <Button size="lg" className="bg-gradient-primary">
                  Explore Our Courses
                </Button>
              </Link>
            </div>
            
            <div className="animate-slide-up">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-medium">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">2018</div>
                    <div className="text-muted-foreground">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">98%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-info mb-2">24/7</div>
                    <div className="text-muted-foreground">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-success mb-2">100+</div>
                    <div className="text-muted-foreground">Languages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core principles guide everything we do and shape the way we serve our learning community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className={`text-center p-8 hover-lift animate-fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="p-0">
                  <div className="flex justify-center mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're a passionate group of educators, technologists, and innovators committed to transforming learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className={`text-center p-6 hover-lift animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground text-2xl font-bold">{member.initial}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Our Learning Revolution</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Start your learning journey today and unlock your full potential with our world-class courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;