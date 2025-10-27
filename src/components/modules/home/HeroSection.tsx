
import BG_LG from "@/assets/bg.png";
import BG_MOBILE from "@/assets/bg_mobile.png";



import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-hero">

       <img
         src={BG_LG}
         alt="Background"
         className="absolute inset-0 hidden md:block w-full h-full object-cover opacity-10"
       />
       <img
         src={BG_MOBILE}
         alt="Background Mobile"
         className="absolute inset-0 md:hidden w-full h-full object-cover opacity-10"
       />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10 flex justify-between items-center">
        <div className="max-w-5xl mx-auto">
          <div className="items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
              >
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-semibold text-primary">Trusted by 50,000+ Students</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
              >
                Master <span className="bg-gradient-primary bg-clip-text text-transparent">English</span>
                <br />
                <span className="text-foreground/80">Speak With Confidence</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto text-center"
              >
                Transform your English skills with expert-led courses designed for real-world communication. Join learners from 120+ countries.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex  gap-4 justify-center  mb-8"
              >
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow group">
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
            <Link to="/courses">
                  <Button size="lg" variant="outline" className="border-2 group">
                    <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Explore Courses
                  </Button>
                   </Link>
                </motion.div>
           

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 justify-center  text-sm"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">50,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="font-semibold">95% Success Rate</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right visual */}
      
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
