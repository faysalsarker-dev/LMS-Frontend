import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Globe2, Sparkles, GraduationCap } from "lucide-react";

const FloatingElements = () => {
  const floatingItems = [
    { icon: BookOpen, delay: 0, x: "10%", y: "15%", size: 48, rotation: -15 },
    { icon: MessageCircle, delay: 0.5, x: "75%", y: "20%", size: 40, rotation: 10 },
    { icon: Globe2, delay: 1, x: "20%", y: "70%", size: 52, rotation: 5 },
    { icon: Sparkles, delay: 1.5, x: "80%", y: "65%", size: 36, rotation: -8 },
    { icon: GraduationCap, delay: 2, x: "50%", y: "85%", size: 44, rotation: 12 },
  ];

  const letterElements = [
    { letter: "A", delay: 0.3, x: "85%", y: "35%", size: "text-4xl" },
    { letter: "B", delay: 0.8, x: "15%", y: "45%", size: "text-3xl" },
    { letter: "英", delay: 1.3, x: "70%", y: "80%", size: "text-2xl" },
    { letter: "あ", delay: 1.8, x: "30%", y: "25%", size: "text-3xl" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(168 76% 42% / 0.3) 0%, transparent 70%)",
          left: "-10%",
          top: "20%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(16 85% 60% / 0.3) 0%, transparent 70%)",
          right: "-5%",
          bottom: "10%",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating icons */}
      {floatingItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: item.delay, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 shadow-soft"
            animate={{
              y: [-10, 10, -10],
              rotate: [item.rotation, item.rotation + 5, item.rotation],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <item.icon 
              size={item.size} 
              className="text-primary/70"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Floating letters */}
      {letterElements.map((item, index) => (
        <motion.div
          key={`letter-${index}`}
          className="absolute"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay, duration: 0.6 }}
        >
          <motion.span
            className={`${item.size} font-display font-bold text-secondary/40`}
            animate={{
              y: [-8, 8, -8],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.letter}
          </motion.span>
        </motion.div>
      ))}

      {/* Decorative lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M0,200 Q400,100 800,200 T1600,200"
          stroke="hsl(168 76% 42%)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default FloatingElements;
