import type { Variants } from "framer-motion";

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  },
  hero: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20, duration: 0.6 }
    }
  },
  bookmark: {
    initial: { scale: 1, rotate: 0 },
    tap: { scale: 0.85 },
    hover: { scale: 1.1, rotate: -5 },
    added: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, -15, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  }
} as const ;


export const BOOKMARK_VARIANTS: Variants = {
  initial: { scale: 1, rotate: 0 },
  tap: { scale: 0.85 },
  hover: { scale: 1.1, rotate: -5 },
  added: {
    scale: [1, 1.3, 1],
    rotate: [0, 15, -15, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};