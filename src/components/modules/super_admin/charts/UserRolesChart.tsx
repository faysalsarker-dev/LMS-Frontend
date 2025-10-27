/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface UserRolesChartProps {
  data: {
    students: number;
    instructors: number;
    admins: number;
    superAdmins: number;
  };
}

// 🎨 Relevant, modern color palette (non-theme)
const ROLE_COLORS = {
  students: "#60a5fa", // blue-400
  instructors: "#34d399", // emerald-400
  admins: "#facc15", // yellow-400
  superAdmins: "#fb7185", // rose-400
};

export function UserRolesChart({ data }: UserRolesChartProps) {
  const chartData = [
    { name: "Students", value: data.students, fill: ROLE_COLORS.students },
    { name: "Instructors", value: data.instructors, fill: ROLE_COLORS.instructors },
    { name: "Admins", value: data.admins, fill: ROLE_COLORS.admins },
    { name: "Super Admins", value: data.superAdmins, fill: ROLE_COLORS.superAdmins },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No user role data available
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        students: { label: "Students", color: ROLE_COLORS.students },
        instructors: { label: "Instructors", color: ROLE_COLORS.instructors },
        admins: { label: "Admins", color: ROLE_COLORS.admins },
        superAdmins: { label: "Super Admins", color: ROLE_COLORS.superAdmins },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={85}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }: any) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            stroke="#fff"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
