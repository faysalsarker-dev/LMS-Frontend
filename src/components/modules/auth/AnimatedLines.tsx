import { motion } from 'framer-motion';


const AnimatedLines = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" preserveAspectRatio="none">
    <defs>
      <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
        <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.2" />
        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
        <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </linearGradient>
    </defs>
    
    {/* Animated paths */}
    <motion.path
      d="M-100,150 Q200,50 400,200 T800,150 T1200,250"
      fill="none"
      stroke="url(#lineGradient1)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
    <motion.path
      d="M-50,350 Q150,250 350,400 T750,300 T1150,450"
      fill="none"
      stroke="url(#lineGradient2)"
      strokeWidth="1.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
    <motion.path
      d="M0,550 Q250,450 500,600 T1000,500 T1400,600"
      fill="none"
      stroke="url(#lineGradient1)"
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 5, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
    
    {/* Pulsing circles */}
    <motion.circle 
      cx="15%" 
      cy="25%" 
      r="100" 
      fill="none" 
      stroke="url(#lineGradient1)" 
      strokeWidth="1"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.circle 
      cx="85%" 
      cy="75%" 
      r="80" 
      fill="none" 
      stroke="url(#lineGradient2)" 
      strokeWidth="1"
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

export default AnimatedLines