export interface PromoCode {
  id: string;
  code: string;
  creator: string;
  type: "percentage" | "fixed";
  discountValue: number;
  description: string;
  usageCount: number;
  maxUsageCount: number;
  maxUsagePerUser: number;
  status: "active" | "inactive" | "expired";
  expirationDate: string;
  createdAt: string;
}

export interface UsageStats {
  month: string;
  uses: number;
}

export const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "SUMMER2024",
    creator: "John Doe",
    type: "percentage",
    discountValue: 20,
    description: "Summer sale discount",
    usageCount: 145,
    maxUsageCount: 500,
    maxUsagePerUser: 1,
    status: "active",
    expirationDate: "2024-08-31",
    createdAt: "2024-06-01",
  },
  {
    id: "2",
    code: "WELCOME10",
    creator: "Jane Smith",
    type: "fixed",
    discountValue: 10,
    description: "Welcome bonus for new users",
    usageCount: 892,
    maxUsageCount: 1000,
    maxUsagePerUser: 1,
    status: "active",
    expirationDate: "2024-12-31",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    code: "FLASH50",
    creator: "Mike Johnson",
    type: "percentage",
    discountValue: 50,
    description: "Flash sale - limited time",
    usageCount: 234,
    maxUsageCount: 200,
    maxUsagePerUser: 1,
    status: "expired",
    expirationDate: "2024-03-15",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    code: "LOYAL15",
    creator: "Sarah Williams",
    type: "percentage",
    discountValue: 15,
    description: "Loyalty program discount",
    usageCount: 567,
    maxUsageCount: 1500,
    maxUsagePerUser: 5,
    status: "active",
    expirationDate: "2024-12-31",
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    code: "SAVE25",
    creator: "David Brown",
    type: "fixed",
    discountValue: 25,
    description: "Save $25 on your purchase",
    usageCount: 78,
    maxUsageCount: 300,
    maxUsagePerUser: 1,
    status: "active",
    expirationDate: "2024-09-30",
    createdAt: "2024-05-20",
  },
  {
    id: "6",
    code: "OLDCODE",
    creator: "Admin",
    type: "percentage",
    discountValue: 10,
    description: "Expired promotional code",
    usageCount: 456,
    maxUsageCount: 500,
    maxUsagePerUser: 1,
    status: "inactive",
    expirationDate: "2024-01-31",
    createdAt: "2023-12-01",
  },
];

export const mockUsageStats: UsageStats[] = [
  { month: "Jan", uses: 45 },
  { month: "Feb", uses: 78 },
  { month: "Mar", uses: 123 },
  { month: "Apr", uses: 167 },
  { month: "May", uses: 234 },
  { month: "Jun", uses: 189 },
  { month: "Jul", uses: 256 },
  { month: "Aug", uses: 298 },
];

export const mockUserPromoCode: PromoCode = {
  id: "user-1",
  code: "MYPROMO2024",
  creator: "Current User",
  type: "percentage",
  discountValue: 25,
  description: "Your exclusive discount code",
  usageCount: 12,
  maxUsageCount: 50,
  maxUsagePerUser: 1,
  status: "active",
  expirationDate: "2024-12-31",
  createdAt: "2024-06-15",
};

export const mockUserUsageStats: UsageStats[] = [
  { month: "Jun", uses: 2 },
  { month: "Jul", uses: 5 },
  { month: "Aug", uses: 5 },
];

export interface WeeklyStats {
  week: string;
  uses: number;
  revenue: number;
}

export interface UserUsage {
  id: string;
  name: string;
  email: string;
  usedAt: string;
  discountApplied: number;
  orderValue: number;
}

export const mockWeeklyStats: WeeklyStats[] = [
  { week: "Week 1", uses: 3, revenue: 245 },
  { week: "Week 2", uses: 5, revenue: 412 },
  { week: "Week 3", uses: 2, revenue: 178 },
  { week: "Week 4", uses: 2, revenue: 156 },
];

export const mockMonthlyStats: UsageStats[] = [
  { month: "Mar", uses: 0 },
  { month: "Apr", uses: 1 },
  { month: "May", uses: 2 },
  { month: "Jun", uses: 2 },
  { month: "Jul", uses: 5 },
  { month: "Aug", uses: 5 },
];

export const mockUserUsages: UserUsage[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    usedAt: "2024-08-15",
    discountApplied: 25,
    orderValue: 99.99,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    usedAt: "2024-08-12",
    discountApplied: 25,
    orderValue: 149.50,
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    usedAt: "2024-08-08",
    discountApplied: 25,
    orderValue: 79.99,
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    usedAt: "2024-08-05",
    discountApplied: 25,
    orderValue: 199.00,
  },
  {
    id: "5",
    name: "Emma Brown",
    email: "emma@example.com",
    usedAt: "2024-07-28",
    discountApplied: 25,
    orderValue: 120.75,
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank@example.com",
    usedAt: "2024-07-25",
    discountApplied: 25,
    orderValue: 89.99,
  },
  {
    id: "7",
    name: "Grace Lee",
    email: "grace@example.com",
    usedAt: "2024-07-20",
    discountApplied: 25,
    orderValue: 159.99,
  },
  {
    id: "8",
    name: "Henry Taylor",
    email: "henry@example.com",
    usedAt: "2024-07-15",
    discountApplied: 25,
    orderValue: 95.50,
  },
  {
    id: "9",
    name: "Isabel Martinez",
    email: "isabel@example.com",
    usedAt: "2024-07-10",
    discountApplied: 25,
    orderValue: 175.00,
  },
  {
    id: "10",
    name: "Jack Anderson",
    email: "jack@example.com",
    usedAt: "2024-06-28",
    discountApplied: 25,
    orderValue: 110.25,
  },
  {
    id: "11",
    name: "Kate Thomas",
    email: "kate@example.com",
    usedAt: "2024-06-20",
    discountApplied: 25,
    orderValue: 135.99,
  },
  {
    id: "12",
    name: "Liam Jackson",
    email: "liam@example.com",
    usedAt: "2024-06-18",
    discountApplied: 25,
    orderValue: 88.50,
  },
];