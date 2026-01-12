// import { motion } from 'framer-motion';
// import { Users, UserCheck, UserX, Shield, GraduationCap, User } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import type { DashboardUserStats } from '@/interface/dashboard.types';

// interface UserStatsSectionProps {
//   userStats: DashboardUserStats | undefined;
//   isLoading: boolean;
// }

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.08,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 15 },
//   visible: { opacity: 1, y: 0 },
// };

// const roleIcons = {
//   admin: Shield,
//   instructor: GraduationCap,
//   student: User,
// };

// const statusIcons = {
//   active: UserCheck,
//   inactive: Users,
//   banned: UserX,
// };

// const statusColors = {
//   active: 'text-success',
//   inactive: 'text-muted-foreground',
//   banned: 'text-destructive',
// };

// export const UserStatsSection = ({ userStats, isLoading }: UserStatsSectionProps) => {
//   if (isLoading) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-5 w-24" />
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="flex items-center justify-between">
//                 <Skeleton className="h-4 w-20" />
//                 <Skeleton className="h-6 w-12" />
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-5 w-24" />
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="flex items-center justify-between">
//                 <Skeleton className="h-4 w-20" />
//                 <Skeleton className="h-6 w-12" />
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!userStats) return null;

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="grid gap-4 md:grid-cols-2"
//     >
//       {/* User Roles */}
//       <motion.div variants={itemVariants}>
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base font-semibold flex items-center gap-2">
//               <Users className="h-4 w-4 text-primary" />
//               User Roles
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {Object.entries(userStats.roles).map(([role, count]) => {
//               const Icon = roleIcons[role as keyof typeof roleIcons];
//               return (
//                 <motion.div
//                   key={role}
//                   whileHover={{ x: 4 }}
//                   className="flex items-center justify-between py-1"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-lg bg-secondary p-2">
//                       <Icon className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <span className="text-sm font-medium capitalize">{role}s</span>
//                   </div>
//                   <span className="text-lg font-bold">{count?.toLocaleString()}</span>
//                 </motion.div>
//               );
//             })}
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* User Status */}
//       <motion.div variants={itemVariants}>
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base font-semibold flex items-center gap-2">
//               <UserCheck className="h-4 w-4 text-success" />
//               User Status
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {Object?.entries(userStats?.status).map(([status, count]) => {
//               const Icon = statusIcons[status as keyof typeof statusIcons];
//               const colorClass = statusColors[status as keyof typeof statusColors];
//               return (
//                 <motion.div
//                   key={status}
//                   whileHover={{ x: 4 }}
//                   className="flex items-center justify-between py-1"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="rounded-lg bg-secondary p-2">
//                       <Icon className={`h-4 w-4 ${colorClass}`} />
//                     </div>
//                     <span className="text-sm font-medium capitalize">{status}</span>
//                   </div>
//                   <span className="text-lg font-bold">{count?.toLocaleString()}</span>
//                 </motion.div>
//               );
//             })}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// };


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
  students: User,
  instructors: GraduationCap,
  admins: Shield,
  superAdmins: Shield,
};

const statusIcons: Record<StatusKey, LucideIcon> = {
  active: UserCheck,
  inactive: Users,
  verified: UserCheck,
  unverified: UserX,
};

const statusColors: Record<StatusKey, string> = {
  active: 'text-success',
  inactive: 'text-muted-foreground',
  verified: 'text-primary',
  unverified: 'text-destructive',
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
