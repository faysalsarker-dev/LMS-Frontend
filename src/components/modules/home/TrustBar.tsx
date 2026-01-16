import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TrustBar = () => {
  const { t } = useTranslation();
  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: t('home.trustBar.activeStudents'),
      gradient: 'from-primary to-primary/60',
    },
    {
      icon: BookOpen,
      value: '200+',
      label: t('home.trustBar.expertCourses'),
      gradient: 'from-accent to-accent/60',
    },
    {
      icon: Award,
      value: '95%',
      label: t('home.trustBar.successRate'),
      gradient: 'from-success to-success/60',
    },
    {
      icon: Globe,
      value: '120+',
      label: t('home.trustBar.countries'),
      gradient: 'from-primary to-accent',
    }
  ];

const FloatingParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-primary/20"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

  return (
    <section className="relative max-w-6xl mx-auto py-20 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Animated background lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        <motion.path
          d="M0,50 Q250,20 500,50 T1000,50"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 Q300,50 600,80 T1200,80"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.4} 
          x={10 + i * 12} 
          y={20 + (i % 3) * 25} 
        />
      ))}

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {t('home.trustBar.trustedWorldwide')}
          </motion.span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('home.trustBar.joinGlobalCommunity')}
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Gradient glow on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                
                {/* Icon container */}
                <motion.div
                  className="flex justify-center mb-4"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                    {/* Pulse ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>

                {/* Value with counting animation */}
                <motion.h3
                  className="text-3xl md:text-4xl font-bold text-center mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 100 }}
                >
                  {stat.value}
                </motion.h3>
                
                <p className="text-muted-foreground text-sm md:text-base text-center font-medium">
                  {stat.label}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full bg-gradient-to-r ${stat.gradient}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
