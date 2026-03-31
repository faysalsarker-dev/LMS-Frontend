// Dashboard API Response Types

export interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  profile?: string;
}

export interface DashboardCourse {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
}

export type EnrolmentStatus = "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded";

export interface CurrencyEarnings {
  currency: string;
  total: number;
}



// Monthly Chart Data
export interface MonthlyChartData {
  month: string;
  enrollments: number;
  earnings: number;
}

// Recent Enrollment
export interface RecentEnrollment {
  _id: string;
  user: DashboardUser;
  course: DashboardCourse;
  status: EnrolmentStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  transactionId: string;
  createdAt: string;
}

// Popular Course
export interface PopularCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  totalEnrolled: number;
  averageRating: number;
  price: number;
  discountPrice?: number;
  isDiscounted: boolean;
  currency: string;
}

// Full Dashboard Response
export interface DashboardData {
  totalUsers: number;
  totalCourses: number;
  monthlyChart: MonthlyChartData[];
  recentEnrollments: RecentEnrollment[];
  popularCourses: PopularCourse[];
  totalEarningsByCurrency: CurrencyEarnings[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
