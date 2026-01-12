

import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  User,
 type LucideIcon,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { DashboardUserStats } from '@/interface/dashboard.types';

/* --------------------------------------------
 Types
--------------------------------------------- */

interface UserStatsSectionProps {
  userStats?: DashboardUserStats;
  isLoading: boolean;
}

type RoleKey = keyof DashboardUserStats['roles'];
type StatusKey = keyof DashboardUserStats['status'];

/* --------------------------------------------
 Animation Variants
--------------------------------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/* --------------------------------------------
 Icon Maps (MATCH BACKEND KEYS)
--------------------------------------------- */

const roleIcons: Record<RoleKey, LucideIcon> = {
  student: User,
  instructor: GraduationCap,
  admin: Shield,
  super_admin: Shield,
};

const statusIcons: Record<StatusKey, LucideIcon> = {
  active: UserCheck,
  inactive: Users,
  verified: UserCheck,
  unverified: UserX,
  banned: UserX,
};

const statusColors: Record<StatusKey, string> = {
  active: 'text-success',
  inactive: 'text-muted-foreground',
  verified: 'text-primary',
  unverified: 'text-destructive',
  banned: 'text-destructive',
};

/* --------------------------------------------
 Reusable Stat Row
--------------------------------------------- */

interface StatRowProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClass?: string;
}

const StatRow = ({
  label,
  value,
  icon: Icon,
  iconClass,
}: StatRowProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 4 }}
      className="flex items-center justify-between py-1"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-secondary p-2">
          <Icon className={`h-4 w-4 ${iconClass ?? 'text-muted-foreground'}`} />
        </div>
        <span className="text-sm font-medium capitalize">{label}</span>
      </div>

      <span className="text-lg font-bold">
        {value.toLocaleString()}
      </span>
    </motion.div>
  );
};

/* --------------------------------------------
 Component
--------------------------------------------- */

export const UserStatsSection = ({
  userStats,
  isLoading,
}: UserStatsSectionProps) => {
  /* ---------- Loading State ---------- */
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="flex items-center justify-between"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-14" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!userStats) return null;

  /* ---------- Render ---------- */
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 md:grid-cols-2"
    >
      {/* ---------------- User Roles ---------------- */}
      <Card>
        <motion.div variants={itemVariants}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              User Roles
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {(Object.entries(userStats.roles) as [RoleKey, number][]).map(
              ([role, count]) => (
                <StatRow
                  key={role}
                  label={role}
                  value={count}
                  icon={roleIcons[role]}
                />
              )
            )}
          </CardContent>
        </motion.div>
      </Card>

      {/* ---------------- User Status ---------------- */}
      <Card>
        <motion.div variants={itemVariants}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCheck className="h-4 w-4 text-success" />
              User Status
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {(Object.entries(userStats.status) as [
              StatusKey,
              number
            ][]).map(([status, count]) => (
              <StatRow
                key={status}
                label={status}
                value={count}
                icon={statusIcons[status]}
                iconClass={statusColors[status]}
              />
            ))}
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};
