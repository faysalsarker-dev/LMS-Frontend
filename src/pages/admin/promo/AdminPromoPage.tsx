import { useState } from "react";
import { motion } from "framer-motion";
import { mockPromoCodes, mockUsageStats,type PromoCode } from "@/data/mockPromoData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditPromoModal } from "@/components/modules/promo/EditPromoModal";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Search, Filter, ArrowUpDown, Edit2, Trash2, TrendingUp, Users, Percent, Calendar, Sparkles, Activity } from "lucide-react";
import toast from "react-hot-toast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminPromoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalCodes = mockPromoCodes.length;
  const activeCodes = mockPromoCodes.filter(p => p.status === "active").length;
  const totalUsage = mockPromoCodes.reduce((sum, p) => sum + p.usageCount, 0);
  const avgDiscount = Math.round(
    mockPromoCodes.reduce((sum, p) => sum + p.discountValue, 0) / totalCodes
  );

  const handleEdit = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (promo: PromoCode) => {
    toast.success(`Deleted promo code: ${promo.code}`);
  };

  const getStatusBadge = (status: PromoCode["status"]) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      expired: "destructive",
    } as const;
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const chartConfig = {
    uses: {
      label: "Redemptions",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Promo Management
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Manage and monitor all promotional codes
            </p>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Total Codes</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Percent className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalCodes}</div>
              <p className="text-xs text-muted-foreground mt-1">All promo codes</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-500/10 via-green-500/5 to-background shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Active Codes</CardTitle>
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeCodes}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently available</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Total Usage</CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalUsage}</div>
              <p className="text-xs text-muted-foreground mt-1">Total redemptions</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-background shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Avg Discount</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{avgDiscount}%</div>
              <p className="text-xs text-muted-foreground mt-1">Average value</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Chart */}
        <motion.div variants={item}>
          <Card className="border-none shadow-xl bg-gradient-to-br from-card via-card to-muted/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Usage Trends</CardTitle>
                  <CardDescription>Monthly promo code redemption statistics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockUsageStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      className="text-xs"
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="uses" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#colorUses)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={item}>
          <Card className="border-none shadow-xl bg-card">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">All Promo Codes</CardTitle>
                  <CardDescription>View and manage promotional codes</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search codes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background/50 border-border/50 focus:bg-background"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="usage">Most Used</SelectItem>
                      <SelectItem value="alpha">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 bg-background/50 border-border/50">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
                      <TableHead className="font-semibold text-foreground">Code</TableHead>
                      <TableHead className="font-semibold text-foreground">Creator</TableHead>
                      <TableHead className="font-semibold text-foreground">Type</TableHead>
                      <TableHead className="font-semibold text-foreground">Discount</TableHead>
                      <TableHead className="font-semibold text-foreground">Usage</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPromoCodes.map((promo) => (
                      <TableRow 
                        key={promo.id}
                        className="hover:bg-muted/20 transition-colors border-b border-border/30"
                      >
                        <TableCell className="font-mono font-semibold text-primary">{promo.code}</TableCell>
                        <TableCell className="text-muted-foreground">{promo.creator}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize border-primary/20 bg-primary/5 text-primary">
                            {promo.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-foreground">
                          {promo.type === "percentage" ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {promo.usageCount} / {promo.maxUsageCount}
                            </span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(promo.usageCount / promo.maxUsageCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(promo.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(promo)}
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(promo)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <EditPromoModal
        promo={selectedPromo}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}