import { motion } from "framer-motion";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IUser } from "@/interface";

interface UserStatsProps {
  users: IUser[];
}

export function UserStats({ users }: UserStatsProps) {
  const stats = {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    inactive: users.filter(user => !user.isActive).length,
    students: users.filter(user => user.role === 'student').length,
    instructors: users.filter(user => user.role === 'instructor').length,
    admins: users.filter(user => user.role === 'admin').length,

  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Users", 
      value: stats.active,
      icon: UserCheck,
      color: "text-success",
      bg: "bg-success/10",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Inactive Users",
      value: stats.inactive,
      icon: UserX,
      color: "text-destructive",
      bg: "bg-destructive/10",
      change: "-3%",
      changeType: "negative" as const,
    },
    {
      title: "Instructors",
      value: stats.instructors,
      icon: GraduationCap,
      color: "text-warning",
      bg: "bg-warning/10",
      change: "+5%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Card className="hover:shadow-card-hover transition-all duration-300 border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {stat.title === "Total Users" && (
                    <>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-muted-foreground">{stats.students} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-muted-foreground">{stats.instructors} Instructors</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
   
    </div>
  );
}