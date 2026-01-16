import { motion } from "framer-motion";
import { Play, Users, Star, Clock, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyChooseSection() {
  const { t } = useTranslation();
  const features = [
    {
      icon: Play,
      title: t("home.whyChoose.expertLedCourses"),
      description: t("home.whyChoose.expertLedDescription"),
      color: "from-primary to-primary/60",
    },
    {
      icon: Sparkles,
      title: t("home.whyChoose.interactiveLearning"),
      description: t("home.whyChoose.interactiveDescription"),
      color: "from-accent to-accent/60",
    },
    {
      icon: Users,
      title: t("home.whyChoose.globalCommunity"),
      description: t("home.whyChoose.globalCommunityDescription"),
      color: "from-success to-success/60",
    },
    {
      icon: GraduationCap,
      title: t("home.whyChoose.certifiedExcellence"),
      description: t("home.whyChoose.certifiedDescription"),
      color: "from-blue-500 to-secondary/60",
    },
    {
      icon: Clock,
      title: t("home.whyChoose.flexibleSchedule"),
      description: t("home.whyChoose.flexibleDescription"),
      color: "from-accent to-success",
    },
    {
      icon: ArrowRight,
      title: t("home.whyChoose.careerGrowth"),
      description: t("home.whyChoose.careerGrowthDescription"),
      color: "from-success to-primary",
    },
  ];

const FloatingShape = ({ delay, size, x, y, color }: { delay: number; size: number; x: number; y: number; color: string }) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-3xl`}
    style={{ 
      width: size, 
      height: size, 
      left: `${x}%`, 
      top: `${y}%`,
    }}
    animate={{
      x: [0, 30, -20, 0],
      y: [0, -30, 20, 0],
      scale: [1, 1.1, 0.9, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const AnimatedLetter = ({ char, delay, x, y }: { char: string; delay: number; x: number; y: number }) => (
  <motion.span
    className="absolute text-4xl md:text-5xl font-bold text-primary/30 select-none pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      opacity: [0.1, 0.2, 0.1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {char}
  </motion.span>
);

  const letters = ['A', 'B', 'C', '学', '习', 'E', 'F', '中'];

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Floating gradient shapes */}
      <FloatingShape delay={0} size={300} x={-5} y={10} color="bg-primary/70" />
      <FloatingShape delay={2} size={250} x={85} y={60} color="bg-accent/60" />
      <FloatingShape delay={4} size={200} x={50} y={80} color="bg-success/50" />

      {/* Floating letters */}
      {letters.map((char, i) => (
        <AnimatedLetter 
          key={i} 
          char={char} 
          delay={i * 0.5} 
          x={5 + i * 12} 
          y={10 + (i % 4) * 20}
        />
      ))}

      {/* Animated SVG lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <motion.path
          d="M0,200 C200,100 400,300 600,200 S1000,100 1200,200"
          stroke="hsl(var(--primary) / 0.1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,400 C300,300 500,500 800,400 S1100,300 1400,400"
          stroke="hsl(var(--accent) / 0.1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>

      <div className="max-w-6xl relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">{t('home.whyChoose.whyChooseUs')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
              {t('home.whyChoose.transformLearning')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('home.whyChoose.experience')}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t('home.whyChoose.description')}
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                {/* Hover gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Animated corner accent */}
                <motion.div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${feature.color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="relative mb-6"
                  transition={{ duration: 0.5 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  {/* Icon glow */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                  />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
                />

             
              </div>
            </motion.div>
          ))}
        </div>

   
      </div>
    </section>
  );
}
