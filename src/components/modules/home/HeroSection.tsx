// import { Button } from "@/components/ui/button";
// import msg from "@/assets/msg.jpg";
// import arrow from "@/assets/arow.jpg";
import BG_LG from "@/assets/bg.png";
import BG_MOBILE from "@/assets/bg_mobile.png";

// const HeroSection = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
     
//      {/* Side gradient overlays */}
// <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-black/10 to-transparent -z-20" />
// <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-black/10 to-transparent -z-20" />

//       {/* Background images */}
//       <img
//         src={BG_LG}
//         alt="Background"
//         className="absolute inset-0 hidden md:block w-full h-full object-cover opacity-10"
//       />
//       <img
//         src={BG_MOBILE}
//         alt="Background Mobile"
//         className="absolute inset-0 md:hidden w-full h-full object-cover opacity-10"
//       />

//       {/* Gradient overlays */}
//       {/* <div className="absolute inset-0">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
//       </div> */}

//       {/* Decorative corner images */}
//       <img
//         src={msg}
//         alt="Message Decoration"
//         className="absolute top-10 -right-10 rotate-6 w-28 md:w-44 lg:w-52 animate-float opacity-80"
//       />
//       <img
//         src={arrow}
//         alt="Arrow Decoration"
//         className="absolute bottom-10 -left-10 rotate-2 w-24 md:w-36 lg:w-44 animate-float-slow opacity-80"
//       />

//       {/* Main Content */}
//       <div className="relative z-10 container mx-auto px-6 py-24">
//         <div className="flex flex-col items-center text-center space-y-8">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
//             Master <span className="text-primary">English</span> & Speak With{" "}
//             <span className="text-accent">Confidence</span>
//           </h1>

//           <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl">
//             Join thousands of learners worldwide. Build fluency, expand your vocabulary, 
//             and open doors to global opportunities with our expert-designed courses.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button
//               size="lg"
//               className="group px-8 py-6 bg-gradient-primary hover:bg-primary/10 text-white shadow-lg hover:shadow-xl"
//             >
//               Get Started
//               <svg
//                 className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </Button>

//             <Button
//               size="lg"
//               variant="outline"
//               className="px-8 py-6 border-2 border-primary text-primary bg-primary/10 hover:bg-primary/20"
//             >
//               Explore Courses
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">

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
                className="flex flex-col sm:flex-row gap-4 justify-center  mb-8"
              >
                <Link to="/courses">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-glow group">
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 group">
                  <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
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
