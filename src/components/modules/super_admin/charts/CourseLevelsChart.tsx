import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CourseLevelsChartProps {
  data: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export function CourseLevelsChart({ data }: CourseLevelsChartProps) {
  const chartData = [
    { name: "Beginner", value: data.beginner, stroke: "#60a5fa" }, // blue-400
    { name: "Intermediate", value: data.intermediate, stroke: "#facc15" }, // yellow-400
    { name: "Advanced", value: data.advanced, stroke: "#fb7185" }, // rose-400
  ];

  return (
    <ChartContainer
      config={{
        value: { label: "Courses" },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            style={{ fontSize: "0.85rem", fill: "#6b7280" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            style={{ fontSize: "0.85rem", fill: "#6b7280" }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={3}
            dot={{
              strokeWidth: 2,
              r: 5,
              fill: "#fff",
            }}
            activeDot={{
              r: 7,
              strokeWidth: 3,
            }}
            stroke="#60a5fa"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
