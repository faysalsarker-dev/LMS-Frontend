
import { motion } from 'framer-motion';

const FloatingIcon = ({ 
  icon: Icon, 
  className = "",
  size = 32,
  delay = 0,
  duration = 4
}: { 
  icon: React.ElementType; 
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    className={`absolute text-primary/20 ${className}`}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <Icon size={size} />
  </motion.div>
);

export default FloatingIcon;