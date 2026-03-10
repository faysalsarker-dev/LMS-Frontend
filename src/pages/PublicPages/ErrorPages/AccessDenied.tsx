import { motion } from "framer-motion";
import { ShieldX, Lock, AlertTriangle } from "lucide-react";


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

const LockedVaultIllustration = () => (
  <motion.div
    className="relative w-48 h-48 md:w-64 md:h-64"
    style={{ perspective: "1000px" }}
  >
    {/* Pulsing glow rings */}
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-destructive/30"
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute inset-4 rounded-full border-2 border-destructive/20"
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.3,
      }}
    />
    <motion.div
      className="absolute inset-8 rounded-full border border-destructive/10"
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.6,
      }}
    />

    {/* Main shield container */}
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        rotateY: [0, 10, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-32 h-40 md:w-40 md:h-48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield background */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--destructive))]" stopOpacity="0.8" />
            <stop offset="100%" className="[stop-color:hsl(var(--destructive))]" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="shieldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Shield shape */}
        <path
          d="M50 5 L90 20 L90 55 C90 80 70 100 50 115 C30 100 10 80 10 55 L10 20 Z"
          fill="url(#shieldGradient)"
          className="drop-shadow-lg"
        />
        <path
          d="M50 5 L90 20 L90 55 C90 80 70 100 50 115 C30 100 10 80 10 55 L10 20 Z"
          fill="url(#shieldHighlight)"
        />
        
        {/* Inner shield border */}
        <path
          d="M50 15 L80 27 L80 55 C80 75 65 90 50 102 C35 90 20 75 20 55 L20 27 Z"
          className="stroke-destructive-foreground/30"
          strokeWidth="2"
          fill="none"
        />

        {/* Lock icon in center */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {/* Lock body */}
          <rect
            x="35"
            y="50"
            width="30"
            height="25"
            rx="3"
            className="fill-destructive-foreground/90"
          />
          {/* Lock shackle */}
          <path
            d="M40 50 L40 40 C40 32 60 32 60 40 L60 50"
            className="stroke-destructive-foreground/90"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Keyhole */}
          <circle cx="50" cy="60" r="4" className="fill-destructive" />
          <rect x="48" y="60" width="4" height="8" className="fill-destructive" />
        </motion.g>

        {/* X mark overlay */}
        <motion.g
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <path
            d="M25 85 L75 35"
            className="stroke-destructive-foreground/40"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M75 85 L25 35"
            className="stroke-destructive-foreground/40"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  </motion.div>
);

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
        
        {/* Floating warning icons */}
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{ 
            y: [-5, 5, -5],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AlertTriangle className="w-12 h-12 text-destructive/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-[20%]"
          animate={{ 
            y: [5, -5, 5],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <ShieldX className="w-10 h-10 text-destructive/15" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/4"
          animate={{ 
            y: [-8, 8, -8],
            opacity: [0.05, 0.15, 0.05] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Lock className="w-8 h-8 text-destructive/10" />
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
          <LockedVaultIllustration />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold text-foreground mb-4"
        >
          Account Restricted
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6"
        >
          <ShieldX className="w-5 h-5" />
          <span className="font-medium">Access Denied</span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground text-balance max-w-md mx-auto mb-8"
        >
          Your account is currently blocked or banned due to a violation of our LMS terms of service. 
          If you believe this is a mistake, you can appeal the decision below.
        </motion.p>


        {/* Additional help text */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/30 max-w-md mx-auto"
        >
          <p className="text-sm text-muted-foreground">
            Need immediate assistance? Contact our support team at{" "}
            <a 
              href="mailto:support@lms.com" 
              className="text-primary hover:underline font-medium"
            >
              support@lms.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
