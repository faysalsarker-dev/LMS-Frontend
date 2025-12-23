import { motion } from 'framer-motion';

const FloatingLetter = ({ 
  children, 
  className = "",
  delay = 0,
  duration = 5
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    className={`absolute font-bold select-none ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, -15, 0],
      scale: [1, 1.05, 1],
      rotate: [0, 3, -3, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

export default FloatingLetter;