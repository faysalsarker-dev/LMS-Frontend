import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
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

const UnauthorizedIllustration = () => (
  <motion.div
    className="relative w-40 h-40 md:w-56 md:h-56"
    style={{ perspective: "1000px" }}
  >
    {/* Pulsing rings */}
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-amber-500/30"
      animate={{
        scale: [1, 1.08, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute inset-6 rounded-full border-2 border-amber-500/20"
      animate={{
        scale: [1, 1.06, 1],
        opacity: [0.5, 0.9, 0.5],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.4,
      }}
    />

    {/* Main shield container */}
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        rotateY: [0, 8, -8, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 100 110"
        className="w-28 h-32 md:w-36 md:h-40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="unauthorizedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="unauthorizedHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Shield shape */}
        <path
          d="M50 5 L88 18 L88 50 C88 75 68 95 50 108 C32 95 12 75 12 50 L12 18 Z"
          fill="url(#unauthorizedGradient)"
          className="drop-shadow-lg"
        />
        <path
          d="M50 5 L88 18 L88 50 C88 75 68 95 50 108 C32 95 12 75 12 50 L12 18 Z"
          fill="url(#unauthorizedHighlight)"
        />

        {/* Inner border */}
        <path
          d="M50 14 L78 24 L78 50 C78 70 62 86 50 96 C38 86 22 70 22 50 L22 24 Z"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          fill="none"
        />

        {/* Eye with slash */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
        >
          {/* Eye outline */}
          <ellipse cx="50" cy="52" rx="18" ry="12" stroke="white" strokeWidth="3" fill="none" />
          {/* Pupil */}
          <circle cx="50" cy="52" r="6" fill="white" />
          {/* Slash line */}
          <motion.line
            x1="35"
            y1="65"
            x2="65"
            y2="39"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          />
        </motion.g>
      </svg>
    </motion.div>
  </motion.div>
);

const Unauthorized = () => {
  const navigate = useNavigate();



  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        {/* Floating icons */}
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{
            y: [-6, 6, -6],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldAlert className="w-10 h-10 text-amber-500/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-[18%]"
          animate={{
            y: [6, -6, 6],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <Lock className="w-8 h-8 text-amber-500/15" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-[15%]"
          animate={{
            y: [-5, 5, -5],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <EyeOff className="w-9 h-9 text-amber-500/10" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 text-center max-w-xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Illustration */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <UnauthorizedIllustration />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-extrabold text-foreground mb-3"
        >
          Unauthorized Access
        </motion.h1>

        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-5"
        >
          <Eye className="w-4 h-4" />
          <span className="font-medium text-sm">Permission Required</span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base text-muted-foreground text-balance max-w-md mx-auto mb-8"
        >
          You don't have permission to view this page. Please contact your administrator if you believe this is an error.
        </motion.p>

        {/* Back Button */}
        <motion.div
          variants={itemVariants}
          className="inline-flex flex-col sm:flex-row gap-3 p-5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg"
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            Return Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
