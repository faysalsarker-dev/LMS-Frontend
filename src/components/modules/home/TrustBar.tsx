import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Globe } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Active Students',
    color: 'text-primary'
  },
  {
    icon: BookOpen,
    value: '200+',
    label: 'Expert Courses',
    color: 'text-accent'
  },
  {
    icon: Award,
    value: '95%',
    label: 'Success Rate',
    color: 'text-success'
  },
  {
    icon: Globe,
    value: '120+',
    label: 'Countries',
    color: 'text-info'
  }
];

const TrustBar = () => {
  return (
    <section className="py-16 border-b bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
              >
                <h3 className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
