import { useState } from "react";
import { motion } from "framer-motion";
import { mockUserPromoCode, mockWeeklyStats, mockMonthlyStats, mockUserUsages } from "@/data/mockPromoData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Copy, Percent, Calendar, TrendingUp, Users, CheckCircle2, DollarSign, Activity, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const chartConfig = {
  uses: {
    label: "Uses",
    color: "hsl(var(--primary))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--accent))",
  },
};

export default function UserPromoUsagePage() {
  const promo = mockUserPromoCode;
  const usagePercentage = (promo.usageCount / promo.maxUsageCount) * 100;
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("monthly");
  const totalRevenue = mockUserUsages.reduce((sum, usage) => sum + usage.orderValue, 0);
  const avgOrderValue = totalRevenue / mockUserUsages.length;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success("Promo code copied to clipboard!", {
        icon: "📋",
        duration: 2000,
      });
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Hero Section */}
        <motion.div variants={item} className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Your Promo Code</h1>
          <p className="text-muted-foreground text-lg">
            Share your exclusive code and track its performance
          </p>
        </motion.div>

        {/* Main Promo Card */}
        <motion.div variants={item}>
          <motion.div
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <Badge className="bg-success text-success-foreground px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Your Exclusive Code</CardTitle>
                <CardDescription className="text-base">{promo.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Promo Code Display */}
                <div className="bg-primary/10 rounded-lg p-6 text-center border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Promo Code</p>
                  <p className="text-4xl font-bold font-mono tracking-wider text-primary mb-4">
                    {promo.code}
                  </p>
                  <Button onClick={copyToClipboard} className="w-full sm:w-auto">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Discount Value</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {promo.type === "percentage" ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{promo.type} discount</p>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium text-muted-foreground">Expires On</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {formatDate(promo.expirationDate)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valid until this date
                    </p>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-success" />
                      <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {promo.usageCount} <span className="text-sm text-muted-foreground">/ {promo.maxUsageCount}</span>
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-500"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-card/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-muted-foreground">Per User Limit</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{promo.maxUsagePerUser}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum uses per customer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {promo.usageCount} uses
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-card to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-to-br from-card to-success/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usagePercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Of max capacity
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Analytics Charts */}
        <motion.div variants={item}>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Track trends and performance over time</CardDescription>
                </div>
                <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "weekly" | "monthly")}>
                  <TabsList>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={timeRange} className="space-y-4">
                <TabsContent value="weekly" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Weekly Line Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-muted-foreground">Usage Trend</h4>
                      <ChartContainer config={chartConfig} className="h-[200px]">
                        <LineChart data={mockWeeklyStats}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="week" 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="uses" 
                            stroke="var(--color-uses)" 
                            strokeWidth={2}
                            dot={{ fill: "var(--color-uses)", r: 4 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>

                    {/* Weekly Bar Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-muted-foreground">Revenue Impact</h4>
                      <ChartContainer config={chartConfig} className="h-[200px]">
                        <BarChart data={mockWeeklyStats}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="week" 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar 
                            dataKey="revenue" 
                            fill="var(--color-revenue)" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Monthly Area Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-muted-foreground">Usage Growth</h4>
                      <ChartContainer config={chartConfig} className="h-[200px]">
                        <AreaChart data={mockMonthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area 
                            type="monotone" 
                            dataKey="uses" 
                            stroke="var(--color-uses)" 
                            fill="var(--color-uses)"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>

                    {/* Monthly Bar Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-muted-foreground">Monthly Distribution</h4>
                      <ChartContainer config={chartConfig} className="h-[200px]">
                        <BarChart data={mockMonthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar 
                            dataKey="uses" 
                            fill="var(--color-uses)" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={item}>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>People who used your promo code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Used On</TableHead>
                      <TableHead className="text-right">Order Value</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUserUsages.map((usage) => (
                      <TableRow key={usage.id}>
                        <TableCell className="font-medium">{usage.name}</TableCell>
                        <TableCell className="text-muted-foreground">{usage.email}</TableCell>
                        <TableCell>
                          {new Date(usage.usedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${usage.orderValue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                            -{usage.discountApplied}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div variants={item}>
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Share Your Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Share this code with your friends and followers. Each time someone uses it, 
                    you'll see the usage count increase in your analytics above.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}