import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Globe, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const paths = [
  {
    icon: Briefcase,
    title: 'Business English',
    description: 'Master professional communication for workplace success',
    courses: 45,
    color: 'from-primary to-primary-glow'
  },
  {
    icon: GraduationCap,
    title: 'Academic English',
    description: 'Prepare for IELTS, TOEFL, and university studies',
    courses: 38,
    color: 'from-accent to-info'
  },
  {
    icon: MessageCircle,
    title: 'Conversational English',
    description: 'Build confidence in everyday conversations',
    courses: 52,
    color: 'from-success to-accent'
  },
  {
    icon: Globe,
    title: 'Travel English',
    description: 'Essential phrases and skills for global adventures',
    courses: 28,
    color: 'from-warning to-accent'
  }
];

const LearningPaths = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">Learning Path</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're advancing your career or exploring the world, we have the perfect path for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paths.map((path, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover-lift cursor-pointer group border-2 hover:border-primary/50">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <path.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {path.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {path.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">{path.courses} courses</span>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/courses">
            <Button size="lg" variant="outline" className="group">
              Explore All Paths
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPaths;
