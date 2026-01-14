import { useLocation, Link } from "react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Search, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const SearchingStudentIllustration = () => (
  <motion.div
    animate={{
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="relative w-64 h-64 md:w-80 md:h-80"
  >
    {/* Glow effect behind illustration */}
    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
    
    {/* Main illustration container */}
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full relative z-10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="90" className="fill-primary/10" />
      
      {/* Books stack */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect x="30" y="120" width="50" height="12" rx="2" className="fill-accent" />
        <rect x="35" y="108" width="45" height="12" rx="2" className="fill-primary" />
        <rect x="32" y="96" width="48" height="12" rx="2" className="fill-accent/70" />
      </motion.g>
      
      {/* Student figure */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Body */}
        <ellipse cx="100" cy="145" rx="25" ry="30" className="fill-secondary" />
        {/* Head */}
        <circle cx="100" cy="95" r="25" className="fill-primary/20" />
        {/* Hair */}
        <path
          d="M75 90 Q100 60 125 90"
          className="stroke-foreground/60"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Eyes (searching) */}
        <circle cx="92" cy="95" r="3" className="fill-foreground/70" />
        <circle cx="108" cy="95" r="3" className="fill-foreground/70" />
        {/* Eyebrows (confused) */}
        <path d="M87 88 L97 85" className="stroke-foreground/50" strokeWidth="2" strokeLinecap="round" />
        <path d="M103 85 L113 88" className="stroke-foreground/50" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      
      {/* Magnifying glass */}
      <motion.g
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <circle cx="145" cy="75" r="20" className="stroke-primary" strokeWidth="4" fill="none" />
        <circle cx="145" cy="75" r="15" className="fill-primary/10" />
        <line x1="160" y1="90" x2="175" y2="105" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
        {/* Shine on glass */}
        <path d="M138 68 Q142 64 148 68" className="stroke-primary-foreground/50" strokeWidth="2" strokeLinecap="round" fill="none" />
      </motion.g>
      
      {/* Question marks floating */}
      <motion.text
        x="55"
        y="60"
        className="fill-muted-foreground text-2xl font-bold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0], y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
      >
        ?
      </motion.text>
      <motion.text
        x="160"
        y="45"
        className="fill-primary text-xl font-bold"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0], y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        ?
      </motion.text>
    </svg>
  </motion.div>
);

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <BookOpen className="w-8 h-8 text-primary/10" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/4"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <GraduationCap className="w-10 h-10 text-accent/10" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Illustration */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <SearchingStudentIllustration />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          variants={itemVariants}
          className="text-7xl md:text-8xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
        >
          Lost in Learning
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground max-w-md mx-auto mb-8"
        >
          Oops! This lesson hasn't been written yet. The page you're looking for doesn't exist.
        </motion.p>

        {/* Glassmorphism card with buttons */}
        <motion.div
          variants={itemVariants}
          className="inline-flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg"
        >
          <Button asChild size="lg" className="gap-2 shadow-glow">
            <Link to="/">
              <LayoutDashboard className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/courses">
              <Search className="w-5 h-5" />
              Browse Courses
            </Link>
          </Button>
        </motion.div>

        {/* Helpful hint */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-sm text-muted-foreground/70"
        >
          Tried path: <code className="px-2 py-1 bg-muted rounded text-xs">{location.pathname}</code>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
