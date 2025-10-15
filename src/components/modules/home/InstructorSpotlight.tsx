import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, Users, ArrowRight } from 'lucide-react';

const InstructorSpotlight = () => {
  return (
    <section className="py-20 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8 shadow-large hover-lift">
                {/* Instructor placeholder */}
                <div className="aspect-[4/5] rounded-xl bg-gradient-primary mb-6 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-32 h-32 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-6xl">
                      👨‍🏫
                    </div>
                    <h3 className="text-2xl font-bold">Dr. Michael Chen</h3>
                    <p className="text-white/80">Lead English Instructor</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">15+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent mb-1">50K+</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success mb-1">4.9★</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </Card>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-card shadow-medium rounded-xl p-4 border-2 border-primary"
              >
                <Award className="w-8 h-8 text-primary" />
              </motion.div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Learn from <span className="bg-gradient-primary bg-clip-text text-transparent">Expert</span> Instructors
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our instructors are certified professionals with years of teaching experience and a passion for helping students succeed. Each brings unique expertise and real-world knowledge to create engaging, effective courses.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Certified Professionals</h3>
                    <p className="text-muted-foreground text-sm">
                      All instructors hold advanced degrees and international teaching certifications
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Proven Teaching Methods</h3>
                    <p className="text-muted-foreground text-sm">
                      Utilizing the latest research in language acquisition and pedagogy
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Personal Mentorship</h3>
                    <p className="text-muted-foreground text-sm">
                      Get personalized feedback and support throughout your learning journey
                    </p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow group">
                Meet Our Instructors
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSpotlight;
