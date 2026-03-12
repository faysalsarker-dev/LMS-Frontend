import { motion } from "framer-motion";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserStatsQuery } from "@/redux/features/overview/overview.api";

export function UserStats() {
  const { data, isLoading, isError } = useGetUserStatsQuery({});

  const stats = data?.data || {};
  const roles = stats.roles || {};
  const status = stats.status || {};

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10 text-muted-foreground">
        Loading user statistics...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-destructive py-10">
        Failed to load user statistics.
      </div>
    );

  const statCards = [
    {
      title: "Total Users",
      value: stats.total || 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    
    },
    {
      title: "Active Users",
      value: status.active || 0,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-100",
   
    },
    {
      title: "Inactive Users",
      value: status.inactive || 0,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-100",
   
    },
    {
      title: "Instructors",
      value: roles.instructors || 0,
      icon: GraduationCap,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
     
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
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
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
                <div className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </div>
             
              </div>

         
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
