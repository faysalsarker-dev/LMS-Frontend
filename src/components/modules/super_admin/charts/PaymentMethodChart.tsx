/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PaymentMethodChartProps {
  data: {
    alipay: number;
    wechat: number;
  };
}

// 🎨 Relevant brand-like colors
const PAYMENT_COLORS = {
  alipay: "#3b82f6", // blue-500 (Alipay-like)
  wechat: "#22c55e", // green-500 (WeChat-like)
};

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const chartData = [
    { name: "Alipay", value: data.alipay, fill: PAYMENT_COLORS.alipay },
    { name: "WeChat", value: data.wechat, fill: PAYMENT_COLORS.wechat },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No payment method data available
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        alipay: { label: "Alipay", color: PAYMENT_COLORS.alipay },
        wechat: { label: "WeChat", color: PAYMENT_COLORS.wechat },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="#fff"
            strokeWidth={2}
            label={({ name, percent }: any) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
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
