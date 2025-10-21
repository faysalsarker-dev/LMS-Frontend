import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, Play, Users, Star, Clock, ArrowRight } from "lucide-react";

export default function WhyChooseSection() {
  const features = [
    {
      icon: <Check className="h-8 w-8 text-green-500" />,
      title: "Expert-Led Courses",
      description: "Learn from top industry professionals and world-class educators.",
    },
    {
      icon: <Play className="h-8 w-8 text-blue-500" />,
      title: "Interactive Learning",
      description: "Engage through immersive lessons, quizzes, and real-world projects.",
    },
    {
      icon: <Users className="h-8 w-8 text-pink-500" />,
      title: "Global Community",
      description: "Connect with millions of learners from across the world.",
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: "Certified Excellence",
      description: "Earn prestigious certificates recognized by global employers.",
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: "Flexible Schedule",
      description: "Study at your own pace, anytime and anywhere you want.",
    },
    {
      icon: <ArrowRight className="h-8 w-8 text-cyan-500" />,
      title: "Career Growth",
      description: "Gain practical skills to advance your career in any industry.",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-muted/30 to-white ">
      {/* Decorative background gradient circles */}
  <div className="overflow-hidden max-w-6xl mx-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />
          </div>
    
          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose EduPlatform?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Empowering learners in China and beyond with cutting-edge online education designed for your success.
              </p>
            </motion.div>
    
            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <Card
                    className="relative p-8 text-center backdrop-blur-lg bg-white/70 border border-gray-100 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 rounded-2xl"
                  >
                    <div className="flex justify-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 120 }}
                      >
                        {feature.icon}
                      </motion.div>
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
    
                    {/* Subtle highlight line */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      whileHover={{ width: "60%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
  </div>
    </section>
  );
}
