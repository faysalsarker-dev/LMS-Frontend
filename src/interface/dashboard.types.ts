// Dashboard API Response Types

export interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardCourse {
  _id: string;
  title: string;
  thumbnail?: string;
}

export type EnrolmentStatus = 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Summary Stats
export interface DashboardSummary {
  totalCourses: number;
  totalEnrolments: number;
  totalEarnings: number;
  totalStudents: number;
  currency: string;
}

// User Stats
export interface UserRoleStats {
  admin: number;
  instructor: number;
  student: number;
  super_admin: number;
}

export interface UserStatusStats {
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  banned: number;
}

export interface DashboardUserStats {
  totalUsers: number;
  roles: UserRoleStats;
  status: UserStatusStats;
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
  finalAmount: number;
  currency: string;
  enrolledAt: string;
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
  summary: DashboardSummary;
  userStats: DashboardUserStats;
  monthlyChart: MonthlyChartData[];
  recentEnrollments: RecentEnrollment[];
  popularCourses: PopularCourse[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
