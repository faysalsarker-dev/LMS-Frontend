import { motion } from 'framer-motion';
import { Shield, Clock, Award, RefreshCw } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '256-bit SSL encryption',
  },
  {
    icon: Clock,
    title: 'Instant Access',
    description: 'Start learning immediately',
  },
  {
    icon: Award,
    title: 'Certificate',
    description: 'Upon completion',
  },
  {
    icon: RefreshCw,
    title: '30-Day Guarantee',
    description: 'Money-back promise',
  },
];

export function TrustBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={badge.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border/50"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <badge.icon className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {badge.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            {badge.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
