import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  index?: number;
}

const variantStyles = {
  default: {
    iconBg: 'bg-secondary',
    iconColor: 'text-secondary-foreground',
    glow: '',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    glow: 'hover:shadow-glow',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    glow: 'hover:shadow-success-glow',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    glow: '',
  },
  accent: {
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    glow: '',
  },
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  index = 0,
}: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="h-full"
    >
      <Card className={`h-full transition-shadow duration-300 ${styles.glow}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <p
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% from last month
                </p>
              )}
            </div>
            <div className={`rounded-xl p-3 ${styles.iconBg}`}>
              <Icon className={`h-6 w-6 ${styles.iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
