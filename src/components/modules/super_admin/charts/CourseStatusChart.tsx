import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";


interface CourseStatusChartProps {
  data: {
    draft: number;
    published: number;
    archived: number;
  };
}

const chartConfig = {

    published: {
    label: "Published",
    color: "#3b82f6", // Blue
  },
  draft: {
    label: "Draft",
    color: "#fbbf24", // Amber
  },

  archived: {
    label: "Archived",
    color: "#9ca3af", // Gray
  },
} satisfies ChartConfig;

export function CourseStatusChart({ data }: CourseStatusChartProps) {
  const chartData = [
    { name: "Draft", value: data.draft },
    { name: "Published", value: data.published },
    { name: "Archived", value: data.archived },
  ];

  return (
    
   
      
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barSize={60}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                label={{ position: "top", fill: "#374151" }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "Published"
                        ? "#3b82f6"
                        : entry.name === "Draft"
                        ? "#fbbf24"
                        : "#9ca3af"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      
    
  );
}
